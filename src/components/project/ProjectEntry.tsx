import Link from "next/link";
import { Grid, Rail, ContentColumn, SectionRule } from "@/components/Grid";
import { ProgrammeNav } from "@/components/programme/ProgrammeNav";
import { SiteFooter } from "@/components/programme/SiteFooter";
import { ProjectHero } from "@/components/project/ProjectHero";
import { ProjectDetails } from "@/components/project/ProjectDetails";

export type ProjectEntryData = {
  metadata: {
    slug: string;
    title: string;
    logLine: string;
    runtime: string;
    format: string;
    runOn: string;
    status: string;
  };
  htmlContent: string;
  number: string;
};

/**
 * The whole entry layout: nav, the numbered rail, the opening spread, the
 * printed record, and the way back to the index. The route file only has to
 * load the entry and hand it over.
 */
export function ProjectEntry({ metadata, htmlContent, number }: ProjectEntryData) {
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
              {number}
            </div>
          </Rail>
          <ContentColumn>
            <ProjectHero
              slug={metadata.slug}
              number={number}
              title={metadata.title}
              logLine={metadata.logLine}
            />
            <ProjectDetails slug={metadata.slug} metadata={metadata} htmlContent={htmlContent} />
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
