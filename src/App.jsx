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

export default function App() {
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

        <FiltersBar onChange={() => {}} />

        <section className="mt-10 sm:mt-14">
          <CardStack />
        </section>

        <section className="mt-28 sm:mt-32 mb-20">
          <Onboarding />
        </section>
      </main>

      <footer className="mt-10 py-8 text-center text-sm text-gray-500">
        Built with love for the ocean. Stay safe and respect marine life.
      </footer>
    </div>
  );
}
