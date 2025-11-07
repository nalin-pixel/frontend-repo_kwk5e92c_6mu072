import { useState } from "react";
import { Check, ChevronRight, Waves, MapPin } from "lucide-react";

const steps = [
  { title: "Where do you dive?", icon: MapPin },
  { title: "Your certification", icon: Waves },
  { title: "Ready to explore", icon: Check },
];

export default function Onboarding() {
  const [index, setIndex] = useState(0);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-white to-cyan-50/60 p-6 sm:p-10 shadow-sm">
        <div className="flex items-center gap-2 text-xs text-gray-600 mb-6">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const active = i <= index;
            return (
              <div key={s.title} className="flex items-center gap-2">
                <div className={`h-6 w-6 grid place-items-center rounded-full border ${active ? "bg-cyan-600 text-white border-cyan-600" : "bg-white text-gray-500 border-gray-300"}`}>
                  <Icon size={14} />
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-10 h-[2px] ${active ? "bg-cyan-500" : "bg-gray-200"}`} />
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight">
            {steps[index].title}
          </h2>
          <p className="mt-2 text-gray-600">
            {index === 0 && "Add your favorite dive hub to get better matches."}
            {index === 1 && "Tell us your level so we pair you with suitable buddies."}
            {index === 2 && "Start swiping to find your next dive buddy."}
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            {index < steps.length - 1 ? (
              <button
                onClick={() => setIndex((i) => Math.min(i + 1, steps.length - 1))}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 text-white font-medium shadow hover:shadow-md active:scale-95 transition"
              >
                Continue
                <ChevronRight size={16} />
              </button>
            ) : (
              <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-medium shadow hover:shadow-md active:scale-95 transition">
                Got it
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
