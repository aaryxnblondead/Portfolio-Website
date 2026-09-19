import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

/**
 * The hover print can't do: an accent wipe, a late misregistered ghost,
 * baroque corner filigrees, and the projectionist's cue mark — staggered
 * across three clocks. Every hover has a focus-visible twin. Internal
 * hrefs keep client-side navigation; anything else renders a plain anchor.
 */

function Filigree({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
    >
      <path d="M1 39 L1 14 Q1 1 14 1 L39 1" />
      <path d="M6 33 Q6 22 12 18 Q19 13 24 15 Q28 17 25 21 Q22 25 16 22 Q10 19 12 12 Q14 5 24 6" />
      <circle cx="26.5" cy="5.5" r="1.8" fill="currentColor" stroke="none" />
      <path d="M5 38 Q9 32 7 27" />
    </svg>
  );
}

export function PataphysicalLink({
  href = "#",
  children,
  variant = "accent",
  bare = false,
  className = "",
  ...rest
}: {
  href?: string;
  children: ReactNode;
  /** accent floods accent; ink floods solid ink for drier registers. */
  variant?: "accent" | "ink";
  /**
   * Bare keeps only the scaleX flood wipe. Use in tight quarters like the
   * nav, where the ghost copy, filigrees and cue would collide with
   * neighbouring links.
   */
  bare?: boolean;
  className?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const external = /^(https?:|mailto:|#)/.test(href);
  const classes = `pLink${variant === "ink" ? " pLinkInk" : ""}${bare ? " pLink--bare" : ""}${className ? ` ${className}` : ""}`;

  const inner = (
    <>
      <span aria-hidden="true" className="pFlood" />
      <span aria-hidden="true" className="pGhost">
        {children}
      </span>
      <span aria-hidden="true" className="pFiligreeWrap">
        <Filigree className="pFiligree pFiligreeTL" />
        <Filigree className="pFiligree pFiligreeBR" />
      </span>
      <span aria-hidden="true" className="pCue" />
      <span className="pText">{children}</span>
    </>
  );

  if (external) {
    return (
      <a href={href} className={classes} {...rest}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {inner}
    </Link>
  );
}
