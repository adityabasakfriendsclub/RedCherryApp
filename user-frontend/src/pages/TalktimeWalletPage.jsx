//src/pages/TalktimeWalletPage.jsx
import { useNavigate } from "react-router-dom";

export default function TalktimeWalletPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-pink-300 w-full sticky top-0 z-40 shadow-md">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-white">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div>
            <h1 className="text-white font-extrabold text-2xl leading-tight">
              Talktime
            </h1>
            <h1 className="text-white font-extrabold text-2xl leading-tight -mt-1">
              Wallet
            </h1>
          </div>
          <div className="ml-auto">
            <div className="w-14 h-14 rounded-full bg-white p-1 shadow-md flex items-center justify-center overflow-hidden">
              <img
                src="/logo.png"
                alt="BBSNC"
                className="w-full h-full object-contain rounded-full"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto w-full px-4 pt-5 pb-10">
        {/* Balance Card */}
        <div className="bg-pink-300 rounded-2xl p-8 flex flex-col items-center mb-6 shadow-sm">
          <svg
            className="w-10 h-10 text-white mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          <p className="text-white font-extrabold text-4xl mb-1">₹0</p>
          <p className="text-white/80 text-sm">Available Talktime Balance</p>
        </div>

        {/* Recharge Button */}
        <button className="btn-primary mb-6 active:scale-95 transition-transform">
          Recharge Wallet
        </button>

        {/* About Card */}
        <div className="card p-5">
          <h3 className="font-extrabold text-gray-800 text-base mb-2">
            About Talktime Wallet
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Your Talktime Wallet balance is used for calling hosts on the
            platform. Recharge your wallet to start making calls.
          </p>
        </div>

        <p className="text-center text-gray-400 text-xs mt-8">
          © 2026 Biswa Bangla Social Networking Club. All rights reserved.
        </p>
      </div>
    </div>
  );
}
