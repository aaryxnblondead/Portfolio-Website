/**
 * Spotify feed worker.
 *
 * This is the "secure backend" half of the Authorization Code flow. The browser
 * never sees the client secret or any Spotify token — it only ever talks to this
 * worker, which returns a trimmed JSON payload.
 *
 * Auth model:
 *   - One-time: run `node scripts/spotify-refresh-token.mjs` locally to get a
 *     refresh token (Authorization Code flow, loopback redirect URI).
 *   - Forever after: this worker trades that refresh token for a 1-hour access
 *     token and keeps it in memory until it expires. No re-authorization needed
 *     unless the token is revoked.
 *
 * Endpoints:
 *   GET /            -> { nowPlaying, recent, fetchedAt }
 *   GET /health      -> { ok: true }
 *
 * Bindings (see wrangler.toml):
 *   SPOTIFY_CLIENT_ID      (var)
 *   SPOTIFY_CLIENT_SECRET  (secret)
 *   SPOTIFY_REFRESH_TOKEN  (secret)
 *   ALLOWED_ORIGINS        (var, comma separated)
 *   TOKENS                 (optional KV namespace — persists a rotated refresh token)
 */

const ACCOUNTS_TOKEN_URL = "https://accounts.spotify.com/api/token";
const API_BASE = "https://api.spotify.com/v1";
const REFRESH_TOKEN_KEY = "spotify:refresh_token";

/** In-isolate access token cache. Never persisted. */
let tokenCache = null; // { value: string, expiresAt: number }
/** Set when Spotify rate limits us, so we stop hammering across requests. */
let rateLimitedUntil = 0;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const cors = corsHeaders(request, env);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }
    if (request.method !== "GET") {
      return json({ error: { status: 405, message: "Use GET." } }, 405, cors);
    }
    if (url.pathname === "/health") {
      return json({ ok: true }, 200, cors);
    }

    try {
      const payload = await buildFeed(env, ctx);
      return json(payload, 200, {
        ...cors,
        // Short cache only. Spotify's Developer Terms allow caching for
        // immediate use; 30s is roughly one poll interval.
        "Cache-Control": "public, max-age=30, s-maxage=30",
      });
    } catch (err) {
      const status = err.status || 500;
      const headers = { ...cors, "Cache-Control": "no-store" };
      if (err.retryAfter) headers["Retry-After"] = String(err.retryAfter);
      return json(
        { error: { status, message: err.message || "Unexpected error.", code: err.code } },
        status,
        headers
      );
    }
  },
};

/* ------------------------------------------------------------------ feed */

async function buildFeed(env, ctx) {
  const token = await getAccessToken(env, ctx);

  const [playing, recent] = await Promise.all([
    spotifyGet("/me/player/currently-playing", token, env, ctx),
    spotifyGet("/me/player/recently-played?limit=12", token, env, ctx),
  ]);

  return {
    nowPlaying: normalizeNowPlaying(playing),
    recent: normalizeRecent(recent),
    fetchedAt: new Date().toISOString(),
  };
}

/**
 * Music only. `currently-playing` defaults to the track type, but when a podcast
 * is playing it still answers 200 with currently_playing_type: "episode" and a
 * null (or episode-shaped) item, so check the type explicitly rather than
 * trusting `item` to be a track.
 */
function normalizeNowPlaying(data) {
  if (!data) return null; // 204 No Content — nothing playing
  if (data.currently_playing_type !== "track") return null; // podcast / ad / unknown
  if (!data.is_playing) return null;
  const item = data.item;
  if (!item || item.type !== "track") return null;
  if (data.device && data.device.is_private_session) return null; // respect private sessions

  return {
    ...normalizeTrack(item),
    progressMs: typeof data.progress_ms === "number" ? data.progress_ms : null,
  };
}

/**
 * `recently-played` does not include podcast episodes at all, but the type guard
 * stays in so a future change to that endpoint can't leak one into the list.
 */
function normalizeRecent(data) {
  const items = (data && data.items) || [];
  const out = [];
  let lastId = null;

  for (const entry of items) {
    const track = entry && entry.track;
    if (!track || track.type !== "track") continue;
    if (track.id && track.id === lastId) continue; // collapse repeat plays
    lastId = track.id;
    out.push({ ...normalizeTrack(track), playedAt: entry.played_at || null });
    if (out.length === 6) break;
  }
  return out;
}

function normalizeTrack(track) {
  const images = (track.album && track.album.images) || [];
  return {
    id: track.id,
    name: track.name,
    artists: (track.artists || []).map((a) => a.name),
    album: track.album ? track.album.name : null,
    // Spotify's design guidelines require cover art to be shown unmodified.
    art: pickImage(images, 300),
    artSmall: pickImage(images, 64),
    durationMs: track.duration_ms ?? null,
    url: (track.external_urls && track.external_urls.spotify) || null,
  };
}

function pickImage(images, target) {
  if (!images.length) return null;
  const sorted = [...images].sort((a, b) => (a.width || 0) - (b.width || 0));
  const match = sorted.find((img) => (img.width || 0) >= target);
  return (match || sorted[sorted.length - 1]).url;
}

/* ----------------------------------------------------------------- token */

async function getAccessToken(env, ctx) {
  if (tokenCache && tokenCache.expiresAt > Date.now() + 60_000) {
    return tokenCache.value;
  }

  const refreshToken = (await readStoredRefreshToken(env)) || env.SPOTIFY_REFRESH_TOKEN;
  if (!refreshToken) {
    throw httpError(500, "No refresh token configured. Run scripts/spotify-refresh-token.mjs.");
  }
  if (!env.SPOTIFY_CLIENT_ID || !env.SPOTIFY_CLIENT_SECRET) {
    throw httpError(500, "SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET are not set.");
  }

  const res = await fetch(ACCOUNTS_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`),
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    // invalid_grant means the user revoked access or the token was invalidated.
    // Nothing automatic can fix this: the owner has to authorize again.
    if (res.status === 400 && body.error === "invalid_grant") {
      throw httpError(
        503,
        "Spotify authorization has expired. Re-run scripts/spotify-refresh-token.mjs and update the SPOTIFY_REFRESH_TOKEN secret.",
        { code: "reauthorize_required" }
      );
    }
    if (res.status === 429) {
      const retryAfter = retryAfterSeconds(res);
      rateLimitedUntil = Date.now() + retryAfter * 1000;
      throw httpError(429, "Spotify is rate limiting token requests.", { retryAfter });
    }
    throw httpError(
      502,
      body.error_description || body.error || `Token refresh failed (${res.status}).`
    );
  }

  // Spotify may hand back a new refresh token. If a KV namespace is bound we
  // persist it, which also makes this worker safe to use with PKCE (where the
  // refresh token rotates on every single use).
  if (body.refresh_token && body.refresh_token !== refreshToken) {
    const write = storeRefreshToken(env, body.refresh_token);
    if (ctx && ctx.waitUntil) ctx.waitUntil(write);
    else await write;
  }

  tokenCache = {
    value: body.access_token,
    expiresAt: Date.now() + (body.expires_in || 3600) * 1000,
  };
  return tokenCache.value;
}

async function readStoredRefreshToken(env) {
  if (!env.TOKENS) return null;
  try {
    return await env.TOKENS.get(REFRESH_TOKEN_KEY);
  } catch {
    return null;
  }
}

async function storeRefreshToken(env, value) {
  if (!env.TOKENS) return;
  try {
    await env.TOKENS.put(REFRESH_TOKEN_KEY, value);
  } catch {
    /* non-fatal: the env var still works until the next rotation */
  }
}

/* ------------------------------------------------------------- api calls */

async function spotifyGet(path, token, env, ctx, attempt = 0) {
  if (Date.now() < rateLimitedUntil) {
    const retryAfter = Math.ceil((rateLimitedUntil - Date.now()) / 1000);
    throw httpError(429, "Rate limited by Spotify. Try again shortly.", { retryAfter });
  }

  const res = await fetch(API_BASE + path, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 204) return null; // documented "nothing playing"
  if (res.ok) return res.json().catch(() => null);

  if (res.status === 401 && attempt === 0) {
    // Token died early (password change, scope change). One clean retry.
    tokenCache = null;
    const fresh = await getAccessToken(env, ctx);
    return spotifyGet(path, fresh, env, ctx, attempt + 1);
  }

  if (res.status === 429) {
    const retryAfter = retryAfterSeconds(res);
    rateLimitedUntil = Date.now() + retryAfter * 1000;

    // Respect Retry-After. Only wait it out in-process if it is short;
    // otherwise hand the wait back to the caller instead of blocking.
    if (retryAfter <= 3 && attempt < 2) {
      const backoff = Math.max(retryAfter * 1000, 2 ** attempt * 1000);
      await sleep(backoff);
      rateLimitedUntil = 0;
      return spotifyGet(path, token, env, ctx, attempt + 1);
    }
    throw httpError(429, "Rate limited by Spotify.", { retryAfter });
  }

  const body = await res.json().catch(() => ({}));
  const message = (body.error && body.error.message) || `Spotify request failed (${res.status}).`;

  switch (res.status) {
    case 403:
      throw httpError(403, `Spotify refused the request: ${message}`);
    case 404:
      throw httpError(404, `Spotify endpoint not found: ${message}`);
    case 400:
      throw httpError(400, `Bad request to Spotify: ${message}`);
    default:
      if (res.status >= 500 && attempt < 2) {
        await sleep(2 ** attempt * 500);
        return spotifyGet(path, token, env, ctx, attempt + 1);
      }
      throw httpError(502, message);
  }
}

function retryAfterSeconds(res) {
  const header = res.headers.get("Retry-After");
  const parsed = header ? parseInt(header, 10) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, 3600) : 5;
}

/* --------------------------------------------------------------- helpers */

function corsHeaders(request, env) {
  const allowed = (env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const origin = request.headers.get("Origin") || "";
  const headers = {
    Vary: "Origin",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Max-Age": "86400",
  };
  if (allowed.includes(origin)) headers["Access-Control-Allow-Origin"] = origin;
  else if (allowed.length) headers["Access-Control-Allow-Origin"] = allowed[0];
  return headers;
}

function json(data, status, headers) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...headers },
  });
}

function httpError(status, message, extra = {}) {
  return Object.assign(new Error(message), { status, ...extra });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
