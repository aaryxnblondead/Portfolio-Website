import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllProjects, getProjectBySlug, markdownToHtml } from "@/lib/content";
import { Grid, Rail, ContentColumn, SectionRule, MetaTable } from "@/components/Grid";
import { ProjectDiagram } from "@/components/ProjectDiagram";
import { ProgrammeNav } from "@/components/programme/ProgrammeNav";
import { SiteFooter } from "@/components/programme/SiteFooter";
import { getProjectNumber } from "@/lib/projects";

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug).catch(() => null);
  if (!project) return notFound();

  return {
    title: project.metadata.title,
    description: project.metadata.logLine,
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  let project;
  try {
    project = await getProjectBySlug(slug);
  } catch {
    notFound();
  }

  const { metadata, content } = project;
  const htmlContent = await markdownToHtml(content);

  return (
    <>
    <article id="main" className="project-page">
      <ProgrammeNav
        mark="AS / 26"
        markHref="/"
        links={[
          { label: "About", href: "/about" },
          { label: "Index", href: "/index-page" },
          { label: "Email", href: "mailto:aaryansingh2810@gmail.com" },
        ]}
      />
      <Grid>
        <Rail>
          <div className="section-number text-accent font-space-mono font-bold text-xs uppercase sticky top-32" aria-hidden="true">
            {getProjectNumber(metadata.slug)}
          </div>
        </Rail>
        <ContentColumn>
          <div className="project-hero">
          <span aria-hidden="true" className="project-ghost-num">
            {getProjectNumber(metadata.slug)}
          </span>
          <header className="project-hero-header">
            <h1 className="text-h1-desktop text-ink mb-4 pRise gateWeave">
              {metadata.title}
            </h1>
            <p className="text-body text-ink max-w-prose leading-tight pRise pD2">
              {metadata.logLine}
            </p>
          </header>

          <div className="pRise pD3">
            <ProjectDiagram slug={metadata.slug} />
          </div>

          <a href="#details" className="project-scroll-cue" aria-label="Scroll to field notes">
            <span>FIELD NOTES CONTINUE</span>
            <span className="project-scroll-tick" aria-hidden="true" />
          </a>
          </div>

          <section id="details" className="project-details" aria-label="Project details">
            <MetaTable
              rows={[
                { label: "RUNTIME", value: metadata.runtime },
                { label: "FORMAT", value: metadata.format },
                { label: "RUN ON", value: metadata.runOn },
                { label: "STATUS", value: metadata.status },
              ]}
            />

            <div
              className="prose text-ink max-w-prose"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            <p className="pMono" style={{ marginTop: 32, fontSize: 11, letterSpacing: "0.1em" }}>
              <a
                href={`https://github.com/aaryxnblondead/${metadata.slug}`}
                target="_blank"
                rel="noreferrer noopener"
              >
                Repository ↗
              </a>
            </p>
          </section>


          <SectionRule className="my-12" />

          <footer className="mt-8 text-meta">
            <Link href="/work" className="text-accent font-space-mono">
              &larr; Back to index
            </Link>
          </footer>
        </ContentColumn>
      </Grid>
    </article>
    <SiteFooter />
    </>
  );
}
