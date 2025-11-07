import { useEffect, useMemo, useRef, useState } from "react";
import { ThumbsDown, ThumbsUp, MapPin, Waves, Clock } from "lucide-react";

function useDraggable(onSwipe) {
  const ref = useRef(null);
  const [drag, setDrag] = useState({ x: 0, y: 0, active: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let startX = 0;
    let startY = 0;

    const onPointerDown = (e) => {
      startX = e.clientX;
      startY = e.clientY;
      setDrag((d) => ({ ...d, active: true }));
      el.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e) => {
      if (!drag.active) return;
      setDrag((d) => ({ ...d, x: e.clientX - startX, y: e.clientY - startY }));
    };

    const onPointerUp = () => {
      if (!drag.active) return;
      const threshold = 120;
      const direction = drag.x > threshold ? "right" : drag.x < -threshold ? "left" : null;
      if (direction) onSwipe?.(direction);
      setDrag({ x: 0, y: 0, active: false });
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
    };
  }, [drag.active, drag.x, onSwipe]);

  const style = {
    transform: `translate(${drag.x}px, ${drag.y}px) rotate(${drag.x / 15}deg)`,
    transition: drag.active ? "none" : "transform 300ms cubic-bezier(.2,.7,.3,1)",
  };

  return { ref, drag, style };
}

function DiverCard({ diver, onSwipeLeft, onSwipeRight, isTop }) {
  const onSwipe = (direction) => {
    if (direction === "left") onSwipeLeft?.();
    if (direction === "right") onSwipeRight?.();
  };

  const { ref, style } = useDraggable(onSwipe);

  const photo = diver?.image ||
    "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?q=80&w=1600&auto=format&fit=crop";

  return (
    <div
      ref={isTop ? ref : null}
      className="absolute inset-0 select-none"
      style={isTop ? style : undefined}
    >
      <div className="h-full w-full rounded-3xl overflow-hidden shadow-xl border border-white/20 bg-white">
        <div className="relative h-3/5 w-full">
          <img
            src={photo}
            alt={diver?.name || "Diver"}
            className="h-full w-full object-cover"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 text-white drop-shadow">
            <h3 className="text-2xl font-semibold">{diver?.name || "Diver"}</h3>
            <div className="mt-1 flex items-center gap-2 text-sm text-white/90">
              <MapPin size={16} />
              <span>{diver?.location || "Somewhere by the sea"}</span>
            </div>
          </div>
        </div>

        <div className="h-2/5 p-4 sm:p-6">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
              <Waves size={16} />
              {diver?.level || "Open Water"}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              <Clock size={16} />
              {diver?.experience ?? 0} dives
            </span>
          </div>
          <p className="mt-3 text-gray-700 leading-relaxed">
            {diver?.bio || "Ocean lover excited to explore new sites and make friends underwater."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CardStack({ divers = [], loading = false, onSwipeLeft, onSwipeRight }) {
  const top = divers[0];

  const swipeLeft = () => {
    if (top) onSwipeLeft?.(top);
  };
  const swipeRight = () => {
    if (top) onSwipeRight?.(top);
  };

  return (
    <div className="relative aspect-[3/4] w-full max-w-md mx-auto">
      {loading && (
        <div className="absolute inset-0 grid place-items-center">
          <div className="animate-pulse text-gray-500">Loading divers…</div>
        </div>
      )}

      {divers.map((diver, idx) => {
        const isTop = idx === 0;
        const depth = Math.max(0, Math.min(3, idx));
        return (
          <div
            key={diver._id || diver.id || idx}
            className="absolute inset-0"
            style={{
              transform: `translateY(${depth * -8}px) scale(${1 - depth * 0.03})`,
              filter: `blur(${Math.max(0, depth - 2)}px)`,
            }}
          >
            <DiverCard
              diver={diver}
              onSwipeLeft={swipeLeft}
              onSwipeRight={swipeRight}
              isTop={isTop}
            />
          </div>
        );
      })}

      {top ? (
        <div className="absolute -bottom-16 left-0 right-0 flex items-center justify-center gap-6">
          <button
            onClick={swipeLeft}
            className="h-12 w-12 rounded-full grid place-items-center bg-white border border-gray-200 shadow hover:shadow-md active:scale-95 transition"
            aria-label="Pass"
          >
            <ThumbsDown className="text-rose-500" />
          </button>
          <button
            onClick={swipeRight}
            className="h-14 w-14 rounded-full grid place-items-center bg-gradient-to-tr from-cyan-500 to-sky-500 text-white shadow-lg hover:shadow-xl active:scale-95 transition"
            aria-label="Match"
          >
            <ThumbsUp />
          </button>
        </div>
      ) : (
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <p className="text-xl font-semibold">You're all caught up</p>
            <p className="text-gray-600">Check back later for more dive buddies.</p>
          </div>
        </div>
      )}
    </div>
  );
}
