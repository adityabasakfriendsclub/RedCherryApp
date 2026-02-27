//src/compoments/HostProfileModal.jsx
import { useState } from "react";

function AvatarPlaceholder({ name, size = "lg", color = "bg-pink-300" }) {
  const sizeClass = size === "lg" ? "w-20 h-20 text-2xl" : "w-14 h-14 text-lg";
  return (
    <div
      className={`${sizeClass} ${color} rounded-full flex items-center justify-center text-white font-bold`}
    >
      {name?.charAt(0) || "?"}
    </div>
  );
}

export default function HostProfileModal({ host, onClose, onCall }) {
  const [activeTab] = useState("profile");

  if (!host) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white overflow-y-auto">
      {/* Cover / Hero */}
      <div className="relative w-full h-64 bg-gradient-to-br from-pink-200 to-pink-400 flex-shrink-0">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/30 flex items-center justify-center z-10"
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: `${60 + i * 20}px`,
                height: `${60 + i * 20}px`,
                top: `${10 + i * 8}%`,
                left: `${i % 2 === 0 ? 10 + i * 12 : 50 + i * 5}%`,
                opacity: 0.4,
              }}
            />
          ))}
        </div>
      </div>

      {/* Profile Content */}
      <div className="px-4 pb-24 -mt-10 relative">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-4">
          <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg overflow-hidden bg-pink-200 flex items-center justify-center">
            <AvatarPlaceholder name={host.name} />
          </div>

          <h2 className="text-2xl font-extrabold text-gray-800 mt-2">
            {host.name}{" "}
            <span className="text-gray-400 font-semibold text-lg">
              , {host.age}
            </span>
          </h2>
          <p className="text-gray-500 text-sm mt-0.5">
            {host.languages?.join(", ")}
          </p>
        </div>

        {/* User ID Card */}
        <div className="card p-4 text-center mb-5 shadow-sm">
          <p className="text-pink-400 font-extrabold text-xl tracking-widest">
            {host.userId}
          </p>
          <p className="text-gray-400 text-xs mt-0.5">User ID</p>
        </div>

        {/* About */}
        <div className="mb-5">
          <h3 className="font-extrabold text-gray-800 text-base mb-1.5">
            About
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">{host.about}</p>
        </div>

        {/* Interests */}
        <div className="mb-6">
          <h3 className="font-extrabold text-gray-800 text-base mb-2">
            Interests
          </h3>
          <div className="flex flex-wrap gap-2">
            {host.interests?.map((interest) => (
              <span
                key={interest}
                className="bg-pink-300 text-white text-sm font-semibold px-4 py-1.5 rounded-full"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* Gallery */}
        <div className="mb-6">
          <h3 className="font-extrabold text-gray-800 text-base mb-3">
            Gallery
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`rounded-2xl overflow-hidden bg-gradient-to-br ${
                  i % 4 === 0
                    ? "from-pink-200 to-pink-400"
                    : i % 4 === 1
                      ? "from-blue-100 to-blue-300"
                      : i % 4 === 2
                        ? "from-purple-100 to-purple-300"
                        : "from-green-100 to-green-300"
                } ${i === 4 ? "col-span-2" : ""} aspect-square flex items-center justify-center`}
              >
                <svg
                  className="w-10 h-10 text-white opacity-60"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            ))}
            {/* Last wide image */}
            <div className="col-span-2 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-200 to-gray-400 aspect-video flex items-center justify-center">
              <svg
                className="w-10 h-10 text-white opacity-60"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-lg">
        <button
          onClick={() => onCall && onCall(host)}
          className="w-full py-3.5 rounded-full bg-pink-400 text-white font-extrabold text-base shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          Call Now · ₹{host.ratePerMin}/min
        </button>
      </div>

      {/* Copyright */}
      <div className="text-center text-xs text-gray-400 pb-28 mt-2">
        © 2025 Biswa Bangla Social Networking Club. All rights reserved.
      </div>
    </div>
  );
}
