import registry from "@/data/technologies.json";
import { resolveTechnologyIcon } from "./sources";
import type { ResolvedTechnology, TechnologyRecord } from "./types";

export type { Technology, TechnologyCategory, TechnologyRecord, TechnologySource } from "./types";

export const technologies = registry as TechnologyRecord[];

export function getTechnologies(): ResolvedTechnology[] {
  const resolved = technologies.map((technology) => {
    const { website: _website, ...publicTechnology } = resolveTechnologyIcon(technology);
    return publicTechnology;
  });
  return resolved.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
}

export function getTechnologyById(id: string): ResolvedTechnology | undefined {
  return getTechnologies().find((technology) => technology.id === id);
}

export function getFeaturedTechnologies(): ResolvedTechnology[] {
  return getTechnologies().filter((technology) => technology.featured);
}
