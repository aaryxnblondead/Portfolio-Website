import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * Fires once, when the element first crosses into view, then disconnects.
 * Entrance animations want a one-shot, not a boolean that keeps flipping.
 */
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
): [RefObject<HTMLDivElement>, boolean] {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -10% 0px",
        ...options,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [ref, options]);

  return [ref, isVisible];
}
