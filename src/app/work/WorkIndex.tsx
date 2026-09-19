"use client";

import { useMemo, useState } from "react";
import { SlideIn } from "@/components/Motion";
import { Clapboard } from "@/components/Clapboard";
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
        {visible.map((p, i) => (
          <SlideIn key={p.slug} delayMs={Math.min(i, 4) * 60}>
            <Clapboard
              number={p.number}
              year={p.year}
              section="ENGINEERING"
              title={p.title}
              href={`/work/${p.slug}`}
              metadata={[
                ["RUNTIME", p.runtime],
                ["FORMAT", p.format],
                ["RUN ON", p.runOn],
                ["STATUS", p.status],
                ["CREDIT", p.credit],
              ]}
              metric={p.metric}
              broke={p.broke}
            />
          </SlideIn>
        ))}
      </div>
    </div>
  );
}
