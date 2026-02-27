//src/compoments/FilterTabs.jsx
const TABS = ["Single", "Double", "Multiple", "OnCall"];

export default function FilterTabs({ active, onChange }) {
  return (
    <div className="bg-gray-50 border-b border-gray-100 sticky top-[72px] z-30">
      <div className="max-w-6xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`filter-chip shrink-0 ${active === tab ? "active" : ""}`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
