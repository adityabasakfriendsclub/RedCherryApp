//src/pages/AccountPage.jsx

import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import { useAuth } from "../context/AuthContext";

// ── Backend origin ─────────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ── Build a fully-qualified, cache-busted avatar URL ──────────────────────────
function resolveAvatarUrl(profilePicture) {
  if (!profilePicture) return null;

  const base = profilePicture.startsWith("http")
    ? profilePicture // already absolute (e.g. Cloudinary)
    : `${API_BASE}${profilePicture}`; // relative → absolute

  // Cache-bust: current unix second so browser always re-fetches after save
  return `${base}?t=${Math.floor(Date.now() / 1000)}`;
}

// ── ListRow helper ─────────────────────────────────────────────────────────────
function ListRow({ icon, label, divider = true, onClick }) {
  return (
    <>
      <div
        className="list-row cursor-pointer active:bg-pink-50 rounded-xl transition-colors"
        onClick={onClick}
      >
        <span className="w-6 h-6 flex items-center justify-center shrink-0">
          {icon}
        </span>
        <span className="text-gray-700 font-semibold text-sm flex-1">
          {label}
        </span>
        <svg
          className="w-4 h-4 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
      {divider && <div className="h-px bg-pink-50 mx-1" />}
    </>
  );
}

// ── AccountPage ────────────────────────────────────────────────────────────────
export default function AccountPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Recalculate avatar URL whenever profilePicture value changes
  const avatarUrl = useMemo(
    () => resolveAvatarUrl(user?.profilePicture),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user?.profilePicture],
  );

  // ── FIX 2: Reset imgError every time profilePicture changes ──────────────────
  // Without this, a previously failed load permanently hides the new image
  // (useState(false) only runs once on mount; useEffect re-runs on dep change).
  const [imgError, setImgError] = useState(false);
  useEffect(() => {
    setImgError(false); // give the new URL a fresh attempt
  }, [user?.profilePicture]);

  // Derived display values
  const displayName = user
    ? `${user.firstName} ${user.lastName}`.trim()
    : "Guest";
  const displayGenderAge = user
    ? `${user.gender || "—"} , ${user.age || "—"}`
    : "—";
  const displayId = user?.id ? String(user.id).slice(-8).toUpperCase() : "—";

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <Header title="Account" />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 pt-4 pb-6">
          {/* ── Profile Card ─────────────────────────────────────────────── */}
          <div className="card p-5 mb-4">
            <div className="flex items-center gap-4 mb-4">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-full border-2 border-pink-200 overflow-hidden bg-gray-100">
                  {avatarUrl && !imgError ? (
                    <img
                      key={avatarUrl} // forces React to remount <img> on URL change
                      src={avatarUrl} // full URL with cache-buster
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    // Fallback: coloured circle with initial
                    <div className="w-full h-full bg-pink-200 flex items-center justify-center">
                      <span className="text-white font-extrabold text-3xl">
                        {user?.firstName?.[0]?.toUpperCase() || "?"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Pencil edit badge */}
                <button
                  onClick={() => navigate("/edit-profile")}
                  className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-pink-400 flex items-center justify-center shadow-md"
                >
                  <svg
                    className="w-3.5 h-3.5 text-white"
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
                </button>
              </div>

              {/* Name / Gender / Age / Level */}
              <div>
                <h2 className="font-extrabold text-gray-800 text-xl leading-tight">
                  {displayName}
                </h2>
                <p className="text-gray-400 text-sm mt-0.5">
                  {displayGenderAge}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="bg-pink-300 text-white text-xs font-bold px-3 py-0.5 rounded-full">
                    Level 0
                  </span>
                  <span className="text-gray-500 text-sm">
                    {user?.country || "India"}
                  </span>
                </div>
              </div>
            </div>

            {/* Edit Profile row */}
            <div
              onClick={() => navigate("/edit-profile")}
              className="flex items-center gap-2 border-t border-pink-50 pt-3 cursor-pointer active:bg-pink-50 rounded-xl px-1 py-1 transition-colors"
            >
              <svg
                className="w-4 h-4 text-pink-300"
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
              <span className="text-gray-600 font-semibold text-sm flex-1">
                Edit Profile
              </span>
              <svg
                className="w-4 h-4 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>

          {/* ── Wallet ───────────────────────────────────────────────────── */}
          <p className="section-title">WALLET</p>
          <div className="card px-4 mb-2">
            <ListRow
              label="Talktime Wallet : ₹0"
              onClick={() => navigate("/talktime-wallet")}
              icon={
                <svg
                  className="w-5 h-5 text-yellow-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              }
            />
            <ListRow
              label="Talktime Transactions"
              divider={false}
              onClick={() => {}}
              icon={
                <svg
                  className="w-5 h-5 text-pink-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                  />
                </svg>
              }
            />
          </div>

          {/* ── Controls ─────────────────────────────────────────────────── */}
          <p className="section-title">CONTROLS</p>
          <div className="card px-4 mb-5">
            <ListRow
              label="Report A Problem"
              onClick={() => navigate("/report-problem")}
              icon={
                <svg
                  className="w-5 h-5 text-pink-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
            />
            <ListRow
              label="Settings"
              onClick={() => {}}
              icon={
                <svg
                  className="w-5 h-5 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              }
            />
            <ListRow
              label="Sign Out"
              divider={false}
              onClick={handleLogout}
              icon={
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              }
            />
          </div>

          {/* ── Footer ───────────────────────────────────────────────────── */}
          <div className="text-center space-y-1 mt-2">
            <p className="text-gray-500 font-semibold text-sm">
              ID : {displayId}
            </p>
            <p className="text-gray-400 text-xs leading-relaxed">
              © 2026 Biswa Bangla Social Networking Club.
              <br />
              All rights reserved.
            </p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
