////src/compoments/ RoomCard.jsx
// ✅ Single-room availability logic:
//      currentUsers === 0  →  green "Host wants only 1 user. Join fast!" banner
//                             JOIN ROOM button enabled
//      currentUsers >= maxUsers →  red "Room occupied. Wait for the user to leave."
//                             UNAVAILABLE button (disabled, greyed)
// ✅ Public / Private badge replaces old hardcoded label
// ✅ Live badge only rendered when room.live === true
// ✅ Viewer count (room.viewerCount) shown in LIVE preview area
// ✅ Avatar → falls back to coloured circle with initials

import { useState } from "react";

// ── Helpers ───────────────────────────────────────────────────────────────────
function isFull(room) {
  return room.currentUsers >= room.maxUsers;
}

// ── Host Photo Popup ──────────────────────────────────────────────────────────
function HostPhotoPopup({ room, onClose }) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{
        zIndex: 9999,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(6px)",
      }}
      onClick={onClose}
    >
      <div
        className="relative mx-6 w-full max-w-xs rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full aspect-[3/4] bg-gray-800 flex items-center justify-center">
          {room.avatar ? (
            <img
              src={room.avatar}
              alt={room.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: room.color }}
            >
              <span className="text-white font-extrabold text-5xl">
                {room.initials}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Live / Connecting Screen ──────────────────────────────────────────────────
function ConnectingScreen({ room, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black flex flex-col"
      style={{ zIndex: 9999 }}
    >
      {/* Header */}
      <div className="flex items-center px-4 pt-12 pb-3 gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-pink-400 shrink-0">
          {room.avatar ? (
            <img
              src={room.avatar}
              alt={room.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: room.color }}
            >
              <span className="text-white font-bold text-sm">
                {room.initials}
              </span>
            </div>
          )}
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-tight">
            {room.name}
          </p>
          <p className="text-green-400 text-xs font-semibold">● Live Room</p>
        </div>
        <button
          className="ml-auto text-white text-2xl font-light leading-none"
          onClick={onClose}
        >
          ✕
        </button>
      </div>

      {/* Viewer count */}
      <div className="flex justify-end px-4">
        <div className="flex items-center gap-1 text-white text-sm font-semibold">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {room.viewerCount ?? room.users ?? 0}
        </div>
      </div>

      {/* Connecting area */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <div className="w-20 h-20 rounded-2xl bg-gray-800 flex items-center justify-center self-end mr-8 mb-4">
          <svg
            className="w-10 h-10 text-gray-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
        </div>
        <div className="flex flex-col items-center gap-3">
          <svg
            className="w-16 h-16 text-gray-600"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
          <p className="text-white font-bold text-xl tracking-wide">
            Connecting to room...
          </p>
        </div>
      </div>

      {/* Timer */}
      <div className="text-center mb-6">
        <p className="text-white font-bold text-xl tracking-widest">00:00</p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-8 pb-12">
        <div className="flex flex-col items-center gap-1">
          <button className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
          </button>
          <span className="text-white text-xs">Mic</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <button
            className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center"
            onClick={onClose}
          >
            <svg
              className="w-7 h-7 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z" />
            </svg>
          </button>
          <span className="text-white text-xs">Leave</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <button className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
          <span className="text-white text-xs">Flip</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <button className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>
          <span className="text-white text-xs">Video</span>
        </div>
      </div>
    </div>
  );
}

// ── RoomCard ──────────────────────────────────────────────────────────────────
export default function RoomCard({ room }) {
  const isDouble = room.type === "double";
  const isSingle = room.type === "single";
  const [showPhoto, setShowPhoto] = useState(false);
  const [showRoom, setShowRoom] = useState(false);

  // Availability derived from backend data — never assumed on frontend
  const roomFull = isFull(room); // true → UNAVAILABLE
  const viewerCount = room.viewerCount ?? room.users ?? 0;

  // ── Availability banner (Single rooms only) ─────────────────────────────────
  const renderSingleBanner = () => {
    if (!isSingle) return null;

    if (!roomFull) {
      // Green banner: room is open
      return (
        <div
          className="flex items-center gap-2 rounded-xl px-3 py-2 mb-3"
          style={{ background: "#22c55e" }}
        >
          <svg
            className="w-4 h-4 text-white shrink-0"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
          <span className="text-white font-bold text-xs">
            Host wants only 1 user. Join fast!
          </span>
        </div>
      );
    } else {
      // Red banner: room is occupied
      return (
        <div
          className="flex items-center gap-2 rounded-xl px-3 py-2 mb-3"
          style={{ background: "#ef4444" }}
        >
          <svg
            className="w-4 h-4 text-white shrink-0"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
          <span className="text-white font-bold text-xs">
            Room occupied. Wait for the user to leave.
          </span>
        </div>
      );
    }
  };

  // ── Join / Unavailable button ───────────────────────────────────────────────
  const renderJoinButton = () => {
    // For single rooms: check availability
    if (isSingle && roomFull) {
      return (
        <button
          disabled
          className="w-full py-3 rounded-xl text-white font-extrabold text-sm tracking-widest uppercase cursor-not-allowed"
          style={{ background: "#9ca3af" }} // gray-400
        >
          Unavailable
        </button>
      );
    }

    return (
      <button className="btn-primary" onClick={() => setShowRoom(true)}>
        Join Room
      </button>
    );
  };

  // ── Visibility badge ────────────────────────────────────────────────────────
  const renderVisibilityBadge = () => {
    if (!room.visibility) return null;
    const isPublic = room.visibility === "public";
    return (
      <span
        className="inline-block text-white text-xs font-bold px-3 py-0.5 rounded-full mb-3"
        style={{ background: isPublic ? "#22c55e" : "#374151" }}
      >
        {isPublic ? "Public" : "Private"}
      </span>
    );
  };

  return (
    <>
      <div className="card p-4 mb-3 mx-4 sm:mx-0">
        {/* ── Top row: avatar + info ──────────────────────────────────────── */}
        <div className="flex items-start gap-3 mb-3">
          {/* Clickable avatar */}
          <button
            onClick={() => setShowPhoto(true)}
            className="relative shrink-0 active:scale-95 transition-transform"
          >
            {isDouble ? (
              <div className="w-14 h-14 relative">
                <div
                  className="w-10 h-10 rounded-full absolute top-0 left-0 border-2 border-white overflow-hidden flex items-center justify-center"
                  style={{ background: room.color }}
                >
                  {room.avatar ? (
                    <img
                      src={room.avatar}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-bold text-xs">
                      {room.initials?.[0]}
                    </span>
                  )}
                </div>
                <div
                  className="w-10 h-10 rounded-full absolute bottom-0 right-0 border-2 border-white overflow-hidden flex items-center justify-center"
                  style={{ background: room.color, opacity: 0.85 }}
                >
                  {room.avatar2 ? (
                    <img
                      src={room.avatar2}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-bold text-xs">
                      {room.initials?.[1] || "+"}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div
                className="w-14 h-14 rounded-full border-2 border-pink-200 overflow-hidden flex items-center justify-center text-white font-extrabold text-lg"
                style={{ background: room.color }}
              >
                {room.avatar ? (
                  <img
                    src={room.avatar}
                    alt={room.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  room.initials
                )}
              </div>
            )}
          </button>

          {/* Room info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-gray-800 text-base leading-tight truncate">
                {room.name}
              </h3>
              <div className="flex items-center gap-1 ml-2 shrink-0">
                {room.verified && (
                  <svg
                    className="w-4 h-4 text-pink-400"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                )}
                {/* Live badge — only when room is actually live */}
                {room.live && (
                  <span className="bg-pink-400 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                    Live
                  </span>
                )}
              </div>
            </div>

            {/* Host / age line */}
            <p className="text-gray-400 text-xs mt-0.5">
              {isSingle
                ? `${room.hosts[0]} • ${room.age} yrs`
                : isDouble
                  ? `${room.hosts[0]} • ${room.hosts[1]}`
                  : room.hostLabel}
            </p>

            {/* Viewer / user count */}
            <div className="flex items-center gap-1 mt-1">
              <svg
                className="w-3.5 h-3.5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-gray-400 text-xs font-semibold">
                {room.currentUsers} users
              </span>
            </div>
          </div>
        </div>

        {/* ── Visibility badge ────────────────────────────────────────────── */}
        {renderVisibilityBadge()}

        {/* ── Single-room availability banner ────────────────────────────── */}
        {renderSingleBanner()}

        {/* ── Live video preview ──────────────────────────────────────────── */}
        <div
          className="relative rounded-xl overflow-hidden bg-black mb-3"
          style={{ aspectRatio: "16/9" }}
        >
          {/* LIVE pill */}
          <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-black/70 rounded-full px-2 py-0.5">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
            <span className="text-white text-xs font-bold">LIVE</span>
          </div>

          {/* Viewer count in preview */}
          <div className="absolute top-2 right-2 z-10 flex items-center gap-1 text-white text-xs font-semibold">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {viewerCount}
          </div>

          {/* Camera icon placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-gray-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17 10.5V7a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1v-3.5l4 4v-11l-4 4z" />
            </svg>
          </div>

          {/* Camera button */}
          <button className="absolute bottom-2 right-2 w-9 h-9 rounded-xl bg-pink-300 flex items-center justify-center shadow-lg">
            <svg
              className="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17 10.5V7a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1v-3.5l4 4v-11l-4 4z" />
            </svg>
          </button>
        </div>

        {/* ── CTA ────────────────────────────────────────────────────────── */}
        <p className="text-gray-400 text-xs mb-2.5">
          Click The Button : Join The Room
        </p>
        {renderJoinButton()}
      </div>

      {/* ── Overlays ─────────────────────────────────────────────────────── */}
      {showPhoto && (
        <HostPhotoPopup room={room} onClose={() => setShowPhoto(false)} />
      )}
      {showRoom && (
        <ConnectingScreen room={room} onClose={() => setShowRoom(false)} />
      )}
    </>
  );
}
