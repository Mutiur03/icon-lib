"use client";

import { useMemo, useState } from "react";
import { FALLBACK_ICON_URL, resolveTechnologyIcon, technologyIconPath } from "@/lib/technology/sources";
import type { ResolvedTechnology, TechnologyRecord } from "@/lib/technology/types";

export interface TechnologyIconProps {
  technology?: TechnologyRecord | ResolvedTechnology;
  technologyId?: string;
  technologies?: TechnologyRecord[];
  size?: number;
  showTooltip?: boolean;
  showLabel?: boolean;
}

export function TechnologyIcon({
  technology,
  technologyId,
  technologies = [],
  size = 44,
  showTooltip = true,
  showLabel = false
}: TechnologyIconProps) {
  const resolved = useMemo(() => {
    const candidate = technology ?? technologies.find((item) => item.id === technologyId);
    if (!candidate) return undefined;
    return isResolvedTechnology(candidate) ? candidate : resolveTechnologyIcon(candidate);
  }, [technology, technologies, technologyId]);
  const [failed, setFailed] = useState(false);

  const canUseLocalRoute = resolved && !resolved.resolvedIconUrl.startsWith("data:");
  const iconUrl = failed || !resolved ? FALLBACK_ICON_URL : canUseLocalRoute ? technologyIconPath(resolved.id) : resolved.resolvedIconUrl;
  const name = resolved?.name ?? technologyId ?? "Unknown technology";

  return (
    <span className="icon-wrap" style={{ width: size, minWidth: size }} aria-label={name}>
      <img
        className="tech-icon"
        src={iconUrl}
        alt=""
        data-source={resolved?.resolvedSource ?? "fallback"}
        loading="lazy"
        width={size}
        height={size}
        style={{ width: size, height: size }}
        onError={() => setFailed(true)}
      />
      {showTooltip ? <span className="tooltip">{name}</span> : null}
      {showLabel ? <span className="icon-label">{name}</span> : null}
    </span>
  );
}

function isResolvedTechnology(technology: TechnologyRecord | ResolvedTechnology): technology is ResolvedTechnology {
  return "resolvedIconUrl" in technology && typeof technology.resolvedIconUrl === "string";
}
