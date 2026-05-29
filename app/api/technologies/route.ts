import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import type { TechnologyRecord } from "@/lib/technology/types";

export const dynamic = "force-dynamic";

const registryPath = path.join(process.cwd(), "src", "data", "technologies.json");

export async function GET() {
  const content = await readFile(registryPath, "utf8");
  return NextResponse.json(JSON.parse(content));
}

export async function POST(request: Request) {
  const payload = (await request.json()) as TechnologyRecord[];

  if (!Array.isArray(payload)) {
    return NextResponse.json({ error: "Expected an array of technologies." }, { status: 400 });
  }

  await writeFile(registryPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  return NextResponse.json({ ok: true, count: payload.length });
}