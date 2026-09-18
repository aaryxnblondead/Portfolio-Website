"use client";

import { useIntersectionObserver, usePrefersReducedMotion } from "@/lib/hooks";

interface WipeInProps {
  children: React.ReactNode;
  delay?: boolean;
  className?: string;
}

/**
 * The signature entrance move: a hairline rule wipes left-to-right, then the
 * headline beneath it fades in ~80ms behind. Uses the .wipe-* / .opacity-*
 * classes already defined in globals.css (real CSS, not Tailwind arbitrary-
 * value classNames — those never resolved to anything, since corePlugins is
 * disabled and no plugin generates them).
 */
export function WipeIn({ children, delay = false, className }: WipeInProps) {
  const [ref, isVisible] = useIntersectionObserver();
  const prefersReduced = usePrefersReducedMotion();

  if (prefersReduced) {
    return (
      <div ref={ref} className={className || ""}>
        <div className="rule mb-2" />
        {children}
      </div>
    );
  }

  const ruleClass = ["rule", "mb-2", isVisible ? "wipe-enter-active" : "wipe-enter"].join(" ");
  const headlineClass = [
    className || "",
    isVisible ? "opacity-enter-active" : "opacity-enter",
    delay ? "wipe-delay-1" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={ref}>
      <div className={ruleClass} />
      <div className={headlineClass}>{children}</div>
    </div>
  );
}

export function FadeIn({ children, className }: { children: React.ReactNode; className?: string }) {
  const [ref, isVisible] = useIntersectionObserver();
  const prefersReduced = usePrefersReducedMotion();

  const classes = [
    className || "",
    prefersReduced || isVisible ? "opacity-enter-active" : "opacity-enter",
  ].join(" ");

  return (
    <div ref={ref} className={classes}>
      {children}
    </div>
  );
}
