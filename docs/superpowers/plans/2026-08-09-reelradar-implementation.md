# ReelRadar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a camera-ready competitor Instagram Reels intelligence dashboard for `raycfu`, `mavgpt`, and `nick_saraev`, with typed SocialCrawl integration, clearly labeled fallback data, reel analysis, ethical script frameworks, content planning, and robust UI states.

**Architecture:** Use the Sites vinext starter as a Next.js-compatible React/TypeScript surface. Keep the primary dashboard client-driven for responsive interactions, URL-linked competitor/reel/filter state, and shared views, while isolating SocialCrawl access in server-side code and normalizing it into stable domain types. Ship a deterministic fixture dataset for review when no API key or live data is available; never present it as live data.

**Tech Stack:** Next.js-compatible vinext, React 19, TypeScript, Tailwind CSS 4, Lucide React, server route for SocialCrawl, Node test runner, and CSS variables from DESIGN.md.

## Global Constraints

- Use the SocialCrawl visual system: warm stone neutrals, Geist Sans/Mono, `#FFD400` punctuation, `#3b82f6` analytics, hairline borders, quiet motion.
- No purple, surface gradients, glassmorphism, emoji, sparkle icons, resting card shadows, or spinner-only loading.
- Show only reels in the selected last-30-days range; missing values remain visible as `—` or “Not available”.
- Keep API keys server-side in environment variables; never hardcode credentials.
- Demo fallback copy must visibly identify demo data and must never masquerade as real SocialCrawl results.
- All interactive behavior must be keyboard reachable and honor `prefers-reduced-motion`.

---

### Task 1: Bootstrap the Sites project and source documents

**Files:**
- Create: `DESIGN.md`
- Create: `docs/superpowers/plans/2026-08-09-reelradar-implementation.md`
- Create: starter app files under `app/`, `public/`, and root config files
- Modify: `package.json`, `app/layout.tsx`, `app/globals.css`

**Interfaces:**
- Produces a runnable `npm run dev`, `npm run build`, and `npm test` surface for the remaining tasks.

- [ ] **Step 1: Seed DESIGN.md from the supplied authoritative brief and preserve its exact visual/interaction decisions.**
- [ ] **Step 2: Initialize the Sites vinext starter in the workspace and keep the starter package manager/lockfile.**
- [ ] **Step 3: Remove starter preview-only UI and replace title/description metadata with ReelRadar metadata.**
- [ ] **Step 4: Add Lucide React as the only icon dependency and confirm the starter compiles before feature work.**

### Task 2: Build the typed data and SocialCrawl adapter boundary

**Files:**
- Create: `lib/types.ts`
- Create: `lib/fixtures.ts`
- Create: `lib/metrics.ts`
- Create: `lib/templates.ts`
- Create: `lib/normalize.ts`
- Create: `lib/socialcrawl.ts`
- Create: `app/api/socialcrawl/route.ts`
- Test: `tests/metrics.test.mjs`

**Interfaces:**
- `normalizeSocialCrawlProfile(raw: unknown, handle: string): Competitor`
- `normalizeSocialCrawlReel(raw: unknown, handle: string): Reel`
- `filterReelsByDate(reels: Reel[], rangeDays: number, now: Date): Reel[]`
- `scoreAndRankReels(reels: Reel[], now: Date): Reel[]`
- `buildFramework(reel: Reel): Framework`
- `getCompetitorDataset(handle: string): Promise<DatasetResult>`

- [ ] **Step 1: Write failing tests for date filtering, missing-field preservation, engagement-rate fallback, percentile-based scoring, and descending rank output.**
- [ ] **Step 2: Run `node --test tests/metrics.test.mjs` and verify the tests fail because the shared metric module is not implemented.**
- [ ] **Step 3: Implement domain types, fixture data for the three requested accounts, deterministic analysis/framework generation, and metric helpers.**
- [ ] **Step 4: Implement normalization for SocialCrawl’s canonical `author`/`post` envelopes plus Instagram-specific response variants; keep nulls rather than inventing values.**
- [ ] **Step 5: Implement a server-only SocialCrawl fetcher using `SOCIALCRAWL_API_KEY`, including profile/reels fetching, optional transcript enrichment, and an explicit unavailable result when credentials are missing.**
- [ ] **Step 6: Implement the API route response with live/fallback status, last-synced metadata, and retry-safe error details without leaking credentials.**
- [ ] **Step 7: Run the tests again and confirm all metric/normalization tests pass.**

### Task 3: Establish the visual system and app shell

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Create: `app/reelradar-app.tsx`
- Create: `app/components/ui.tsx`
- Create: `app/components/sidebar.tsx`
- Create: `app/components/top-bar.tsx`

**Interfaces:**
- `ReelRadarApp({ initialView, initialHandle }): JSX.Element`
- `Sidebar({ competitors, activeHandle, onSelect }): JSX.Element`
- `TopBar({ filters, sort, onChange }): JSX.Element`

- [ ] **Step 1: Define CSS variables for exact palette, typography, radii, spacing, focus rings, shadows, texture, and motion rules from DESIGN.md.**
- [ ] **Step 2: Build the outer stone frame, dot grid, floating white app container, fixed/collapsible sidebar, user row, navigation, competitor list, and honest loading states.**
- [ ] **Step 3: Build the top bar with search, date range, filters, sort, refresh, and sync status; make URL state updates deterministic.**
- [ ] **Step 4: Add responsive behavior for 1280px/1120px breakpoints and reduced-motion overrides.**
- [ ] **Step 5: Render the shell with fixture data and verify it remains usable without live API data.**

### Task 4: Build the competitor analysis and ranked reel feed

**Files:**
- Create: `app/components/profile-header.tsx`
- Create: `app/components/reel-card.tsx`
- Create: `app/components/reel-grid.tsx`
- Create: `app/components/metric-card.tsx`
- Modify: `app/reelradar-app.tsx`

**Interfaces:**
- `ProfileHeader({ competitor, reels, onGenerate }): JSX.Element`
- `ReelCard({ reel, selected, onAnalyze }): JSX.Element`
- `ReelGrid({ reels, onAnalyze }): JSX.Element`

- [ ] **Step 1: Add profile header, five stat cells, four opinionated KPI cards, and one yellow CTA.**
- [ ] **Step 2: Add visually rich 9:16 reel cards with rank badges, score rings, metric rows, chips, honest missing values, and video/thumbnail fallback behavior.**
- [ ] **Step 3: Add filtering (AND across facets, OR within a facet), sorting, result counts, empty matches, and stable ranks.**
- [ ] **Step 4: Add competitor selection and crossfade loading state while preserving the app shell.**
- [ ] **Step 5: Test keyboard activation, original-link stopping behavior, focus-within quick actions, and URL-preserved filter/selection state.**

### Task 5: Build the reel detail hero drawer and ethical framework flow

**Files:**
- Create: `app/components/reel-drawer.tsx`
- Create: `app/components/transcript-block.tsx`
- Create: `app/components/performance-badge.tsx`
- Modify: `app/reelradar-app.tsx`

**Interfaces:**
- `ReelDrawer({ reel, competitor, onClose, onMove, onGenerate, onAddToPlan }): JSX.Element`
- `TranscriptBlock({ transcript }): JSX.Element`
- `PerformanceBadge({ score, rank, large }): JSX.Element`

- [ ] **Step 1: Implement the 480px right-side drawer with scrim behavior, Esc close, focus return, and `j/k` or arrow navigation.**
- [ ] **Step 2: Render preview, six-stat engagement comparison bars, transcript with hook/CTA/beat highlights, and honest transcript-missing state.**
- [ ] **Step 3: Render pattern analysis and dark reusable framework panel with explicit “structure, not wording” ethics copy.**
- [ ] **Step 4: Implement generate/copy/save/add-to-plan actions, toast feedback, and the score ring sweep animation.**
- [ ] **Step 5: Verify the default #1 hero state is reachable within two clicks from the first screen.**

### Task 6: Build content plan, scripts, and route surfaces

**Files:**
- Create: `app/components/content-plan.tsx`
- Create: `app/components/script-generator.tsx`
- Create: `app/plan/page.tsx`
- Create: `app/scripts/page.tsx`
- Create: `app/reels/page.tsx`
- Create: `app/competitors/[handle]/page.tsx`
- Create: `app/settings/page.tsx`
- Modify: `app/page.tsx`, `app/reelradar-app.tsx`

**Interfaces:**
- `ContentPlan({ ideas, onUpdateStatus }): JSX.Element`
- `ScriptGenerator({ sourceReel, framework }): JSX.Element`

- [ ] **Step 1: Add content-plan rows with evidence links, priority rings, status chips, tabs, empty state, and add-row feedback.**
- [ ] **Step 2: Add script generator configuration, deterministic original draft output, generating shimmer, copy/save/regenerate behavior, and ethics disclaimer.**
- [ ] **Step 3: Wire dashboard, competitors, reels, plan, scripts, and minimal settings routes to the shared shell.**
- [ ] **Step 4: Keep the user-selected competitor and drawer/filter state linkable through route/query state.**
- [ ] **Step 5: Add labeled demo/fallback status wherever live SocialCrawl data is unavailable.**

### Task 7: Verify, polish, and document the handoff

**Files:**
- Modify: `README.md`
- Modify: `.env.example`
- Modify: `tests/rendered-html.test.mjs` if needed

- [ ] **Step 1: Run `npm run lint` and fix actual lint errors.**
- [ ] **Step 2: Run `npm test` and confirm the build plus rendered HTML checks pass.**
- [ ] **Step 3: Run `npm run build` independently and confirm exit code 0.**
- [ ] **Step 4: Re-check the final diff for hard bans, missing-data honesty, key leakage, and the three-second first viewport.**
- [ ] **Step 5: Update README with run commands, environment variables, SocialCrawl behavior, real-vs-fallback data, and known limitations.**

