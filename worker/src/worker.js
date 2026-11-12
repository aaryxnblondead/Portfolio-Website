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

import { allowedOrigin, corsHeaders, json } from './cors.js';
import { feed } from './spotify.js';

/** Diagnostics are booleans and origin decisions only — never a secret. */
function debugBlock(env, request, origin) {
  return {
    hasClientId: Boolean(env.SPOTIFY_CLIENT_ID),
    hasClientSecret: Boolean(env.SPOTIFY_CLIENT_SECRET),
    hasRefreshToken: Boolean(env.SPOTIFY_REFRESH_TOKEN),
    allowedOrigins: (env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()),
    allowVercelPreviews: env.ALLOW_VERCEL_PREVIEWS === 'true',
    requestOrigin: request.headers.get('Origin'),
    resolvedOrigin: origin,
  };
}

const worker = {
  async fetch(request, env) {
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
        data.debug = debugBlock(env, request, origin);
      }

      // 60s of edge cache keeps you well inside Spotify's rate limit.
      // Recently-played barely moves minute to minute, and the client's
      // progress line is extrapolated locally, so nothing visible goes stale.
      return json(data, { origin, cache: 60 });
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

export default worker;
