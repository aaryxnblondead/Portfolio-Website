import type { ReactNode } from "react";

/**
 * Editorial furniture for the programme. Each of these encodes something about
 * the content — a sequence, an aside, a caption, a measure — rather than
 * decorating it. All of them inherit the paper/ink tokens: no radius, no
 * shadows, no gradients, no icon sets.
 */

/* ---------------------------------------------------------- section head */

export function SectionHead({
  number,
  title,
  kicker,
  id,
}: {
  number?: string;
  title: string;
  kicker?: string;
  id?: string;
}) {
  return (
    <header className="sec-head">
      <h2 id={id} className="text-h2-desktop text-ink sec-head-title">
        {number && <span className="sec-head-number font-space-mono">{number}</span>}
        {title}
      </h2>
      {kicker && <p className="sec-head-kicker text-small text-ink-muted">{kicker}</p>}
      <div className="rule-2" aria-hidden="true" />
    </header>
  );
}

/* -------------------------------------------------------------- drop cap */

/** Opens a long passage. Use once per page, at most. */
export function DropCap({ children }: { children: string }) {
  const [first, ...rest] = children;
  return (
    <p className="text-body text-ink dropcap-p">
      <span className="dropcap" aria-hidden="true">
        {first}
      </span>
      <span className="sr-only">{first}</span>
      {rest.join("")}
    </p>
  );
}

/* ------------------------------------------------------------- pullquote */

export function PullQuote({
  children,
  attribution,
  align = "left",
}: {
  children: ReactNode;
  attribution?: string;
  align?: "left" | "right";
}) {
  return (
    <figure className={`pullquote pullquote-${align}`}>
      <blockquote>{children}</blockquote>
      {attribution && (
        <figcaption className="text-meta font-space-mono text-ink-muted">{attribution}</figcaption>
      )}
    </figure>
  );
}

/* ------------------------------------------------------------ marginalia */

/** A note for the rail. Hangs off an accent tick so it reads as an aside. */
export function Marginalia({ children }: { children: ReactNode }) {
  return <p className="marginalia">{children}</p>;
}

/* ----------------------------------------------------------- sprocket rule */

/**
 * A divider drawn as film perforations. Heavier than a hairline, so use it
 * between acts rather than between paragraphs.
 */
export function SprocketRule({ count = 24 }: { count?: number }) {
  return (
    <div className="sprocket" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span key={i} />
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- ticker */

/** Running strip of fixed facts. Freezes under prefers-reduced-motion. */
export function Ticker({ items }: { items: string[] }) {
  const line = items.join("   ·   ");
  return (
    <div className="ticker" role="marquee" aria-label="Site status">
      <div className="ticker-track">
        <span className="ticker-run text-meta font-space-mono">{line}</span>
        <span className="ticker-run text-meta font-space-mono" aria-hidden="true">
          {line}
        </span>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- plate */

/** A framed figure with a numbered caption, the way a programme prints stills. */
export function Plate({
  label,
  caption,
  children,
}: {
  label: string;
  caption?: string;
  children: ReactNode;
}) {
  return (
    <figure className="plate">
      <div className="plate-frame">{children}</div>
      <figcaption className="plate-caption">
        <span className="text-meta font-space-mono-bold text-accent">{label}</span>
        {caption && <span className="text-small text-ink-muted">{caption}</span>}
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ tags */

export function TagRow({ items }: { items: string[] }) {
  return (
    <ul className="tag-row">
      {items.map((item) => (
        <li key={item} className="tag text-meta font-space-mono">
          {item}
        </li>
      ))}
    </ul>
  );
}

/* --------------------------------------------------------------- callout */

/** Bordered note with a label tab. For constraints, caveats, corrections. */
export function Callout({
  label,
  children,
  tone = "cold",
}: {
  label: string;
  children: ReactNode;
  tone?: "cold" | "accent";
}) {
  return (
    <aside className={`callout callout-${tone}`}>
      <span className="callout-label text-meta font-space-mono-bold">{label}</span>
      <div className="callout-body text-small">{children}</div>
    </aside>
  );
}

/* ------------------------------------------------------------- key/value */

export function KeyValueList({
  items,
}: {
  items: { label: string; value: ReactNode }[];
}) {
  return (
    <dl className="kv">
      {items.map((item, i) => (
        <div key={i} className="kv-row">
          <dt className="text-meta font-space-mono text-ink-muted">{item.label}</dt>
          <dd className="text-meta font-space-mono-bold text-ink">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ------------------------------------------------------------- stat grid */

export function StatGrid({
  stats,
}: {
  stats: { value: string; label: string; note?: string }[];
}) {
  return (
    <div className="stat-grid">
      {stats.map((stat) => (
        <div key={stat.label} className="stat">
          <div className="stat-value font-space-mono-bold">{stat.value}</div>
          <div className="stat-label text-meta font-space-mono text-ink-muted">{stat.label}</div>
          {stat.note && <div className="stat-note text-small text-ink-muted">{stat.note}</div>}
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------- timeline */

/** Genuinely sequential content only — a run of dates, not a list of features. */
export function Timeline({
  entries,
}: {
  entries: { period: string; title: string; detail?: string }[];
}) {
  return (
    <ol className="timeline">
      {entries.map((entry, i) => (
        <li key={i} className="timeline-entry">
          <span className="timeline-period text-meta font-space-mono text-ink-muted">
            {entry.period}
          </span>
          <span className="timeline-body">
            <span className="timeline-title text-body text-ink">{entry.title}</span>
            {entry.detail && <span className="timeline-detail text-small text-ink-muted">{entry.detail}</span>}
          </span>
        </li>
      ))}
    </ol>
  );
}
