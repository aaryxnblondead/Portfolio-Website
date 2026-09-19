import { ProgrammeNav } from "@/components/programme/ProgrammeNav";
import { Masthead } from "@/components/programme/Masthead";
import { MarqueeRule } from "@/components/programme/ColumnEleven";
import { PROJECTS } from "@/lib/projects";
import { WorkIndex } from "./WorkIndex";
import { SiteFooter } from "@/components/programme/SiteFooter";

export const metadata = {
  title: "Work — Aaryan Singh",
  description:
    "Four engineering entries as an interactive programme: filter by status, open a record, read what broke.",
};

export default function WorkPage() {
  return (
    <div className="pHome">
      <ProgrammeNav
        mark="AS / 26"
        markHref="/"
        links={[
          { label: "About", href: "/about" },
          { label: "Contact", href: "/#contact" },
        ]}
      />

      <main id="main">
        <div className="split-index">
          <aside className="split-side" aria-label="Work masthead">
            <div className="split-sticky">
              <Masthead
                compact
                word="WORK"
                name="Aaryan Singh"
                role="Applied machine learning"
                meta={[
                  ["EDITION", "No. 04"],
                  ["ENTRIES", "04"],
                  ["PLACE", "Mumbai"],
                  ["AVAILABLE", "Nov 2026"],
                ]}
              />
            </div>
          </aside>

          <div className="split-main">
            <p
              className="pMono pRise pD1"
              style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--accent)" }}
            >
              FILTER BY STATUS, OPEN AN ENTRY
            </p>
            <div className="pRise pD2">
              <WorkIndex projects={PROJECTS} />
            </div>
          </div>
        </div>

        <MarqueeRule text="SELECTED WORK" repeat={14} />
      </main>

      <SiteFooter />
    </div>
  );
}
