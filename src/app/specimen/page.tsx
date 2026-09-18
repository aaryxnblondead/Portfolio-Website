import Link from "next/link";
import { tokens } from "@/lib/tokens";

export const metadata = {
  title: "Specimen | Aaryan Singh",
  description: "Type specimen for the repertory design system",
  robots: { index: false, follow: false },
};

export default function SpecimenPage() {
  const spacingSteps = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 18, 20];

  return (
    <main id="main" className="py-16">
      <div className="grid-12">
        <div className="content-col">
          <h1 className="text-h1-desktop mb-6">Design System Specimen</h1>

          <section className="mb-16">
            <h2 className="text-h2-desktop mb-6">Typography Scale</h2>

            <div className="space-y-8">
              <div className="border-t border-rule pt-4">
                <div className="label text-meta text-ink-muted">Masthead (Desktop)</div>
                <div className="value text-masthead-desktop font-fraunces-light text-ink mt-2">Aaryan Singh</div>
                <div className="value text-small text-ink-muted mt-1">6.5rem / 3rem, Fraunces 300 WONK 1, -0.03em tracking</div>
              </div>

              <div className="border-t border-rule pt-4">
                <div className="label text-meta text-ink-muted">Masthead (Mobile)</div>
                <div className="value text-masthead font-fraunces-light text-ink mt-2">Aaryan Singh</div>
                <div className="value text-small text-ink-muted mt-1">3rem, Fraunces 300 WONK 1</div>
              </div>

              <div className="border-t border-rule pt-4">
                <div className="label text-meta text-ink-muted">H1</div>
                <div className="value text-h1-desktop text-ink mt-2">Selected Work</div>
                <div className="value text-small text-ink-muted mt-1">3.25rem / 2.125rem, Fraunces 400</div>
              </div>

              <div className="border-t border-rule pt-4">
                <div className="label text-meta text-ink-muted">H2</div>
                <div className="value text-h2-desktop text-ink mt-2">The Problem</div>
                <div className="value text-small text-ink-muted mt-1">1.875rem / 1.5rem, Fraunces 400</div>
              </div>

              <div className="border-t border-rule pt-4">
                <div className="label text-meta text-ink-muted">Standfirst</div>
                <div className="value text-standfirst-desktop text-ink mt-2">Built applications, shipped systems.</div>
                <div className="value text-small text-ink-muted mt-1">1.5rem / 1.25rem, Fraunces 300</div>
              </div>

              <div className="border-t border-rule pt-4">
                <div className="label text-meta text-ink-muted">Body</div>
                <div className="value text-body text-ink mt-2">The standard chunk of ipsum that goes right here.</div>
                <div className="value text-small text-ink-muted mt-1">1.0625rem, Archivo 400</div>
              </div>

              <div className="border-t border-rule pt-4">
                <div className="label text-meta text-ink-muted">Small</div>
                <div className="value text-small text-ink mt-2">Caption or fine print text.</div>
                <div className="value text-small text-ink-muted mt-1">0.875rem, Archivo 400</div>
              </div>

              <div className="border-t border-rule pt-4">
                <div className="label text-meta text-ink-muted">Meta</div>
                <div className="value text-meta text-ink mt-2">OCT 2025 - MAY 2026</div>
                <div className="value text-small text-ink-muted mt-1">0.6875rem, Space Mono 400, uppercase</div>
              </div>

              <div className="border-t border-rule pt-4">
                <div className="label text-meta text-ink-muted">Metric</div>
                <div className="value text-metric text-ink mt-2">63.1pp</div>
                <div className="value text-small text-ink-muted mt-1">1.5rem, Space Mono 700, tabular nums</div>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-h2-desktop mb-6">Colour Palette</h2>

            <div className="grid grid-cols-2 md-grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2" style={{ backgroundColor: tokens.colors.paper }}></div>
                <div className="label text-meta">--paper</div>
                <div className="value text-small text-ink-muted">{tokens.colors.paper}</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2" style={{ backgroundColor: tokens.colors.paperSunk }}></div>
                <div className="label text-meta">--paper-sunk</div>
                <div className="value text-small text-ink-muted">{tokens.colors.paperSunk}</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2" style={{ backgroundColor: tokens.colors.ink }}></div>
                <div className="label text-meta">--ink</div>
                <div className="value text-small text-ink-muted">{tokens.colors.ink}</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2" style={{ backgroundColor: tokens.colors.inkMuted }}></div>
                <div className="label text-meta">--ink-muted</div>
                <div className="value text-small text-ink-muted">{tokens.colors.inkMuted}</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2" style={{ backgroundColor: tokens.colors.rule }}></div>
                <div className="label text-meta">--rule</div>
                <div className="value text-small text-ink-muted">{tokens.colors.rule}</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2" style={{ backgroundColor: tokens.colors.accent }}></div>
                <div className="label text-meta">--accent</div>
                <div className="value text-small text-ink-muted">{tokens.colors.accent}</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2" style={{ backgroundColor: tokens.colors.accentCold }}></div>
                <div className="label text-meta">--accent-cold</div>
                <div className="value text-small text-ink-muted">{tokens.colors.accentCold}</div>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-h2-desktop mb-6">Spacing Grid</h2>

            <div className="space-y-4">
              <div className="text-meta">8px base unit multiples</div>
              <div className="flex gap-2">
                {spacingSteps.map((n) => (
                  <div key={n} className="flex items-end gap-1">
                    <div className="text-center">
                      <div className="bg-accent text-paper text-xs font-space-mono w-10 h-4 mb-1 flex items-center justify-center" style={{ width: "40px", height: "16px", fontSize: "0.6875rem" }}>{n * 8}px</div>
                      <div className="label text-meta text-ink-muted">sp-{n}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-h2-desktop mb-6">Grid Layout</h2>

            <div className="relative mb-8">
              <div className="grid-12 gap-4">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="bg-paper-sunk border border-rule h-8 flex items-center justify-center" style={{ gridColumn: `auto` }}>
                    <span className="text-meta text-ink-muted">col {i + 1}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-meta text-ink-muted">12-column grid, 24px gutters</div>
            </div>

            <div className="space-y-4">
              <div className="text-meta">Rail: columns 1-2 | Content: columns 3-10</div>
              <div className="grid-12">
                <div className="rail bg-paper-sunk border border-rule h-16 flex items-center justify-center">
                  <span className="text-meta text-ink-muted">RAIL</span>
                </div>
                <div className="content-col bg-paper border border-dashed border-rule h-16 flex items-center justify-center">
                  <span className="text-meta text-ink-muted">CONTENT</span>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-h2-desktop mb-6">Motion Tokens</h2>

            <div className="space-y-4">
              <div className="border-t border-rule pt-4">
                <div className="label text-meta text-ink-muted">Wipe</div>
                <div className="value text-body text-ink mt-1">420ms, cubic-bezier(0.16, 1, 0.3, 1)</div>
                <div className="value text-small text-ink-muted">Headline delay: 80ms behind rule</div>
              </div>
              <div className="border-t border-rule pt-4">
                <div className="label text-meta text-ink-muted">Fade</div>
                <div className="value text-body text-ink mt-1">200ms, ease-out</div>
              </div>
              <div className="border-t border-rule pt-4">
                <div className="label text-meta text-ink-muted">Link hover</div>
                <div className="value text-body text-ink mt-1">180ms, accent redraw</div>
              </div>
            </div>
          </section>

          <section className="border-t border-rule pt-8">
            <Link href="/" className="text-meta text-ink-muted no-underline">
              Return to site
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}