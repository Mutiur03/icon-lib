import { TechnologyCategory } from "@/components/technology/TechnologyCategory";
import { TechnologyGrid } from "@/components/technology/TechnologyGrid";
import { getTechnologies } from "@/lib/technology/registry";
import { ThemeToggle } from "@/components/ThemeToggle";
import { QuickStart } from "@/components/technology/QuickStart";

export default function HomePage() {
  const technologies = getTechnologies();

  return (
    <main className="mx-auto w-full max-w-295 px-4 pb-16 pt-6 sm:px-6 lg:px-0">
      {/* Top Navigation / Header */}
      {/* <header className="flex justify-between items-center py-4 border-b border-slate-800 mb-8" aria-label="Global header">
        <div className="flex items-center gap-3 select-none">
          <div className="h-9 w-9 rounded-lg bg-emerald-400 flex items-center justify-center text-slate-950 font-extrabold text-lg shadow-[0_4px_12px_rgba(52,211,153,0.3)]">
            I
          </div>
          <span className="font-bold text-white text-xl tracking-tight">IconLib</span>
        </div>
        <ThemeToggle />
      </header> */}

      <section className="grid min-h-[35vh] gap-8 border-b border-slate-800 pb-10 pt-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:pt-6">
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-emerald-400/90">Portfolio system</p>
          <h1 className="mb-5 max-w-4xl text-5xl font-extrabold tracking-tight text-white leading-[1.05] sm:text-6xl lg:text-7xl">
            Technology Icon Library
          </h1>
          <p className="max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            Clean same-domain icons for languages, frameworks, tools, databases, cloud services, and AI platforms.
          </p>
        </div>
        <div
          className="min-w-47.5 rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-[0_14px_40px_rgba(0,0,0,0.28)]"
          aria-label="Registry statistics"
        >
          <span className="block text-5xl font-extrabold text-white">{technologies.length}</span>
          <small className="block text-slate-400">registered technologies</small>
        </div>
      </section>

      <TechnologyGrid initialTechnologies={technologies} />
      <TechnologyCategory technologies={technologies} />
      <QuickStart />
    </main>
  );
}
