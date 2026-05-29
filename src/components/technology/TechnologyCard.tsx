import type { ResolvedTechnology } from "@/lib/technology/types";
import { technologyIconPath } from "@/lib/technology/sources";
import { CheckCircle2, Code2, FolderKanban, Image as ImageIcon, Sparkles, TriangleAlert } from "lucide-react";
import { TechnologyIcon } from "./TechnologyIcon";

export function TechnologyCard({ technology }: { technology: ResolvedTechnology }) {
  return (
    <a className="tech-card" href={technologyIconPath(technology.id)} aria-label={`Open ${technology.name} icon`}>
      <div className="tech-card-head">
        <TechnologyIcon technology={technology} size={46} />
        {technology.featured ? (
          <span className="featured-badge" aria-label="Featured" title="Featured">
            <CheckCircle2 size={14} aria-hidden="true" />
          </span>
        ) : null}
      </div>
      <div className="tech-label">
        <strong>{technology.name}</strong>
        <span>Source: {getSourceLabel(technology.resolvedSource)}</span>
      </div>
    </a>
  );
}

function getSourceLabel(source: ResolvedTechnology["resolvedSource"]) {
  switch (source) {
    case "custom":
      return "Custom";
    case "skillicon":
      return "SkillIcons";
    case "devicon":
      return "Devicon";
    case "simpleicon":
      return "Simple Icons";
    default:
      return "Fallback";
  }
}
