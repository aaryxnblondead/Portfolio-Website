"use client";

import { useIntersectionObserver } from "@/lib/use-intersection";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Entrance from the right: fades in while travelling left into place.
 * Rows of an index stagger by passing delayMs. Never traps content —
 * reduced motion (or pre-intersection SSR) renders plainly visible.
 */
export function SlideIn({
  children,
  className,
  delayMs = 0,
  distancePx = 28,
}: {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  distancePx?: number;
}) {
  const [ref, isVisible] = useIntersectionObserver();
  const prefersReduced = usePrefersReducedMotion();

  if (prefersReduced) {
    return (
      <div ref={ref} className={className || ""}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={className || ""}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "none" : `translateX(${distancePx}px)`,
        transition: `opacity 560ms cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms, transform 560ms cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms`,
      }}
    >
      {children}
    </div>
  );
}
