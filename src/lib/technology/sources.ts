import type { ResolvedTechnology, TechnologyRecord, TechnologySource } from "./types";

export const FALLBACK_ICON_URL = "/icons/fallback.svg";

const sourceOrder: Array<TechnologySource> = ["skillicon", "devicon", "custom"];

const providerUrl = (source: TechnologySource, value: string, theme?: string) => {
  if (!value) return "";
  if (value.startsWith("/") || value.startsWith("http") || value.startsWith("data:")) return value;

  switch (source) {
    case "skillicon":
      const themeParam = theme ? `&theme=${encodeURIComponent(theme)}` : "";
      return `https://skillicons.dev/icons?i=${encodeURIComponent(value)}${themeParam}`;
    case "devicon":
      return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${value}/${value}-original.svg`;
    // Note: Simple Icons deprecated — handled by registry mapping to SkillIcons.
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

export function resolveProviderTechnologyIcon(technology: TechnologyRecord, theme?: string): ResolvedTechnology {
  for (const source of sourceOrder) {
    const candidate = technology.iconSources?.[source];
    const iconUrl = candidate ? providerUrl(source, candidate, theme) : "";
    if (iconUrl) {
      return { ...technology, resolvedSource: source, resolvedIconUrl: iconUrl };
    }
  }

  if (technology.iconUrl) {
    return {
      ...technology,
      resolvedSource: technology.source,
      resolvedIconUrl: providerUrl(technology.source, technology.iconUrl, theme)
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
