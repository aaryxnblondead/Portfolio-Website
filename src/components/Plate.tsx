import type { CSSProperties, ReactNode } from 'react';
import { getPhoto, type Photo } from '@/lib/photos';

/**
 * Photographic furniture for the programme.
 *
 * A plate is a print mounted on board: hairline rule, a mat of paper-sunk
 * around the image, a plate number in the margin, and a caption set in the
 * same monospace as the rest of the catalogue metadata. No radius, no shadow,
 * no gradient — depth comes from the mount, exactly as the rules and the
 * paper/paper-sunk pair do elsewhere.
 */

export type PlateSize = 'rail' | 'column' | 'wide' | 'bleed';

const SIZES: Record<PlateSize, string> = {
  rail: '(max-width: 900px) 38vw, 220px',
  column: '(max-width: 900px) 92vw, 620px',
  wide: '(max-width: 900px) 92vw, 960px',
  bleed: '100vw',
};

const DEFAULT_RATIO: Record<PlateSize, string | undefined> = {
  rail: '4 / 5',
  column: undefined, // natural — uncropped is the honest default in a catalogue
  wide: undefined,
  bleed: '21 / 9',
};

/** The three cut pairings for the misregistered second plate. */
const CUTS = { 1: 'pCutoutB', 2: 'pCutoutC', 3: 'pCutoutA' } as const;

function toRatio(ratio?: string | number): string | undefined {
  if (ratio === undefined) return undefined;
  if (typeof ratio === 'number') return String(ratio);
  return ratio.includes(':') ? ratio.split(':').join(' / ') : ratio;
}

function resolvePhoto(photo: string | Photo): Photo {
  return typeof photo === 'string' ? getPhoto(photo) : photo;
}

/** The paper tint and blurred placeholder every mount sits on. */
function mountStyle(p: Photo, ratio?: string): CSSProperties {
  return {
    '--plate-tone': p.tone,
    '--plate-lqip': `url("${p.lqip}")`,
    ...(ratio ? { '--plate-ratio': ratio } : {}),
  } as CSSProperties;
}

/** Strike the misregistered pass behind the mount. Omit for a plain mount. */
function Misregistered({ misreg, children }: { misreg?: 1 | 2 | 3; children: ReactNode }) {
  if (!misreg) return <>{children}</>;
  return (
    <div className="plate__miswrap">
      <span aria-hidden="true" className={`pPlate ${CUTS[misreg]}`} />
      {children}
    </div>
  );
}

function PlateNumber({ plate }: { plate?: string | number }) {
  if (plate === undefined) return null;
  return (
    <span className="plate__number" aria-hidden="true">
      Pl. {plate}
    </span>
  );
}

/** One print inside its mat: the responsive sources plus the image itself. */
function Mount({
  photo,
  alt,
  sizes,
  focus,
  ratio,
  priority = false,
}: {
  photo: Photo;
  alt: string;
  sizes: string;
  focus?: string;
  ratio?: string;
  priority?: boolean;
}) {
  return (
    <div className={`plate__mount${ratio ? ' plate__mount--cropped' : ''}`} style={mountStyle(photo, ratio)}>
      <picture>
        <source type="image/avif" srcSet={photo.avif} sizes={sizes} />
        <source type="image/webp" srcSet={photo.webp} sizes={sizes} />
        <img
          className="plate__img"
          src={photo.src}
          srcSet={photo.jpg}
          sizes={sizes}
          width={photo.width}
          height={photo.height}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'auto'}
          style={focus ? { objectPosition: focus } : undefined}
        />
      </picture>
    </div>
  );
}

export type PlateProps = {
  /** Manifest slug, or a Photo object straight from getPhoto(). */
  photo: string | Photo;
  /** Describe the photograph, not the project. Required — these are content. */
  alt: string;
  /** Caption printed under the rule. Omit for silent plates. */
  caption?: ReactNode;
  /** Plate number in the margin. Pass a string for things like "12a". */
  plate?: string | number;
  size?: PlateSize;
  /**
   * Crop ratio: '3:2', '16:9', '1:1', a number, or 'natural' to never crop.
   * Leave unset to take the size default.
   */
  ratio?: string | number | 'natural';
  /** object-position for the crop, e.g. 'center 30%'. */
  focus?: string;
  /** Catalogue metadata rendered beside the caption. */
  meta?: Record<string, string>;
  /** Load eagerly and at high priority — use once per page, above the fold. */
  priority?: boolean;
  className?: string;
  /**
   * Strike the misregistered second plate: a solid accent shape offset
   * 10px / 12px behind the mount only (never behind the caption), with
   * the print clipped to a cut-out polygon so the two passes disagree.
   * Pass 1, 2 or 3 for the three cut pairings. Omit for a plain mount.
   */
  misreg?: 1 | 2 | 3;
};

export function Plate({
  photo,
  alt,
  caption,
  plate,
  size = 'column',
  ratio,
  focus,
  meta,
  priority = false,
  className,
  misreg,
}: PlateProps) {
  const resolved = ratio === 'natural' ? undefined : toRatio(ratio) ?? DEFAULT_RATIO[size];
  const misClass = misreg ? ` plate--misreg plate--misreg-${misreg}` : '';

  return (
    <figure className={`plate plate--${size}${misClass}${className ? ` ${className}` : ''}`}>
      <PlateNumber plate={plate} />
      <Misregistered misreg={misreg}>
        <Mount photo={resolvePhoto(photo)} alt={alt} sizes={SIZES[size]} focus={focus} ratio={resolved} priority={priority} />
      </Misregistered>
      {(caption || meta) && (
        <figcaption className="plate__caption">
          {caption && <p className="plate__text">{caption}</p>}
          {meta && (
            <dl className="plate__meta">
              {Object.entries(meta).map(([k, v]) => (
                <div key={k} className="plate__meta-row">
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          )}
        </figcaption>
      )}
    </figure>
  );
}

/* ------------------------------------------------------------------ */

/** Two plates side by side, sharing one caption. Use for before/after or a diptych. */
export function PlatePair({
  left,
  right,
  caption,
  plate,
  ratio = '3:2',
  misreg,
}: {
  left: { photo: string | Photo; alt: string; focus?: string };
  right: { photo: string | Photo; alt: string; focus?: string };
  caption?: ReactNode;
  plate?: string | number;
  ratio?: string | number;
  /**
   * Strike the misregistered second plate behind the pair track only
   * (never behind the caption). Pair prints stay rectangular; the rust
   * pass is clipped so the two passes disagree.
   */
  misreg?: 1 | 2 | 3;
}) {
  const resolved = toRatio(ratio) ?? '3 / 2';
  const misClass = misreg ? ` plate--misreg plate--misreg-${misreg}` : '';

  const track = (
    <div className="plate__pair-track">
      {[left, right].map((side) => (
        <Mount
          key={resolvePhoto(side.photo).slug}
          photo={resolvePhoto(side.photo)}
          alt={side.alt}
          sizes="(max-width: 900px) 92vw, 470px"
          focus={side.focus}
          ratio={resolved}
        />
      ))}
    </div>
  );

  return (
    <figure className={`plate plate--pair${misClass}`}>
      <PlateNumber plate={plate} />
      <Misregistered misreg={misreg}>{track}</Misregistered>
      {caption && (
        <figcaption className="plate__caption">
          <p className="plate__text">{caption}</p>
        </figcaption>
      )}
    </figure>
  );
}
