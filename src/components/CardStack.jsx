import { useEffect, useMemo, useRef, useState } from "react";
import { ThumbsDown, ThumbsUp, MapPin, Waves, Clock } from "lucide-react";

const sampleDivers = [
  {
    id: 1,
    name: "Maya",
    location: "Bali, Indonesia",
    level: "Advanced Open Water",
    experience: 120,
    bio: "Macro lover. Sunrise dives are my happy place.",
    image:
      "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?q=80&w=1740&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Leo",
    location: "Cozumel, Mexico",
    level: "Rescue Diver",
    experience: 210,
    bio: "Drift diving addict. Photographer on the side.",
    image:
      "https://images.unsplash.com/photo-1544551763-7ef420be2e25?q=80&w=1740&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Aya",
    location: "Okinawa, Japan",
    level: "Advanced Open Water",
    experience: 85,
    bio: "Sea turtles and calm seas, please.",
    image:
      "https://images.unsplash.com/photo-1544273677-c433136021f5?q=80&w=1740&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Sam",
    location: "Red Sea, Egypt",
    level: "Divemaster",
    experience: 350,
    bio: "Wrecks and night dives. I bring cookies for the surface interval.",
    image:
      "https://images.unsplash.com/photo-1542027951431-81b38a08719c?q=80&w=1740&auto=format&fit=crop",
  },
];

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

  return (
    <div
      ref={isTop ? ref : null}
      className="absolute inset-0 select-none"
      style={isTop ? style : undefined}
    >
      <div className="h-full w-full rounded-3xl overflow-hidden shadow-xl border border-white/20 bg-white">
        <div className="relative h-3/5 w-full">
          <img
            src={diver.image}
            alt={diver.name}
            className="h-full w-full object-cover"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 text-white drop-shadow">
            <h3 className="text-2xl font-semibold">{diver.name}</h3>
            <div className="mt-1 flex items-center gap-2 text-sm text-white/90">
              <MapPin size={16} />
              <span>{diver.location}</span>
            </div>
          </div>
        </div>

        <div className="h-2/5 p-4 sm:p-6">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
              <Waves size={16} />
              {diver.level}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              <Clock size={16} />
              {diver.experience} dives
            </span>
          </div>
          <p className="mt-3 text-gray-700 leading-relaxed">
            {diver.bio}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CardStack() {
  const [cards, setCards] = useState(sampleDivers);
  const topCard = useMemo(() => cards[cards.length - 1], [cards]);

  const swipeLeft = () => {
    setCards((prev) => prev.slice(0, -1));
  };
  const swipeRight = () => {
    setCards((prev) => prev.slice(0, -1));
  };

  return (
    <div className="relative aspect-[3/4] w-full max-w-md mx-auto">
      {cards.map((diver, idx) => {
        const isTop = idx === cards.length - 1;
        return (
          <div
            key={diver.id}
            className="absolute inset-0"
            style={{ transform: `translateY(-${(cards.length - 1 - idx) * 8}px) scale(${1 - (cards.length - 1 - idx) * 0.03})`, filter: `blur(${Math.max(0, cards.length - 1 - idx - 2)}px)` }}
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

      {topCard ? (
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
