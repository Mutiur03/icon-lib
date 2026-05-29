import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { FALLBACK_ICON_URL, resolveProviderTechnologyIcon } from "@/lib/technology/sources";
import { technologies } from "@/lib/technology/registry";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const technology = technologies.find((item) => item.id === id);
  const iconUrl = technology ? resolveProviderTechnologyIcon(technology).resolvedIconUrl : FALLBACK_ICON_URL;

  try {
    return await iconResponse(iconUrl);
  } catch {
    return iconResponse(FALLBACK_ICON_URL);
  }
}

async function iconResponse(iconUrl: string) {
  if (iconUrl.startsWith("data:")) {
    const [meta, payload] = iconUrl.split(",", 2);
    const contentType = meta.match(/^data:([^;]+)/)?.[1] ?? "image/svg+xml";
    const body = meta.includes(";base64") ? Buffer.from(payload, "base64") : Buffer.from(decodeURIComponent(payload));
    return new NextResponse(body, { headers: iconHeaders(contentType) });
  }

  if (iconUrl.startsWith("/")) {
    const filePath = path.join(process.cwd(), "public", iconUrl);
    const body = await readFile(filePath);
    return new NextResponse(body, { headers: iconHeaders(contentTypeFromPath(iconUrl)) });
  }

  const response = await fetch(iconUrl, { next: { revalidate: 60 * 60 * 24 } });
  if (!response.ok) throw new Error("Icon fetch failed");
  const body = await response.arrayBuffer();
  return new NextResponse(body, {
    headers: iconHeaders(response.headers.get("content-type") ?? contentTypeFromPath(iconUrl))
  });
}

function iconHeaders(contentType: string) {
  return {
    "Content-Type": contentType,
    "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800"
  };
}

function contentTypeFromPath(value: string) {
  if (value.endsWith(".png")) return "image/png";
  if (value.endsWith(".webp")) return "image/webp";
  if (value.endsWith(".jpg") || value.endsWith(".jpeg")) return "image/jpeg";
  return "image/svg+xml";
}
