import Link from "next/link";
import { Grid, Rail, ContentColumn, SectionNumber } from "@/components/Grid";
import { TopNav } from "@/components/TopNav";

const LAST_REVISED = "September 17, 2026";

export const metadata = {
  title: "Colophon | Aaryan Singh",
  description: "Typefaces, stack, grid, errata, and contact for this portfolio.",
};

export default function ColophonPage() {
  return (
    <main id="main" className="py-16">
      <TopNav />
      <Grid>
        <Rail>
          <SectionNumber number="CP" />
        </Rail>
        <ContentColumn>
          <h1 className="text-h1-desktop text-ink mb-8">Colophon</h1>

          <section className="mb-12">
            <h2 className="text-h2-desktop text-ink mb-6">Typography</h2>
            <div className="space-y-4">
              <div className="border-t border-rule pt-4">
                <div className="label">Display</div>
                <div className="value text-body text-ink mt-1">Neue Machina, by Pangram Pangram, self-hosted from /fonts</div>
                <div className="value text-small text-ink-muted mt-1">Light, Regular, and Ultrabold. Used for headlines, display type, and interface text across the site.</div>
              </div>
              <div className="border-t border-rule pt-4">
                <div className="label">Body</div>
                <div className="value text-body text-ink mt-1">Archivo Variable, designed by Héctor Gatti / Omnibus-Type</div>
                <div className="value text-small text-ink-muted mt-1">Weights 400 and 500.</div>
              </div>
              <div className="border-t border-rule pt-4">
                <div className="label">Meta and numerals</div>
                <div className="value text-body text-ink mt-1">Space Mono, designed by Colophon Foundry</div>
                <div className="value text-small text-ink-muted mt-1">Weights 400 and 700.</div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-h2-desktop text-ink mb-6">Stack</h2>
            <div className="space-y-4">
              <div className="border-t border-rule pt-4">
                <div className="label">Framework</div>
                <div className="value text-body text-ink mt-1">Next.js 15, App Router</div>
              </div>
              <div className="border-t border-rule pt-4">
                <div className="label">Styling</div>
                <div className="value text-body text-ink mt-1">Tailwind CSS v3, fully replaced theme</div>
              </div>
              <div className="border-t border-rule pt-4">
                <div className="label">Content</div>
                <div className="value text-body text-ink mt-1">MDX under /content, parsed at build time</div>
              </div>
              <div className="border-t border-rule pt-4">
                <div className="label">Deployment</div>
                <div className="value text-body text-ink mt-1">Vercel, static export</div>
              </div>
              <div className="border-t border-rule pt-4">
                <div className="label">Analytics</div>
                <div className="value text-body text-ink mt-1">Vercel Web Analytics. Cookieless page views only, no cross-site tracking.</div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-h2-desktop text-ink mb-6">Grid</h2>
            <div className="space-y-2">
              <p className="text-body text-ink">12-column grid, 1200px max width, 24px gutters.</p>
              <p className="text-body text-ink">Left rail: 2 columns for section numbers and marginalia.</p>
              <p className="text-body text-ink">Content: columns 3 through 10.</p>
              <p className="text-body text-ink">8px base unit. Type sits on 4px increments.</p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-h2-desktop text-ink mb-6">Errata</h2>
            <div className="space-y-6">
              <div className="border-t border-rule pt-4">
                <div className="label">VidhaanAI: Heading detector</div>
                <div className="value text-body text-ink mt-1">Initially, the OCR pipeline treated table rows as body text because the government PDFs used bold italics inconsistently in section headers. This caused 12% of sections to merge with adjacent content. Fixed by retraining the heading classifier on a 400-section labeled dataset from Maharashtra and Karnataka legal codes.</div>
              </div>
              <div className="border-t border-rule pt-4">
                <div className="label">Resume Analytics Platform: Two-column layouts</div>
                <div className="value text-body text-ink mt-1">PyMuPDF concatenated both columns into a single text stream, which broke entity boundaries in 8% of resumes. Fixed by switching to pdfplumber with a layout-aware preprocessing step that detects column gutters before extraction.</div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-h2-desktop text-ink mb-6">Design Decisions</h2>
            <div className="space-y-2">
              <p className="text-body text-ink">No dark mode toggle. One committed surface. The paper colour is fixed at #F2EEE6, chosen because it matches the warm white of recycled print stock.</p>
              <p className="text-body text-ink">Border radius is 0 everywhere, except a single 4px radius on interactive nav links. The softness distinguishes clickable state from the hard, rule-based grid.</p>
              <p className="text-body text-ink">No box shadows. Depth comes from hairline rules and the paper/paper-sunk colour pair only.</p>
              <p className="text-body text-ink">One element per page is allowed to break the grid. On the homepage it is the film belt, which runs edge to edge so the frames stay legible at glide speed.</p>
              <p className="text-body text-ink">Three devices are borrowed from record sleeves: the 404 repeats its title until the words turn to texture, availability sits on a flat accent field, and the footer carries a boxed regulatory label. Catalogue plates are struck in solid ink rather than pink.</p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-h2-desktop text-ink mb-6">Elsewhere</h2>
            <div className="space-y-4">
              <div className="border-t border-rule pt-4">
                <div className="label">Work</div>
                <div className="value text-body text-ink mt-1"><Link href="/#projects" className="text-accent no-underline">Selected catalogue</Link> on the homepage, four entries with runtimes and metrics.</div>
              </div>
              <div className="border-t border-rule pt-4">
                <div className="label">Notes</div>
                <div className="value text-body text-ink mt-1"><Link href="/lab" className="text-accent no-underline">Working notes</Link>, four experiments with constraints and statuses.</div>
              </div>
              <div className="border-t border-rule pt-4">
                <div className="label">Reference</div>
                <div className="value text-body text-ink mt-1"><Link href="/index-page" className="text-accent no-underline">Index</Link>, every technology on the site with links back to where it appears.</div>
              </div>
            </div>
          </section>

          <section className="mt-16 border-t border-rule pt-8">
            <div className="flex flex-col md-flex-row justify-between text-meta text-ink-muted font-space-mono">
              <span>LAST REVISED {LAST_REVISED}</span>
              <div>
                <Link href="/" className="text-accent no-underline">Home</Link>
                {" / "}
                <Link href="/index-page" className="text-accent no-underline">Index</Link>
              </div>
            </div>

            <div className="mt-8 text-meta">
              <p className="text-ink-muted">Contact:</p>
              <p>aaryansingh2810@gmail.com</p>
              <p>
                <Link href="https://github.com/aaryxnblondead" className="text-accent no-underline">github.com/aaryxnblondead</Link>
              </p>
              <p>
                <Link href="https://www.linkedin.com/in/aaryan-singh-1b068828b/" className="text-accent no-underline">linkedin.com/in/aaryan-singh</Link>
              </p>
            </div>
          </section>
        </ContentColumn>
      </Grid>
    </main>
  );
}
