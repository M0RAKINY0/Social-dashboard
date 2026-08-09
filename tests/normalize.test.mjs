import test from "node:test";
import assert from "node:assert/strict";
import { normalizeSocialCrawlProfile, normalizeSocialCrawlReel } from "../lib/normalize.ts";
import { buildFramework, generateOriginalScript } from "../lib/templates.ts";

test("normalizes a canonical SocialCrawl profile without inventing optional fields", () => {
  const competitor = normalizeSocialCrawlProfile(
    {
      data: {
        author: {
          username: "raycfu",
          display_name: "Ray Fu",
          avatar_url: "https://cdn.example/avatar.jpg",
          followers: 12000,
          posts_count: 80,
        },
      },
    },
    "raycfu",
  );

  assert.equal(competitor.handle, "raycfu");
  assert.equal(competitor.displayName, "Ray Fu");
  assert.equal(competitor.followers, 12000);
  assert.equal(competitor.following, null);
  assert.equal(competitor.source, "live");
});

test("normalizes a canonical SocialCrawl reel and leaves absent metrics null", () => {
  const reel = normalizeSocialCrawlReel(
    {
      id: "reel-1",
      url: "https://www.instagram.com/reel/reel-1/",
      content: {
        text: "Stop building features nobody asked for",
        thumbnail_url: "https://cdn.example/thumb.jpg",
        duration_seconds: 34,
      },
      engagement: { views: 1000, likes: 120, comments: 8, shares: null, saves: null },
      published_at: "2026-08-01T12:00:00.000Z",
    },
    "raycfu",
  );

  assert.equal(reel.id, "reel-1");
  assert.equal(reel.competitorHandle, "raycfu");
  assert.equal(reel.caption, "Stop building features nobody asked for");
  assert.equal(reel.views, 1000);
  assert.equal(reel.saves, null);
  assert.equal(reel.source, "live");
});

test("generates an original framework and script without copying source wording", () => {
  const reel = {
    id: "reel-1",
    competitorHandle: "raycfu",
    publishedAt: "2026-08-01T12:00:00.000Z",
    caption: "Stop building features nobody asked for",
    hook: "Stop building features nobody asked for",
    cta: "Comment GUIDE for the checklist",
    performanceScore: 92,
    analysis: {
      hookType: "Negative claim",
      angle: "Contrarian product advice",
      painPoint: "Wasted roadmap cycles",
      structureFormula: "Claim → cost → rule → example → invitation",
    },
  };

  const framework = buildFramework(reel);
  const script = generateOriginalScript(reel, framework, "Grow followers");

  assert.equal(framework.length, 7);
  assert.match(script.disclaimer, /structure/i);
  assert.doesNotMatch(script.hook, /Stop building features nobody asked for/i);
  assert.ok(script.body.length > 20);
});
