import type { TechnologyCategory } from "./types";

export const TECHNOLOGY_CATEGORIES: Array<{ id: TechnologyCategory; label: string }> = [
  { id: "language", label: "Languages" },
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "database", label: "Databases" },
  { id: "cloud", label: "Cloud" },
  { id: "devops", label: "DevOps" },
  { id: "ai", label: "AI" },
  { id: "tool", label: "Tools" },
  { id: "other", label: "Other" }
];

export const categoryLabel = (category: TechnologyCategory) =>
  TECHNOLOGY_CATEGORIES.find((item) => item.id === category)?.label ?? category;
