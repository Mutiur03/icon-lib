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
    <section className="section" aria-labelledby="technology-grid-heading">
      <h2 id="technology-grid-heading">Browse Technologies</h2>
      <div className="toolbar">
        <label>
          <span className="sr-only">Search technologies</span>
          <div className="search-field">
            <Search size={18} aria-hidden="true" />
            <input
              className="field"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search technology"
            />
          </div>
        </label>
        <select
          className="select"
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
        <label className="toggle">
          <input type="checkbox" checked={featuredOnly} onChange={(event) => setFeaturedOnly(event.target.checked)} />
          Featured
        </label>
      </div>
      <div className="grid" role="list" aria-live="polite">
        {filtered.map((technology) => (
          <div key={technology.id} role="listitem">
            <TechnologyCard technology={technology} />
          </div>
        ))}
      </div>
      {filtered.length === 0 ? <p className="admin-note">No technologies match current filters.</p> : null}
    </section>
  );
}
