//src/compoments/BottomNav.jsx
import { useNavigate, useLocation } from "react-router-dom";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/home";

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-pink-300 z-50 shadow-lg">
      <div className="max-w-6xl mx-auto flex items-center px-8 py-3">
        <button
          onClick={() => navigate("/home")}
          className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2"
        >
          <div
            className={`${isHome ? "bg-pink-100/40" : ""} rounded-full px-5 py-1.5 transition-all`}
          >
            <svg
              className={`w-6 h-6 ${isHome ? "text-white" : "text-pink-200"}`}
              fill={isHome ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={isHome ? 0 : 2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </div>
          <span
            className={`text-xs font-bold ${isHome ? "text-white" : "text-pink-200"}`}
          >
            Home
          </span>
        </button>

        <button
          onClick={() => navigate("/account")}
          className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2"
        >
          <div
            className={`${!isHome ? "bg-pink-100/40" : ""} rounded-full px-5 py-1.5 transition-all`}
          >
            <svg
              className={`w-6 h-6 ${!isHome ? "text-white" : "text-pink-200"}`}
              fill={!isHome ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={!isHome ? 0 : 2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <span
            className={`text-xs font-bold ${!isHome ? "text-white" : "text-pink-200"}`}
          >
            Account
          </span>
        </button>
      </div>
    </div>
  );
}
