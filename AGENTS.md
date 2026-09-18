# AGENTS.md

## Project Overview
Aaryan Singh's portfolio website built as a "repertory cinema programme" — a static Next.js 15 site with a dense, typographically serious layout.

## Commands

### Development
```bash
npm run dev
```
Runs the Next.js development server.

### Build
```bash
npm run build
```
Builds the production static site.

### Lint
```bash
npm run lint
```
Runs ESLint with Next.js core-web-vitals rules.

### Type Check
```bash
npm run typecheck
```
Runs TypeScript type checking without emitting files.

### Sitemap Generation
```bash
node scripts/generate-sitemap.js
```
Generates `sitemap.xml` and `robots.txt` in the `public/` directory.

## Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with fonts, schema, and component CSS imports
│   ├── page.tsx            # Homepage with Soundtrack panel in footer
│   ├── colophon/           # Colophon page
│   ├── index-page/         # Index of technologies (/index-page, mapped from /index)
│   ├── specimen/           # Type specimen page (excluded from sitemap)
│   ├── not-found.tsx       # 404 page
│   └── work/[slug]/        # Project pages
├── components/             # UI components
│   ├── Grid.tsx            # Layout primitives (MetaTable, Metric, SectionNumber, etc.)
│   ├── Motion.tsx          # WipeIn/FadeIn animation wrappers using IntersectionObserver
│   ├── Soundtrack.tsx      # Spotify now-playing component (client-side only)
│   └── Editorial.tsx       # Editorial furniture (SectionHead, DropCap, PullQuote, etc.)
├── lib/
│   ├── content.ts          # MDX content loader with metadata extraction
│   ├── fonts.ts            # Font loading (Fraunces variable, Archivo, Space Mono)
│   ├── hooks.ts            # IntersectionObserver and prefers-reduced-motion hooks
│   ├── spotify.ts          # Spotify feed client (talks to worker, never Spotify directly)
│   └── tokens.ts           # Design token values (colors, type scale)
├── styles/
│   ├── globals.css         # Global styles with custom tokens
│   ├── components.css      # Component styles (Soundtrack, Editorial furniture, grids)
│   └── fonts.css           # Deleted (unused, static @font-face overrides variable font)
└── content/
    └── work/               # MDX project content with frontmatter metadata
        ├── anora.mdx
        ├── vidhaanai.mdx
        ├── capstone.mdx
        └── resume-analytics.mdx
```

## Spotify Integration

The portfolio includes an optional "Soundtrack" panel that shows now-playing and recently-played tracks from Spotify. The architecture keeps the client secret and refresh token out of the browser entirely:

1. **Worker** (`/worker/`): A Cloudflare Worker that holds the Spotify client ID/secret and refresh token as secrets, trades for access tokens, and serves a trimmed JSON feed. Deploy with `cd worker && npx wrangler deploy`.

2. **Client** (`src/lib/spotify.ts`): React hooks and types that call the worker endpoint — never Spotify directly.

3. **Environment variables**: Set `NEXT_PUBLIC_SPOTIFY_FEED_URL` in `.env.local` pointing to the deployed worker URL. An `.env.example` template is included.

### Where to put Spotify credentials

| Variable | Where |
|---|---|
| `NEXT_PUBLIC_SPOTIFY_FEED_URL` | `.env.local` in the project root (not committed) |
| `SPOTIFY_CLIENT_ID` | `worker/wrangler.toml` `[vars]` section (plain text) |
| `SPOTIFY_CLIENT_SECRET` | Worker secret: `cd worker && npx wrangler secret put SPOTIFY_CLIENT_SECRET` |
| `SPOTIFY_REFRESH_TOKEN` | Worker secret: `cd worker && npx wrangler secret put SPOTIFY_REFRESH_TOKEN` |
| `ALLOWED_ORIGINS` | `worker/wrangler.toml` `[vars]` section (comma-separated domains) |
| `ALLOW_VERCEL_PREVIEWS` | `worker/wrangler.toml` `[vars]` section (`"true"` auto-allows `*.vercel.app` preview hosts) |

Debug a broken feed by opening the worker URL with `?debug=1` (reports config presence and origin resolution, never secrets). The dock shows the worker's error message instead of vanishing.

Generate the refresh token once with:
```bash
SPOTIFY_CLIENT_ID=your-id SPOTIFY_CLIENT_SECRET=your-secret node scripts/spotify-refresh-token.mjs
```
Then store the printed refresh token in the worker secrets as shown above.

## Scripts

- `npm run dev` — Start Next.js development server on `localhost:3000`
- `npm run build` — Production static export to `/out`
- `npm run lint` — ESLint with `next/core-web-vitals`
- `npm run typecheck` — `tsc --noEmit`
- `node scripts/generate-sitemap.js` — Regenerate `sitemap.xml` and `robots.txt`

## Design Constraints
- No dark mode toggle. Warm paper surface (#F2EEE6) is committed.
- No box shadows. Depth from rules and the paper/paper-sunk pair.
- Border radius: 0 everywhere except one deliberate exception.
- No gradients. No icon libraries. No component libraries.
- Motion: single wipe animation via CSS + IntersectionObserver.
- Fonts: Fraunces (display), Archivo (body), Space Mono (meta/numerals).
- 8px base unit. 12-column grid on desktop with 2-column left rail.