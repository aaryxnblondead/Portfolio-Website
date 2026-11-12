import { ProjectDiagram } from "@/components/ProjectDiagram";

/** The opening spread of an entry: number, title, log line, diagram. */
export function ProjectHero({
  slug,
  number,
  title,
  logLine,
}: {
  slug: string;
  number: string;
  title: string;
  logLine: string;
}) {
  return (
    <div className="project-hero">
      <span aria-hidden="true" className="project-ghost-num">
        {number}
      </span>
      <header className="project-hero-header">
        <h1 className="text-h1-desktop text-ink mb-4 pRise gateWeave">{title}</h1>
        <p className="text-body text-ink max-w-prose leading-tight pRise pD2">{logLine}</p>
      </header>

      <div className="pRise pD3">
        <ProjectDiagram slug={slug} />
      </div>

      <a href="#details" className="project-scroll-cue" aria-label="Scroll to field notes">
        <span>FIELD NOTES CONTINUE</span>
        <span className="project-scroll-tick" aria-hidden="true" />
      </a>
    </div>
  );
}
