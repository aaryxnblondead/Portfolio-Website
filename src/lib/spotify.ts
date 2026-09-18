/**
 * Talks to the worker, never to Spotify directly. No tokens exist in the
 * browser, so there is nothing here to store, refresh, or leak.
 */

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: string[];
  album: string | null;
  art: string | null;
  artSmall: string | null;
  durationMs: number | null;
  url: string | null;
}

export interface NowPlayingTrack extends SpotifyTrack {
  progressMs: number | null;
}

export interface RecentTrack extends SpotifyTrack {
  playedAt: string | null;
}

export interface SpotifyFeed {
  nowPlaying: NowPlayingTrack | null;
  recent: RecentTrack[];
  fetchedAt: string;
}

export class SpotifyFeedError extends Error {
  status: number;
  code?: string;
  retryAfter?: number;

  constructor(message: string, status: number, code?: string, retryAfter?: number) {
    super(message);
    this.name = "SpotifyFeedError";
    this.status = status;
    this.code = code;
    this.retryAfter = retryAfter;
  }
}

const FEED_URL = process.env.NEXT_PUBLIC_SPOTIFY_FEED_URL ?? "";

/** Poll cadences, in ms. Slower when nothing is playing; paused when hidden. */
export const POLL_PLAYING = 30_000;
export const POLL_IDLE = 90_000;

export async function fetchSpotifyFeed(signal?: AbortSignal): Promise<SpotifyFeed> {
  if (!FEED_URL) {
    throw new SpotifyFeedError("NEXT_PUBLIC_SPOTIFY_FEED_URL is not set.", 500);
  }
  return request(FEED_URL, signal, 0);
}

async function request(url: string, signal: AbortSignal | undefined, attempt: number): Promise<SpotifyFeed> {
  const res = await fetch(url, { signal, headers: { Accept: "application/json" } });

  if (res.ok) {
    return (await res.json()) as SpotifyFeed;
  }

  const body = await res.json().catch(() => ({} as { error?: { message?: string; code?: string } }));
  const message = body?.error?.message ?? `Feed request failed (${res.status}).`;
  const code = body?.error?.code;
  const retryAfter = parseRetryAfter(res.headers.get("Retry-After"));

  // Respect Retry-After, back off exponentially, and give up rather than loop.
  const transient = res.status === 429 || res.status >= 500;
  if (transient && attempt < 2) {
    const wait = retryAfter ? retryAfter * 1000 : 2 ** attempt * 1000 + Math.random() * 400;
    if (wait <= 15_000) {
      await sleep(wait, signal);
      return request(url, signal, attempt + 1);
    }
  }

  throw new SpotifyFeedError(message, res.status, code, retryAfter);
}

function parseRetryAfter(header: string | null): number | undefined {
  if (!header) return undefined;
  const seconds = parseInt(header, 10);
  return Number.isFinite(seconds) && seconds > 0 ? seconds : undefined;
}

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true }
    );
  });
}

/* ------------------------------------------------------------ formatting */

export function formatDuration(ms: number | null | undefined): string {
  if (ms == null || ms < 0) return "--:--";
  const total = Math.floor(ms / 1000);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

/** "14 min ago", "3 hr ago", "yesterday" — matched to the site's mono meta voice. */
export function formatPlayedAt(iso: string | null): string {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return "";

  const minutes = Math.round((Date.now() - then) / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;

  const days = Math.round(hours / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(then).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function joinArtists(artists: string[]): string {
  if (artists.length <= 2) return artists.join(" & ");
  return `${artists.slice(0, -1).join(", ")} & ${artists[artists.length - 1]}`;
}
