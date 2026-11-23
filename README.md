# Fundi Now: client demo

A clickable, installable prototype of **Fundi Now**, an on-demand mechanic service for Kampala.
It covers both sides of a job: the customer and the fundi.
Everything runs in the browser with simulated data, so there is no backend or account needed.

The product plan lives in [docs/PLAN.md](docs/PLAN.md).

## Run it

Requires Node 26 (pinned via Volta in `package.json`) and pnpm.

```bash
pnpm install
pnpm dev                 # http://localhost:3000
pnpm build && pnpm start # production mode: also enables the offline service worker
```

## Giving the demo

**On one phone**
1. Open `/`, tap **Get started** and use any `+256` number. The code is `123456`.
2. Tap **Breakdown? Get help now** or pick a problem, then request a fundi.
3. The fundi's side plays automatically: accept, drive over, arrive, then send a quote.
4. Approve the quote, pay with MTN MoMo or Airtel Money (simulated PIN prompt, any 4 digits), then rate.

To turn automatic playing off, go to **Account → Simulate the fundi**.

**On a laptop (presenter view)**
1. Open `/demo` to see the customer and fundi phones side by side, kept in sync.
2. Follow the script on the right, tapping through each phone in turn.
3. Use **Skip to next step** to move faster, or **Restart demo** to start over.

**Reset:** use **Account → Reset demo data**, or **Restart demo** on `/demo`.

## How it's built

- **App:** Next.js 16 (App Router), Tailwind v4 and shadcn/ui (Radix, Maia style, Lucide icons). The brand colour is defined as tokens in `src/app/globals.css`.
- **Simulated backend:** `src/lib/demo/` holds a zustand store persisted to `localStorage`. Tabs and iframes stay in sync through the `storage` event.
  - `autopilot.ts` plays the fundi's side on a single phone.
  - Every step is a guarded state transition (`matching → assigned → en_route → … → reviewed`), matching the job state machine in the plan.
- **Map:** MapLibre GL with free OpenFreeMap tiles, so no API key is needed. The route is a real Bukoto → Ntinda road path, stored in `data.ts`.
  - `scripts/copy-map-worker.mjs` copies MapLibre's web worker to `public/vendor/`, because the bundler breaks its default worker URL. `dev` and `build` run this automatically.
- **PWA:** `src/app/manifest.ts`, icons in `public/icons/` and `src/app/icon.png`, and `public/sw.js`. The service worker only registers in production builds.

## Live demo (GitHub Pages)

**https://alemiherbert.github.io/fundi-now/** · presenter view: **https://alemiherbert.github.io/fundi-now/demo/**

Every push to `main` deploys automatically through `.github/workflows/pages.yml`.
- The Pages build is a static export served from `/fundi-now/`. It is enabled by setting `GITHUB_PAGES=true` (see `next.config.ts`).
- Raw URLs go through `withBase()` or `pageUrl()` in `src/lib/base-path.ts`. That covers iframes, the service worker, the map worker and the manifest. `<Link>` and router calls get the base path automatically.
- To try the Pages build locally, run `pnpm build:pages`, then serve `out/` under `/fundi-now/`.

## Testing on a real phone

Open the GitHub Pages link on the phone. It's served over HTTPS, so you can add it to the home screen.
For a local build, `cloudflared tunnel --url http://localhost:3000` gives you a temporary HTTPS URL.
