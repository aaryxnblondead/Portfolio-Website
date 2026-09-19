import { getPhoto, type Photo } from "@/lib/photos";

/**
 * The Drake / Late Registration register, resolved exactly once: the frame
 * is dead straight and square to the grid while the photograph inside is
 * tilted, oversized, and cropped by the frame's edges. Brass appears here
 * and nowhere else on the site.
 */

function Corner({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      className={`pCorner ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    >
      <path d="M0 47 L0 16 Q0 0 16 0 L47 0" />
      <path d="M7 40 Q7 26 15 21 Q24 15 30 18 Q35 21 31 26 Q27 31 20 27 Q12 23 15 14 Q18 5 31 7" />
      <path d="M4 46 Q10 38 8 31" />
      <circle cx="33.5" cy="6.5" r="2.1" fill="currentColor" stroke="none" />
      <path d="M38 2 L44 2 M41 0 L41 6" />
    </svg>
  );
}

export function OrnateFrame({
  photo,
  alt = "",
  caption,
  plate = "MUMBAI / 2025",
  className = "",
}: {
  photo: string | Photo;
  alt?: string;
  caption?: string;
  plate?: string;
  className?: string;
}) {
  const p = typeof photo === "string" ? getPhoto(photo) : photo;

  return (
    <figure className={`pOrnate${className ? ` ${className}` : ""}`}>
      <div className="pOrnateOuter">
        <div className="pOrnateInner">
          <div className="vignette pOrnateImgWrap">
            <picture>
              <source type="image/avif" srcSet={p.avif} sizes="(max-width: 900px) 92vw, 420px" />
              <source type="image/webp" srcSet={p.webp} sizes="(max-width: 900px) 92vw, 420px" />
              <img
                className="pOrnateImg transferWarm"
                src={p.src}
                srcSet={p.jpg}
                sizes="(max-width: 900px) 92vw, 420px"
                width={p.width}
                height={p.height}
                alt={alt}
                loading="lazy"
                decoding="async"
              />
            </picture>
          </div>
          <span className="pOrnateEdge pVertical" aria-hidden="true">
            {plate}
          </span>
        </div>

        <Corner className="pCornerTL" />
        <Corner className="pCornerTR" />
        <Corner className="pCornerBR" />
        <Corner className="pCornerBL" />
      </div>

      {caption && <figcaption className="pOrnateCaption">{caption}</figcaption>}
    </figure>
  );
}
