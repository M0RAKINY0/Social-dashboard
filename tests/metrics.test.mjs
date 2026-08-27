import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateEngagementRate,
  filterReelsByDate,
  scoreAndRankReels,
} from "../lib/metrics.ts";

const now = new Date("2026-08-09T12:00:00.000Z");

test("filters reels to the inclusive last-30-days window", () => {
  const reels = [
    { id: "recent", publishedAt: "2026-08-01T12:00:00.000Z" },
    { id: "boundary", publishedAt: "2026-07-10T12:00:00.000Z" },
    { id: "old", publishedAt: "2026-07-01T12:00:00.000Z" },
  ];

  assert.deepEqual(
    filterReelsByDate(reels, 30, now).map((reel) => reel.id),
    ["recent", "boundary"],
  );
});

test("calculates engagement from only the metrics that exist", () => {
  assert.equal(
    calculateEngagementRate({
      views: 1000,
      likes: 100,
      comments: 20,
      shares: null,
      saves: null,
    }),
    12,
  );
  assert.equal(calculateEngagementRate({ views: 0, likes: 10 }), null);
});

test("scores and ranks reels from highest performance to lowest", () => {
  const ranked = scoreAndRankReels([
    { id: "low", publishedAt: "2026-08-01T12:00:00.000Z", views: 100, likes: 1, comments: 0 },
    { id: "high", publishedAt: "2026-08-08T12:00:00.000Z", views: 1000, likes: 100, comments: 10 },
    { id: "mid", publishedAt: "2026-07-20T12:00:00.000Z", views: 500, likes: 30, comments: 4 },
  ], now);

  assert.deepEqual(ranked.map((reel) => reel.id), ["high", "mid", "low"]);
  assert.deepEqual(ranked.map((reel) => reel.rank), [1, 2, 3]);
  assert.ok(ranked[0].performanceScore > ranked[1].performanceScore);
});
