//src/pages/VerifyOTPPage.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* ── Envelope icon ──────────────────────────────────────────────────────── */
function EnvelopeIcon() {
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
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#f47eb0"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    </div>
  );
}

const OTP_SECONDS = 60;

export default function VerifyOTPPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const {
    phoneNumber,
    countryCode = "+91",
    maskedPhone,
    mode = "signup",
  } = location.state || {};

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(OTP_SECONDS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const inputs = useRef([]);

  /* auto-focus first box */
  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  /* countdown */
  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const fmt = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    setError("");
    if (val && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0)
      inputs.current[i - 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pasted) return;
    const next = [...otp];
    pasted.split("").forEach((ch, i) => {
      next[i] = ch;
    });
    setOtp(next);
    inputs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      // ✅ Use different endpoints for signup vs password-reset flows
      const endpoint =
        mode === "reset"
          ? "/api/auth/verify-reset-otp" // password reset OTP
          : "/api/auth/verify-otp"; // signup OTP

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, otp: code }),
      });

      // ✅ Safe JSON parse
      let data = {};
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        try {
          data = await res.json();
        } catch {
          /* empty body */
        }
      }

      if (!res.ok) {
        setError(
          data.message ||
            (res.status === 429
              ? "Too many attempts. Please request a new OTP."
              : res.status === 400
                ? "Invalid or expired OTP. Please try again."
                : "OTP verification failed."),
        );
        return;
      }

      if (mode === "reset") {
        // ✅ Reset flow: password already changed by backend — go straight to Sign In
        login(data.user, data.token);
        navigate("/signin");
      } else {
        // ✅ Signup flow: log user in and go to Sign In
        login(data.user, data.token);
        navigate("/signin");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setResending(true);
    setError("");
    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, countryCode }),
      });
      // ✅ Safe JSON parse
      let data = {};
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        try {
          data = await res.json();
        } catch {
          /* empty body */
        }
      }
      if (!res.ok) {
        setError(data.message || "Failed to resend OTP. Please try again.");
      } else {
        setResent(true);
        setTimer(OTP_SECONDS);
        setOtp(["", "", "", "", "", ""]);
        inputs.current[0]?.focus();
        setTimeout(() => setResent(false), 3000);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const displayPhone =
    maskedPhone ||
    (phoneNumber ? `xxxxx${phoneNumber.slice(-4)}` : "your number");

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
          minHeight: 200,
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
          OTP Verification
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
        {/* Envelope */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 18,
          }}
        >
          <EnvelopeIcon />
        </div>

        <h2
          style={{
            textAlign: "center",
            fontFamily: "Georgia,serif",
            fontSize: 24,
            fontWeight: 800,
            color: "#1a1a1a",
            margin: 0,
          }}
        >
          Enter OTP
        </h2>
        <p
          style={{
            textAlign: "center",
            fontSize: 14,
            color: "#9e9e9e",
            marginTop: 8,
          }}
        >
          We&apos;ve sent a 6-digit OTP to
        </p>
        <p
          style={{
            textAlign: "center",
            fontSize: 16,
            fontWeight: 800,
            color: "#333",
            marginTop: 4,
            marginBottom: 20,
          }}
        >
          {displayPhone}
        </p>

        {/* Alerts */}
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
        {resent && (
          <div
            style={{
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              color: "#16a34a",
              fontSize: 13,
              borderRadius: 12,
              padding: "10px 16px",
              textAlign: "center",
              marginBottom: 14,
            }}
          >
            ✓ OTP resent successfully!
          </div>
        )}

        {/* 6 OTP boxes */}
        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "center",
            marginBottom: 18,
          }}
          onPaste={handlePaste}
        >
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputs.current[i] = el)}
              type="tel"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              style={{
                width: 46,
                height: 54,
                textAlign: "center",
                fontSize: 22,
                fontWeight: 800,
                color: "#333",
                border: digit ? "2px solid #f47eb0" : "2px solid #fce4ec",
                borderRadius: 14,
                background: digit ? "#fff5f8" : "#fff",
                outline: "none",
                boxShadow: digit ? "0 2px 8px rgba(244,126,176,0.18)" : "none",
                transition: "border-color 0.15s, background 0.15s",
              }}
            />
          ))}
        </div>

        {/* Timer row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            marginBottom: 6,
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#aaa"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span style={{ fontSize: 14, color: "#aaa" }}>
            Resend OTP in{" "}
            <span style={{ color: "#f47eb0", fontWeight: 700 }}>
              {fmt(timer)}
            </span>
          </span>
        </div>

        {/* Resend button */}
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <button
            onClick={handleResend}
            disabled={timer > 0 || resending}
            style={{
              background: "transparent",
              border: "none",
              cursor: timer > 0 ? "default" : "pointer",
              fontSize: 14,
              fontWeight: 600,
              color: timer > 0 ? "#ccc" : "#f47eb0",
              padding: "4px 8px",
            }}
          >
            {resending ? "Resending…" : "Resend OTP"}
          </button>
        </div>

        {/* Verify button */}
        <button
          onClick={handleVerify}
          disabled={loading || otp.join("").length < 6}
          style={{
            width: "100%",
            padding: "15px 0",
            borderRadius: 50,
            background:
              loading || otp.join("").length < 6 ? "#f9d96a" : "#f5c518",
            color: "#fff",
            fontWeight: 800,
            fontSize: 14,
            letterSpacing: 3,
            textTransform: "uppercase",
            border: "none",
            cursor:
              loading || otp.join("").length < 6 ? "not-allowed" : "pointer",
            boxShadow: "0 6px 20px rgba(245,197,24,0.38)",
            opacity: loading || otp.join("").length < 6 ? 0.7 : 1,
          }}
        >
          {loading ? "Verifying…" : "VERIFY OTP"}
        </button>
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
        Wrong number?{" "}
        <Link
          to={mode === "reset" ? "/forgot-password" : "/signup"}
          style={{ fontWeight: 700, color: "#f47eb0", textDecoration: "none" }}
        >
          {mode === "reset" ? "Back to Forgot Password" : "Back to Sign Up"}
        </Link>
      </p>
      <p
        style={{
          textAlign: "center",
          fontSize: 11,
          color: "#ccc",
          paddingBottom: 28,
        }}
      >
        © 2026 Biswa Bangla Social Networking Club.
      </p>
    </div>
  );
}
