/**
 * Origin policy and response shaping. Kept apart from the Spotify calls so the
 * CORS rules can be read without reading any feed logic.
 */

export function allowedOrigin(request, env) {
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

export function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin || 'null',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

export function json(body, { status = 200, origin, cache = 0 } = {}) {
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
