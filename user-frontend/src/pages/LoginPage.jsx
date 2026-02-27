//src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* ── Google colour icon ─────────────────────────────────────────────────── */
function GoogleIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

/* ── Eye toggle icon ────────────────────────────────────────────────────── */
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

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ phoneNumber: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.phoneNumber.trim())
      return setError("Please enter your phone number.");
    if (!form.password) return setError("Please enter your password.");
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: form.phoneNumber.trim(),
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.needsVerification) {
          return navigate("/verify-otp", {
            state: {
              phoneNumber: form.phoneNumber.trim(),
              maskedPhone: data.maskedPhone,
              mode: "signup",
            },
          });
        }
        throw new Error(data.message || "Login failed. Please try again.");
      }
      login(data.user, data.token);
      navigate("/home");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ── shared field border style ── */
  const fieldBox = {
    border: "1.5px solid #fce4ec",
    borderRadius: 16,
    background: "#fff",
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
      {/* ═══ HERO GRADIENT HEADER ═══════════════════════════════════════════ */}
      <div
        style={{
          background:
            "linear-gradient(135deg,#f9c846 0%,#f9a66c 30%,#f47eb0 65%,#f06fa8 100%)",
          borderBottomLeftRadius: "2.2rem",
          borderBottomRightRadius: "2.2rem",
          minHeight: 230,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingBottom: 36,
          paddingTop: 52,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* decorative blobs */}
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

        {/* Logo — real PNG from /public/logo.png */}
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
          Welcome back
        </p>
      </div>

      {/* ═══ CARD ═══════════════════════════════════════════════════════════ */}
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
          Sign In
        </h2>
        <p style={{ fontSize: 14, color: "#9e9e9e", marginTop: 4 }}>
          Enter your credentials to continue
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
          {/* Phone Number */}
          <label
            style={{
              display: "block",
              fontSize: 13,
              fontWeight: 700,
              color: "#333",
              marginBottom: 6,
            }}
          >
            Phone Number
          </label>
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
              name="phoneNumber"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="Enter phone number"
              value={form.phoneNumber}
              onChange={onChange}
              autoComplete="tel"
              style={{
                flex: 1,
                padding: "14px 16px",
                fontSize: 14,
                color: "#333",
                border: "none",
                outline: "none",
                background: "transparent",
              }}
            />
          </div>

          {/* Password */}
          <label
            style={{
              display: "block",
              fontSize: 13,
              fontWeight: 700,
              color: "#333",
              marginBottom: 6,
            }}
          >
            Password
          </label>
          <div
            style={{
              ...fieldBox,
              display: "flex",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <input
              name="password"
              type={showPass ? "text" : "password"}
              placeholder="Enter your password"
              value={form.password}
              onChange={onChange}
              autoComplete="current-password"
              style={{
                flex: 1,
                padding: "14px 16px",
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

          {/* Forgot password */}
          <div style={{ textAlign: "right", marginBottom: 16 }}>
            <Link
              to="/forgot-password"
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#f47eb0",
                textDecoration: "none",
              }}
            >
              Forgot Password?
            </Link>
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

          {/* Sign In button */}
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
              transition: "all 0.2s",
              marginBottom: 18,
            }}
          >
            {loading ? "Signing In…" : "SIGN IN"}
          </button>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 14,
            }}
          >
            <div style={{ flex: 1, height: 1, background: "#fce4ec" }} />
            <span style={{ fontSize: 13, color: "#bbb" }}>or</span>
            <div style={{ flex: 1, height: 1, background: "#fce4ec" }} />
          </div>

          {/* Google button */}
          <button
            type="button"
            style={{
              width: "100%",
              padding: "13px 0",
              borderRadius: 50,
              background: "#fff",
              border: "1.5px solid #fce4ec",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              fontSize: 14,
              fontWeight: 700,
              color: "#444",
              cursor: "pointer",
            }}
          >
            <GoogleIcon />
            SIGN IN WITH GOOGLE
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
        Don&apos;t have an account?{" "}
        <Link
          to="/signup"
          style={{ fontWeight: 700, color: "#f47eb0", textDecoration: "none" }}
        >
          Sign Up
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
