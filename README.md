# ReelRadar

ReelRadar is a competitor Instagram Reels intelligence dashboard for finding patterns, ranking standout posts, and turning research into original content.

The current workspace tracks:

- `raycfu`
- `mavgpt`
- `nick_saraev`

The product is designed around ethical remixing: use competitor content to understand structures and signals, then develop an original angle rather than copying source wording.

## Product surface

- **Dashboard** - compare tracked competitors and surface the strongest Reels across the workspace.
- **Competitor analysis** - inspect profile metrics, ranked Reels, formats, hooks, and engagement signals.
- **Reel drawer** - review a Reel's source link, performance score, available transcript, and supporting metrics.
- **Content plan** - turn evidence from the feed into prioritized ideas with workflow statuses.
- **Script generator** - select a source Reel and create an original draft using an ethical remix framework.
- **Settings** - see the active data-source state and workspace accessibility preferences.
- **Honest data states** - live data, demo data, and unavailable upstream data are clearly distinguished in the UI.

## Stack

- Next.js `16.2.6` with React `19.2.6`
- TypeScript
- Next.js Webpack development and production builds
- `@next/swc-wasm-nodejs` fallback for environments that cannot load native Windows compiler bindings
- Custom CSS design system with Tailwind/PostCSS tooling
- Lucide React icons
- SocialCrawl for live Instagram profile and Reel data
- Node.js `>=22.13.0`

## Quick start

Install dependencies and start the local app:

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

The app runs with labeled demo data when no API key is configured, so the interface can be reviewed without live credentials.

## Environment variables

Copy `.env.example` to `.env.local` and add a server-side SocialCrawl key:

```text
SOCIALCRAWL_API_KEY=sc_your_api_key_here
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

`.env.local` is ignored by Git. The key is read only by the server-side adapter and is never sent to the browser. Never commit or paste a real key into source files, documentation, or issue reports.

## Available commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js development server with the WASM compiler fallback. |
| `npm run build` | Create a production build using the same Windows-compatible launcher. |
| `npm run start` | Serve the production build locally. |
| `npm run lint` | Run ESLint. |
| `npm run typecheck` | Run TypeScript without emitting files. |
| `npm test` | Run typechecking and the normalization, metrics, and rendered-HTML tests. |
| `npm run db:generate` | Generate Drizzle artifacts when database work is introduced. |

## Data flow

1. The client requests `/api/socialcrawl?handle=raycfu`.
2. The server route calls the SocialCrawl adapter with the requested handle.
3. When configured, the adapter requests profile data from `/v1/instagram/profile/full` and Reel data from `/v1/instagram/profile/reels/full`.
4. The response is normalized into the app's typed profile and Reel models.
5. Reels are filtered to the inclusive last-30-days window and ranked from the available metrics.
6. The UI renders the resulting dataset with an explicit source status.

The ranking score uses percentile-based signals with these weights:

- views: `45%`
- engagement rate: `30%`
- comments: `15%`
- recency: `10%`

If a metric is missing, the available weights are renormalized instead of inventing a value.

### Fallback behavior

- **No API key:** the app uses synthetic fixture data and labels the workspace `DEMO`.
- **Upstream request fails:** the app keeps the UI usable with the same labeled fallback and exposes an `unavailable` warning.
- **Missing source fields:** the UI shows an honest missing value or source notice rather than fabricating data.

## Project structure

```text
app/
  api/socialcrawl/       Server route for live competitor data
  components/            Dashboard shell, cards, feed, drawer, plan, and generator
  page.tsx               App entry point
  reelradar-app.tsx      Shared client orchestration and URL-linked state
  globals.css            Product styling and responsive layout
lib/
  socialcrawl.ts         Server-only API adapter and fallback selection
  normalize.ts           SocialCrawl payload normalization
  metrics.ts             Date filtering, engagement, and ranking logic
  fixtures.ts            Clearly labeled synthetic demo dataset
  templates.ts           Deterministic ethical remix output
  types.ts               Shared domain types
scripts/
  next-wasm.mjs          Cross-platform Next.js launcher
tests/                   Node-based behavior and rendered-output tests
DESIGN.md                Authoritative visual and interaction brief
```

## Limitations

- Demo fixtures are synthetic and should not be treated as real competitor data.
- Direct video playback is available only when SocialCrawl returns a playable media URL; otherwise the app provides a thumbnail placeholder and Instagram source link.
- Transcripts appear only when the source provides them. The current generator is deterministic when no external AI provider is configured.
- The app preserves structure and intent for remixing but does not paraphrase source wording.
- Builds use a local Geist-first font stack instead of fetching Google Fonts, keeping local and offline builds reliable.

## Design reference

See [DESIGN.md](DESIGN.md) for the visual system, page requirements, interaction notes, and acceptance criteria that define the dashboard's intended experience.
