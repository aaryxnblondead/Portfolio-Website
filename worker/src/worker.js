/**
 * Spotify feed worker.
 *
 * Fixes the three things that usually break this on Vercel:
 *   1. OPTIONS preflight was never answered, so the browser blocked the GET.
 *   2. ALLOWED_ORIGINS did not include the Vercel preview domains, which
 *      change on every single deploy (*.vercel.app with a new hash).
 *   3. A failure returned an opaque 500, so the client had nothing to show
 *      and silently rendered nothing.
 *
 * GET  /            -> { nowPlaying, recent[] }
 * GET  /?debug=1    -> same, plus a diagnostics block (no secrets)
 *
 * wrangler.toml:
 *   [vars]
 *   SPOTIFY_CLIENT_ID = "…"
 *   ALLOWED_ORIGINS   = "https://aaryansingh.com,https://portfolio-website.vercel.app,http://localhost:3000"
 *   ALLOW_VERCEL_PREVIEWS = "true"
 *
 * Secrets (npx wrangler secret put …):
 *   SPOTIFY_CLIENT_SECRET
 *   SPOTIFY_REFRESH_TOKEN
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

function retryAfterSeconds(res, fallback = 30, cap = 300) {
  const parsed = parseInt(res.headers.get('Retry-After') || '', 10);
  if (Number.isFinite(parsed) && parsed > 0) return Math.min(parsed, cap);
  return fallback;
}

function allowedOrigin(request, env) {
  const origin = request.headers.get('Origin');
  if (!origin) return null;

  const list = (env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim().replace(/\/$/, ''))
    .filter(Boolean);

  if (list.includes(origin)) return origin;

  // Vercel gives every preview deploy a fresh hostname. Without this, the site
  // works in production and silently fails on every preview branch.
  if (env.ALLOW_VERCEL_PREVIEWS === 'true') {
    try {
      const { hostname, protocol } = new URL(origin);
      if (protocol === 'https:' && hostname.endsWith('.vercel.app')) return origin;
    } catch {
      /* malformed Origin — fall through */
    }
  }

  return null;
}

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin || 'null',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function json(body, { status = 200, origin, cache = 0 } = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': cache
        ? `public, max-age=${cache}, s-maxage=${cache}`
        : 'no-store',
      ...corsHeaders(origin),
    },
  });
}

async function accessToken(env) {
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

function trimTrack(t) {
  if (!t) return null;
  return {
    id: t.id,
    title: t.name,
    artist: (t.artists || []).map((a) => a.name).join(', '),
    album: t.album?.name ?? null,
    art: t.album?.images?.[1]?.url ?? t.album?.images?.[0]?.url ?? null,
    url: t.external_urls?.spotify ?? null,
    durationMs: t.duration_ms ?? null,
  };
}

async function feed(env) {
  if (Date.now() < rateLimitedUntil) {
    const retryAfter = Math.ceil((rateLimitedUntil - Date.now()) / 1000);
    throw Object.assign(new Error('Spotify is rate limiting feed requests.'), {
      status: 429,
      code: 'spotify_rate_limited',
      retryAfter,
    });
  }

  const callAll = (token) => {
    const auth = { Authorization: `Bearer ${token}` };
    return Promise.all([
      fetch(NOW_URL, { headers: auth }),
      fetch(RECENT_URL, { headers: auth }),
    ]);
  };

  let [nowRes, recentRes] = await callAll(await accessToken(env));

  if (nowRes.status === 401 || recentRes.status === 401) {
    // Token died early (password or scope change). One clean retry, then the
    // failure below surfaces instead of looping.
    tokenCache = null;
    [nowRes, recentRes] = await callAll(await accessToken(env));
  }

  const limited = [nowRes, recentRes].find((r) => r.status === 429);
  if (limited) {
    const retryAfter = retryAfterSeconds(limited);
    rateLimitedUntil = Date.now() + retryAfter * 1000;
    throw Object.assign(new Error('Spotify is rate limiting feed requests.'), {
      status: 429,
      code: 'spotify_rate_limited',
      retryAfter,
    });
  }

  let nowPlaying = null;
  // 204 means nothing is playing. That is a normal state, not an error.
  if (nowRes.status === 200) {
    const d = await nowRes.json();
    if (d && d.item) {
      nowPlaying = {
        ...trimTrack(d.item),
        isPlaying: Boolean(d.is_playing),
        progressMs: d.progress_ms ?? null,
      };
    }
  } else if (nowRes.status !== 204 && nowRes.status !== 404) {
    throw Object.assign(new Error(`currently-playing returned ${nowRes.status}`), {
      status: 502,
      code: 'spotify_now',
    });
  }

  let recent = [];
  if (recentRes.ok) {
    const d = await recentRes.json();
    recent = (d.items || []).map((i) => ({
      ...trimTrack(i.track),
      playedAt: i.played_at,
    }));
  } else {
    throw Object.assign(new Error(`recently-played returned ${recentRes.status}`), {
      status: 502,
      code: 'spotify_recent',
    });
  }

  return { nowPlaying, recent, fetchedAt: new Date().toISOString() };
}

export default {
  async fetch(request, env, ctx) {
    const origin = allowedOrigin(request, env);
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      // Preflight. Must succeed even when the origin is rejected, otherwise the
      // browser reports a generic network error instead of a CORS message.
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method !== 'GET') {
      return json({ error: 'method_not_allowed' }, { status: 405, origin });
    }

    // A request with an Origin header that is not on the list gets a clear 403
    // rather than a response the browser will quietly discard.
    if (request.headers.get('Origin') && !origin) {
      return json(
        {
          error: 'origin_not_allowed',
          message:
            'Add this origin to ALLOWED_ORIGINS in worker/wrangler.toml and redeploy the worker.',
          origin: request.headers.get('Origin'),
        },
        { status: 403 },
      );
    }

    try {
      const data = await feed(env);

      if (url.searchParams.get('debug') === '1') {
        data.debug = {
          hasClientId: Boolean(env.SPOTIFY_CLIENT_ID),
          hasClientSecret: Boolean(env.SPOTIFY_CLIENT_SECRET),
          hasRefreshToken: Boolean(env.SPOTIFY_REFRESH_TOKEN),
          allowedOrigins: (env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()),
          allowVercelPreviews: env.ALLOW_VERCEL_PREVIEWS === 'true',
          requestOrigin: request.headers.get('Origin'),
          resolvedOrigin: origin,
        };
      }

      // 30s of edge cache keeps you well inside Spotify's rate limit.
      return json(data, { origin, cache: 30 });
    } catch (err) {
      const res = json(
        { error: err.code || 'unknown', message: err.message },
        { status: err.status || 500, origin },
      );
      if (err.retryAfter) res.headers.set('Retry-After', String(err.retryAfter));
      return res;
    }
  },
};
