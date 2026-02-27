//src/compoments/TopPicksRow.jsx
import { topPicks } from "../data/mockData";
export default function TopPicksRow() {
  return (
    <div className="my-2 card p-4">
      <div className="flex gap-4 overflow-x-auto scrollbar-hide">
        {topPicks.map((user) => (
          <div
            key={user.id}
            className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer active:scale-95 transition-transform"
          >
            <div className="w-14 h-14 rounded-full border-2 border-pink-300 overflow-hidden bg-gray-200 flex items-center justify-center">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-bold text-lg bg-green-400 w-full h-full flex items-center justify-center">
                  {user.name.charAt(0)}
                </span>
              )}
            </div>
            <span className="text-xs font-semibold text-gray-600">
              {user.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
