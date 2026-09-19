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

export function useSpotifyFeed(pollMs = 45_000): FeedState {
  const [state, setState] = useState<FeedState>(
    FEED_URL ? { status: 'loading' } : { status: 'unconfigured' },
  );
  const abort = useRef<AbortController | null>(null);
  // Set from the worker's Retry-After header. While it holds, polls are
  // skipped entirely so a throttle is waited out, not extended.
  const coolUntil = useRef(0);

  useEffect(() => {
    if (!FEED_URL) {
      // Loud in dev, silent in production — but never a blank panel with no
      // explanation of why.
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          '[soundtrack] NEXT_PUBLIC_SPOTIFY_FEED_URL is undefined in this bundle. ' +
            'Set it in Vercel > Settings > Environment Variables for every environment ' +
            'you deploy, then trigger a NEW deploy — NEXT_PUBLIC_ vars are baked in at build time.',
        );
      }
      return;
    }

    let cancelled = false;

    async function load() {
      if (Date.now() < coolUntil.current) return;
      abort.current?.abort();
      const controller = new AbortController();
      abort.current = controller;

      try {
        const res = await fetch(FEED_URL as string, {
          signal: controller.signal,
          cache: 'no-store',
          mode: 'cors',
        });

        const body = await res.json().catch(() => null);

        if (!res.ok) {
          if (res.status === 429) {
            const header = parseInt(res.headers.get('retry-after') || '', 10);
            const wait =
              Number.isFinite(header) && header > 0 ? Math.min(header, 300) : 60;
            coolUntil.current = Date.now() + wait * 1000;
          }
          const message =
            body?.message ||
            `Feed returned ${res.status}. ${
              res.status === 403
                ? 'The worker rejected this origin — add it to ALLOWED_ORIGINS.'
                : 'Check the worker logs with `npx wrangler tail`.'
            }`;
          if (!cancelled) setState({ status: 'error', message });
          return;
        }

        if (!cancelled && body) setState({ status: 'ready', feed: body as Feed });
      } catch (err) {
        if (controller.signal.aborted || cancelled) return;
        setState({
          status: 'error',
          message:
            'Could not reach the feed. This is almost always CORS: open the ' +
            'Network tab and check the request to the worker, or hit the worker ' +
            'URL directly with ?debug=1.',
        });
      }
    }

    load();
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

/** For the progress line. */
export function formatDuration(ms: number | null): string {
  if (!ms && ms !== 0) return '—';
  const total = Math.round(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

/** "14 min ago", "3 hr ago", "yesterday" — matched to the site's mono meta voice. */
export function formatPlayedAt(iso: string | null): string {
  if (!iso) return '';
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return '';

  const minutes = Math.round((Date.now() - then) / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;

  const days = Math.round(hours / 24);
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;
  return new Date(then).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}
