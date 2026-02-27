//src/compoments/OnCallGrid.jsx
import { useState } from "react";
import { onCallHosts } from "../data/mockData";
import HostProfileModal from "./HostProfileModal";

function HostCard({ host, onPress }) {
  return (
    <div
      onClick={() => onPress(host)}
      className="card p-4 flex flex-col items-center gap-2 cursor-pointer active:scale-95 transition-transform"
    >
      {/* Avatar with live badge */}
      <div className="relative">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-pink-300 to-pink-500 flex items-center justify-center border-2 border-pink-200">
          <span className="text-white font-extrabold text-2xl">
            {host.name.charAt(0)}
          </span>
        </div>
        <span className="absolute bottom-0 right-0 bg-green-400 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
          LIVE
        </span>
      </div>

      <div className="text-center">
        <p className="font-extrabold text-gray-800 text-sm">{host.name}</p>
        <p className="text-gray-400 text-xs">{host.age} yrs</p>
        <p className="text-pink-500 text-xs font-semibold mt-0.5">
          ₹{host.ratePerMin}/min
        </p>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onPress(host);
        }}
        className="w-full py-1.5 rounded-full bg-pink-300 text-white text-xs font-bold active:bg-pink-400 transition-colors"
      >
        📞 Call
      </button>
    </div>
  );
}

export default function OnCallGrid() {
  const [selectedHost, setSelectedHost] = useState(null);

  return (
    <>
      <div className="mt-4 px-4">
        <p className="text-sm font-bold text-gray-700 mb-3">
          Hosts Available On Call
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {onCallHosts.map((host) => (
            <HostCard key={host.id} host={host} onPress={setSelectedHost} />
          ))}
        </div>
        <p className="text-center text-gray-400 text-xs mt-6">
          © 2025 Biswa Bangla Social Networking Club. All rights reserved.
        </p>
      </div>

      {selectedHost && (
        <HostProfileModal
          host={selectedHost}
          onClose={() => setSelectedHost(null)}
          onCall={(host) => {
            alert(`Calling ${host.name}... ₹${host.ratePerMin}/min`);
            setSelectedHost(null);
          }}
        />
      )}
    </>
  );
}
