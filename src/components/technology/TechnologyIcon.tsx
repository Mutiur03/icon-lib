"use client";

import { useMemo, useState } from "react";
import { FALLBACK_ICON_URL, resolveTechnologyIcon, technologyIconPath } from "@/lib/technology/sources";
import { getTechnologyById } from "@/lib/technology/registry";
import type { ResolvedTechnology, TechnologyRecord } from "@/lib/technology/types";

export interface TechnologyIconProps {
  technology?: TechnologyRecord | ResolvedTechnology;
  technologyId?: string;
  size?: number;
  showTooltip?: boolean;
  showLabel?: boolean;
}

export function TechnologyIcon({
  technology,
  technologyId,
  size = 44,
  showLabel = false
}: TechnologyIconProps) {
  const resolved = useMemo(() => {
    const candidate = technology ?? (technologyId ? getTechnologyById(technologyId) : undefined);
    if (!candidate) return undefined;
    return isResolvedTechnology(candidate) ? candidate : resolveTechnologyIcon(candidate as any);
  }, [technology, technologyId]);
  const [failed, setFailed] = useState(false);

  const canUseLocalRoute = resolved && !resolved.resolvedIconUrl.startsWith("data:");
  const iconUrl = failed || !resolved ? FALLBACK_ICON_URL : canUseLocalRoute ? technologyIconPath(resolved.id) : resolved.resolvedIconUrl;
  const name = resolved?.name ?? technologyId ?? "Unknown technology";

  return (
    <span className="group relative inline-flex flex-col items-center justify-center rounded-lg" style={{ width: size, minWidth: size }} aria-label={name}>
      <img
        className="block object-contain"
        src={iconUrl}
        alt=""
        data-source={resolved?.resolvedSource ?? "fallback"}
        loading="lazy"
        width={size}
        height={size}
        style={{ width: size, height: size }}
        onError={() => setFailed(true)}
      />
      {showLabel ? <span className="mt-2 text-center text-sm text-slate-100">{name}</span> : null}
    </span>
  );
}

function isResolvedTechnology(technology: TechnologyRecord | ResolvedTechnology): technology is ResolvedTechnology {
  return "resolvedIconUrl" in technology && typeof technology.resolvedIconUrl === "string";
}
