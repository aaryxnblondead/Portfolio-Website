"use client";

import { useSpotifyFeed, type Track } from "@/lib/spotify";

export function LastListened() {
  const state = useSpotifyFeed();

  if (state.status === "loading") {
    return <div className="last-listened last-listened-loading" aria-hidden="true" />;
  }
  if (state.status !== "ready") return null;

  const track: Track | null =
    state.feed.nowPlaying ?? state.feed.recent[0] ?? null;
  if (!track) return null;

  return (
    <div className="last-listened" aria-label={`Last listened to ${track.title} by ${track.artist}`}>
      <div className="last-listened-art-wrap">
        {track.art ? (
          <img className="last-listened-art" src={track.art} alt={`${track.title} cover art`} width={96} height={96} loading="lazy" decoding="async" />
        ) : (
          <span className="last-listened-art last-listened-art-empty" aria-hidden="true" />
        )}
        <span className="last-listened-vinyl" aria-hidden="true" />
      </div>
      <div className="last-listened-copy">
        <span className="neo-index">LAST LISTENED TO</span>
        <a href={track.url ?? "https://open.spotify.com"} target="_blank" rel="noreferrer noopener" className="last-listened-title">{track.title}</a>
        <span className="last-listened-meta">{track.artist}{track.album ? ` · ${track.album}` : ""}</span>
      </div>
    </div>
  );
}
