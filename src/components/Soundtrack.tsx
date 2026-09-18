"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchSpotifyFeed,
  formatDuration,
  formatPlayedAt,
  joinArtists,
  POLL_IDLE,
  POLL_PLAYING,
  SpotifyFeedError,
  type SpotifyFeed,
} from "@/lib/spotify";

/**
 * Nothing is persisted. The feed lives in component state for as long as the tab
 * is open and is dropped on unmount, which keeps it inside Spotify's
 * "immediate use" caching rule.
 */
export function Soundtrack() {
  const [feed, setFeed] = useState<SpotifyFeed | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(true);

  // Anchor for ticking the progress bar between polls, so a playing track moves
  // every second without costing a request.
  const anchor = useRef<{ progressMs: number; at: number } | null>(null);
  const [tick, setTick] = useState(0);

  const load = useCallback(async (signal: AbortSignal) => {
    try {
      const next = await fetchSpotifyFeed(signal);
      if (signal.aborted) return;
      setFeed(next);
      setError(null);
      anchor.current =
        next.nowPlaying?.progressMs != null
          ? { progressMs: next.nowPlaying.progressMs, at: Date.now() }
          : null;
    } catch (err) {
      if (signal.aborted || (err as Error)?.name === "AbortError") return;
      const message =
        err instanceof SpotifyFeedError
          ? err.code === "reauthorize_required"
            ? "Spotify access needs re-authorizing."
            : err.message
          : "Couldn't reach Spotify.";
      setError(message);
    } finally {
      if (!signal.aborted) setPending(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>;

    const schedule = () => {
      clearTimeout(timer);
      if (document.visibilityState !== "visible") return;
      const delay = anchor.current ? POLL_PLAYING : POLL_IDLE;
      timer = setTimeout(run, delay);
    };

    const run = async () => {
      await load(controller.signal);
      schedule();
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") run();
      else clearTimeout(timer);
    };

    run();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      controller.abort();
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [load]);

  // One-second heartbeat, only while something is playing.
  useEffect(() => {
    if (!feed?.nowPlaying) return;
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [feed?.nowPlaying?.id, feed?.nowPlaying]);

  const playing = feed?.nowPlaying ?? null;

  let elapsed = playing?.progressMs ?? 0;
  if (playing && anchor.current) {
    elapsed = Math.min(
      anchor.current.progressMs + (Date.now() - anchor.current.at),
      playing.durationMs ?? Number.MAX_SAFE_INTEGER
    );
  }
  void tick; // the heartbeat exists to re-run the line above

  const progress =
    playing?.durationMs && playing.durationMs > 0
      ? Math.min(100, (elapsed / playing.durationMs) * 100)
      : 0;

  return (
    <section className="sdtk" aria-labelledby="soundtrack-heading">
      <div className="sdtk-head">
        <h2 id="soundtrack-heading" className="text-meta font-space-mono-bold text-ink">
          Soundtrack
        </h2>
        <SpotifyMark />
      </div>

      {pending && !feed && <SoundtrackSkeleton />}

      {error && !feed && (
        <p className="sdtk-note text-small text-ink-muted">
          {error}{" "}
          <a
            href="https://open.spotify.com/user/"
            className="text-accent no-underline"
            rel="noreferrer noopener"
          >
            Listen on Spotify
          </a>
        </p>
      )}

      {feed && (
        <>
          {playing ? (
            <article className="sdtk-now">
              {playing.art && (
                /* Cover art is shown unmodified, per Spotify's design guidelines. */
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="sdtk-art"
                  src={playing.art}
                  alt={playing.album ? `${playing.album} cover art` : "Album cover art"}
                  width={300}
                  height={300}
                  loading="lazy"
                  decoding="async"
                />
              )}

              <p className="sdtk-state text-meta font-space-mono text-accent">
                <Equalizer /> On now
              </p>

              <h3 className="sdtk-title">
                <TrackLink track={playing} />
              </h3>
              <p className="sdtk-artist text-small text-ink">{joinArtists(playing.artists)}</p>
              {playing.album && (
                <p className="sdtk-album text-meta font-space-mono text-ink-muted">{playing.album}</p>
              )}

              <div
                className="sdtk-progress"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress)}
                aria-label="Track progress"
              >
                <span className="sdtk-progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <p className="sdtk-times text-meta font-space-mono text-ink-muted">
                <span>{formatDuration(elapsed)}</span>
                <span>{formatDuration(playing.durationMs)}</span>
              </p>
            </article>
          ) : (
            <p className="sdtk-note text-meta font-space-mono text-ink-muted">
              Nothing playing right now
            </p>
          )}

          {feed.recent.length > 0 && (
            <>
              <p className="sdtk-divider text-meta font-space-mono text-ink-muted">Earlier</p>
              <ol className="sdtk-list">
                {feed.recent.map((track, i) => (
                  <li key={`${track.id}-${track.playedAt ?? i}`} className="sdtk-row">
                    <span className="sdtk-index text-meta font-space-mono text-ink-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="sdtk-row-body">
                      <span className="sdtk-row-title">
                        <TrackLink track={track} />
                      </span>
                      <span className="sdtk-row-meta text-meta font-space-mono text-ink-muted">
                        {joinArtists(track.artists)}
                        {track.playedAt ? ` · ${formatPlayedAt(track.playedAt)}` : ""}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </>
          )}
        </>
      )}
    </section>
  );
}

function TrackLink({ track }: { track: { name: string; url: string | null } }) {
  if (!track.url) return <>{track.name}</>;
  return (
    <a href={track.url} className="no-underline title-link" rel="noreferrer noopener" target="_blank">
      {track.name}
    </a>
  );
}

/** Three bars. Held still when the visitor prefers reduced motion. */
function Equalizer() {
  return (
    <span className="sdtk-eq" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

/** Attribution, as the Developer Terms require. */
function SpotifyMark() {
  return (
    <a
      href="https://open.spotify.com"
      className="sdtk-mark no-underline"
      rel="noreferrer noopener"
      target="_blank"
      aria-label="Powered by Spotify"
    >
      <svg viewBox="0 0 24 24" width="14" height="14" role="img" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24Zm5.5 17.3a.75.75 0 0 1-1.03.25c-2.82-1.72-6.37-2.11-10.55-1.16a.75.75 0 1 1-.33-1.46c4.57-1.04 8.5-.59 11.66 1.34.35.22.46.68.25 1.03Zm1.47-3.27a.94.94 0 0 1-1.29.31c-3.23-1.98-8.15-2.56-11.97-1.4a.94.94 0 0 1-.55-1.79c4.37-1.33 9.79-.69 13.5 1.59.44.27.58.85.31 1.29Zm.13-3.4C15.23 8.33 8.86 8.13 5.15 9.25a1.12 1.12 0 1 1-.65-2.15c4.26-1.29 11.29-1.04 15.74 1.6a1.12 1.12 0 1 1-1.14 1.93Z"
        />
      </svg>
      <span className="text-meta font-space-mono">Spotify</span>
    </a>
  );
}

function SoundtrackSkeleton() {
  return (
    <div className="sdtk-skeleton" aria-hidden="true">
      <div className="sdtk-skeleton-art" />
      <div className="sdtk-skeleton-line" style={{ width: "80%" }} />
      <div className="sdtk-skeleton-line" style={{ width: "55%" }} />
    </div>
  );
}
