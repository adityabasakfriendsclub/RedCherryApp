//src/pages/ReportProblemsPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ReportProblemPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    subject: "",
    problemType: "",
    description: "",
  });

  const problemTypes = ["App Bug", "Payment", "Account", "Other"];

  const handleSubmit = () => {
    if (!form.subject || !form.problemType || !form.description) {
      alert("Please fill all fields");
      return;
    }
    alert("Report submitted! Our team will review it within 24 hours.");
    navigate(-1);
  };

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
              Report
            </h1>
            <h1 className="text-white font-extrabold text-2xl leading-tight -mt-1">
              A Problem
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

      <div className="max-w-2xl mx-auto w-full px-4 pt-5 pb-10 space-y-5">
        {/* Info Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 items-start">
          <svg
            className="w-5 h-5 text-amber-500 shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-amber-700 text-sm">
            Our team will review your report and get back to you within 24
            hours.
          </p>
        </div>

        {/* Subject */}
        <div>
          <label className="block font-extrabold text-gray-800 mb-2">
            Subject
          </label>
          <input
            type="text"
            placeholder="e.g. App crash, Payment issue..."
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3 text-gray-700 text-sm focus:outline-none focus:border-pink-300"
          />
        </div>

        {/* Problem Type */}
        <div>
          <label className="block font-extrabold text-gray-800 mb-2">
            Problem Type
          </label>
          <div className="flex flex-wrap gap-2">
            {problemTypes.map((type) => (
              <button
                key={type}
                onClick={() => setForm({ ...form, problemType: type })}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                  form.problemType === type
                    ? "bg-pink-300 text-white border-pink-300"
                    : "bg-white text-gray-600 border-gray-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block font-extrabold text-gray-800 mb-2">
            Description
          </label>
          <textarea
            rows={6}
            placeholder="Please describe the issue in detail..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3 text-gray-700 text-sm focus:outline-none focus:border-pink-300 resize-none"
          />
        </div>

        {/* Submit */}
        <button onClick={handleSubmit} className="btn-primary">
          Submit Report
        </button>

        <p className="text-center text-gray-400 text-xs">
          © 2026 Biswa Bangla Social Networking Club. All rights reserved.
        </p>
      </div>
    </div>
  );
}
