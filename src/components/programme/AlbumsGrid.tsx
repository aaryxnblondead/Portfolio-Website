import { getPhoto } from "@/lib/photos";
import { ALBUMS } from "@/lib/albums";

/**
 * The inspirations shelf: one grid, eight sleeves, each a link out to
 * the record. Covers are local pipeline prints (graded neutrally, with
 * srcsets and LQIP tones like every other photograph); hover is the
 * house tactile shift, never a shadow or a zoom.
 */
export function AlbumsGrid() {
  return (
    <ol className="album-grid">
      {ALBUMS.map((album, i) => {
        const p = getPhoto(album.photo);
        return (
          <li key={`${album.artist}-${album.title}`} className="album">
            <a
              href={album.spotify}
              target="_blank"
              rel="noreferrer noopener"
              className="album-link"
              aria-label={`${album.title} by ${album.artist} (${album.year}) — open the record`}
            >
              <span className="album-no" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="album-mount">
                <span className="album-frame">
                  <img
                    src={p.src}
                    srcSet={p.jpg}
                    sizes="(max-width: 700px) 42vw, 220px"
                    width={p.width}
                    height={p.height}
                    alt={`${album.title} album cover`}
                    loading="lazy"
                    decoding="async"
                    style={{ backgroundColor: p.tone }}
                  />
                </span>
              </span>
              <span className="album-title">{album.title}</span>
              <span className="album-meta">
                {album.artist} · {album.year} ↗
              </span>
            </a>
          </li>
        );
      })}
    </ol>
  );
}
