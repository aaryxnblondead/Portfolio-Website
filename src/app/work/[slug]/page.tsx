import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllProjects, getProjectBySlug, markdownToHtml } from "@/lib/content";
import { Grid, Rail, ContentColumn, SectionRule, MetaTable } from "@/components/Grid";
import { ProjectDiagram } from "@/components/ProjectDiagram";

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
    <article id="main" className="project-page py-16">
      <Grid>
        <Rail>
          <div className="section-number text-accent font-space-mono font-bold text-xs uppercase sticky top-32" aria-hidden="true">
            {"0" + (getProjectNumber(metadata.slug) + 1)}
          </div>
        </Rail>
        <ContentColumn>
          <header className="mb-12">
            <h1 className="text-h1-desktop text-ink mb-4">
              {metadata.title}
            </h1>
            <p className="text-body text-ink max-w-prose leading-tight">
              {metadata.logLine}
            </p>
            <div className="mt-6">
              <MetaTable
                rows={[
                  { label: "RUNTIME", value: metadata.runtime },
                  { label: "FORMAT", value: metadata.format },
                  { label: "RUN ON", value: metadata.runOn },
                  { label: "STATUS", value: metadata.status },
                ]}
              />
            </div>
          </header>

          <ProjectDiagram slug={metadata.slug} />

          <div
            className="prose text-ink max-w-prose"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />


          <SectionRule className="my-12" />

          <footer className="mt-8 text-meta">
            <Link href="/" className="text-accent font-space-mono">
              &larr; Back to index
            </Link>
            <Link href={`https://github.com/aaryxnblondead/${metadata.slug}`} className="ml-4 text-accent font-space-mono">
              Repository
            </Link>
          </footer>
        </ContentColumn>
      </Grid>
    </article>
  );
}

function getProjectNumber(slug: string): number {
  const order = ["anora", "vidhaanai", "capstone", "resume-analytics"];
  return order.indexOf(slug);
}