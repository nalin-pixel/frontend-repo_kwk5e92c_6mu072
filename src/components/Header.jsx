import { Anchor, Compass, User } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 border-b border-gray-200">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-full bg-cyan-500 grid place-items-center text-white shadow">
            <Anchor size={18} />
          </div>
          <div className="leading-tight">
            <p className="text-lg font-semibold tracking-tight">DiveBuddy</p>
            <p className="text-[11px] uppercase tracking-wider text-gray-500 font-medium">
              Find your next splash mate
            </p>
          </div>
        </div>

        <nav className="flex items-center gap-3 text-gray-600">
          <button className="inline-flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors">
            <Compass size={18} />
            <span className="hidden sm:inline text-sm font-medium">Explore</span>
          </button>
          <button className="inline-flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors">
            <User size={18} />
            <span className="hidden sm:inline text-sm font-medium">Profile</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
