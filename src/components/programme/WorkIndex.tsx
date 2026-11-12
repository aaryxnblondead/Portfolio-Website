"use client";

import { useMemo, useState } from "react";
import { SlideIn } from "@/components/Motion";
import { ProjectSlate } from "@/components/programme/ProjectSlate";
import type { ProjectRecord } from "@/lib/projects";

const FILTERS = ["ALL", "Shipped", "In progress"] as const;
type Filter = (typeof FILTERS)[number];

/**
 * The work programme as slates: status toggles filter the four clapboard
 * entries, which arrive from the right on scroll. Square brackets, never
 * pills; titles flood clean with no ghost doubling.
 */
export function WorkIndex({ projects }: { projects: ProjectRecord[] }) {
  const [filter, setFilter] = useState<Filter>("ALL");

  const visible = useMemo(
    () => (filter === "ALL" ? projects : projects.filter((p) => p.status === filter)),
    [filter, projects]
  );

  return (
    <div>
      <div className="work-filters" role="group" aria-label="Filter entries by status">
        <span className="work-filter-label">STATUS</span>
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            className="work-toggle"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
        <span className="work-count" aria-live="polite">
          SHOWING {String(visible.length).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
        </span>
      </div>

      <div className="slate-grid">
        {visible.map((project, i) => (
          <SlideIn key={project.slug} delayMs={Math.min(i, 4) * 60}>
            <ProjectSlate project={project} />
          </SlideIn>
        ))}
      </div>
    </div>
  );
}
