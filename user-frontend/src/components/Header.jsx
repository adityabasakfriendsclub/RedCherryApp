//src/compoments/Header.jsx
export default function Header({ title }) {
  return (
    <div className="bg-pink-300 w-full sticky top-0 z-40 shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between relative">
        <h1 className="text-white text-2xl font-extrabold">{title}</h1>

        <div className="absolute left-1/2 -translate-x-1/2">
          <div className="w-14 h-14 rounded-full bg-white p-1 shadow-md flex items-center justify-center overflow-hidden">
            <img
              src="/logo.png"
              alt="Biswa Bangla Social Networking Club"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
        </div>

        <div className="bg-white rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-sm">
          <svg
            className="w-4 h-4 text-pink-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 7h18M3 7a2 2 0 00-2 2v8a2 2 0 002 2h18a2 2 0 002-2V9a2 2 0 00-2-2M3 7V5a2 2 0 012-2h14a2 2 0 012 2v2"
            />
          </svg>
          <span className="text-pink-500 font-extrabold text-sm">₹55</span>
        </div>
      </div>
    </div>
  );
}
