'use client';

import { useEffect, useRef, useState } from 'react';

export type Track = {
  id: string;
  title: string;
  artist: string;
  album: string | null;
  art: string | null;
  url: string | null;
  durationMs: number | null;
};

export type NowPlaying = Track & { isPlaying: boolean; progressMs: number | null };
export type RecentTrack = Track & { playedAt: string };

export type Feed = {
  nowPlaying: NowPlaying | null;
  recent: RecentTrack[];
  fetchedAt: string;
};

/**
 * NEXT_PUBLIC_* is inlined by the compiler at build time. It must be read as a
 * full static member expression — `process.env[key]` or destructuring returns
 * undefined in the browser bundle, which is a very common way this breaks.
 */
const FEED_URL = process.env.NEXT_PUBLIC_SPOTIFY_FEED_URL;

export type FeedState =
  | { status: 'loading' }
  | { status: 'unconfigured' }
  | { status: 'error'; message: string }
  | { status: 'ready'; feed: Feed };

/** A failed request: a message worth showing, plus how long to stop asking. */
class FeedError extends Error {
  retryAfterMs: number;

  constructor(message: string, retryAfterMs = 0) {
    super(message);
    this.retryAfterMs = retryAfterMs;
  }
}

const DEFAULT_COOL_MS = 60_000;
const MAX_COOL_MS = 300_000;

const UNREACHABLE =
  'Could not reach the feed. This is almost always CORS: open the ' +
  'Network tab and check the request to the worker, or hit the worker ' +
  'URL directly with ?debug=1.';

/** Honor the worker's Retry-After, capped so a bad header cannot mute the panel. */
function coolDownMs(res: Response): number {
  const header = parseInt(res.headers.get('retry-after') || '', 10);
  const seconds = Number.isFinite(header) && header > 0 ? header : DEFAULT_COOL_MS / 1000;
  return Math.min(seconds * 1000, MAX_COOL_MS);
}

function failureMessage(body: { message?: string } | null, status: number): string {
  if (body?.message) return body.message;
  return status === 403
    ? 'Feed returned 403. The worker rejected this origin — add it to ALLOWED_ORIGINS.'
    : `Feed returned ${status}. Check the worker logs with \`npx wrangler tail\`.`;
}

/**
 * One GET against the worker. Returns null for a 2xx with an unparseable body,
 * which the caller treats as "no news" rather than an error.
 */
async function requestFeed(url: string, signal: AbortSignal): Promise<Feed | null> {
  const res = await fetch(url, { signal, cache: 'no-store', mode: 'cors' });
  const body = await res.json().catch(() => null);

  if (!res.ok) {
    const retryAfterMs = res.status === 429 ? coolDownMs(res) : 0;
    throw new FeedError(failureMessage(body, res.status), retryAfterMs);
  }

  return (body as Feed) ?? null;
}

function warnUnconfigured() {
  if (process.env.NODE_ENV === 'production') return;
  console.warn(
    '[soundtrack] NEXT_PUBLIC_SPOTIFY_FEED_URL is undefined in this bundle. ' +
      'Set it in Vercel > Settings > Environment Variables for every environment ' +
      'you deploy, then trigger a NEW deploy — NEXT_PUBLIC_ vars are baked in at build time.',
  );
}

/**
 * Poll interval in ms. Pass 0 for a single fetch with no polling and no
 * visibility refresh — for widgets like LastListened that show a moment,
 * not a live state. Every poller is Spotify quota spent, so only the
 * now-playing dock should poll.
 */
export function useSpotifyFeed(pollMs = 60_000): FeedState {
  const [state, setState] = useState<FeedState>(
    FEED_URL ? { status: 'loading' } : { status: 'unconfigured' },
  );
  const abort = useRef<AbortController | null>(null);
  // Set from the worker's Retry-After header. While it holds, polls are
  // skipped entirely so a throttle is waited out, not extended.
  const coolUntil = useRef(0);

  useEffect(() => {
    if (!FEED_URL) {
      warnUnconfigured();
      return;
    }

    let cancelled = false;

    async function load() {
      if (Date.now() < coolUntil.current) return;
      abort.current?.abort();
      const controller = new AbortController();
      abort.current = controller;

      try {
        const feed = await requestFeed(FEED_URL as string, controller.signal);
        if (!cancelled && feed) setState({ status: 'ready', feed });
      } catch (err) {
        if (controller.signal.aborted || cancelled) return;
        const failure = err instanceof FeedError ? err : new FeedError(UNREACHABLE);
        coolUntil.current = Date.now() + failure.retryAfterMs;
        setState({ status: 'error', message: failure.message });
      }
    }

    load();

    // One-shot mode: fetch once, no interval, no visibility listener.
    if (pollMs <= 0) {
      return () => {
        cancelled = true;
        abort.current?.abort();
      };
    }

    const id = window.setInterval(load, pollMs);

    // Refresh when the tab comes back rather than polling a hidden tab.
    const onVisible = () => {
      if (document.visibilityState === 'visible') load();
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      cancelled = true;
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', onVisible);
      abort.current?.abort();
    };
  }, [pollMs]);

  return state;
}
