import Link from "next/link";
import { PataphysicalLink } from "@/components/programme/PataphysicalLink";

/**
 * A project record as a light-brown film slate: chevron clapper stick on
 * top, production fields below. The board is paper-sunk, the only brown
 * in the token set; every text pair on it clears AA. No radius, no
 * shadow, no motion of its own — the title keeps the projection hover.
 */

export type ClapboardMeta = [label: string, value: string];

export function Clapboard({
  number,
  section = "ENGINEERING",
  year,
  title,
  href,
  metadata = [],
  metric,
  broke,
}: {
  number: string;
  section?: string;
  year: string;
  title: string;
  href: string;
  metadata?: ClapboardMeta[];
  metric?: { value: string; label: string };
  broke?: string;
}) {
  return (
    <article className="slate">
      <div className="slate-stick" aria-hidden="true">
        <span className="slate-hinge" />
        <span className="slate-chevrons" />
      </div>

      <div className="slate-body">
        <p className="slate-rail">
          <span>{number}</span>
          <span>{section}</span>
          <span>{year}</span>
        </p>

        <h3 className="slate-title">
          <PataphysicalLink href={href}>{title}</PataphysicalLink>
        </h3>

        {metadata.length > 0 && (
          <dl className="pMeta slate-meta">
            {metadata.map(([label, value]) => (
              <div key={label} className="pMetaRow">
                <dt className="pMetaDt">{label}</dt>
                <dd className="pMetaDd">{value}</dd>
              </div>
            ))}
          </dl>
        )}

        {broke && (
          <div className="pBroke slate-broke">
            <span className="pBrokeLabel">WHAT BROKE</span>
            <p>{broke}</p>
          </div>
        )}

        <div className="slate-foot">
          {metric && (
            <p className="slate-metric">
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </p>
          )}
          <Link href={href} className="slate-link" aria-label={`Open ${title}`}>
            Full record <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
