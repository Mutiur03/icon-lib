"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { TECHNOLOGY_CATEGORIES } from "@/lib/technology/categories";
import type { ResolvedTechnology, TechnologyCategory } from "@/lib/technology/types";
import { TechnologyCard } from "./TechnologyCard";

interface TechnologyGridProps {
  initialTechnologies: ResolvedTechnology[];
}

export function TechnologyGrid({ initialTechnologies }: TechnologyGridProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<TechnologyCategory | "all">("all");
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return initialTechnologies.filter((technology) => {
      const matchesQuery =
        !needle ||
        technology.name.toLowerCase().includes(needle) ||
        technology.id.includes(needle) ||
        technology.aliases?.some((alias) => alias.toLowerCase().includes(needle));
      const matchesCategory = category === "all" || technology.category === category;
      const matchesFeatured = !featuredOnly || technology.featured;
      return matchesQuery && matchesCategory && matchesFeatured;
    });
  }, [category, featuredOnly, initialTechnologies, query]);

  return (
    <section className="py-10 sm:py-12" aria-labelledby="technology-grid-heading">
      <h2 id="technology-grid-heading" className="mb-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        Browse Technologies
      </h2>
      <div className="mb-5 grid gap-3 md:grid-cols-[minmax(220px,1fr)_180px_auto] md:items-center">
        <label>
          <span className="sr-only">Search technologies</span>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              className="w-full min-h-11 rounded-lg border border-slate-800 bg-slate-900 px-3 pl-10 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search technology"
            />
          </div>
        </label>
        <select
          className="min-h-11 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
          value={category}
          onChange={(event) => setCategory(event.target.value as TechnologyCategory | "all")}
          aria-label="Filter category"
        >
          <option value="all">All categories</option>
          {TECHNOLOGY_CATEGORIES.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
        <label className="inline-flex min-h-11 items-center gap-2 whitespace-nowrap text-slate-400">
          <input type="checkbox" checked={featuredOnly} onChange={(event) => setFeaturedOnly(event.target.checked)} />
          Featured
        </label>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(155px,1fr))] gap-3" role="list" aria-live="polite">
        {filtered.map((technology) => (
          <div key={technology.id} role="listitem">
            <TechnologyCard technology={technology} />
          </div>
        ))}
      </div>
      {filtered.length === 0 ? <p className="mt-4 text-sm leading-6 text-slate-400">No technologies match current filters.</p> : null}
    </section>
  );
}
