// //src/pages/HomePage.jsx  ────────────────────────────────────────────────────────────
// ✅ Single filter is active by default (matches design screenshots)
// ✅ Strict filtering — only rooms whose type matches the selected tab are shown
// ✅ "No Single rooms available" friendly empty state
// ✅ Smooth skeleton loading animation while data loads
// ✅ Error boundary message if fetch fails
// ✅ Real-time ready: swap `rooms` import for an API fetch hook when backend is live

import { useState, useEffect } from "react";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import FilterTabs from "../components/FilterTabs";
import RoomCard from "../components/RoomCard";
import TopPicksRow from "../components/TopPicksRow";
import OnCallGrid from "../components/OnCallGrid";
import { rooms as mockRooms } from "../data/mockData";

// ── Skeleton card shown while data loads ─────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="card p-4 mb-3 mx-4 sm:mx-0 animate-pulse">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-14 h-14 rounded-full bg-pink-100 shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-4 bg-pink-100 rounded-full w-3/4" />
          <div className="h-3 bg-pink-50 rounded-full w-1/2" />
          <div className="h-3 bg-pink-50 rounded-full w-1/3" />
        </div>
      </div>
      <div
        className="rounded-xl bg-pink-50 mb-3"
        style={{ aspectRatio: "16/9" }}
      />
      <div className="h-3 bg-pink-50 rounded-full w-2/3 mb-2" />
      <div className="h-10 bg-pink-100 rounded-xl" />
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ filter }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 px-6 text-center">
      {/* Icon */}
      <div className="w-16 h-16 rounded-full bg-pink-50 flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-pink-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      </div>
      <p className="text-gray-700 font-bold text-base mb-1">
        No {filter} rooms available right now.
      </p>
      <p className="text-gray-400 text-sm">
        Please check again later. New rooms open up frequently!
      </p>
    </div>
  );
}

// ── Error state ───────────────────────────────────────────────────────────────
function ErrorState({ onRetry }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-red-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <p className="text-gray-700 font-bold text-base mb-1">
        Could not load rooms.
      </p>
      <p className="text-gray-400 text-sm mb-4">
        Please check your connection and try again.
      </p>
      <button
        onClick={onRetry}
        className="bg-pink-400 text-white font-bold text-sm px-6 py-2 rounded-full active:scale-95 transition-transform"
      >
        Retry
      </button>
    </div>
  );
}

// ── HomePage ──────────────────────────────────────────────────────────────────
export default function HomePage() {
  // Default to "Single" tab as per design
  const [activeFilter, setActiveFilter] = useState("Single");

  // ── Data state ──────────────────────────────────────────────────────────────
  // Using mock data for now; replace fetchRooms with a real API call when ready.
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Fetch rooms (mock simulates network delay) ──────────────────────────────
  const fetchRooms = () => {
    setLoading(true);
    setError(null);

    // Simulate async fetch — swap this block with:
    //   const res = await fetch(`/api/rooms?type=${activeFilter.toLowerCase()}`);
    //   const data = await res.json();
    //   setRooms(data.rooms);
    setTimeout(() => {
      try {
        setRooms(mockRooms);
        setLoading(false);
      } catch {
        setError("Failed to load rooms.");
        setLoading(false);
      }
    }, 600); // 600 ms simulated latency
  };

  // Re-fetch whenever the active filter changes
  useEffect(() => {
    fetchRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter]);

  // ── Strict filter ───────────────────────────────────────────────────────────
  // Only rooms whose type === the selected tab (case-insensitive) are shown.
  // When backend is live, filtering happens server-side — keep this as a safety net.
  const filtered = rooms.filter(
    (room) => room.type === activeFilter.toLowerCase(),
  );

  // ── Handle tab change ───────────────────────────────────────────────────────
  const handleFilterChange = (tab) => {
    if (tab === activeFilter) return; // no-op if same tab
    setActiveFilter(tab);
  };

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <Header title="Home" />

      {/* Filter tabs — highlighted tab = active filter */}
      <FilterTabs active={activeFilter} onChange={handleFilterChange} />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {activeFilter === "OnCall" ? (
            // OnCall tab has its own dedicated grid component
            <OnCallGrid />
          ) : (
            <div className="px-4">
              {/* Top Picks row — always visible regardless of filter */}
              <p className="text-sm font-bold text-gray-700 mt-4 mb-1">
                Top Picks For You
              </p>
              <TopPicksRow />

              {/* ── Room list ──────────────────────────────────────────────── */}
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
                {loading ? (
                  // Skeleton loading state — show 3 placeholder cards
                  <>
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                  </>
                ) : error ? (
                  // API / network error
                  <ErrorState onRetry={fetchRooms} />
                ) : filtered.length === 0 ? (
                  // No rooms match the selected filter
                  <EmptyState filter={activeFilter} />
                ) : (
                  // Render matched rooms
                  filtered.map((room) => <RoomCard key={room.id} room={room} />)
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
