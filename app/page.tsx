import { TechnologyCategory } from "@/components/technology/TechnologyCategory";
import { TechnologyGrid } from "@/components/technology/TechnologyGrid";
import { getTechnologies } from "@/lib/technology/registry";

export default function HomePage() {
  const technologies = getTechnologies();

  return (
    <main className="mx-auto w-full max-w-295 px-4 pb-16 pt-12 sm:px-6 lg:px-0">
      <section className="grid min-h-[46vh] gap-8 border-b border-slate-800 pb-10 pt-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:pt-16">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-emerald-300">Portfolio system</p>
          <h1 className="mb-5 max-w-4xl text-5xl leading-none tracking-tight text-white sm:text-6xl lg:text-7xl">
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
    </main>
  );
}
