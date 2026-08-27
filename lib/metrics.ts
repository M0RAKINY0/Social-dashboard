import type { Reel } from "./types";

type MetricInput = Pick<Reel, "views" | "likes" | "comments" | "shares" | "saves"> &
  Partial<Pick<Reel, "publishedAt">>;

const DAY_MS = 24 * 60 * 60 * 1000;

function numeric(value: number | null | undefined): number | null {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : null;
}

export function calculateEngagementRate(input: MetricInput): number | null {
  const views = numeric(input.views);
  if (!views || views <= 0) return null;

  const interactions = [input.likes, input.comments, input.shares, input.saves]
    .map(numeric)
    .filter((value): value is number => value !== null);

  if (!interactions.length) return null;
  return Number(((interactions.reduce((sum, value) => sum + value, 0) / views) * 100).toFixed(1));
}

export function filterReelsByDate<T extends Pick<Reel, "publishedAt">>(
  reels: T[],
  rangeDays: number,
  now = new Date(),
): T[] {
  const cutoff = now.getTime() - rangeDays * DAY_MS;
  return reels.filter((reel) => {
    const timestamp = Date.parse(reel.publishedAt);
    return Number.isFinite(timestamp) && timestamp >= cutoff && timestamp <= now.getTime();
  });
}

function percentile(values: number[], value: number | null): number | null {
  if (!values.length || value === null) return null;
  const belowOrEqual = values.filter((candidate) => candidate <= value).length;
  return values.length === 1 ? 1 : (belowOrEqual - 1) / (values.length - 1);
}

function recencyScore(publishedAt: string, now: Date): number | null {
  const ageDays = (now.getTime() - Date.parse(publishedAt)) / DAY_MS;
  if (!Number.isFinite(ageDays)) return null;
  return Math.max(0, Math.min(1, 1 - ageDays / 30));
}

export function scoreAndRankReels(reels: Reel[], now = new Date()): Reel[] {
  const enriched = reels.map((reel) => ({
    ...reel,
    engagementRate: reel.engagementRate ?? calculateEngagementRate(reel),
  }));

  const viewValues = enriched.map((reel) => numeric(reel.views)).filter((value): value is number => value !== null);
  const engagementValues = enriched
    .map((reel) => numeric(reel.engagementRate))
    .filter((value): value is number => value !== null);
  const commentValues = enriched.map((reel) => numeric(reel.comments)).filter((value): value is number => value !== null);

  const weighted = enriched.map((reel) => {
    const candidates = [
      { weight: 0.45, score: percentile(viewValues, numeric(reel.views)) },
      { weight: 0.3, score: percentile(engagementValues, numeric(reel.engagementRate)) },
      { weight: 0.15, score: percentile(commentValues, numeric(reel.comments)) },
      { weight: 0.1, score: recencyScore(reel.publishedAt, now) },
    ];
    const available = candidates.filter((candidate) => candidate.score !== null);
    const totalWeight = available.reduce((sum, candidate) => sum + candidate.weight, 0);
    const score = totalWeight
      ? (available.reduce((sum, candidate) => sum + candidate.weight * (candidate.score ?? 0), 0) / totalWeight) * 100
      : 0;

    return { ...reel, performanceScore: Math.round(score) };
  });

  return weighted
    .sort((a, b) => b.performanceScore - a.performanceScore || Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
    .map((reel, index) => ({ ...reel, rank: index + 1 }));
}

export function averageMetric(reels: Reel[], key: "views" | "engagementRate"): number | null {
  const values = reels
    .map((reel) => numeric(reel[key]))
    .filter((value): value is number => value !== null);
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
}

export function formatCompactMetric(value: number | null | undefined): string {
  const normalized = numeric(value);
  if (normalized === null) return "—";
  if (normalized >= 1_000_000) return `${(normalized / 1_000_000).toFixed(normalized >= 10_000_000 ? 0 : 1)}M`;
  if (normalized >= 1_000) return `${(normalized / 1_000).toFixed(normalized >= 100_000 ? 0 : 1)}K`;
  return Math.round(normalized).toLocaleString("en-US");
}
