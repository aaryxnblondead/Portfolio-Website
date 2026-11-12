/**
 * The Spotify Authorization Code dance, isolated from the HTTP server that
 * drives it so the token exchange can be read (and tested) on its own.
 */

const TOKEN_URL = "https://accounts.spotify.com/api/token";
export const REDIRECT_PATH = "/callback";

export function authorizeUrl({ clientId, redirectUri, scopes, state }) {
  return (
    "https://accounts.spotify.com/authorize?" +
    new URLSearchParams({
      response_type: "code",
      client_id: clientId,
      scope: scopes.join(" "),
      redirect_uri: redirectUri,
      state,
    })
  );
}

/** Trade the one-time code for a long-lived refresh token. */
export async function exchangeCode({ clientId, clientSecret, code, redirectUri }) {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }),
  });

  const body = await res.json();
  return { ok: res.ok, body };
}

/** The one page this script ever serves. */
export function receipt(message) {
  return (
    `<!doctype html><meta charset="utf-8"><title>Spotify</title>` +
    `<body style="font:16px/1.5 ui-monospace,Menlo,monospace;background:#F2EEE6;color:#171412;padding:48px">` +
    `<p>${message}</p></body>`
  );
}
