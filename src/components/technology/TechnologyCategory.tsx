import { TECHNOLOGY_CATEGORIES } from "@/lib/technology/categories";
import type { ResolvedTechnology } from "@/lib/technology/types";
import { TechnologyCard } from "./TechnologyCard";

export function TechnologyCategory({ technologies }: { technologies: ResolvedTechnology[] }) {
  return (
    <section className="py-10 sm:py-12" aria-labelledby="technology-category-heading">
      <h2 id="technology-category-heading" className="mb-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        Grouped Technologies
      </h2>
      <div className="grid gap-6">
        {TECHNOLOGY_CATEGORIES.map((category) => {
          const items = technologies.filter((technology) => technology.category === category.id);
          if (!items.length) return null;

          return (
            <section className="pt-2" key={category.id} aria-labelledby={`${category.id}-heading`}>
              <h3 id={`${category.id}-heading`} className="mb-3 text-base font-semibold text-white">
                {category.label}
              </h3>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(128px,1fr))] gap-3">
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
