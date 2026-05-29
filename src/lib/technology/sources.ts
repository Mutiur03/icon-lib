import type { ResolvedTechnology, TechnologyRecord, TechnologySource } from "./types";

export const FALLBACK_ICON_URL = "/icons/fallback.svg";

const sourceOrder: Array<TechnologySource> = ["custom", "skillicon", "devicon", "simpleicon"];

const providerUrl = (source: TechnologySource, value: string) => {
  if (!value) return "";
  if (value.startsWith("/") || value.startsWith("http") || value.startsWith("data:")) return value;

  switch (source) {
    case "skillicon":
      return `https://skillicons.dev/icons?i=${encodeURIComponent(value)}`;
    case "devicon":
      return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${value}/${value}-original.svg`;
    case "simpleicon":
      return `https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/${value}.svg`;
    case "custom":
      return value;
  }
};

export function technologyIconPath(technologyId: string) {
  return `/api/icons/${encodeURIComponent(technologyId)}`;
}

export function resolveTechnologyIcon(technology: TechnologyRecord): ResolvedTechnology {
  const resolved = resolveProviderTechnologyIcon(technology);
  return {
    ...resolved,
    resolvedIconUrl: resolved.resolvedIconUrl.startsWith("data:") ? resolved.resolvedIconUrl : technologyIconPath(technology.id)
  };
}

export function resolveProviderTechnologyIcon(technology: TechnologyRecord): ResolvedTechnology {
  for (const source of sourceOrder) {
    const candidate = technology.iconSources?.[source];
    const iconUrl = candidate ? providerUrl(source, candidate) : "";
    if (iconUrl) {
      return { ...technology, resolvedSource: source, resolvedIconUrl: iconUrl };
    }
  }

  if (technology.iconUrl) {
    return {
      ...technology,
      resolvedSource: technology.source,
      resolvedIconUrl: providerUrl(technology.source, technology.iconUrl)
    };
  }

  return { ...technology, resolvedSource: "fallback", resolvedIconUrl: FALLBACK_ICON_URL };
}

export function normalizeTechnologyId(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/#/g, "sharp")
    .replace(/\+/g, "plus")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
