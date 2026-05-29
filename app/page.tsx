import { TechnologyCategory } from "@/components/technology/TechnologyCategory";
import { TechnologyGrid } from "@/components/technology/TechnologyGrid";
import { getTechnologies } from "@/lib/technology/registry";

export default function HomePage() {
  const technologies = getTechnologies();

  return (
    <main className="page-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Portfolio system</p>
          <h1>Technology Icon Library</h1>
          <p className="hero-copy">
            Clean same-domain icons for languages, frameworks, tools, databases, cloud services, and AI platforms.
          </p>
        </div>
        <div className="hero-stats" aria-label="Registry statistics">
          <span>{technologies.length}</span>
          <small>registered technologies</small>
        </div>
      </section>

      <TechnologyGrid initialTechnologies={technologies} />
      <TechnologyCategory technologies={technologies} />
    </main>
  );
}
