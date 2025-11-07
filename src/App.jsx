import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Header from "./components/Header";
import CardStack from "./components/CardStack";
import FiltersBar from "./components/FiltersBar";
import Onboarding from "./components/Onboarding";

function Background() {
  return (
    <div className="absolute inset-0 -z-0 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-50 to-white" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-80 w-[40rem] rounded-full bg-cyan-200/40 blur-3xl" />
    </div>
  );
}

function useDebouncedCallback(fn, delay) {
  const timeoutRef = useRef();
  return useCallback(
    (...args) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => fn(...args), delay);
    },
    [fn, delay]
  );
}

export default function App() {
  const backend = import.meta.env.VITE_BACKEND_URL;
  const [filters, setFilters] = useState({ location: "", level: "" });
  const [divers, setDivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [matchBanner, setMatchBanner] = useState(null);

  // Simple stable user id for demo usage
  const currentUserId = useMemo(() => {
    const k = "divebuddy_user_id";
    let id = localStorage.getItem(k);
    if (!id) {
      id = `demo-${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(k, id);
    }
    return id;
  }, []);

  const fetchDivers = useCallback(
    async (f) => {
      if (!backend) return;
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (f?.location) params.set("location", f.location);
        if (f?.level) params.set("level", f.level);
        params.set("limit", "20");
        const res = await fetch(`${backend}/divers?${params.toString()}`);
        const data = await res.json();
        setDivers(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to fetch divers", e);
      } finally {
        setLoading(false);
      }
    },
    [backend]
  );

  const debouncedFetch = useDebouncedCallback(fetchDivers, 300);

  useEffect(() => {
    fetchDivers(filters);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFiltersChange = (vals) => {
    const f = { ...filters, ...vals };
    setFilters(f);
    debouncedFetch(f);
  };

  const removeTopCard = () => {
    setDivers((prev) => prev.slice(1));
  };

  const handleSwipe = async (diver, direction) => {
    // Optimistic update
    removeTopCard();

    if (!backend || !diver?._id) return;
    try {
      const res = await fetch(`${backend}/swipes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from_id: currentUserId, to_id: diver._id, direction }),
      });
      const data = await res.json();
      if (data?.matched) {
        setMatchBanner({ name: diver.name, match_id: data.match_id });
        setTimeout(() => setMatchBanner(null), 3000);
      }
    } catch (e) {
      console.error("Swipe failed", e);
    }
  };

  return (
    <div className="min-h-screen relative text-gray-900">
      <Background />
      <Header />

      <main className="mx-auto max-w-5xl px-4 sm:px-6">
        <section className="pt-8 sm:pt-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Find your perfect dive buddy
          </h1>
          <p className="mt-2 text-gray-600">
            Swipe to match with divers who share your vibe, level, and location.
          </p>
        </section>

        <FiltersBar onChange={handleFiltersChange} />

        <section className="mt-10 sm:mt-14">
          <CardStack
            divers={divers}
            loading={loading}
            onSwipeLeft={(diver) => handleSwipe(diver, "left")}
            onSwipeRight={(diver) => handleSwipe(diver, "right")}
          />
        </section>

        <section className="mt-28 sm:mt-32 mb-20">
          <Onboarding />
        </section>
      </main>

      {matchBanner && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-emerald-600 text-white px-5 py-2 shadow-lg">
          It's a match with {matchBanner.name}! Say hi 👋
        </div>
      )}

      <footer className="mt-10 py-8 text-center text-sm text-gray-500">
        Built with love for the ocean. Stay safe and respect marine life.
      </footer>
    </div>
  );
}
