import { NextResponse } from "next/server";
import { getCompetitorDataset } from "../../../lib/socialcrawl";

export async function GET(request: Request) {
  const handle = new URL(request.url).searchParams.get("handle") ?? "raycfu";
  const dataset = await getCompetitorDataset(handle);
  return NextResponse.json(dataset, {
    headers: { "Cache-Control": "private, max-age=60" },
  });
}
