"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Feed, NowPlaying, RecentTrack, Track } from "@/lib/spotify";
import { useSpotifyFeed } from "@/lib/spotify";
import { formatDuration, formatPlayedAt } from "@/lib/track-format";
import { IconChevron, IconVinyl } from "@/components/Icons";

/**
 * The dock's tab plus its panel. Both open and error states share this shell,
 * so the ARIA wiring and the heading exist in exactly one place.
 */
function Dock({
  open,
  spinning,
  onToggle,
  children,
}: {
  open: boolean;
  /** Marks the tab as "On now" and sets the record turning. */
  spinning: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className={`sdtk-dock${open ? " is-open" : ""}`}>
      <button
        type="button"
        className="sdtk-tab"
        aria-expanded={open}
        aria-controls="soundtrack-panel"
        onClick={onToggle}
      >
        <IconVinyl size={16} className={spinning ? "sdtk-tab-vinyl is-spinning" : "sdtk-tab-vinyl"} />
        <span className="sdtk-tab-label text-meta font-space-mono">
          {spinning ? "On now" : "Soundtrack"}
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
        {children}
      </section>
    </div>
  );
}

/**
 * Open/closed ownership. A live track opens the dock by itself and can be
 * dismissed until the track changes; with nothing playing the reader owns it.
 */
function useDockOpen(playing: NowPlaying | null) {
  const [manualOpen, setManualOpen] = useState(false);
  const [dismissedTrackId, setDismissedTrackId] = useState<string | null>(null);

  const isDismissed = playing !== null && dismissedTrackId === playing.id;
  const open = playing ? !isDismissed : manualOpen;

  function toggle() {
    if (!playing) {
      setManualOpen((value) => !value);
      return;
    }
    setDismissedTrackId(open ? playing.id : null);
  }

  return { open, toggle };
}

/**
 * Elapsed time, extrapolated locally between polls. The worker only reports a
 * progress snapshot, so without this the bar would jump once a minute.
 */
function useElapsed(track: NowPlaying | null): number {
  const anchor = useRef<{ progressMs: number; at: number } | null>(null);
  const [, setTick] = useState(0);

  useEffect(() => {
    anchor.current =
      track?.progressMs != null ? { progressMs: track.progressMs, at: Date.now() } : null;
  }, [track?.id, track?.progressMs]);

  useEffect(() => {
    if (!track) return;
    const id = setInterval(() => setTick((value) => value + 1), 1000);
    return () => clearInterval(id);
  }, [track]);

  if (!track || !anchor.current) return track?.progressMs ?? 0;

  const elapsed = anchor.current.progressMs + (Date.now() - anchor.current.at);
  return Math.min(elapsed, track.durationMs ?? Number.MAX_SAFE_INTEGER);
}

function NowPlayingCard({ track, elapsed }: { track: NowPlaying; elapsed: number }) {
  const progress =
    track.durationMs && track.durationMs > 0
      ? Math.min(100, (elapsed / track.durationMs) * 100)
      : 0;

  return (
    <article className="sdtk-now">
      <div className="sdtk-art-wrap">
        {track.art && (
          <img
            className="sdtk-art"
            src={track.art}
            alt={track.album ? `${track.album} cover art` : "Album cover art"}
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
        <TrackLink track={track} />
      </h3>
      <p className="sdtk-artist text-small text-ink">{track.artist}</p>
      {track.album && (
        <p className="sdtk-album text-meta font-space-mono text-ink-muted">{track.album}</p>
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
        <span>{formatDuration(track.durationMs)}</span>
      </p>
    </article>
  );
}

function RecentList({ tracks }: { tracks: RecentTrack[] }) {
  return (
    <>
      <p className="sdtk-divider text-meta font-space-mono text-ink-muted">Earlier</p>
      <ol className="sdtk-list">
        {tracks.map((track, index) => (
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
  );
}

/** The panel body for a live feed: the current track, then what came before. */
function PanelBody({
  feed,
  playing,
  elapsed,
}: {
  feed: Feed | null;
  playing: NowPlaying | null;
  elapsed: number;
}) {
  const recent = feed?.recent ?? [];

  return (
    <>
      <span className="sr-only" aria-live="polite">
        {playing ? `Now playing ${playing.title} by ${playing.artist}` : ""}
      </span>

      {playing ? (
        <NowPlayingCard track={playing} elapsed={elapsed} />
      ) : (
        <p className="sdtk-note text-meta font-space-mono text-ink-muted">
          Nothing playing right now
        </p>
      )}

      {recent.length > 0 && <RecentList tracks={recent} />}
    </>
  );
}

/**
 * What the panel needs to know about the feed, derived once. The worker reports
 * the last touched item even when paused, so only a currently playing track
 * counts as "on now"; anything else falls through to the recent list.
 */
function useFeedView() {
  const state = useSpotifyFeed();
  const feed = state.status === "ready" ? state.feed : null;
  const playing = feed?.nowPlaying?.isPlaying ? feed.nowPlaying : null;
  return { state, feed, playing };
}

export function Soundtrack() {
  const { state, feed, playing } = useFeedView();
  const elapsed = useElapsed(playing);
  const { open, toggle } = useDockOpen(playing);

  if (state.status === "loading" || state.status === "unconfigured") return null;

  if (state.status === "error") {
    return (
      <Dock open={open} spinning={false} onToggle={toggle}>
        <p className="sdtk-note text-meta font-space-mono text-ink-muted">{state.message}</p>
      </Dock>
    );
  }

  const hasContent = playing !== null || (feed?.recent.length ?? 0) > 0;
  if (!hasContent) return null;

  return (
    <Dock open={open} spinning={playing !== null} onToggle={toggle}>
      <PanelBody feed={feed} playing={playing} elapsed={elapsed} />
    </Dock>
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
