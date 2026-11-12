import { SlideIn } from "@/components/Motion";
import { ProjectSlate } from "@/components/programme/ProjectSlate";
import { PROJECTS } from "@/lib/projects";
import { Sheet, Rail, Content, Bleed } from "@/components/programme/Sheet";
import { PataphysicalLink } from "@/components/programme/PataphysicalLink";

/** The programme's slate grid: every entry as a clapboard, revealed in sequence. */
export function SelectedWork() {
  return (
    <Sheet as="section" className="pHomeStage" aria-labelledby="projects-title">
      <Rail className="pMono pEntryRail">
        <div>№ 02</div>
        <div className="pEntryRailSub">SELECTED WORK</div>
        <div className="pEntryRailYear">04 ENTRIES</div>
      </Rail>

      <Content>
        <div className="pHomeStageHead">
          <h2 id="projects-title">Selected work</h2>
          <PataphysicalLink href="/work">Full programme ↗</PataphysicalLink>
        </div>

        <div className="slate-grid" style={{ marginTop: 32 }}>
          {PROJECTS.map((project, i) => (
            <SlideIn key={project.slug} delayMs={Math.min(i, 4) * 60}>
              <ProjectSlate project={project} />
            </SlideIn>
          ))}
        </div>
      </Content>

      <Bleed aria-hidden="true" />
    </Sheet>
  );
}
