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
│   ├── layout.tsx          # Root layout with fonts and schema
│   ├── page.tsx            # Homepage
│   ├── colophon/           # Colophon page
│   ├── index-page/         # Index of technologies (/index-page, mapped from /index)
│   ├── specimen/           # Type specimen page (excluded from sitemap)
│   ├── not-found.tsx       # 404 page
│   └── work/[slug]/        # Project pages
├── components/             # UI components
│   ├── Grid.tsx            # Layout primitives
│   ├── CatalogueMetadata.tsx
│   └── Motion.tsx          # Intersection Observer hooks
├── lib/
│   ├── fonts.ts            # Font loading configuration
│   ├── tokens.ts           # Design tokens
│   ├── content.ts          # Content loader
│   └── hooks.ts            # IntersectionObserver hook
├── styles/
│   ├── globals.css         # Global styles with custom tokens
│   └── fonts.css           # Font-specific styles
└── content/
    └── work/               # MDX project content
        ├── anora.mdx
        ├── vidhaanai.mdx
        ├── capstone.mdx
        └── resume-analytics.mdx
```

## Design Constraints
- No dark mode toggle. Warm paper surface (#F2EEE6) is committed.
- No box shadows. Depth from rules and the paper/paper-sunk pair.
- Border radius: 0 everywhere except one deliberate exception.
- No gradients. No icon libraries. No component libraries.
- Motion: single wipe animation via CSS + IntersectionObserver.
- Fonts: Fraunces (display), Archivo (body), Space Mono (meta/numerals).
- 8px base unit. 12-column grid on desktop with 2-column left rail.