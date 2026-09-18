import manifest from './photo-manifest.json';

export type Photo = {
  slug: string;
  /** Intrinsic pixel dimensions of the graded source. */
  width: number;
  height: number;
  /** width / height */
  aspect: number;
  /** JPEG fallback for <img src>. */
  src: string;
  /** Pre-joined srcset strings. */
  avif: string;
  webp: string;
  jpg: string;
  /** 24px blurred placeholder, inlined as a data URI. */
  lqip: string;
  /** Dominant colour of the graded image, used to tone the mount. */
  tone: string;
};

export const photos = manifest as unknown as Record<string, Photo>;

export function getPhoto(slug: string): Photo {
  const photo = photos[slug];
  if (!photo) {
    throw new Error(
      `Unknown photo "${slug}". Add the file to photos/ and run "npm run photos". ` +
        `Known slugs: ${Object.keys(photos).join(', ') || '(none)'}`,
    );
  }
  return photo;
}

/** Slugs in manifest order — handy for contact sheets. */
export const photoSlugs = Object.keys(photos);

/** Every photo whose slug starts with a prefix, e.g. allPhotos('anora'). */
export function allPhotos(prefix: string): Photo[] {
  return photoSlugs
    .filter((s) => s === prefix || s.startsWith(`${prefix}-`))
    .map((s) => photos[s]);
}
