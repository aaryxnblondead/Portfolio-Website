"use client";

import { useEffect, useRef, useState } from "react";
import { getPhoto, type Photo } from "@/lib/photos";

/**
 * PhotoBelt — the non-individual frames as a gliding film belt. Real
 * graded photos ride inside the sprocket-hole motif: ink band, hairline
 * borders, mono frame numbers, one static legend so nothing gliding needs
 * to be read at speed.
 *
 * Motion follows the FilmStrip contract: compositor-only translateX,
 * paused off-screen via IntersectionObserver, and a static horizontally
 * scrollable strip under prefers-reduced-motion.
 */

export type BeltItem = {
  photo: string | Photo;
  alt: string;
};

export function PhotoBelt({
  items,
  label,
  start = 1,
}: {
  items: BeltItem[];
  /** Belt heading, e.g. 'Group frames + Samvad run'. */
  label?: string;
  /** First frame number, continuing the page plate sequence. */
  start?: number;
}) {
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

  const frames = items.map((item) => ({
    ...item,
    p: typeof item.photo === "string" ? getPhoto(item.photo) : item.photo,
  }));

  return (
    <section className="belt" aria-label={label ?? "Photo belt"}>
      {label && (
        <div className="belt__head">
          <h3 className="belt__label">{label}</h3>
          <span className="belt__count" aria-hidden="true">
            {String(frames.length).padStart(2, "0")} FRAMES
          </span>
        </div>
      )}
      <div className="belt-tape" ref={ref}>
        <div className={`belt-track${visible ? " is-running" : ""}`}>
          {[0, 1].map((copy) => (
            <div className="belt-run" key={copy} aria-hidden={copy === 1}>
              {frames.map((frame, i) => (
                <figure className="belt-frame" key={`${copy}-${frame.p.slug}`}>
                  <span className="belt-holes" aria-hidden="true" />
                  <picture>
                    <source type="image/avif" srcSet={frame.p.avif} sizes="(max-width: 700px) 50vw, 280px" />
                    <source type="image/webp" srcSet={frame.p.webp} sizes="(max-width: 700px) 50vw, 280px" />
                    <img
                      className="belt-img"
                      src={frame.p.src}
                      srcSet={frame.p.jpg}
                      sizes="(max-width: 700px) 50vw, 280px"
                      width={frame.p.width}
                      height={frame.p.height}
                      alt={copy === 0 ? frame.alt : ""}
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                  <span className="belt-no" aria-hidden="true">
                    {String(start + i).padStart(2, "0")}
                  </span>
                  <span className="belt-holes" aria-hidden="true" />
                </figure>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
