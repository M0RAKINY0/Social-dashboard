import { getDemoDataset } from "./fixtures";
import { filterReelsByDate, scoreAndRankReels } from "./metrics";
import { normalizeSocialCrawlProfile, normalizeSocialCrawlReels } from "./normalize";
import type { DatasetResult, Reel } from "./types";

const API_BASE = "https://www.socialcrawl.dev";

function getApiKey(): string | null {
  const key = process.env.SOCIALCRAWL_API_KEY?.trim();
  return key && key.startsWith("sc_") ? key : null;
}

async function socialCrawlGet(path: string, params: Record<string, string>): Promise<unknown> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("SOCIALCRAWL_API_KEY is not configured");
  const url = new URL(`${API_BASE}${path}`);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  const response = await fetch(url, { headers: { "x-api-key": apiKey }, cache: "no-store" });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = typeof body === "object" && body && "error" in body ? (body as { error?: { message?: string } }).error?.message : undefined;
    throw new Error(message ?? `SocialCrawl returned ${response.status}`);
  }
  return body;
}

function enrichFromPosts(reels: Reel[], profilePayload: unknown, handle: string): DatasetResult {
  const profile = normalizeSocialCrawlProfile(profilePayload, handle);
  const filtered = scoreAndRankReels(filterReelsByDate(reels, 30));
  const views = filtered.map((reel) => reel.views).filter((value): value is number => typeof value === "number");
  const engagements = filtered.map((reel) => reel.engagementRate).filter((value): value is number => typeof value === "number");
  const avgViews = views.length ? views.reduce((sum, value) => sum + value, 0) / views.length : null;
  const avgEngagementRate = engagements.length ? engagements.reduce((sum, value) => sum + value, 0) / engagements.length : null;
  return {
    competitor: { ...profile, trackedReelsCount: filtered.length, avgViews, avgEngagementRate },
    reels: filtered,
    source: "live",
    lastSynced: new Date().toISOString(),
  };
}

export async function getCompetitorDataset(handle: string): Promise<DatasetResult> {
  const normalized = handle.replace(/^@/, "").toLowerCase();
  if (!getApiKey()) return getDemoDataset(normalized);

  try {
    const [profilePayload, reelsPayload] = await Promise.all([
      socialCrawlGet("/v1/instagram/profile/full", { handle: normalized, posts: "50" }),
      socialCrawlGet("/v1/instagram/profile/reels/full", { handle: normalized, limit: "50" }),
    ]);
    return enrichFromPosts(normalizeSocialCrawlReels(reelsPayload, normalized), profilePayload, normalized);
  } catch (error) {
    const fallback = getDemoDataset(normalized);
    return {
      ...fallback,
      source: "unavailable",
      warning: error instanceof Error ? `Live data unavailable: ${error.message}` : "Live data unavailable.",
    };
  }
}
