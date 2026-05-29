import type { ResolvedTechnology } from "@/lib/technology/types";
import { technologyIconPath } from "@/lib/technology/sources";
import { CheckCircle2 } from "lucide-react";
import { TechnologyIcon } from "./TechnologyIcon";

export function TechnologyCard({ technology }: { technology: ResolvedTechnology }) {
  return (
    <a
      className="group flex min-h-35.5 flex-col justify-between gap-4 overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-inherit shadow-[0_14px_40px_rgba(0,0,0,0.28)] transition duration-150 hover:-translate-y-0.5 hover:border-emerald-400/70 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
      href={technologyIconPath(technology.id)}
      aria-label={`Open ${technology.name} icon`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <TechnologyIcon technology={technology} size={46} />
        {technology.featured ? (
          <span
            className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300"
            aria-label="Featured"
            title="Featured"
          >
            <CheckCircle2 size={14} aria-hidden="true" />
          </span>
        ) : null}
      </div>
      <div className="min-w-0 space-y-1">
        <strong className="block wrap-break-word text-sm font-semibold text-white">{technology.name}</strong>
        <span className="block wrap-break-word text-xs leading-5 text-slate-400">Source: {getSourceLabel(technology.resolvedSource)}</span>
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
    default:
      return "Fallback";
  }
}
