// src/pages/ComingSoonPage.jsx
import { useNavigate } from "react-router-dom";

const COLORS = [
  "#FF4B6E",
  "#FF6B35",
  "#FFD93D",
  "#6BCB77",
  "#4D96FF",
  "#C77DFF",
  "#FF85A1",
];

const PETALS = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  size: (i % 3) * 6 + 8,
  left: `${(i * 13) % 97}%`,
  top: `${(i * 17) % 93}%`,
  color: COLORS[i % COLORS.length],
  delay: `${((i * 0.3) % 3).toFixed(1)}s`,
  duration: `${(2 + ((i * 0.17) % 2.5)).toFixed(1)}s`,
}));

export default function ComingSoonPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #130008 0%, #3b0018 50%, #130008 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      {/* Floating Holi Color Blobs */}
      {PETALS.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: p.color,
            left: p.left,
            top: p.top,
            opacity: 0.55,
            filter: "blur(1.5px)",
            animation: `floatUp ${p.duration} ${p.delay} infinite alternate ease-in-out`,
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Background Glow Orbs */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,75,110,0.15) 0%, transparent 70%)",
          top: "0%",
          left: "0%",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 350,
          height: 350,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(199,125,255,0.12) 0%, transparent 70%)",
          bottom: "0%",
          right: "0%",
          pointerEvents: "none",
        }}
      />

      {/* Main Card */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,75,110,0.35)",
          borderRadius: 28,
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          padding: "48px 32px 40px",
          maxWidth: 460,
          width: "90%",
          textAlign: "center",
          boxShadow:
            "0 0 80px rgba(255,75,110,0.18), 0 24px 64px rgba(0,0,0,0.55)",
        }}
      >
        {/* App Logo */}
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: "50%",
            background: "#fff",
            boxShadow: "0 0 24px rgba(255,75,110,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            border: "3px solid rgba(255,255,255,0.8)",
            margin: "0 auto 14px",
          }}
        >
          <img
            src="/logo.png"
            alt="Red Cherry"
            style={{ width: 78, height: 78, objectFit: "contain" }}
            onError={(e) => {
              e.target.style.display = "none";
              e.target.parentNode.innerHTML = "🍒";
              e.target.parentNode.style.fontSize = "48px";
            }}
          />
        </div>

        {/* Brand Name */}
        <h1
          style={{
            fontSize: 28,
            fontWeight: 900,
            letterSpacing: "0.14em",
            background: "linear-gradient(90deg, #FF4B6E, #FFD93D, #FF85A1)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: "0 0 6px 0",
            fontFamily: "Georgia, serif",
          }}
        >
          RED CHERRY
        </h1>

        {/* Tagline */}
        <p
          style={{
            color: "#FFD93D",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.08em",
            margin: "0 0 18px 0",
          }}
        >
          Something Sweet Is Coming Soon!
        </p>

        {/* ── Two Government Logos below tagline ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 32,
            marginBottom: 22,
          }}
        >
          {/* Government of India Logo — LEFT */}
          <div className="gov-logo-wrap" style={logoWrapStyle}>
            <img
              src="/government-of-india-logo.png"
              alt="Government of India"
              style={logoImgStyle}
            />
            <span style={logoLabelStyle}>Govt. of India</span>
          </div>

          {/* Government of West Bengal Logo — RIGHT */}
          <div className="gov-logo-wrap" style={logoWrapStyle}>
            <img
              src="/government-of-west-bengal-logo.png"
              alt="Government of West Bengal"
              style={logoImgStyle}
            />
            <span style={logoLabelStyle}>Govt. of West Bengal</span>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(255,75,110,0.5), transparent)",
            marginBottom: 22,
          }}
        />

        {/* Body Text */}
        <p
          style={{
            color: "rgba(255,255,255,0.75)",
            fontSize: 14,
            lineHeight: 1.75,
            margin: "0 0 20px 0",
          }}
        >
          We're working behind the scenes to bring you an exciting new
          experience. Our website is currently under development, and we'll be
          launching very soon.
        </p>

        {/* Holi Message */}
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(255,75,110,0.12), rgba(199,125,255,0.12))",
            border: "1px solid rgba(255,217,61,0.28)",
            borderRadius: 16,
            padding: "14px 16px",
            marginBottom: 28,
          }}
        >
          <p
            style={{
              color: "rgba(255,255,255,0.9)",
              fontSize: 13,
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            🌈 <strong style={{ color: "#FFD93D" }}>Happy Holi!</strong> May
            this festival of colors fill your life with joy, happiness, success,
            and positivity. Thank you for your love and support — see you soon
            with vibrant new features!
          </p>
        </div>

        {/* Enter Button */}
        <button
          onClick={() => navigate("/signin")}
          style={{
            width: "100%",
            padding: "15px 0",
            background: "linear-gradient(135deg, #FF4B6E, #FF1744)",
            border: "none",
            borderRadius: 50,
            color: "#fff",
            fontWeight: 800,
            fontSize: 15,
            letterSpacing: "0.06em",
            cursor: "pointer",
            boxShadow: "0 8px 28px rgba(255,75,110,0.45)",
            fontFamily: "'Nunito', sans-serif",
            transition: "opacity 0.2s, transform 0.1s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          Enter App 🚀
        </button>
      </div>

      {/* Footer */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          marginTop: 28,
          textAlign: "center",
          color: "rgba(255,255,255,0.3)",
          fontSize: 12,
          lineHeight: 1.9,
        }}
      >
        <div>© Red Cherry | All Rights Reserved</div>
        <div>Follow us for updates 🚀</div>
      </div>

      <style>{`
        @keyframes floatUp {
          from { transform: translateY(0px) rotate(0deg); }
          to   { transform: translateY(-22px) rotate(12deg); }
        }

        .gov-logo-wrap {
          transition: transform 0.25s ease, filter 0.25s ease !important;
          cursor: pointer;
        }
        .gov-logo-wrap:hover {
          transform: scale(1.18) translateY(-4px) !important;
          filter: drop-shadow(0 0 10px rgba(255,217,61,0.7)) !important;
        }
        .gov-logo-wrap:active {
          transform: scale(1.08) !important;
        }
      `}</style>
    </div>
  );
}

/* ── Shared logo styles ───────────────────────────────────── */
const logoWrapStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 6,
};

const logoImgStyle = {
  width: 70,
  height: 70,
  objectFit: "contain",
  borderRadius: "50%",
  background: "rgba(255,255,255,0.08)",
  padding: 4,
  border: "1px solid rgba(255,255,255,0.15)",
};

const logoLabelStyle = {
  color: "rgba(255,255,255,0.5)",
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: "0.04em",
  whiteSpace: "nowrap",
};
