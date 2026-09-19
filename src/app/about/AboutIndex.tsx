"use client";

import { useState, type ReactNode } from "react";
import { SlideIn } from "@/components/Motion";

export type AboutSection = {
  id: string;
  no: string;
  title: string;
  meta: string;
  body: ReactNode;
};

/**
 * The about-me index: single-open rows that highlight on hover and expand
 * on click. Opening a row collapses the others; nothing starts open.
 * Same interaction language as the work programme — one shared 320ms
 * clock, square rules, no pills.
 */
export function AboutIndex({ sections }: { sections: AboutSection[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <div className="work-list">
      {sections.map((s, i) => {
        const isOpen = openId === s.id;
        return (
          <article key={s.id} className={`work-entry${isOpen ? " is-open" : ""}`}>
            <SlideIn delayMs={Math.min(i, 4) * 60}>
            <button
              type="button"
              className="work-rowbtn"
              aria-expanded={isOpen}
              aria-controls={`about-panel-${s.id}`}
              onClick={() => toggle(s.id)}
            >
              <span className="work-rowno">{s.no}</span>
              <span className="work-rowtitle">{s.title}</span>
              <span className="work-rowmeta">{s.meta}</span>
              <span className="work-arrow" aria-hidden="true">
                {isOpen ? "✕" : "↗"}
              </span>
            </button>
            <div
              className="work-panel"
              id={`about-panel-${s.id}`}
              role="region"
              aria-label={`${s.title} section`}
              inert={!isOpen}
            >
              <div className="work-panel-inner">
                <div className="work-panel-body">{s.body}</div>
              </div>
            </div>
            </SlideIn>
          </article>
        );
      })}
    </div>
  );
}
