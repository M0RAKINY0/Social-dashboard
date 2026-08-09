import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("ships the ReelRadar entry shell and requested competitor routes", async () => {
  const [page, app, fixtures, topBar, design, packageJson, route, socialcrawl] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/reelradar-app.tsx", root), "utf8"),
    readFile(new URL("lib/fixtures.ts", root), "utf8"),
    readFile(new URL("app/components/top-bar.tsx", root), "utf8"),
    readFile(new URL("DESIGN.md", root), "utf8"),
    readFile(new URL("package.json", root), "utf8"),
    readFile(new URL("app/api/socialcrawl/route.ts", root), "utf8"),
    readFile(new URL("lib/socialcrawl.ts", root), "utf8"),
  ]);

  assert.match(page, /<ReelRadarApp initialView="analysis" initialHandle="raycfu" \/>/);
  assert.match(app, /raycfu/);
  assert.match(fixtures, /mavgpt/);
  assert.match(fixtures, /nick_saraev/);
  assert.match(topBar, /Last 30 days/);
  assert.match(app, /ReelDrawer/);
  assert.match(design, /SocialCrawl Design System/);
  assert.match(design, /#FFD400/);
  assert.match(packageJson, /"lucide-react"/);
  assert.match(route, /getCompetitorDataset/);
  assert.match(socialcrawl, /SOCIALCRAWL_API_KEY/);
});

test("does not ship the starter preview metadata or placeholder dependency", async () => {
  const [page, layout, packageJson] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/layout.tsx", root), "utf8"),
    readFile(new URL("package.json", root), "utf8"),
  ]);

  assert.doesNotMatch(page, /codex-preview|SkeletonPreview|_sites-preview/);
  assert.doesNotMatch(layout, /Starter Project|codex-preview|_sites-preview/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
