"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A scrolling strip of film frames and sprocket holes, used as a section
 * divider. Deliberately the loudest moving thing on the page other than the
 * ticker — use at most one per page, the way you'd use SprocketRule (its
 * static cousin) between acts, not between paragraphs.
 *
 * Resource footprint, by design:
 *  - The only animated property is `transform: translateX()`, which is
 *    compositor-only work — no layout, no paint, on every frame.
 *  - Pure CSS `@keyframes`, not a JS animation loop or scroll listener.
 *  - `prefers-reduced-motion` swaps it for a static strip.
 *  - An IntersectionObserver toggles `animation-play-state`, so the strip is
 *    paused (zero cost) whenever it's off-screen — a long page with several
 *    dividers still only ever animates the one you're looking at.
 */
export function FilmStrip({ frameCount = 14 }: { frameCount?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: "64px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const frames = Array.from({ length: frameCount }, (_, i) => i);

  return (
    <div className="filmstrip" ref={ref} aria-hidden="true">
      <div className={`filmstrip-track${visible ? " is-running" : ""}`}>
        {[0, 1].map((copy) => (
          <div className="filmstrip-run" key={copy}>
            {frames.map((i) => (
              <span className="filmstrip-frame" key={i}>
                <span className="filmstrip-holes" />
                <span className="filmstrip-cell" />
                <span className="filmstrip-holes" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
