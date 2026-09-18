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

export function IconWaveform(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M3 12v.01M6.5 8v8M10 5v14M13.5 9v6M17 6.5v11M20.5 11v2" />
    </Base>
  );
}

export function IconClapperboard(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M3.5 10.5 4.7 5.9a1 1 0 0 1 1.22-.72l13.4 3.6a1 1 0 0 1 .71 1.22l-.3 1.1" />
      <path d="M4 20.5h16v-9.8H4v9.8Z" />
      <path d="m6.3 5.9 3 3.9M11.3 4.6l3 3.9M16.2 3.4l3 3.9" strokeOpacity="0.6" />
    </Base>
  );
}

export function IconFilmFrame(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="3.5" y="4" width="17" height="16" />
      <path d="M3.5 8h17M3.5 16h17" strokeOpacity="0.5" />
      <path d="M8 4v16M16 4v16" strokeOpacity="0.5" />
    </Base>
  );
}

export function IconPin(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.4" />
    </Base>
  );
}

export function IconMail(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="3" y="5.5" width="18" height="13" />
      <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
    </Base>
  );
}

export function IconGithub(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 2.5a9.5 9.5 0 0 0-3 18.52c.48.1.65-.21.65-.46v-1.8c-2.64.58-3.2-1.17-3.2-1.17-.43-1.13-1.06-1.42-1.06-1.42-.87-.6.07-.59.07-.59.96.07 1.47 1 1.47 1 .86 1.5 2.24 1.06 2.79.81.09-.64.34-1.06.61-1.31-2.11-.24-4.33-1.07-4.33-4.76 0-1.05.37-1.91.98-2.58-.1-.24-.42-1.23.09-2.57 0 0 .8-.26 2.6 1a8.85 8.85 0 0 1 4.74 0c1.8-1.25 2.6-1 2.6-1 .52 1.34.19 2.33.1 2.57.6.67.97 1.53.97 2.58 0 3.7-2.22 4.51-4.34 4.75.35.31.65.9.65 1.83v2.71c0 .25.16.56.66.46A9.5 9.5 0 0 0 12 2.5Z" />
    </Base>
  );
}

export function IconLinkedin(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" />
      <path d="M7.8 10.2v6.3M7.8 7.7v.01M11.5 16.5v-3.7c0-1.3.9-2.1 2-2.1s1.9.8 1.9 2.1v3.7" strokeLinecap="round" />
      <path d="M11.5 12v4.5" />
    </Base>
  );
}

export function IconArrowUpRight(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M7 17 17 7M9 7h8v8" />
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

export function IconPlay(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M7 4.5v15l13-7.5-13-7.5Z" strokeLinejoin="round" />
    </Base>
  );
}

export function IconPause(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M7.5 4.5v15M16.5 4.5v15" />
    </Base>
  );
}

export function IconSprocket(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="4" y="4" width="16" height="16" />
      <circle cx="7.2" cy="7.2" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="16.8" cy="7.2" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="7.2" cy="16.8" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="16.8" cy="16.8" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="3" />
    </Base>
  );
}
