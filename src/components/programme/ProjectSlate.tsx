import { Clapboard } from "@/components/Clapboard";
import type { ProjectRecord } from "@/lib/projects";

/**
 * One entry as a slate. The catalogue fields are listed once here, so the
 * programme index and the homepage can't drift apart.
 */
export function ProjectSlate({ project }: { project: ProjectRecord }) {
  return (
    <Clapboard
      number={project.number}
      year={project.year}
      section="ENGINEERING"
      title={project.title}
      href={`/work/${project.slug}`}
      metadata={[
        ["RUNTIME", project.runtime],
        ["FORMAT", project.format],
        ["RUN ON", project.runOn],
        ["STATUS", project.status],
        ["CREDIT", project.credit],
      ]}
      metric={project.metric}
      broke={project.broke}
    />
  );
}
