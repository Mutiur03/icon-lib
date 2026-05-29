import { TECHNOLOGY_CATEGORIES } from "@/lib/technology/categories";
import type { ResolvedTechnology } from "@/lib/technology/types";
import { TechnologyCard } from "./TechnologyCard";

export function TechnologyCategory({ technologies }: { technologies: ResolvedTechnology[] }) {
  return (
    <section className="section" aria-labelledby="technology-category-heading">
      <h2 id="technology-category-heading">Grouped Technologies</h2>
      <div className="category-stack">
        {TECHNOLOGY_CATEGORIES.map((category) => {
          const items = technologies.filter((technology) => technology.category === category.id);
          if (!items.length) return null;

          return (
            <section className="category-band" key={category.id} aria-labelledby={`${category.id}-heading`}>
              <h3 id={`${category.id}-heading`}>{category.label}</h3>
              <div className="grid">
                {items.map((technology) => (
                  <TechnologyCard key={technology.id} technology={technology} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}
