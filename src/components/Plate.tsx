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

function toRatio(ratio?: string | number): string | undefined {
  if (ratio === undefined) return undefined;
  if (typeof ratio === 'number') return String(ratio);
  return ratio.includes(':') ? ratio.split(':').join(' / ') : ratio;
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
  const p = typeof photo === 'string' ? getPhoto(photo) : photo;
  const resolved =
    ratio === 'natural' ? undefined : toRatio(ratio) ?? DEFAULT_RATIO[size];

  const style = {
    '--plate-tone': p.tone,
    '--plate-lqip': `url("${p.lqip}")`,
    ...(resolved ? { '--plate-ratio': resolved } : {}),
  } as CSSProperties;

  const misClass = misreg ? ` plate--misreg plate--misreg-${misreg}` : '';
  const plateCut = misreg === 2 ? 'pCutoutC' : misreg === 3 ? 'pCutoutA' : 'pCutoutB';

  const mount = (
    <div className={`plate__mount${resolved ? ' plate__mount--cropped' : ''}`}>
      <picture>
        <source type="image/avif" srcSet={p.avif} sizes={SIZES[size]} />
        <source type="image/webp" srcSet={p.webp} sizes={SIZES[size]} />
        <img
          className="plate__img"
          src={p.src}
          srcSet={p.jpg}
          sizes={SIZES[size]}
          width={p.width}
          height={p.height}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'auto'}
          style={focus ? { objectPosition: focus } : undefined}
        />
      </picture>
    </div>
  );

  return (
    <figure
      className={`plate plate--${size}${misClass}${className ? ` ${className}` : ''}`}
      style={style}
    >
      {plate !== undefined && (
        <span className="plate__number" aria-hidden="true">
          Pl. {plate}
        </span>
      )}

      {misreg ? (
        <div className="plate__miswrap">
          <span aria-hidden="true" className={`pPlate ${plateCut}`} />
          {mount}
        </div>
      ) : (
        mount
      )}

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

export type ContactSheetItem = {
  photo: string | Photo;
  alt: string;
  caption?: string;
  focus?: string;
};

/**
 * A contact sheet: frames from the same shoot, uniformly cropped, numbered in
 * sequence because a contact sheet genuinely is one. Scrolls horizontally on
 * narrow screens rather than collapsing to a stack of postage stamps.
 */
export function ContactSheet({
  items,
  ratio = '3:2',
  columns = 4,
  label,
  start = 1,
}: {
  items: ContactSheetItem[];
  ratio?: string | number;
  columns?: 2 | 3 | 4 | 5;
  /** Sheet heading, e.g. 'Anora — festival run, Feb 2025'. */
  label?: string;
  /** First frame number. */
  start?: number;
}) {
  const resolved = toRatio(ratio);

  return (
    <section
      className="sheet"
      style={{ '--sheet-columns': columns, '--plate-ratio': resolved } as CSSProperties}
      aria-label={label ?? 'Contact sheet'}
    >
      {label && <h3 className="sheet__label">{label}</h3>}
      <ol className="sheet__frames">
        {items.map((item, i) => {
          const p = typeof item.photo === 'string' ? getPhoto(item.photo) : item.photo;
          return (
            <li
              key={p.slug}
              className="sheet__frame"
              style={
                {
                  '--plate-tone': p.tone,
                  '--plate-lqip': `url("${p.lqip}")`,
                } as CSSProperties
              }
            >
              <div className="plate__mount plate__mount--cropped">
                <picture>
                  <source type="image/avif" srcSet={p.avif} sizes={SIZES.column} />
                  <source type="image/webp" srcSet={p.webp} sizes={SIZES.column} />
                  <img
                    className="plate__img"
                    src={p.src}
                    srcSet={p.jpg}
                    sizes="(max-width: 900px) 62vw, 260px"
                    width={p.width}
                    height={p.height}
                    alt={item.alt}
                    loading="lazy"
                    decoding="async"
                    style={item.focus ? { objectPosition: item.focus } : undefined}
                  />
                </picture>
              </div>
              <p className="sheet__frame-meta">
                <span className="sheet__frame-no">
                  {String(start + i).padStart(2, '0')}
                </span>
                {item.caption && <span>{item.caption}</span>}
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/* ------------------------------------------------------------------ */

/**
 * The portrait that sits in the 2-column left rail beside the opening text.
 * Cropped 4:5 so it reads as a passport plate in a programme, not a hero image.
 */
export function Portrait({
  photo,
  alt,
  credit,
  focus = 'center 28%',
}: {
  photo: string | Photo;
  alt: string;
  /** Photographer and date, printed under the rule. */
  credit?: string;
  focus?: string;
}) {
  return (
    <Plate
      photo={photo}
      alt={alt}
      size="rail"
      ratio="4:5"
      focus={focus}
      caption={credit}
      priority
      className="plate--portrait"
    />
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
  const misClass = misreg ? ` plate--misreg plate--misreg-${misreg}` : '';
  const plateCut = misreg === 2 ? 'pCutoutC' : misreg === 3 ? 'pCutoutA' : 'pCutoutB';
  const track = (
    <div className="plate__pair-track">
      {[left, right].map((side) => {
        const p = typeof side.photo === 'string' ? getPhoto(side.photo) : side.photo;
        return (
          <div
            key={p.slug}
            className="plate__mount plate__mount--cropped"
            style={
              {
                '--plate-tone': p.tone,
                '--plate-lqip': `url("${p.lqip}")`,
                '--plate-ratio': toRatio(ratio),
              } as CSSProperties
            }
          >
            <picture>
              <source type="image/avif" srcSet={p.avif} sizes="(max-width: 900px) 92vw, 470px" />
              <source type="image/webp" srcSet={p.webp} sizes="(max-width: 900px) 92vw, 470px" />
              <img
                className="plate__img"
                src={p.src}
                srcSet={p.jpg}
                sizes="(max-width: 900px) 92vw, 470px"
                width={p.width}
                height={p.height}
                alt={side.alt}
                loading="lazy"
                decoding="async"
                style={side.focus ? { objectPosition: side.focus } : undefined}
              />
            </picture>
          </div>
        );
      })}
    </div>
  );
  return (
    <figure className={`plate plate--pair${misClass}`}>
      {plate !== undefined && (
        <span className="plate__number" aria-hidden="true">
          Pl. {plate}
        </span>
      )}
      {misreg ? (
        <div className="plate__miswrap">
          <span aria-hidden="true" className={`pPlate ${plateCut}`} />
          {track}
        </div>
      ) : (
        track
      )}
      {caption && (
        <figcaption className="plate__caption">
          <p className="plate__text">{caption}</p>
        </figcaption>
      )}
    </figure>
  );
}
