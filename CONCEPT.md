# Concept & Design Decisions

## Concept in three sentences

The site is structured as a printed repertory cinema programme: a dense, typographically serious booklet with numbered section margins, hairline rules separating entries, and catalogue-style metadata blocks. The engineering projects and the film festival work are catalogued in the same typographic system and metadata structure, without the site ever explaining the connection. The concept lives entirely in the layout, typography, and metadata structure — not in decorative elements.

## Five decisions that a default AI build would not make

1. **Asymmetric grid with a deliberate break**: Content occupies columns 3-10 of a 12-column grid, with a 2-column left rail for section numbers and marginalia. Column 11 is left empty except for one deliberate element (a running-time line) that bleeds past the grid. Default AI builds center everything.

2. **Catalogue records, not cards**: Projects are presented as catalogue records with a fixed metadata block (RUNTIME, FORMAT, RUN ON, STATUS, CREDIT) in monospace, separated by 2px rules. No rounded corners, no shadow, no card grid. Default AI builds use three-across card grids.

3. **First-person technical failures**: The "What broke" section on each project page documents specific failures with specific causes, including code-level issues (heading detector bugs, memory allocation failures) and their financial cost (10 days delayed, 2 weeks of training cycles). Default AI builds only mention successes.

4. **Errata with real fixes**: The colophon includes a documented errata section listing things that went wrong and how they were fixed (OCR preprocessing pipeline, PDF column detection). This is the strongest human signal on the site.

5. **Index as anti-AI statement**: The /index page is an alphabetical list of every technology mentioned across the site, each with backlinks. This single page does more anti-AI work than any visual flourish — it demonstrates deep, specific knowledge of the actual tech stack used.
