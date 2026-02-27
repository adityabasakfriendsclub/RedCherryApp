//src/pages/ResetPasswordPage.jsx
import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

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

function LockIcon() {
  return (
    <div
      style={{
        width: 64,
        height: 64,
        borderRadius: "50%",
        background: "#fce4ec",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#f47eb0"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>
    </div>
  );
}

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { phoneNumber, resetToken } = location.state || {};

  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6)
      return setError("Password must be at least 6 characters.");
    if (form.password !== form.confirmPassword)
      return setError("Passwords do not match.");
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber,
          resetToken,
          newPassword: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(
          data.message || "Failed to reset password. Please try again.",
        );
      setSuccess(true);
      setTimeout(() => navigate("/signin"), 2500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
          minHeight: 210,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingBottom: 32,
          paddingTop: 44,
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
            width: 88,
            height: 88,
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
            style={{ width: 78, height: 78, objectFit: "contain" }}
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
            marginTop: 10,
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
          Reset your password
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
        {/* Lock icon */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          <LockIcon />
        </div>

        <h2
          style={{
            textAlign: "center",
            fontFamily: "Georgia,serif",
            fontSize: 26,
            fontWeight: 800,
            color: "#1a1a1a",
            margin: 0,
          }}
        >
          Forgot Password?
        </h2>
        <p
          style={{
            textAlign: "center",
            fontSize: 14,
            color: "#9e9e9e",
            marginTop: 8,
            lineHeight: 1.6,
          }}
        >
          Enter your registered mobile number
          <br />
          and set a new password
        </p>
        <div
          style={{
            width: 36,
            height: 3,
            borderRadius: 4,
            background: "linear-gradient(90deg,#f47eb0,#f9c846)",
            margin: "12px auto 24px",
          }}
        />

        {success ? (
          /* ── Success state ── */
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "#f0fdf4",
                border: "2px solid #bbf7d0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 14px",
              }}
            >
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#22c55e"
                strokeWidth="2.5"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p style={{ fontWeight: 800, fontSize: 16, color: "#16a34a" }}>
              Password Reset!
            </p>
            <p style={{ fontSize: 14, color: "#aaa", marginTop: 6 }}>
              Redirecting to Sign In…
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* New Password */}
            <label style={label}>New Password</label>
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
                placeholder="Enter new password"
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
                marginBottom: form.confirmPassword ? 6 : 20,
              }}
            >
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter new password"
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

            {/* Match indicator */}
            {form.confirmPassword && (
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  marginBottom: 16,
                  marginTop: 4,
                  color:
                    form.password === form.confirmPassword
                      ? "#22c55e"
                      : "#ef4444",
                }}
              >
                {form.password === form.confirmPassword
                  ? "✓ Passwords match"
                  : "✗ Passwords do not match"}
              </p>
            )}

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
              {loading ? "Resetting…" : "RESET PASSWORD"}
            </button>
          </form>
        )}
      </div>

      {/* Footer */}
      <p
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          fontSize: 14,
          color: "#aaa",
          padding: "16px 0 4px",
        }}
      >
        <span style={{ color: "#f47eb0", fontSize: 16 }}>🔖</span>
        Remember your password?{" "}
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
