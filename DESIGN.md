# DESIGN.md — ReelRadar

**Competitor Instagram Reels intelligence dashboard.**
Design spec for an AI coding agent. Follow it exactly. Do not improvise visual style.

> **Binding style decision:** This product ships on the **SocialCrawl Design System** (the data provider's own system): warm stone neutrals, Geist Sans / Geist Mono, brand yellow `#FFD400` as surgical punctuation, data blue `#3b82f6` for analytics, hairline borders, quiet motion. The brief's "warm off-white" outer-background option is the one we take; the warm accent role the references fill with orange/red is filled here by brand yellow. This gives us a distinctive, non-generic look that no other AI-built dashboard will have — and it is intentionally NOT purple, NOT glassmorphic, NOT gradient-soaked.

---

## 1. Product overview

ReelRadar tracks competitors' Instagram Reels from the last 30 days and answers four questions, in this order, on every screen:

1. **What is working?** — ranked Reels feed per competitor.
2. **Why is it working?** — per-Reel pattern analysis (hook, angle, pacing, CTA).
3. **What should I post next?** — content plan with prioritized, evidence-backed ideas.
4. **How do I make my own version?** — reusable script frameworks + a script generator that preserves *structure, never wording* (ethical remix, not plagiarism).

Data arrives from the SocialCrawl API. Fields can be missing; the UI must degrade honestly (see §13).

**Primary user:** a founder/creator/marketer planning their own Reels.
**Primary demo context:** a 1440px-wide YouTube screen recording. Every screen must read within 3 seconds on camera.

---

## 2. Design goals

1. **Instantly legible product story.** First frame: competitor list left → ranked Reels center → analysis/template right. A viewer who has never seen the app should narrate it correctly in 3 seconds.
2. **Premium restraint, social warmth.** SaaS discipline (hairline borders, strict type scale, 4pt grid) + social-native texture (circular avatars, rounded thumbnails, rank badges, pillar chips).
3. **Analysis over vanity.** Every number earns its place. No decorative stat cards, no fake sparkline soup.
4. **Camera-friendly density.** Dense enough to feel useful; each card is a self-contained "crop-able" composition for thumbnails and B-roll.
5. **Honest data.** Missing fields render as explicit `—` / "Not available" states, never invented.

### Anti-goals (hard bans)
- No purple gradients. No gradients on surfaces at all (gradients exist only as fade masks and inside video thumbnails).
- No glassmorphism, no backdrop blur (modal scrim is solid `rgba(0,0,0,0.4)`).
- No AI-sparkle icons. The script generator uses a `pen-line` / `wand-2`-free vocabulary — use `file-text`, `layout-template`, `arrow-right`.
- No emoji anywhere in UI copy.
- No unstyled tables, no default-Tailwind look, no card shadows at rest.

---

## 3. Visual direction

**Three words: Effortless. Precise. Trustworthy.**

- **Surfaces:** warm stone neutrals only. Outer app frame `#f5f5f4` (stone-100); the dashboard is one large white rounded container (24px radius, 1px `#e7e5e4` border, `--shadow-lg`-equivalent soft shadow) floating on that frame. This is the ONLY shadow at rest in the entire app.
- **Yellow `#FFD400` is punctuation, never paint.** Legal uses: the single primary CTA per view, the active competitor/nav highlight (soft `#fef08a` at ~18% tint + `#ca8a04` text), rank-#1 badge, the performance-score ring, focus rings, chart series 1, JSON keys in code-style blocks. Nothing else.
- **Data blue `#3b82f6`** for analytics semantics: links, original-video URLs, secondary chart series, "vs. average" comparison bars. Never on the same element as yellow.
- **Green `#03A94D`** only for positive deltas / success. **Red `oklch(0.577 0.245 27.325)`** only for negative deltas / errors.
- **Dark surfaces:** transcript/script code-style blocks use `#1c1917` (stone-950) — the one persistently dark surface, exactly like SocialCrawl's code blocks. This is the hero-moment contrast device: a dark transcript panel against a white app photographs beautifully.
- **Texture:** a faint 72px dot-grid (border color at 8% opacity, radially masked) behind the outer frame only. Inside the dashboard: clean white, no texture.
- **Imagery:** Reel thumbnails are the imagery. 9:16 rounded rectangles (10px radius), 1px border. Placeholder thumbnails are muted stone blocks with a centered Lucide `play` glyph — never fake photos.

### Reference image interpretation (§4 of the brief)
- **From reference 1 (ShareFlow-style):** floating rounded app container on tinted background; left sidebar with a "Following" list of avatars; white top bar; card-based center feed; right rail of recommendations. We keep the *architecture*, replace the orange/red accent with brand yellow and the cool gray frame with warm stone.
- **From reference 2 (Instagram-style):** profile header with stats row; circular avatars with ring treatment (active competitor gets a 2px `#FFD400` ring, echoing story rings without copying Instagram gradients); masonry-ish feed rhythm. We take the *social rhythm*, none of the branding, none of the pink/orange gradient.
- **Explicitly not taken:** Instagram logo/gradient, donate/premium upsell panels, story tray.

---

## 4. Layout system

Desktop-first, designed at **1440 × 900**. Minimum supported 1280; below 1120 the right rail overlays as a drawer.

```
┌─ Outer frame: #f5f5f4, 24px padding, faint dot grid ─────────────────────────┐
│ ┌─ App container: white, radius 24, border, soft shadow ───────────────────┐ │
│ │ ┌ Sidebar 264px ┬──────────── Main column (fluid) ────────────────────┐ │ │
│ │ │ logo          │ TopBar (64px, border-bottom)                        │ │ │
│ │ │ nav           ├─────────────────────────────────────────────────────┤ │ │
│ │ │ ───────────   │ CompetitorProfileHeader                             │ │ │
│ │ │ FOLLOWING     │ KPI row (4 MetricCards)                             │ │ │
│ │ │ competitor    │ FilterPills + SortDropdown                          │ │ │
│ │ │ list          │ ReelGrid (3-col at 1440, 2-col ≤1280)               │ │ │
│ │ │ ───────────   │                                                     │ │ │
│ │ │ user account  │        [ReelDetailDrawer slides over, 480px]        │ │ │
│ │ └───────────────┴─────────────────────────────────────────────────────┘ │ │
│ └───────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

- **Sidebar:** fixed 264px, white, 1px right border. Collapsible to a 64px icon strip (logo mark, nav icons, avatar-only competitor list). Collapse toggle is a hamburger at the top of the sidebar.
- **Main column:** fluid, max content width 1040px centered when the drawer is closed; content compresses (not overlaps) when the drawer opens on ≥1280 viewports.
- **Reel detail = slide-over drawer**, 480px, right edge, full height of the app container, `--shadow-lg`, solid white. Chosen over modal/split-screen because on camera it produces the hero moment: ranked feed still visible left, transcript + template right. Drawer is the ONLY floating surface besides dropdowns/toasts.
- **Content Plan and Scripts** are full main-column pages (nav destinations), plus a compact "Add to plan" toast interaction from the drawer.

---

## 5. Color palette

Use these exact tokens (from `colors_and_type.css` of the SocialCrawl system — copy that file into the build).

| Role | Token / value |
|---|---|
| Outer frame background | `#f5f5f4` (`--muted`) |
| App container / cards | `#ffffff` (`--background`) |
| Primary text | `#0c0a09` (`--foreground`, stone-950) |
| Secondary text | `#78716c` (`--muted-foreground`, stone-500) |
| Hairline borders | `#e7e5e4` (`--border`, stone-200) |
| Inset wells / hover tint | `--muted` at 30–50% |
| Primary accent | `#FFD400` (`--brand-yellow`) — CTA fill, active states |
| Accent text-on-white | `#ca8a04` (`--brand-yellow-deep`) — never raw yellow text on white |
| Accent soft tint | `#fef08a` at ~18% (`--brand-yellow-soft`) — active row backgrounds |
| Analytics / links | `#3b82f6` (`--brand-blue`), soft `#dbeafe` |
| Positive delta / success | `#03A94D` (`--brand-green`) |
| Negative delta / error | `--destructive` (red-600) |
| Warning | `#f59e0b` |
| Dark panel (transcript/script) | `#1c1917` bg, `#e7e5e4` text, `#FFD400` highlights, `#60a5fa` values, `#57534e` comments |
| Charts | series 1 `#FFD400`, 2 `#fbbf24`, 3 `#f59e0b`, 4 `#60a5fa`, 5 `#3b82f6` |

**Ratio discipline:** ~92% stone/white, ~5% dark panels, ~2% blue, ~1% yellow. If a screen has more than three yellow elements visible, remove some.

---

## 6. Typography

**Geist Sans** (UI) + **Geist Mono** (data, metrics, tags, transcripts) from Google Fonts. Max weights per view: 600 / 500 / 400 (700 only for the page title and big stat numbers).

| Use | Spec |
|---|---|
| Page title (competitor name) | Geist 700, 30px/1.1 |
| Section headings ("Top Reels — last 30 days") | Geist 600, 18px/1.25 |
| Card titles / competitor names | Geist 600, 14px |
| Body / captions | Geist 400, 14px/1.5, `text-wrap: pretty` |
| Metadata rows, timestamps | Geist 400, 12px, `--muted-foreground` |
| Big stat numbers (KPI cards, drawer) | **Geist Mono 500**, 24–28px, tabular feel — all metrics are mono |
| Small metrics on cards (views, ER%) | Geist Mono 400, 12px |
| Labels / section eyebrows | Geist Mono 500, 11px, uppercase, +0.05em, `--muted-foreground` (e.g. `FOLLOWING`, `PATTERN ANALYSIS`, `// SCRIPT FRAMEWORK \\`) |
| Transcript text | Geist Mono 400, 13px/1.65 on dark panel |
| Handles, endpoints, dates in meta | Geist Mono, e.g. `@thefoundermark · 2.1s hook · 34s` |

**Numeric formatting:** `1,247` counts; `184ms`; `99.99%`; `1.2M` / `48.3K` for large view counts; ER as `6.8%`. Dates as `Jun 24`. Handles always `@lowercase`.

---

## 7. Spacing and sizing

4pt grid, 8px rhythm. Key values:

- Outer frame padding: 24px. App container radius: 24px.
- Sidebar: 264px wide; nav item height 40px; competitor row height 56px; sidebar padding 16px.
- TopBar: 64px tall, 24px horizontal padding.
- Main column padding: 32px; section gap: 32px; card grid gap: 20px.
- Card interior padding: 20px (KPI: 20px; Reel card: 0 on media, 16px on body).
- Drawer: 480px wide, 24px padding, sections separated by 1px borders + 24px.
- Radii: 6px chips/tags · 8px buttons, inputs, KPI cards · 12px Reel cards, table wrappers, dark panels · 10px thumbnails inside cards · 16px profile header card · 24px app container · pill (9999px) for filter pills, search, primary CTA, status badges.
- Avatars: 40px sidebar, 24px meta rows, 80px profile header. Always circular, 1px border; active = 2px `#FFD400` ring with 2px white gap.
- Hit targets ≥ 36px; primary buttons 40px tall.

**Shadows:** none on cards at rest. `--shadow-sm` tooltips · `--shadow-md` dropdowns/popovers/toasts · `--shadow-lg` drawer + the app container itself. Hover elevation change: never. Hover = background tint `--muted`/30 only, except Reel cards which may also translate `-2px` (see §15).

---

## 8. Component library

For every component: purpose · visual · data · states · interactions.

### AppShell
- **Purpose:** outer frame + container + grid described in §4.
- **Visual:** stone frame, dot-grid texture, floating white container.
- **States:** drawer-open (main column compresses), sidebar-collapsed.

### Sidebar
- **Visual:** white, 1px right border. Top: logo (24px yellow disc mark + "ReelRadar", Geist 600 16px). Nav list: Dashboard, Competitors, Reel Library, Content Plan, Scripts, Settings — Lucide 16px/1.5px icons (`layout-dashboard`, `users`, `clapperboard`, `calendar-range`, `file-text`, `settings`), 40px rows, 8px radius. Active: `#fef08a`/18% bg + `#ca8a04` text + icon in `--foreground`. Hover: `--muted`/50.
- Divider, then eyebrow `FOLLOWING` (mono 11px uppercase) with a mono count chip (`6`), then CompetitorListItems, then a ghost "+ Track competitor" row.
- Bottom: user account row (avatar, name, plan tag `PRO` mono chip), overflow menu.

### CompetitorListItem
- **Purpose:** the core navigation object — selecting one drives the whole main column.
- **Visual:** 56px row, 8px radius. 40px avatar · name (Geist 500 14px) over `@handle · N reels` (mono 11px muted) · right-aligned delta chip (`▲ 23%` green / `▼ 8%` red / `—` muted, mono 11px).
- **Data:** avatar, displayName, handle, trackedReelsCount, trendVsPrev30d.
- **States:** default · hover (`--muted`/40) · **active** (yellow-soft bg, 2px yellow avatar ring, name at 600) · loading (skeleton row) · avatar-missing (initials on stone-200 disc).
- **Interaction:** click → loads competitor analysis page; keyboard focusable; `aria-current="page"` when active.

### TopBar
- **Visual:** 64px, border-bottom. Left→right: search (pill input, 280px, `search` icon, placeholder "Search reels, hooks, captions…") · DateRangeSelector · FilterPills trigger (`sliders-horizontal` outline button "Filters") · SortDropdown · spacer · Export (ghost, `download`) · 32px user avatar.
- One primary CTA rule: the TopBar has **no** yellow button; yellow lives in the profile header.

### DateRangeSelector
- **Visual:** outline pill button, `calendar` icon + "Last 30 days" + `chevron-down`. Dropdown (shadow-md, 8px radius): Last 7 / 30 / 90 days, Custom. Selected row gets yellow-soft tint + check.
- **State:** changing range re-fetches → feed shows skeletons; header stats show inline spinners as mono `…`.

### CompetitorProfileHeader
- **Purpose:** the analysis header for the selected competitor.
- **Visual:** 16px-radius card, white, 1px border. Slim 96px banner strip: stone-100 with the dot-grid texture and a right-aligned oversized, cropped, 4%-opacity rendering of the competitor's handle in Geist Mono (decorative, per-competitor). 80px avatar overlapping banner bottom-left. Row: name (30px/700) + `@handle` (mono, muted) + category chip ("B2B SaaS · Founder content") · right side: outline button "Open profile ↗" and the page's single primary CTA **"Generate script"** (yellow pill, dark text).
- Stats row (border-top, 5 equal cells, mono numbers 20px/500 with 11px uppercase labels): Followers `128.4K` · Reels analyzed `24` · Avg views `86.2K` · Avg ER `5.1%` · Posting freq `4.2/wk`. Each cell may carry a small delta (`▲ 0.8pt` green mono 11px) vs previous 30 days.
- Second meta line: `Best pillar: Hiring stories · Best format: Talking head` as chips.
- **States:** loading (skeleton banner + rows) · partial data (missing stat renders `—` with tooltip "Not provided by source").

### MetricCard (KPI row — exactly 4, opinionated picks)
1. **Top Reel views** — `412K`, sub "vs 86K avg · 4.8×", `play` icon.
2. **Avg engagement rate** — `5.1%`, delta chip vs prev 30d.
3. **Winning hook format** — "Negative hook" + sub `9 of top 10 reels` (text KPI, no chart).
4. **Opportunity score** — `78/100` with a thin yellow progress arc, sub "High — low competition on 'pricing teardown'".
- **Visual:** white, 8px radius, 1px border, 20px padding; label (mono 11px uppercase) → value (mono 24–28px/500) → subtext (12px muted). Icon 16px top-right in `--muted-foreground`. No sparklines unless real data exists.
- **States:** default · loading skeleton · empty (`—` + "Awaiting data").

### PerformanceBadge
- **Purpose:** rank + score, the visual currency of the whole app.
- **Visual — rank:** `#1` `#2` `#3` chips top-left of thumbnails, mono 12px/500. #1 = solid `#FFD400`/dark text; #2–3 = white/90 with border; #4+ = stone-100.
- **Visual — score:** circular 32px ring gauge, stroke = yellow for ≥80, blue 50–79, stone <50; mono number inside. Drawer uses a 56px version.
- **States:** static; on drawer-open the ring animates sweep 0→score over 500ms ease-out (once).

### ReelCard
- **Purpose:** one competitor Reel in the ranked feed. Must read as social, not spreadsheet.
- **Visual:** 12px-radius card, border, white. Vertical: 9:16 thumbnail (10px radius inset 6px, muted-stone placeholder with `play` glyph if missing) with overlays — rank badge top-left, duration chip bottom-right (`0:34` mono on stone-950/70 white text), score ring top-right. Body 16px padding: hook line (Geist 600 14px, 2-line clamp, quoted: `"Stop hiring senior engineers first"`) · caption preview (12px muted, 1 line) · metrics row (mono 12px, icon+value: `play 412K · heart 18.2K · message-circle 942 · bookmark 3.1K · ER 8.4%`) · chip row: pillar chip (stone) + format chip (blue-soft, e.g. `Talking head`) + CTA chip (outline, e.g. `Comment "GUIDE"`) · footer: `Jun 24` (mono muted) + `Analyze reel →` link (blue, 13px).
- **Data:** thumbnail?, rank, performanceScore, hook?, caption?, publishedAt, views, likes, comments, shares?, saves?, engagementRate?, durationSec?, pillar?, format?, cta?, videoUrl.
- **States:** default · hover (bg `--muted`/30, translateY(-2px), border→stone-300, quick actions fade in over thumbnail: `external-link` "Open reel" + `bookmark-plus` "Save") · selected (2px yellow-deep border while drawer open) · missing metric → `—` in that slot (never hide the row) · skeleton.
- **Interactions:** card click → drawer. `Open reel` → videoUrl in new tab (stopPropagation). Keyboard: Enter opens drawer.

### ReelGrid
- 3 columns at 1440 (2 at ≤1280), 20px gap. Section heading row above: "Top Reels — last 30 days" (18px/600) + result count (mono muted `24 reels`) right-aligned.
- Ranked by current sort; re-sort does **not** animate reorder (content just updates — house rule).

### FilterPills
- Row of pill toggles under the heading: `All` · pillar values · format values · CTA types, horizontally scrollable. Off: white/border/muted text. On: stone-950 bg, white text (yellow is reserved). Multi-select within a facet; count badge on the "Filters" TopBar button mirrors active count. Clearing: `Reset` ghost pill appears when ≥1 active.

### SortDropdown
- Outline pill: `arrow-down-wide-narrow` + "Performance". Menu: Performance score · Views · Engagement rate · Comments · Newest. Shadow-md, selected row check + yellow-soft tint.

### ReelDetailDrawer  ⭐ hero component
- **Purpose:** full analysis of one Reel; the on-camera money shot.
- **Visual:** 480px slide-over, white, left border + shadow-lg, slides in 240ms cubic-bezier(0.4,0,0.2,1). Sticky header: `Reel #3 of 24` (mono 11px uppercase) + close `x`. Scrollable body, sections in this order, separated by hairlines:
  1. **Preview:** 120px-wide 9:16 thumbnail left; right column: hook (600 15px), `@handle · Jun 24 · 0:34`, blue link `instagram.com/reel/… ↗` (mono 12px, `external-link`), 56px score ring with label `Performance 92`.
  2. **Engagement:** 2×3 mini-grid of mono stat cells (Views/Likes/Comments/Saves/Shares/ER), each with a tiny horizontal comparison bar: blue fill = this Reel vs stone tick = competitor 30-day average, sub-label `4.8× avg`. Line: `Ranks #3 of 24 this period`.
  3. **Transcript:** dark panel (`#1c1917`, 12px radius). Eyebrow `TRANSCRIPT` + copy button. Geist Mono 13px/1.65, stone-200 text, timestamps `[00:03]` in `#57534e`. **Hook lines highlighted** with `#FFD400` left rule + yellow text; **CTA lines** with `#60a5fa` left rule + blue text; emotional beats annotated as comment lines: `// beat: tension spike`. Collapsed to ~10 lines with "Show full transcript" expander.
  4. **Pattern analysis** (`WHY IT WORKED`): definition-list rows, label (mono 11px uppercase muted) : value (14px). Hook type · Content angle · Pain point · Curiosity gap · Pacing (`avg shot 1.8s`) · CTA style · Visual format · Repeatable structure (one-line formula, 500 weight).
  5. **Reusable Script Framework** (`// SCRIPT FRAMEWORK \\` badge): dark panel again. Ethics line (12px, stone-400): "Structure, not wording. Use this skeleton to write an original Reel — never copy the source script." Numbered skeleton, slot names in yellow, guidance in stone-200: `1. HOOK — negative claim against {common practice} (≤2s)` / `2. SETUP — establish your credibility in one line` / `3. TENSION — the hidden cost nobody prices in` / `4. INSIGHT — your contrarian rule` / `5. EXAMPLE — one concrete number or story` / `6. CTA — comment-keyword ask`.
  6. **Footer actions (sticky):** primary yellow pill **"Generate my version"** + outline "Add to content plan" + ghost icon `bookmark` (Save template).
- **States:** open/closed · loading skeleton per section · transcript-missing (section shows honest empty: `file-x` icon, "Transcript not available for this reel", ghost "Request transcription") · error banner inline.
- **Interactions:** Esc / scrim-click / `x` closes; ↑↓ or `j/k` move to prev/next ranked Reel without closing (header counter updates); copy transcript; all three footer actions.

### TranscriptBlock / TranscriptHighlight
- As specified inside drawer §3 above; `TranscriptHighlight` = the left-rule + colored-text treatment with `data-kind="hook" | "cta" | "beat"`. Reused at larger width on the Scripts page.

### ScriptTemplateCard
- **Purpose:** a saved reusable framework (Scripts page + drawer save target).
- **Visual:** 12px-radius card; header: framework name ("Negative Hook → Contrarian Rule", 600 14px) + source chip (`From @thefoundermark #3` mono 11px, links back to Reel) · body: 6-step skeleton in mono 12px, step names in `#ca8a04` · footer: `Used 3×` mono muted + "Generate my version" outline button.
- **States:** default · hover tint · just-saved (brief yellow-soft flash 600ms).

### ContentPlanPanel
- **Purpose:** turns insights into a queue. Full page under "Content Plan".
- **Visual:** list of idea rows in a bordered 12px wrapper, hairline dividers. Each row: priority score ring (32px) · idea title (600 14px) + suggested hook (13px muted, quoted) · chips: pillar + suggested CTA · evidence line (12px muted): `Based on: 4 talking-head reels from @thefoundermark averaging 3.2× ER` with inline blue links to the source Reels · status select (pill: Draft stone / Ready to script blue-soft / Saved green-soft text `#03A94D` / Needs review amber-soft) · overflow menu.
- Header: "Content plan" (30px/700) + count + primary yellow **"New idea"**; sub-tabs `All · Ready · Drafts`.
- **States:** empty ("No ideas yet — analyze a reel and add it here", ghost CTA to Reel Library) · row-added (slides in from top 200ms, yellow-soft flash).

### GeneratedScriptPanel
- **Purpose:** the script generator (Scripts page + entered via "Generate my version").
- **Visual:** two-column: left 360px config card — source Reel (compact ReelCard mini), template select, **"Your angle"** textarea (inset `--muted` well), goal select (Grow followers / Drive comments / Sell) — with yellow **"Generate script"** at bottom; right column: output as a dark panel styled like the transcript: sections `HOOK` `BODY` `PAYOFF` `CTA` in yellow eyebrows, script text stone-200, optional `// shot: whip-pan to screen` comment lines. Footer: copy, "Save to scripts", regenerate ghost button, and a mono disclaimer `Original draft — structure inspired by, not copied from, the source reel.`
- **States:** idle (right column shows a stone-outlined placeholder: `file-text` icon, "Your script will appear here") · generating (dark panel with shimmering mono skeleton lines, no spinner-only state) · done · error.

### EmptyState
- Centered in the affected region: 20px Lucide icon in a 48px stone-100 disc, one-line message (14px/500), one-line explanation (12px muted), optional ghost action. Never full-screen illustrations. Copy is plain: "No reels in the last 30 days." / "@handle hasn't posted reels in this period."

### LoadingSkeleton
- Stone-100 blocks, 6–8px radius, subtle 1.6s opacity pulse (0.5→1). Shapes mirror the real layout exactly (thumbnail block + 3 text lines for ReelCard; row shapes for competitors). No spinners except inline `…` in stat cells.

### ErrorBanner
- Inline (not toast) at top of the affected region: destructive-soft bg (red at 8%), 8px radius, `triangle-alert` 16px, message + mono detail (`SocialCrawl API · 503`), "Retry" outline button. Never blocks the rest of the UI.

---

## 9. Screen-by-screen design

### 9.1 Main dashboard / competitor overview (`/`)
Nav: Dashboard. Purpose: cross-competitor situational awareness.
- Header: "Dashboard" (30px/700) + sub "6 competitors · last 30 days".
- Row of compact competitor summary cards (horizontal scroll if >4): avatar, name, `24 reels`, avg ER, trend delta. Click → their analysis page.
- "Top reels across all competitors" — ReelGrid, top 6, each card additionally shows a 24px avatar + handle above the hook.
- Right rail (320px, only on this screen): "This week's patterns" card — 3 bullet insights, each with mono count evidence (`Negative hooks: 7 of top 10`), and a mini ContentPlan preview (top 3 ideas) with "Open plan →".

### 9.2 Selected competitor analysis page (`/competitors/:handle`) — the default demo screen
Exactly the layout of §4: profile header → KPI row → filters/sort → ranked ReelGrid. **This is the first loaded screen in the video**, with @thefoundermark active in the sidebar and 24 reels loaded.

### 9.3 Reels ranked feed
The grid section of 9.2; also standalone under "Reel Library" (all competitors, competitor filter pill row added).

### 9.4 Reel detail view — drawer over 9.2. ⭐ **Hero moment:** drawer open on the #1 Reel — rank badge, 92-score ring mid-sweep, dark transcript with yellow hook highlight, framework panel visible above the fold, feed still visible left. This exact state is the thumbnail crop.

### 9.5 Transcript & reusable template view
The drawer's sections 3+5 expanded ("Show full transcript"); also reachable full-width on the Scripts page by opening a saved template's source.

### 9.6 Content plan view (`/plan`) — see ContentPlanPanel.

### 9.7 Script generator view (`/scripts`) — GeneratedScriptPanel + below it a 3-col grid of saved ScriptTemplateCards under heading "Saved frameworks".

### 9.8 Loading state — sidebar competitor skeleton rows; profile header skeleton; 6 skeleton ReelCards. App chrome (sidebar nav, topbar) never skeletons.

### 9.9 Empty state — competitor with 0 reels in range: profile header still renders (with available stats), grid region shows EmptyState with ghost action "Extend range to 90 days".

### 9.10 Error state — ErrorBanner atop the grid region; last-good data stays visible if cached, with a mono staleness note `Data from Jun 30 · refresh failed`.

---

## 10. Interaction states (summary spec)

1. **Competitor click:** active row restyles instantly; main column crossfades (120ms out / 160ms in) to skeletons → data. URL updates.
2. **Sort:** by Performance / Views / ER / Comments / Newest; content swaps without reorder animation; rank badges always reflect performance rank regardless of sort.
3. **Filter:** pillar / format / CTA pills, AND across facets, OR within; result count updates; empty result → EmptyState "No reels match these filters" + Reset.
4. **Reel click →** drawer (240ms slide + 40% scrim on <1280 only). Selected card keeps yellow-deep border.
5. **Original link:** new tab, `rel="noopener"`, external-link icon always present.
6. **Generate my version:** navigates to Scripts with source Reel + template preloaded; generation shows the shimmer state ≥800ms so it reads on camera.
7. **Add to content plan:** toast (bottom-right, shadow-md, 8px radius): check icon, "Added to content plan", "View" link; auto-dismiss 4s.
8. **Card hover:** tint + `-2px` lift + quick actions fade (120ms).
9–12. Loading / empty / error / skeletons — as §9.8–9.10 and §8.

**Keyboard:** `/` focuses search; `Esc` closes drawer; `j/k` prev/next Reel while drawer open; full tab order sidebar → topbar → feed.

---

## 11. Data model assumptions

TypeScript-ish shapes the UI binds to; `?` = may be missing and must render honestly.

```ts
Competitor {
  handle: string; displayName: string; avatarUrl?: string;
  bio?: string; category?: string;
  followers?: number; following?: number; totalPosts?: number;
  trackedReelsCount: number; avgViews?: number; avgEngagementRate?: number;
  topPillar?: string; postingFreqPerWeek?: number;
  trendVsPrev30d?: number; // signed %, drives delta chips
}

Reel {
  id: string; competitorHandle: string;
  videoUrl: string; thumbnailUrl?: string;
  caption?: string; transcript?: TranscriptLine[]; // {t?: seconds, text, kind?: 'hook'|'cta'|'beat'}
  publishedAt: string; durationSec?: number;
  views?: number; likes?: number; comments?: number; shares?: number; saves?: number;
  engagementRate?: number;
  hook?: string; cta?: string; topic?: string;
  pillar?: string; format?: 'Talking head'|'Tutorial'|'Story'|'Hot take'|'Founder POV'|'Case study'|'Trend remix';
  performanceScore: number; // 0–100, computed
  analysis?: { hookType, angle, painPoint, curiosityGap, pacing, ctaStyle, visualFormat, structureFormula }
  framework?: FrameworkStep[]; // {name, guidance}
}

PlanIdea { id, title, suggestedHook?, pillar?, suggestedCta?, priorityScore,
  rationale, sourceReelIds: string[], status: 'draft'|'ready'|'saved'|'review' }
```

Seed the demo with **6 competitors** (varied niches: founder content, DTC skincare, fitness coach, B2B SaaS, personal finance, food creator) and **24 reels** for the active one, with realistic ranges (views 12K–412K, ER 1.9–9.6%) and **deliberate gaps**: ~3 reels missing transcripts, 1 missing saves/shares, 1 competitor with avatar missing → initials.

---

## 12. Empty / loading / error rules (global)

- A missing value renders `—` in its exact slot; layout never reflows to hide it.
- Tooltips on `—`: "Not provided by source".
- Skeleton shapes always match final layout 1:1.
- Errors are regional, inline, retryable; the shell never white-screens.
- Never invent a metric to fill a gap.

---

## 13. Accessibility notes

- Text contrast ≥ 4.5:1 (hence `#ca8a04` — never raw `#FFD400` — for yellow text on white; dark text on yellow buttons).
- Yellow/green/red deltas always pair color with a glyph (`▲ ▼ —`) — never color alone.
- Focus visible: 2px `--ring` (yellow) outline, 2px offset, on all interactive elements.
- Drawer: `role="dialog"`, focus-trapped, focus returns to the source card on close.
- Rank/score rings have `aria-label` ("Performance score 92 of 100").
- Thumbnails get alt text from hook or caption; decorative banner texture is `aria-hidden`.
- All interactions keyboard-reachable; hover-revealed quick actions also visible on focus-within.
- `prefers-reduced-motion`: kill lift, ring sweep, drawer slides → instant.

---

## 14. Animation / motion guidance

House rules (SocialCrawl): quiet, 150–200ms, `cubic-bezier(0.4, 0, 0.2, 1)`, color/opacity/transform only, **layout never animates**, no springs/bounce/scale-in.

- Drawer: 240ms translateX. Toast: 200ms translateY+fade.
- Card hover: 120ms tint + `-2px` translate.
- Score ring: single 500ms sweep on drawer open (the one flourish; earns its place on camera).
- Skeleton pulse: 1.6s opacity 0.5↔1.
- Active competitor switch: 120ms fade-out / 160ms fade-in of the main column.
- Nothing else moves.

---

## 15. Implementation notes for the coding agent

1. **Load Geist + Geist Mono** from Google Fonts (weights 400/500/600/700; mono 400/500). Copy the SocialCrawl `colors_and_type.css` token file and bind all colors via `var(--*)`.
2. **Icons: Lucide only**, 16px at 1.5px stroke (20px in empty states). No emoji, no icon fonts, no `✓/★` unicode glyphs — use Lucide equivalents. Sanctioned unicode ornaments: `→ ↗ · ▲ ▼ —` and mono `// LABEL \\` badges.
3. Build order: tokens → AppShell → Sidebar+CompetitorListItem → TopBar → ProfileHeader+MetricCards → ReelCard+Grid+Filters → Drawer (all 6 sections) → Plan → Scripts → states.
4. Ship with seed data per §11 including the deliberate gaps; default route = §9.2 with the first competitor active and **make the drawer openable to the §9.4 hero state within two clicks of load**.
5. Thumbnails: use muted-stone placeholder blocks with `play` glyph (varying stone tones 100/200 for rhythm) — do NOT hotlink stock photos.
6. All metric text uses Geist Mono with `font-variant-numeric: tabular-nums`.
7. Charts (comparison bars only) are plain divs — no chart library needed.
8. State: client-side only; competitor selection + drawer + filters in URL params so demo states are directly linkable for B-roll.
9. Keep the whole app in light mode; the only dark surfaces are transcript/script panels.
10. Respect the one-primary-CTA rule per view; audit each screen for yellow-count ≤ 3.

---

## 16. Final design checklist

- [ ] Outer stone frame + single floating white container (24px radius) — reads in a thumbnail crop.
- [ ] Sidebar: nav + FOLLOWING list; active competitor has yellow-soft bg + yellow avatar ring.
- [ ] Profile header with banner, overlapping avatar, mono stat row, exactly one yellow CTA.
- [ ] 4 opinionated KPI cards — no filler stats, no fake sparklines.
- [ ] Ranked ReelGrid: 9:16 thumbnails, rank badges, score rings, chips, honest `—` gaps.
- [ ] Drawer hero state: dark transcript with yellow hook / blue CTA highlights + script framework + sweep-in score ring.
- [ ] Content plan rows with evidence links; script generator with dark output panel + ethics line.
- [ ] All numbers Geist Mono tabular; all deltas glyph+color; all links blue with `↗`.
- [ ] Zero: purple, gradients-on-surfaces, glass, emoji, sparkle icons, resting card shadows, spinner-only loading.
- [ ] Skeletons mirror layout; errors inline + retryable; empty states one icon + two lines.
- [ ] Keyboard: `/`, `Esc`, `j/k`; focus rings everywhere; reduced-motion honored.
- [ ] 3-second test passes: competitors left,

