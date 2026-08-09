# ReelRadar

ReelRadar is a premium competitor Instagram Reels intelligence dashboard for the three configured accounts:

- `raycfu`
- `mavgpt`
- `nick_saraev`

It surfaces ranked Reels, pattern analysis, ethical script frameworks, a content plan, and an original script generator in a camera-ready SocialCrawl visual system.

## Run locally

Prerequisite: Node.js `>=22.13.0`.

```bash
npm install
npm run dev
```

Validation commands:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

`npm run build` uses Next.js with Webpack and the local WASM compiler fallback, so it does not depend on native Windows addons or a network font download. The source checks and tests do not require live API credentials.

## Environment variables

Copy `.env.example` to `.env.local` and set:

```text
SOCIALCRAWL_API_KEY=sc_...
```

The key is only read by the server-side adapter. It is never sent to the browser. Optional transcript enrichment can be added later through the same adapter without changing the UI types.

## SocialCrawl behavior

The server route at `/api/socialcrawl?handle=raycfu` requests Instagram profile and Reel data from SocialCrawl, normalizes canonical `author`/`post` responses, filters to the last 30 days, and scores the result using the available metrics.

When `SOCIALCRAWL_API_KEY` is not configured or the upstream request fails, the UI remains reviewable with an explicit `DEMO` label and a visible “Demo fallback data” notice. Fixture data is not presented as real competitor data. Missing live fields remain `—` / “Not provided by source”.

## Key files

- `DESIGN.md` — authoritative visual and interaction brief.
- `lib/socialcrawl.ts`, `lib/normalize.ts`, `lib/metrics.ts` — data boundary and scoring.
- `lib/fixtures.ts`, `lib/templates.ts` — labeled demo dataset and deterministic ethical remix output.
- `app/reelradar-app.tsx` — shared client orchestration and URL-linked state.
- `scripts/next-wasm.mjs` — cross-platform Next.js launcher for hosts that cannot load native bindings.
- `app/components/` — shell, cards, feed, drawer, content plan, and script generator.

## Known limitations

- The checked-in fallback data is intentionally synthetic and clearly labeled for camera-ready UI review.
- Direct video playback appears only when SocialCrawl returns a playable media URL; otherwise the card uses an honest thumbnail placeholder and an Instagram link.
- Transcript generation is deterministic when no external AI provider is configured; it preserves structure and does not paraphrase source wording.
- The app uses a local Geist-first system font stack instead of fetching Google Fonts during builds, so offline builds remain supported.
