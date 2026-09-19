import { PataphysicalLink } from "./PataphysicalLink";

/**
 * Film-strip nav: squared perfs on top, 2px rule below. Mark left in
 * Neue Machina 800, mono links, mono meta far right. No pills, no
 * buttons, no shadows — links keep the pataphysical wipe.
 */
export function ProgrammeNav({
  mark = "AS / 26",
  markHref = "/",
  links = [
    { label: "Work", href: "#work" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "#contact" },
  ],
  meta = "MUMBAI · 19°04′N 72°52′E",
  label = "Site navigation",
}: {
  mark?: string;
  markHref?: string;
  links?: { label: string; href: string }[];
  meta?: string;
  label?: string;
}) {
  return (
    <nav className="pNav" aria-label={label}>
      <div className="pNavPerfs" aria-hidden="true" />
      <div className="pNavBar">
        <PataphysicalLink href={markHref} variant="ink" className="pNavMark">
          {mark}
        </PataphysicalLink>
        <div className="pNavLinks">
          {links.map((l) => (
            <PataphysicalLink key={l.label} href={l.href} bare>
              {l.label}
            </PataphysicalLink>
          ))}
        </div>
        <span className="pNavMeta" aria-hidden="true">
          {meta}
        </span>
      </div>
    </nav>
  );
}
