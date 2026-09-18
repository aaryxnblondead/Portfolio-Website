import Link from "next/link";
import { getAllProjects } from "@/lib/content";
import { Grid, Rail, ContentColumn, SectionRule, MetaTable, SectionNumber, Metric } from "@/components/Grid";
import { WipeIn } from "@/components/Motion";
import { FilmStrip } from "@/components/FilmStrip";
import { IconGithub, IconLinkedin } from "@/components/Icons";

export const metadata = {
  title: "Aaryan Singh | Portfolio",
  description: "Applied machine learning engineer based in Mumbai. Works on retrieval systems, on-device inference, and generative models for financial time series.",
};

const AVAILABILITY = "November 2026";

const marginalia = [
  "I still think about the ways I could've improved VidhaanAI's inference from FIRs.",
  "On-device inference is a hard constraint, not a preference.",
  "The diffusion model is taking longer than I budgeted.",
];

const nowItems = [
  { label: "WORKING ON", value: "Capstone diffusion model for NIFTY-50 forecasting" },
  { label: "LEARNING", value: "Causal inference with instrumental variables" },
  { label: "LOOKING FOR", value: "Data analytics roles in Mumbai → Especially in Finance" },
  { label: "LAST UPDATED", value: "September 2026" },
];

const contactLine = "Send me a line about projects, roles, or anything you think I'd find technically interesting.";

export default async function HomePage() {
  const projects = await getAllProjects();
  const featuredProjects = projects.slice(0, 4);

  return (
    <>
      <header>
        <nav aria-label="Site navigation" className="grid-12">
          <ul className="col-span-full text-meta font-space-mono flex justify-end gap-6">
            <li><Link href="/index-page" className="text-accent no-underline">Index</Link></li>
            <li><Link href="/colophon" className="text-accent no-underline">Colophon</Link></li>
          </ul>
        </nav>
      </header>

      <main id="main" className="relative min-h-screen bg-paper">
        {/* ===== 00 Masthead ===== */}
        <section className="pt-16 md-pt-24 pb-12">
          <Grid>
            <Rail>
              <SectionNumber number="00" />
            </Rail>
            <ContentColumn>
              <WipeIn>
                <h1 className="text-masthead-desktop font-fraunces-light text-ink leading-tight-088">
                  Aaryan Singh
                </h1>
              </WipeIn>
              <p className="text-meta text-ink-muted mt-4 font-space-mono">
                MUMBAI · 19°04&lsquo;N 72°52&lsquo;E · AVAILABLE FROM {AVAILABILITY}
              </p>
            </ContentColumn>
          </Grid>
        </section>

        {/* ===== 01 Standfirst ===== */}
        <section className="pb-16">
          <Grid>
            <Rail>
              <SectionNumber number="01" />
              <aside className="mt-12">
                {marginalia.slice(0, 2).map((note, i) => (
                  <p key={i} className="text-small italic text-ink-muted mb-4" style={{ fontSize: "13px" }}>
                    {note}
                  </p>
                ))}
              </aside>
            </Rail>
            <ContentColumn>
              <p className="text-standfirst-desktop font-fraunces-light text-ink max-w-prose leading-tight">
                I build applied machine learning systems that run where the data lives: on device, on edge hardware, or in the narrow gap between two cloud services. I co-founded a film festival in college and still think about how things get catalogued. I write first-person, I admit what broke, and I lead with the constraint before the outcome.
              </p>
            </ContentColumn>
          </Grid>
        </section>

        <FilmStrip />

        {/* ===== 02 Selected Work ===== */}
        <section>
          <Grid>
            <Rail>
              <SectionNumber number="02" />
              {marginalia.slice(2, 4).map((note, i) => (
                <p key={i} className="text-small italic text-ink-muted mt-8 mb-4" style={{ fontSize: "13px" }}>
                  {note}
                </p>
              ))}
            </Rail>
            <ContentColumn>
              <div className="space-y-16">
                {featuredProjects.map((project, index) => (
                  <article key={project.slug} className={index % 2 === 1 ? "md-ml-6" : ""}>
                    <div className="mb-4 text-meta uppercase text-ink-muted font-space-mono">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <h2 className="text-h1-desktop text-ink mb-3">
                      <Link href={`/work/${project.slug}`} className="no-underline title-link">
                        {project.title}
                      </Link>
                    </h2>
                    <p className="text-body text-ink mb-4 max-w-prose">
                      {project.logLine}
                    </p>
                    <div className="mb-6">
                      <MetaTable
                        rows={[
                          { label: "RUNTIME", value: project.runtime },
                          { label: "FORMAT", value: project.format },
                          { label: "RUN ON", value: project.runOn },
                          { label: "STATUS", value: project.status },
                          { label: "CREDIT", value: project.credit },
                        ]}
                      />
                    </div>
                    <Metric value={project.metric.value} label={project.metric.label} />
                  </article>
                ))}
              </div>
            </ContentColumn>
          </Grid>
        </section>

        <SectionRule className="mt-16" />

        {/* ===== 03 Production Credits ===== */}
        <section className="mt-16">
          <Grid>
            <Rail>
              <SectionNumber number="03" />
            </Rail>
            <ContentColumn>
              <WipeIn>
                <h2 className="text-h2-desktop text-ink mb-8">The Roles I&rsquo;ve Played</h2>
              </WipeIn>
              <div className="space-y-8">
                {[
                  {
                    title: "CineCRCE National Short Film Festival",
                    role: "Co-founder and Production Lead",
                    dates: "Jan 2024 - May 2025, 300+ participants, ₹80,000 raised from zero, ₹60,000+ prize pool, 6+ sponsors"
                  },
{
                    title: "Rotaract Club of CRCE",
                    role: "Sergeant-At-Arms",
                    dates: "Aug 2023 - Dec 2024, Heart & Sole Virtual Run 8k: 1,500+ participants; Kalsubai Base Camp trek: 200+ students"
                  },
                  {
                    title: "Students' Council - Technical Representative",
                    role: "Representative",
                    dates: "Jul 2023 - Jun 2024, ₹40,000+ secured in grants, platforms supporting 1,000+ users"
                  },
                ].map((credit) => (
                  <div key={credit.title} className="border-t border-rule pt-4">
                    <div className="label text-meta text-ink-muted">{credit.title}</div>
                    <div className="value text-body text-ink mt-1">{credit.role}</div>
                    <div className="value text-small text-ink-muted">{credit.dates}</div>
                  </div>
                ))}
              </div>
            </ContentColumn>
          </Grid>
        </section>

        {/* ===== 04 Now ===== */}
        <section>
          <Grid>
            <Rail>
              <SectionNumber number="04" />
            </Rail>
            <ContentColumn>
              <WipeIn>
                <h2 className="text-h2-desktop text-ink mb-6">Now</h2>
              </WipeIn>
              <div className="grid gap-y-4">
                {nowItems.map((item) => (
                  <div key={item.label} className="grid grid-cols-2">
                    <div className="label text-meta text-ink-muted font-space-mono">{item.label}</div>
                    <div className="value text-meta text-ink font-space-mono-bold">{item.value}</div>
                  </div>
                ))}
              </div>
            </ContentColumn>
          </Grid>
        </section>

        <SectionRule />

        {/* ===== 05 Contact ===== */}
        <section>
          <Grid>
            <Rail>
              <SectionNumber number="05" />
            </Rail>
            <ContentColumn>
              <WipeIn>
                <h2 className="text-h2-desktop text-ink mb-4">Contact</h2>
              </WipeIn>
<div className="grid gap-y-4">
                 {[
                   { id: "location", label: "LOCATION", value: "MUMBAI, INDIA" },
                   { id: "email", label: "EMAIL", value: <button type="button" data-copy-email="aaryansingh2810@gmail.com" className="text-accent text-left font-space-mono-bold">aaryansingh2810@gmail.com <span className="text-ink-muted"></span></button>},
                   { id: "github", label: <IconGithub size={16} className="text-accent mr-2" />, value: <Link href="https://github.com/aaryxnblondead" className="text-accent no-underline">github.com/aaryxnblondead</Link> },
                   { id: "linkedin", label: <IconLinkedin size={16} className="text-accent mr-2" />, value: <Link href="https://www.linkedin.com/in/aaryan-singh-1b068828b/" className="text-accent no-underline">linkedin.com/in/aaryan-singh</Link> },
                 ].map((item) => (
                   <div key={item.id} className="grid grid-cols-2">
                     <div className="label text-meta text-ink-muted font-space-mono">{item.label}</div>
                     <div className="value text-meta text-ink font-space-mono-bold">{item.value}</div>
                   </div>
                 ))}
               </div>
              <script
                dangerouslySetInnerHTML={{
                  __html: `document.addEventListener("click",function(e){var b=e.target.closest("[data-copy-email]");if(!b)return;navigator.clipboard.writeText(b.dataset.copyEmail).then(function(){var t=b.innerHTML;b.innerHTML=b.dataset.copyEmail+' <span class="text-ink-muted">(copied)</span>';setTimeout(function(){b.innerHTML=t},1600)})})`,
                }}
              />
              <p className="text-body text-ink mt-4 max-w-prose">
                {contactLine}
              </p>
            </ContentColumn>
          </Grid>
        </section>

      {/* ===== Colophon Strip ===== */}
      <SectionRule className="mt-12" />
      <footer>
        <section className="mt-16 border-t border-rule pt-8">
          <Grid>
            <Rail>
              <SectionNumber number="06" />
            </Rail>
            <ContentColumn>
              <div className="flex flex-col md-flex-row justify-between text-meta text-ink-muted font-space-mono mb-12">
                <Link href="/colophon" className="text-accent no-underline">Colophon</Link>
                <span className="text-ink-muted md-ml-2">·</span>
                <Link href="/index-page" className="text-accent no-underline">Index</Link>
              </div>

            </ContentColumn>
            {/* Deliberate grid break: running time extends into column 11 */}
            <div className="hidden md-block" style={{ gridColumn: "11" }}>
              <p className="text-meta text-ink-muted font-space-mono" style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}>
                RUNNING TIME: ~4 MIN READ
              </p>
            </div>
          </Grid>
        </section>
      </footer>
      </main>
      </>
  );
}