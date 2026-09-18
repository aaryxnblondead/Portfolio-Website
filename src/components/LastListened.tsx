"use client";

import { useEffect, useState } from "react";
import { fetchSpotifyFeed, joinArtists, type SpotifyFeed, type SpotifyTrack } from "@/lib/spotify";

export function LastListened() {
  const [track, setTrack] = useState<SpotifyTrack | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetchSpotifyFeed(controller.signal)
      .then((feed: SpotifyFeed) => setTrack(feed.nowPlaying ?? feed.recent[0] ?? null))
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  if (!track) return null;

  return (
    <div className="last-listened">
      <div className="last-listened-art-wrap">
        {track.art && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="last-listened-art" src={track.art} alt={`${track.name} cover art`} width={112} height={112} loading="lazy" decoding="async" />
        )}
        <span className="last-listened-vinyl" aria-hidden="true" />
      </div>
      <div className="last-listened-copy">
        <span className="neo-index">LAST LISTENED TO</span>
        <a href={track.url ?? "https://open.spotify.com"} target="_blank" rel="noreferrer noopener" className="last-listened-title">{track.name}</a>
        <span className="last-listened-meta">{joinArtists(track.artists)}{track.album ? ` · ${track.album}` : ""}</span>
      </div>
    </div>
  );
}