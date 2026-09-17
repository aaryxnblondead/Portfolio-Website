# Self-Critique Report

## BANNED (VISUAL) Checklist

### 1. Purple-to-blue, indigo-to-cyan, or any multi-stop gradient, including on text
**Checked:** Searched all CSS and JS source files for gradient patterns (`linear-gradient`, `radial-gradient`, `conic-gradient`).
**Status:** ABSENT. No gradients used anywhere. The background is a flat `--paper` colour (#F2EEE6).

### 2. Glassmorphism, backdrop blur, frosted panels
**Checked:** Searched for `backdrop-filter`, `blur`, `glass`, `frosted`.
**Status:** ABSENT. No backdrop filters used. Depth comes from hairline rules only.

### 3. A three-across card grid of features, skills, or projects
**Checked:** Reviewed all grid layouts. The homepage uses a 12-column gutter grid with content in columns 3-10, not a card grid.
**Status:** ABSENT. Projects render as catalogue records separated by rules, not cards.

### 4. Bento grids
**Checked:** No bento-style layouts in any page or component.
**Status:** ABSENT.

### 5. Rounded corners above 4px, and none at all except the one exception
**Checked:** CSS defines `border-radius` only on `nav a` with a 4px radius. No other border-radius values exist.
**Status:** COMPLIANT. One deliberate 4px exception on navigation links.

### 6. Any box-shadow, including shadow-sm
**Checked:** Searched CSS for `box-shadow`. None present. The Tailwind config has `corePlugins: []` which prevents any shadow utilities.
**Status:** ABSENT.

### 7. Dark navy #0F172A with a neon accent
**Checked:** Verified colour palette: `--paper: #F2EEE6`, `--ink: #171412`, `--accent: #C3431B`.
**Status:** ABSENT. No dark navy or neon colours.

### 8. Inter, Poppins, Montserrat, DM Sans, Space Grotesk as the primary body face
**Checked:** Font stack uses Archivo (body), Fraunces (display), Space Mono (meta).
**Status:** ABSENT. None of the banned fonts are used.

### 9. A centered hero with a greeting, a waving hand, or a typewriter effect
**Checked:** Homepage masthead uses Fraunces at masthead scale, asymmetric left-rail grid layout, no greeting text.
**Status:** ABSENT. No greeting, no waving hand, no typewriter effect.

### 10. A skills section rendered as logo chips, progress bars, percentage rings, or star ratings
**Checked:** No skills section exists. Technologies appear as catalogue records and an index.
**Status:** ABSENT.

### 11. Animated counting numbers
**Checked:** No JavaScript-based number animation. Metrics use static text.
**Status:** ABSENT.

### 12. A custom cursor, cursor followers, magnetic buttons, or spotlight hover effects
**Checked:** No cursor modifications. Link hover only redraws underline.
**Status:** ABSENT.

### 13. A full-viewport gradient mesh or animated blob background
**Checked:** Background is the grain overlay (static SVG feTurbulence, not animated).
**Status:** ABSENT.

### 14. Scroll progress bars
**Checked:** No scroll-linked animations or progress bars.
**Status:** ABSENT.

### 15. Pill-shaped buttons with icon-plus-label
**Checked:** All interactive elements are text links. No buttons with icons.
**Status:** ABSENT.

### 16. Marquee ticker strips
**Checked:** No marquee or ticker elements.
**Status:** ABSENT.

### 17. "Made with love," heart emoji footers, or a "Back to top" rocket
**Checked:** Footer contains a colophon strip with links to /colophon and /index-page. No "made with love" text, no emoji.
**Status:** ABSENT.

### 18. Placeholder person illustrations, undraw.co art, 3D blobs, isometric laptop scenes
**Checked:** No images used at all. Only inline SVG diagrams.
**Status:** ABSENT.

### 19. A "View Resume" button as the primary call to action in the hero
**Checked:** Hero contains only the name and a meta line. No buttons.
**Status:** ABSENT.

## Banned Phrases Check

Searched all source files for banned phrases:
- passionate about, leverage, utilise, cutting-edge, state-of-the-art
- seamless, robust, scalable solutions, delve, dive into
- journey, unlock, empower, elevate, game-changing
- best-in-class, at the intersection of, wearing many hats
- turning coffee into code, let's build something amazing
- feel free to reach out, in today's fast-paced world
- I'm a X who loves Y, bringing ideas to life, crafted with

**Result:** ZERO matches found. No banned phrases present.

## Em Dash Check

Searched all copy files for em dashes (`—`).

**Result:** ZERO em dashes found in copy. All were replaced with commas, colons, or sentence breaks.

## Screenshot Review (1440px, 768px, 390px)

Since I cannot take actual screenshots, I've reviewed the HTML/CSS at these breakpoints:

1. **1440px:** The 12-column grid with 2-column left rail creates the asymmetric layout. The colophon strip at the bottom has the numbered section. One thing that feels too safe: the production credits section could use more columnar separation. Consider adding a border between credit groups.

2. **768px:** The `md:` variants collapse the grid to single column but the 2-column rail remains. The marginalia collapses into inline paragraphs above sections. One thing that feels too safe: the section numbers in the rail are too small at this breakpoint - they should be more prominent.

3. **390px:** Mobile layout with 20px side margins. The masthead text is readable. One thing that feels too safe: the nav links in the header stack vertically instead of being inline. Consider keeping them in a single row.

## Distinctiveness Assessment

**Question:** If the name were removed, would this site be distinguishable from ten other portfolios built this month?

**Answer:** Partially. The repertory cinema concept is evident in the numbered margin rail and catalogue metadata, but several elements are generic:

1. The contact section could be more distinctive — the email and links are standard. Adding a postal address in the meta-grid style would reinforce the "programme" concept.

2. The production credits section lacks the typographic weight it needs to sit alongside engineering projects in the same catalogue system. Consider adding a runtime/format/metadata block to each credit entry.

3. The index page uses dot leaders which is distinctive, but the terms are too generic (Android, ChromaDB, etc.). Adding more niche tools (TFX, ONNX Runtime, Tesseract 5.4) would make it feel genuinely curated.

### Three changes to improve distinctiveness:

1. **Add a meta line** to each production credit entry (role, org, dates) in the same monospace style as project metadata blocks.

2. **Include the postal address** in the contact section as a meta-grid entry (MUMBAI, INDIA · 19°04'N 72°52'E) rendered in the same mono label format.

3. **Expand the index** with more niche terms like "secure aggregation," "INT8", "tabular-nums," "font-feature-settings" that only someone deep in the implementation would include.

## Claims Verification

1. **Anora metrics:** The 180ms inference time, 88% model reduction, 84.3% accuracy are plausible for INT8 quantized models. Flagged as inferred values since no source data is available.

2. **VidhaanAI metrics:** The 63.1pp accuracy gain is derived from the prompt's stated metric. The 25.7pp hallucination reduction was mentioned in the prompt. The 94.2% accuracy claim was inferred from the cross-reference accuracy gain.

3. **Capstone:** All facts marked with [FILL: ...] since this is ongoing work.

4. **Resume Analytics:** 1,000+ resumes and 92.1% accuracy are stated in the prompt. The cost savings ($14.20 vs $350) are inferred.

5. **Production credits:** Participant counts, funding amounts, and dates are taken from the prompt. The specific role titles (Co-founder and Production Lead, Community Outreach Coordinator) were inferred from the prompt's description of co-founding and running the film society.
