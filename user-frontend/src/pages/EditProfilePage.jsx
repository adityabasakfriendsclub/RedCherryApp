//src/pages/EditProfilePage.jsx
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { user, token, updateUser } = useAuth();

  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    age: user?.age ? String(user.age) : "",
    gender: user?.gender || "Male",
    country: user?.country || "India",
  });

  // ── Image state ──────────────────────────────────────────────────────────────
  const [imageFile, setImageFile] = useState(null); // raw File object
  const [imagePreview, setImagePreview] = useState(
    // local blob URL for preview
    user?.profilePicture ? `${API_BASE}${user.profilePicture}` : null,
  );
  const fileInputRef = useRef(null);

  // ── Status ───────────────────────────────────────────────────────────────────
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic client-side validation
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPG, PNG, WebP, etc.).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5 MB.");
      return;
    }

    setError("");
    setImageFile(file);
    // Show instant local preview — no upload yet
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      // Build multipart/form-data — DO NOT set Content-Type manually;
      // the browser sets it with the correct boundary automatically.
      const formData = new FormData();
      formData.append("firstName", form.firstName.trim());
      formData.append("lastName", form.lastName.trim());
      formData.append("age", form.age);
      formData.append("gender", form.gender);
      formData.append("country", form.country.trim());

      // Only attach the file field if the user actually picked one
      if (imageFile) {
        formData.append("profilePicture", imageFile); // must match multer field name
      }

      const res = await fetch(`${API_BASE}/api/auth/profile`, {
        method: "PUT",
        headers: {
          // ❌ Do NOT add "Content-Type": "application/json" — FormData sets its own
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile.");
      }

      // Sync AuthContext + localStorage with the returned user object
      updateUser(data.user);
      setSuccess("Profile updated successfully!");
      setTimeout(() => navigate("/account"), 1200);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ── Avatar display ────────────────────────────────────────────────────────────
  const initials = (form.firstName?.[0] || "?").toUpperCase();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-pink-300 w-full sticky top-0 z-40 shadow-md">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between relative">
          <button onClick={() => navigate(-1)} className="text-white">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
            <div className="w-14 h-14 rounded-full bg-white p-1 shadow-md flex items-center justify-center overflow-hidden">
              <img
                src="/logo.png"
                alt="BBSNC"
                className="w-full h-full object-contain rounded-full"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-white text-pink-400 font-bold text-sm px-5 py-1.5 rounded-full shadow-sm active:scale-95 transition-transform disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
        <div className="text-center pb-3">
          <span className="text-white font-extrabold text-xl">
            Edit Profile
          </span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto w-full px-4 pt-4 pb-10">
        {/* Error / Success banners */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-600 text-sm rounded-xl px-4 py-3">
            {success}
          </div>
        )}

        {/* Avatar picker */}
        <div className="card p-6 flex flex-col items-center mb-5">
          {/* Hidden real file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />

          {/* Clickable avatar — triggers the hidden input */}
          <div
            className="relative cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
            title="Tap to change photo"
          >
            <div className="w-24 h-24 rounded-full border-2 border-pink-200 overflow-hidden bg-pink-200 flex items-center justify-center">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-extrabold text-3xl">
                  {initials}
                </span>
              )}
            </div>

            {/* Edit pencil badge */}
            <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-pink-400 flex items-center justify-center shadow-md">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </div>
          </div>

          <p className="text-gray-400 text-sm mt-3">
            {imageFile ? `Selected: ${imageFile.name}` : "Tap to change photo"}
          </p>
        </div>

        {/* Form fields */}
        <div className="card p-5 space-y-5">
          <div>
            <label className="block font-extrabold text-gray-800 mb-1.5">
              First Name
            </label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-3 text-gray-800 font-semibold text-sm focus:outline-none focus:border-pink-300"
              placeholder="First name"
            />
          </div>

          <div>
            <label className="block font-extrabold text-gray-800 mb-1.5">
              Last Name
            </label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-3 text-gray-800 font-semibold text-sm focus:outline-none focus:border-pink-300"
              placeholder="Last name"
            />
          </div>

          <div>
            <label className="block font-extrabold text-gray-800 mb-1.5">
              Age
            </label>
            <input
              type="number"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-3 text-gray-800 font-semibold text-sm focus:outline-none focus:border-pink-300"
              placeholder="Age"
              min={13}
              max={120}
            />
          </div>

          <div>
            <label className="block font-extrabold text-gray-800 mb-2">
              Gender
            </label>
            <div className="flex gap-3 flex-wrap">
              {["Male", "Female", "Other"].map((g) => (
                <button
                  key={g}
                  onClick={() => setForm({ ...form, gender: g })}
                  className={`px-5 py-1.5 rounded-full text-sm font-bold transition-all ${
                    form.gender === g
                      ? "bg-pink-300 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-extrabold text-gray-800 mb-1.5">
              Country
            </label>
            <input
              type="text"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-3 text-gray-800 font-semibold text-sm focus:outline-none focus:border-pink-300"
              placeholder="Country"
            />
          </div>
        </div>

        <p className="text-center text-gray-400 text-xs mt-6">
          © 2026 Biswa Bangla Social Networking Club. All rights reserved.
        </p>
      </div>
    </div>
  );
}
