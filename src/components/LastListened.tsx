"use client";

import { useEffect, useState } from "react";
import { fetchSpotifyFeed, joinArtists, type SpotifyFeed, type SpotifyTrack } from "@/lib/spotify";

export function LastListened() {
  const [track, setTrack] = useState<SpotifyTrack | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetchSpotifyFeed(controller.signal)
      .then((feed: SpotifyFeed) => setTrack(feed.nowPlaying ?? feed.recent[0] ?? null))
      .catch(() => undefined)
      .finally(() => setLoaded(true));
    return () => controller.abort();
  }, []);

  if (!loaded) return <div className="last-listened last-listened-loading" aria-hidden="true" />;
  if (!track) return null;

  const artwork = track.art ?? track.artSmall;

  return (
    <div className="last-listened" aria-label={`Last listened to ${track.name} by ${joinArtists(track.artists)}`}>
      <div className="last-listened-art-wrap">
        {artwork ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="last-listened-art" src={artwork} alt={`${track.name} cover art`} width={96} height={96} loading="lazy" decoding="async" />
        ) : (
          <span className="last-listened-art last-listened-art-empty" aria-hidden="true" />
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