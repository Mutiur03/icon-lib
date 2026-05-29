import type { TechnologyCategory } from "./types";

export const TECHNOLOGY_CATEGORIES: Array<{ id: TechnologyCategory; label: string }> = [
  { id: "language", label: "Languages" },
  { id: "frontend", label: "Frontend Development" },
  { id: "backend", label: "Backend Development" },
  { id: "database", label: "Databases & Cache" },
  { id: "cloud", label: "Cloud Platforms" },
  { id: "devops", label: "DevOps & CI/CD" },
  { id: "ai", label: "AI & Machine Learning" },
  { id: "tool", label: "Development Tools" },
  { id: "os", label: "Operating Systems & Shells" },
  { id: "other", label: "Other Services & APIs" }
];

export const categoryLabel = (category: TechnologyCategory) =>
  TECHNOLOGY_CATEGORIES.find((item) => item.id === category)?.label ?? category;
