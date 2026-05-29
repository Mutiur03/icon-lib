import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { FALLBACK_ICON_URL, resolveProviderTechnologyIcon } from "@/lib/technology/sources";
import { technologies } from "@/lib/technology/registry";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const url = new URL(request.url);
  const theme = url.searchParams.get("theme") || url.searchParams.get("t") || undefined;
  
  const normalizedId = id.toLowerCase();
  const technology = technologies.find(
    (item) => item.id.toLowerCase() === normalizedId || item.aliases?.some((alias) => alias.toLowerCase() === normalizedId)
  );
  const iconUrl = technology ? resolveProviderTechnologyIcon(technology, theme).resolvedIconUrl : FALLBACK_ICON_URL;

  try {
    return await iconResponse(iconUrl, theme);
  } catch {
    return iconResponse(FALLBACK_ICON_URL, theme);
  }
}

async function iconResponse(iconUrl: string, theme?: string) {
  if (iconUrl.startsWith("data:")) {
    const [meta, payload] = iconUrl.split(",", 2);
    const contentType = meta.match(/^data:([^;]+)/)?.[1] ?? "image/svg+xml";
    let body: Buffer;
    if (meta.includes(";base64")) {
      const rawBuffer = Buffer.from(payload, "base64");
      if (contentType.includes("image/svg+xml")) {
        const svgText = injectThemeStyleToSvg(rawBuffer.toString("utf8"), theme);
        body = Buffer.from(svgText, "utf8");
      } else {
        body = rawBuffer;
      }
    } else {
      let svgText = decodeURIComponent(payload);
      if (contentType.includes("image/svg+xml")) {
        svgText = injectThemeStyleToSvg(svgText, theme);
      }
      body = Buffer.from(svgText, "utf8");
    }
    return new NextResponse(body as any, { headers: iconHeaders(contentType) });
  }

  if (iconUrl.startsWith("/")) {
    const filePath = path.join(process.cwd(), "public", iconUrl);
    const contentType = contentTypeFromPath(iconUrl);
    if (contentType.includes("image/svg+xml")) {
      let svgText = await readFile(filePath, "utf8");
      svgText = injectThemeStyleToSvg(svgText, theme);
      const body = Buffer.from(svgText, "utf8");
      return new NextResponse(body as any, { headers: iconHeaders(contentType) });
    } else {
      const body = await readFile(filePath);
      return new NextResponse(body as any, { headers: iconHeaders(contentType) });
    }
  }

  const response = await fetch(iconUrl, { next: { revalidate: 60 * 60 * 24 } });
  if (!response.ok) throw new Error("Icon fetch failed");
  const contentType = response.headers.get("content-type") ?? contentTypeFromPath(iconUrl);

  let body: Buffer;
  if (contentType.includes("image/svg+xml")) {
    let svgText = await response.text();
    svgText = injectThemeStyleToSvg(svgText, theme);
    body = Buffer.from(svgText, "utf8");
  } else {
    body = Buffer.from(await response.arrayBuffer());
  }

  return new NextResponse(body as any, {
    headers: iconHeaders(contentType)
  });
}

function isMonochromeSvg(svgText: string): boolean {
  const cleanText = svgText.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
  
  const grayscalePattern = /#(?:000000|ffffff|111111|222222|333333|444444|555555|666666|777777|888888|999999|aaaaaa|bbbbbb|cccccc|dddddd|eeeeee|231f20|010101|050505|0a0a0a|0d0d0d|1a1a1a|2b2b2b|3c3c3c|4d4d4d|5e5e5e|6f6f6f|808080|919191|a2a2a2|b3b3b3|c4c4c4|d5d5d5|e6e6e6|f7f7f7|fff|000|111|222|333|444|555|666|777|888|999|aaa|bbb|ccc|ddd|eee)\b/i;
  
  const hexMatches = cleanText.match(/#[a-f0-9]{3,6}\b/gi) || [];
  for (const hex of hexMatches) {
    if (!grayscalePattern.test(hex)) {
      return false;
    }
  }
  
  const rgbMatches = cleanText.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/gi) || [];
  for (const rgb of rgbMatches) {
    const parts = rgb.match(/\d+/g);
    if (parts && (parts[0] !== parts[1] || parts[1] !== parts[2])) {
      return false;
    }
  }
  
  const colorNames = /\b(red|green|blue|yellow|cyan|magenta|orange|purple|indigo|pink|teal|violet|brown)\b/i;
  if (colorNames.test(cleanText)) {
    return false;
  }

  return true;
}

function injectThemeStyleToSvg(svgText: string, theme?: string): string {
  if (svgText.includes("/* icon-lib-theme-aware */")) {
    return svgText;
  }

  const isMonochrome = isMonochromeSvg(svgText);
  const styleBlock = `
  <style>
    /* icon-lib-theme-aware */
    ${
      theme === "dark"
        ? `
      [fill="#000000" i], [fill="#000" i], [fill="black" i], [fill="#231f20" i], [fill="#111111" i], [fill="#111" i], [fill="#010101" i], [fill="#1c3c3c" i] { fill: #ffffff !important; }
      [stroke="#000000" i], [stroke="#000" i], [stroke="black" i], [stroke="#231f20" i], [stroke="#111111" i], [stroke="#111" i], [stroke="#010101" i], [stroke="#1c3c3c" i] { stroke: #ffffff !important; }
    `
        : theme === "light"
        ? `
      [fill="#ffffff" i], [fill="#fff" i], [fill="white" i] { fill: #000000 !important; }
      [stroke="#ffffff" i], [stroke="#fff" i], [stroke="white" i] { stroke: #000000 !important; }
    `
        : `
      @media (prefers-color-scheme: dark) {
        [fill="#000000" i], [fill="#000" i], [fill="black" i], [fill="#231f20" i], [fill="#111111" i], [fill="#111" i], [fill="#010101" i], [fill="#1c3c3c" i] { fill: #ffffff !important; }
        [stroke="#000000" i], [stroke="#000" i], [stroke="black" i], [stroke="#231f20" i], [stroke="#111111" i], [stroke="#111" i], [stroke="#010101" i], [stroke="#1c3c3c" i] { stroke: #ffffff !important; }
      }
      @media (prefers-color-scheme: light) {
        ${
          isMonochrome
            ? `
          [fill="#ffffff" i], [fill="#fff" i], [fill="white" i] { fill: #000000 !important; }
          [stroke="#ffffff" i], [stroke="#fff" i], [stroke="white" i] { stroke: #000000 !important; }
        `
            : ""
        }
      }
    `
    }
  </style>`;

  const svgTagMatch = svgText.match(/<svg[^>]*>/i);
  if (svgTagMatch) {
    const insertIndex = svgTagMatch.index! + svgTagMatch[0].length;
    return svgText.slice(0, insertIndex) + styleBlock + svgText.slice(insertIndex);
  }

  return svgText;
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
