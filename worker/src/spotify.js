/**
 * Everything that talks to Spotify: the token cache, the throttle guard, and
 * the two endpoints the panel reads. Failures are thrown as errors carrying a
 * `status` (what the client should get) and an optional `retryAfter` in
 * seconds, so the fetch handler stays a thin adapter.
 */

const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const NOW_URL = 'https://api.spotify.com/v1/me/player/currently-playing';
const RECENT_URL = 'https://api.spotify.com/v1/me/player/recently-played?limit=6';

/** In-isolate access token cache. Tokens live ~1h; without this every feed
    request pays a refresh round-trip and Spotify throttles the app (429). */
let tokenCache = null; // { value: string, expiresAt: number }
/** Set while Spotify answers 429, so requests fail fast instead of piling on
    and extending the throttle. Per-isolate, like the token cache. */
let rateLimitedUntil = 0;

export function retryAfterSeconds(res, fallback = 30, cap = 300) {
  const parsed = parseInt(res.headers.get('Retry-After') || '', 10);
  if (Number.isFinite(parsed) && parsed > 0) return Math.min(parsed, cap);
  return fallback;
}

function rateLimited(retryAfter = 0) {
  return Object.assign(new Error('Spotify is rate limiting feed requests.'), {
    status: 429,
    code: 'spotify_rate_limited',
    retryAfter,
  });
}

export async function accessToken(env) {
  if (tokenCache && tokenCache.expiresAt > Date.now()) return tokenCache.value;

  const id = env.SPOTIFY_CLIENT_ID;
  const secret = env.SPOTIFY_CLIENT_SECRET;
  const refresh = env.SPOTIFY_REFRESH_TOKEN;

  const missing = [
    !id && 'SPOTIFY_CLIENT_ID',
    !secret && 'SPOTIFY_CLIENT_SECRET',
    !refresh && 'SPOTIFY_REFRESH_TOKEN',
  ].filter(Boolean);

  if (missing.length) {
    throw Object.assign(new Error(`Worker is missing: ${missing.join(', ')}`), {
      status: 500,
      code: 'worker_config',
    });
  }

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${btoa(`${id}:${secret}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refresh,
    }),
  });

  if (res.status === 429) {
    const retryAfter = retryAfterSeconds(res);
    rateLimitedUntil = Date.now() + retryAfter * 1000;
    throw Object.assign(new Error('Spotify is rate limiting token requests.'), {
      status: 429,
      code: 'spotify_rate_limited',
      retryAfter,
    });
  }

  if (!res.ok) {
    const detail = await res.text();
    throw Object.assign(
      new Error(`Spotify refused the refresh token (${res.status}). ${detail.slice(0, 200)}`),
      { status: 502, code: 'refresh_failed' },
    );
  }

  const data = await res.json();
  tokenCache = {
    value: data.access_token,
    expiresAt: Date.now() + (data.expires_in || 3600) * 1000 - 60_000,
  };
  return tokenCache.value;
}

/** Spotify returns images largest-first, so prefer the 300px pass when it exists. */
function imageUrl(album) {
  return album?.images?.[1]?.url ?? album?.images?.[0]?.url ?? null;
}

function artistNames(artists) {
  return (artists || []).map((a) => a.name).join(', ');
}

function trimTrack(t) {
  if (!t) return null;
  return {
    id: t.id,
    title: t.name,
    artist: artistNames(t.artists),
    album: t.album?.name ?? null,
    art: imageUrl(t.album),
    url: t.external_urls?.spotify ?? null,
    durationMs: t.duration_ms ?? null,
  };
}

function callBoth(token) {
  const auth = { Authorization: `Bearer ${token}` };
  return Promise.all([
    fetch(NOW_URL, { headers: auth }),
    fetch(RECENT_URL, { headers: auth }),
  ]);
}

async function readNowPlaying(res) {
  // 204 means nothing is playing, and 404 means no active device. Both are
  // normal states, not errors.
  if (res.status === 204 || res.status === 404) return null;
  if (res.status !== 200) {
    throw Object.assign(new Error(`currently-playing returned ${res.status}`), {
      status: 502,
      code: 'spotify_now',
    });
  }

  const d = await res.json();
  if (!d || !d.item) return null;

  return {
    ...trimTrack(d.item),
    isPlaying: Boolean(d.is_playing),
    progressMs: d.progress_ms ?? null,
  };
}

async function readRecent(res) {
  if (!res.ok) {
    throw Object.assign(new Error(`recently-played returned ${res.status}`), {
      status: 502,
      code: 'spotify_recent',
    });
  }

  const d = await res.json();
  return (d.items || []).map((i) => ({
    ...trimTrack(i.track),
    playedAt: i.played_at,
  }));
}

export async function feed(env) {
  if (Date.now() < rateLimitedUntil) {
    throw rateLimited(Math.ceil((rateLimitedUntil - Date.now()) / 1000));
  }

  let [nowRes, recentRes] = await callBoth(await accessToken(env));

  if (nowRes.status === 401 || recentRes.status === 401) {
    // Token died early (password or scope change). One clean retry, then the
    // failure below surfaces instead of looping.
    tokenCache = null;
    [nowRes, recentRes] = await callBoth(await accessToken(env));
  }

  const limited = [nowRes, recentRes].find((r) => r.status === 429);
  if (limited) {
    const retryAfter = retryAfterSeconds(limited);
    rateLimitedUntil = Date.now() + retryAfter * 1000;
    throw rateLimited(retryAfter);
  }

  return {
    nowPlaying: await readNowPlaying(nowRes),
    recent: await readRecent(recentRes),
    fetchedAt: new Date().toISOString(),
  };
}
