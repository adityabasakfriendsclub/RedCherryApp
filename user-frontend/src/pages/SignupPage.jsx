//src/pages/SignupPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const COUNTRY_CODE = "+91";

function EyeIcon({ open }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke={open ? "#f47eb0" : "#b0b0b0"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {open ? (
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </>
      ) : (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  );
}

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    gender: "",
    age: "",
    password: "",
    confirmPassword: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setError("");
  };

  const validate = () => {
    if (!form.firstName.trim()) return "First name is required.";
    if (!form.lastName.trim()) return "Last name is required.";
    if (!/^\d{10}$/.test(form.phoneNumber.trim()))
      return "Enter a valid 10-digit mobile number.";
    if (!form.gender) return "Please select your gender.";
    const age = Number(form.age);
    if (!form.age || age < 13 || age > 120)
      return "Enter a valid age (13–120).";
    if (form.password.length < 6)
      return "Password must be at least 6 characters.";
    if (form.password !== form.confirmPassword)
      return "Passwords do not match.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return setError(err);
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          phoneNumber: form.phoneNumber.trim(),
          countryCode: COUNTRY_CODE,
          gender: form.gender,
          age: Number(form.age),
          password: form.password,
        }),
      });

      // Safe JSON parse
      let data = {};
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        try {
          data = await res.json();
        } catch {
          /* empty body */
        }
      }

      if (!res.ok) {
        const msg =
          data.message ||
          (res.status === 409
            ? "This phone number is already registered."
            : res.status === 400
              ? "Please check your details and try again."
              : res.status === 500
                ? "Server error. Ensure DEV_SKIP_SMS=true is set in your .env file."
                : "Registration failed. Please try again.");
        setError(msg);
        return;
      }

      navigate("/verify-otp", {
        state: {
          phoneNumber: form.phoneNumber.trim(),
          countryCode: COUNTRY_CODE,
          maskedPhone: data.maskedPhone,
          mode: "signup",
        },
      });
    } catch (fetchErr) {
      if (fetchErr instanceof TypeError) {
        setError(
          "Cannot reach server. Make sure the backend is running on port 5000.",
        );
      } else {
        setError(fetchErr.message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  /* shared styles */
  const fieldBox = {
    border: "1.5px solid #fce4ec",
    borderRadius: 16,
    background: "#fff",
  };
  const label = {
    display: "block",
    fontSize: 13,
    fontWeight: 700,
    color: "#333",
    marginBottom: 6,
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fdf0f3",
        maxWidth: 430,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ═══ HERO ═════════════════════════════════════════════════════════ */}
      <div
        style={{
          background:
            "linear-gradient(135deg,#f9c846 0%,#f9a66c 30%,#f47eb0 65%,#f06fa8 100%)",
          borderBottomLeftRadius: "2.2rem",
          borderBottomRightRadius: "2.2rem",
          minHeight: 215,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingBottom: 34,
          paddingTop: 48,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -30,
            right: -30,
            width: 140,
            height: 140,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.12)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            left: -40,
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.07)",
          }}
        />

        {/* Real logo */}
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            background: "#fff",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            border: "3px solid rgba(255,255,255,0.8)",
            position: "relative",
            zIndex: 2,
          }}
        >
          <img
            src="/logo.png"
            alt="BBSNC Logo"
            style={{ width: 86, height: 86, objectFit: "contain" }}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>
        <p
          style={{
            color: "#fff",
            fontFamily: "Georgia,serif",
            fontSize: 24,
            fontWeight: 700,
            marginTop: 12,
            position: "relative",
            zIndex: 2,
          }}
        >
          Red Cherry
        </p>
        <p
          style={{
            color: "rgba(255,255,255,0.85)",
            fontSize: 14,
            marginTop: 2,
            position: "relative",
            zIndex: 2,
          }}
        >
          Create your account
        </p>
      </div>

      {/* ═══ CARD ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          margin: "0 16px",
          marginTop: -2,
          background: "#fff",
          borderRadius: 20,
          boxShadow: "0 8px 32px rgba(244,126,176,0.13)",
          padding: "28px 24px 24px",
        }}
      >
        <h2
          style={{
            fontFamily: "Georgia,serif",
            fontSize: 26,
            fontWeight: 800,
            color: "#1a1a1a",
            margin: 0,
          }}
        >
          Sign Up
        </h2>
        <p style={{ fontSize: 14, color: "#9e9e9e", marginTop: 4 }}>
          Fill in your details to get started
        </p>
        <div
          style={{
            width: 36,
            height: 3,
            borderRadius: 4,
            background: "linear-gradient(90deg,#f47eb0,#f9c846)",
            margin: "10px 0 22px",
          }}
        />

        <form onSubmit={handleSubmit}>
          {/* First / Last Name row */}
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={label} htmlFor="firstName">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                placeholder="First"
                value={form.firstName}
                onChange={update("firstName")}
                autoComplete="given-name"
                style={{
                  ...fieldBox,
                  width: "100%",
                  padding: "12px 14px",
                  fontSize: 14,
                  color: "#333",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={label} htmlFor="lastName">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                placeholder="Last"
                value={form.lastName}
                onChange={update("lastName")}
                autoComplete="family-name"
                style={{
                  ...fieldBox,
                  width: "100%",
                  padding: "12px 14px",
                  fontSize: 14,
                  color: "#333",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {/* Mobile */}
          <label style={label}>Mobile Number</label>
          <div
            style={{
              ...fieldBox,
              display: "flex",
              overflow: "hidden",
              marginBottom: 16,
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "0 12px",
                background: "#fff5f8",
                borderRight: "1.5px solid #fce4ec",
                fontSize: 14,
                fontWeight: 600,
                color: "#555",
                minWidth: 72,
                whiteSpace: "nowrap",
              }}
            >
              +91 <span style={{ fontSize: 10, color: "#aaa" }}>▾</span>
            </span>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="Enter mobile number"
              value={form.phoneNumber}
              onChange={update("phoneNumber")}
              autoComplete="tel"
              style={{
                flex: 1,
                padding: "13px 14px",
                fontSize: 14,
                color: "#333",
                border: "none",
                outline: "none",
                background: "transparent",
              }}
            />
          </div>

          {/* Gender / Age row */}
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={label}>Gender</label>
              <div style={{ position: "relative" }}>
                <select
                  value={form.gender}
                  onChange={update("gender")}
                  style={{
                    ...fieldBox,
                    width: "100%",
                    padding: "12px 32px 12px 14px",
                    fontSize: 14,
                    color: form.gender ? "#333" : "#aaa",
                    outline: "none",
                    appearance: "none",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="">Select Gen..</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
                <span
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 10,
                    color: "#aaa",
                    pointerEvents: "none",
                  }}
                >
                  ▾
                </span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <label style={label}>Age</label>
              <input
                type="number"
                placeholder="Age"
                value={form.age}
                onChange={update("age")}
                min={13}
                max={120}
                style={{
                  ...fieldBox,
                  width: "100%",
                  padding: "12px 14px",
                  fontSize: 14,
                  color: "#333",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {/* Password */}
          <label style={label}>Password</label>
          <div
            style={{
              ...fieldBox,
              display: "flex",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <input
              type={showPass ? "text" : "password"}
              placeholder="Create a password"
              value={form.password}
              onChange={update("password")}
              autoComplete="new-password"
              style={{
                flex: 1,
                padding: "13px 14px",
                fontSize: 14,
                color: "#333",
                border: "none",
                outline: "none",
                background: "transparent",
              }}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              style={{
                padding: "0 14px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <EyeIcon open={showPass} />
            </button>
          </div>

          {/* Confirm Password */}
          <label style={label}>Confirm Password</label>
          <div
            style={{
              ...fieldBox,
              display: "flex",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Re-enter your password"
              value={form.confirmPassword}
              onChange={update("confirmPassword")}
              autoComplete="new-password"
              style={{
                flex: 1,
                padding: "13px 14px",
                fontSize: 14,
                color: "#333",
                border: "none",
                outline: "none",
                background: "transparent",
              }}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              style={{
                padding: "0 14px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <EyeIcon open={showConfirm} />
            </button>
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              style={{
                background: "#fff0f0",
                border: "1px solid #ffd5d5",
                color: "#e53935",
                fontSize: 13,
                borderRadius: 12,
                padding: "10px 16px",
                textAlign: "center",
                marginBottom: 14,
              }}
            >
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "15px 0",
              borderRadius: 50,
              background: loading ? "#f9d96a" : "#f5c518",
              color: "#fff",
              fontWeight: 800,
              fontSize: 14,
              letterSpacing: 3,
              textTransform: "uppercase",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 6px 20px rgba(245,197,24,0.38)",
            }}
          >
            {loading ? "Creating Account…" : "CREATE ACCOUNT"}
          </button>
        </form>
      </div>

      {/* Footer */}
      <p
        style={{
          textAlign: "center",
          fontSize: 14,
          color: "#aaa",
          padding: "16px 0 4px",
        }}
      >
        Already have an account?{" "}
        <Link
          to="/signin"
          style={{ fontWeight: 700, color: "#f47eb0", textDecoration: "none" }}
        >
          Sign In
        </Link>
      </p>
      <p
        style={{
          textAlign: "center",
          fontSize: 11,
          color: "#ccc",
          paddingBottom: 28,
          lineHeight: 1.7,
        }}
      >
        © 2026 Biswa Bangla Social Networking Club.
        <br />
        All rights reserved.
      </p>
    </div>
  );
}
