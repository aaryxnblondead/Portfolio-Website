import type { ReactNode, SVGProps } from "react";

/**
 * A small, purpose-built icon set — not a general-purpose library. Every
 * icon is drawn at the same weight as the site's hairline rules (1.5px
 * stroke, no fill, no rounded caps unless the mark itself is circular) so
 * they read as part of the type system rather than imported chrome.
 *
 * Usage: <IconVinyl size={16} className="text-accent" />
 * Color follows `currentColor`, so set color via a text-* class or CSS.
 */

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

function Base({ size = 18, children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={props["aria-label"] ? undefined : true}
      {...props}
    >
      {children}
    </svg>
  );
}

export function IconVinyl(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="9.25" />
      <circle cx="12" cy="12" r="5.5" strokeOpacity="0.45" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
    </Base>
  );
}

export function IconChevron({ direction = "right", ...props }: IconProps & { direction?: "left" | "right" | "up" | "down" }) {
  const rotation = { right: 0, down: 90, left: 180, up: 270 }[direction];
  return (
    <Base {...props} style={{ transform: `rotate(${rotation}deg)`, ...props.style }}>
      <path d="m9 5 7 7-7 7" />
    </Base>
  );
}
