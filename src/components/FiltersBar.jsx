import { useState } from "react";
import { Filter, MapPin, Waves, Calendar } from "lucide-react";

export default function FiltersBar({ onChange }) {
  const [location, setLocation] = useState("");
  const [level, setLevel] = useState("");
  const [dates, setDates] = useState("");

  const emit = (vals) => onChange?.(vals);

  return (
    <div className="w-full max-w-3xl mx-auto mt-4 sm:mt-6">
      <div className="rounded-2xl border border-gray-200 bg-white/70 backdrop-blur p-3 sm:p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="flex-1">
            <label className="text-xs text-gray-500 font-medium">Location</label>
            <div className="mt-1 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5">
              <MapPin size={16} className="text-gray-500" />
              <input
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  emit({ location: e.target.value, level, dates });
                }}
                placeholder="e.g., Bali, Red Sea, Cozumel"
                className="w-full outline-none text-sm"
              />
            </div>
          </div>

          <div className="sm:w-56">
            <label className="text-xs text-gray-500 font-medium">Certification</label>
            <div className="mt-1 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5">
              <Waves size={16} className="text-gray-500" />
              <select
                value={level}
                onChange={(e) => {
                  setLevel(e.target.value);
                  emit({ location, level: e.target.value, dates });
                }}
                className="w-full outline-none text-sm bg-transparent"
              >
                <option value="">Any</option>
                <option>Open Water</option>
                <option>Advanced Open Water</option>
                <option>Rescue Diver</option>
                <option>Divemaster</option>
              </select>
            </div>
          </div>

          <div className="sm:w-52">
            <label className="text-xs text-gray-500 font-medium">When</label>
            <div className="mt-1 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5">
              <Calendar size={16} className="text-gray-500" />
              <input
                value={dates}
                onChange={(e) => {
                  setDates(e.target.value);
                  emit({ location, level, dates: e.target.value });
                }}
                placeholder="Dates or range"
                className="w-full outline-none text-sm"
              />
            </div>
          </div>

          <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 text-white font-medium shadow hover:shadow-md active:scale-95 transition">
            <Filter size={16} />
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
