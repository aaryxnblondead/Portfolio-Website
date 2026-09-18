"use client";

import { useEffect, useRef, useState } from "react";
import {
  formatDuration,
  formatPlayedAt,
  useSpotifyFeed,
  type Track,
} from "@/lib/spotify";
import { IconChevron, IconVinyl } from "@/components/Icons";

export function Soundtrack() {
  const state = useSpotifyFeed();
  const [manualOpen, setManualOpen] = useState(false);
  const [dismissedTrackId, setDismissedTrackId] = useState<string | null>(null);
  const anchor = useRef<{ progressMs: number; at: number } | null>(null);
  const [tick, setTick] = useState(0);

  const feed = state.status === "ready" ? state.feed : null;
  // The worker reports the last touched item even when paused. Only a
  // currently playing track drives the "On now" state and the progress line;
  // anything else falls through to the recent list.
  const playing = feed?.nowPlaying?.isPlaying ? feed.nowPlaying : null;

  useEffect(() => {
    anchor.current =
      playing?.progressMs != null ? { progressMs: playing.progressMs, at: Date.now() } : null;
  }, [playing?.id, playing?.progressMs]);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setTick((value) => value + 1), 1000);
    return () => clearInterval(id);
  }, [playing]);

  let elapsed = playing?.progressMs ?? 0;
  if (playing && anchor.current) {
    elapsed = Math.min(
      anchor.current.progressMs + (Date.now() - anchor.current.at),
      playing.durationMs ?? Number.MAX_SAFE_INTEGER
    );
  }
  void tick;

  const progress =
    playing?.durationMs && playing.durationMs > 0
      ? Math.min(100, (elapsed / playing.durationMs) * 100)
      : 0;
  const hasContent = Boolean(feed && (playing || feed.recent.length > 0));
  const isDismissed = playing ? dismissedTrackId === playing.id : false;
  const open = playing ? !isDismissed : manualOpen;

  if (state.status === "loading" || state.status === "unconfigured") return null;

  if (state.status === "error") {
    return (
      <div className="sdtk-dock">
        <button
          type="button"
          className="sdtk-tab"
          aria-expanded={manualOpen}
          aria-controls="soundtrack-panel"
          onClick={() => setManualOpen((value) => !value)}
        >
          <IconVinyl size={16} className="sdtk-tab-vinyl" />
          <span className="sdtk-tab-label text-meta font-space-mono">Soundtrack</span>
          <IconChevron size={12} direction={manualOpen ? "right" : "left"} />
        </button>

        <section
          id="soundtrack-panel"
          className="sdtk-panel"
          aria-labelledby="soundtrack-heading"
          aria-hidden={!manualOpen}
        >
          <div className="sdtk-head">
            <h2 id="soundtrack-heading" className="text-meta font-space-mono-bold text-ink">
              Soundtrack
            </h2>
            <SpotifyMark />
          </div>
          <p className="sdtk-note text-meta font-space-mono text-ink-muted">{state.message}</p>
        </section>
      </div>
    );
  }

  if (!hasContent) return null;

  return (
    <div className={`sdtk-dock${open ? " is-open" : ""}`}>
      <button
        type="button"
        className="sdtk-tab"
        aria-expanded={open}
        aria-controls="soundtrack-panel"
        onClick={() => {
          if (playing) setDismissedTrackId(open ? playing.id : null);
          else setManualOpen((value) => !value);
        }}
      >
        <IconVinyl
          size={16}
          className={playing ? "sdtk-tab-vinyl is-spinning" : "sdtk-tab-vinyl"}
        />
        <span className="sdtk-tab-label text-meta font-space-mono">
          {playing ? "On now" : "Soundtrack"}
        </span>
        <IconChevron size={12} direction={open ? "right" : "left"} />
      </button>

      <section
        id="soundtrack-panel"
        className="sdtk-panel"
        aria-labelledby="soundtrack-heading"
        aria-hidden={!open}
      >
        <div className="sdtk-head">
          <h2 id="soundtrack-heading" className="text-meta font-space-mono-bold text-ink">
            Soundtrack
          </h2>
          <SpotifyMark />
        </div>
        <span className="sr-only" aria-live="polite">
          {playing ? `Now playing ${playing.title} by ${playing.artist}` : ""}
        </span>

        {playing ? (
          <article className="sdtk-now">
            <div className="sdtk-art-wrap">
              {playing.art && (
                <img
                  className="sdtk-art"
                  src={playing.art}
                  alt={playing.album ? `${playing.album} cover art` : "Album cover art"}
                  width={240}
                  height={240}
                  loading="lazy"
                  decoding="async"
                />
              )}
              <IconVinyl size={28} className="sdtk-vinyl-sticker is-spinning" aria-hidden="true" />
            </div>
            <p className="sdtk-state text-meta font-space-mono text-accent">
              <Equalizer /> On now
            </p>
            <h3 className="sdtk-title">
              <TrackLink track={playing} />
            </h3>
            <p className="sdtk-artist text-small text-ink">{playing.artist}</p>
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

        {feed && feed.recent.length > 0 && (
          <>
            <p className="sdtk-divider text-meta font-space-mono text-ink-muted">Earlier</p>
            <ol className="sdtk-list">
              {feed.recent.map((track, index) => (
                <li key={`${track.id}-${track.playedAt ?? index}`} className="sdtk-row">
                  <span className="sdtk-index text-meta font-space-mono text-ink-muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="sdtk-row-body">
                    <span className="sdtk-row-title">
                      <TrackLink track={track} />
                    </span>
                    <span className="sdtk-row-meta text-meta font-space-mono text-ink-muted">
                      {track.artist}
                      {track.playedAt ? ` · ${formatPlayedAt(track.playedAt)}` : ""}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </>
        )}
      </section>
    </div>
  );
}

function TrackLink({ track }: { track: Pick<Track, "title" | "url"> }) {
  if (!track.url) return <>{track.title}</>;
  return (
    <a href={track.url} className="no-underline title-link" rel="noreferrer noopener" target="_blank">
      {track.title}
    </a>
  );
}

function Equalizer() {
  return (
    <span className="sdtk-eq" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

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
