#!/usr/bin/env node
/**
 * One-time authorization. Run this once, paste the refresh token into your
 * worker secrets, and you are done — the worker renews access tokens by itself
 * from then on.
 *
 * Authorization Code flow (not PKCE): the refresh token it returns does not
 * rotate, which is exactly what a stateless worker needs. The client secret
 * never leaves your machine or the worker.
 *
 * Setup in the Spotify dashboard (https://developer.spotify.com/dashboard):
 *   Redirect URI: http://127.0.0.1:8888/callback
 *   (Loopback HTTP is the one non-HTTPS URI Spotify still accepts. Not localhost.)
 *
 * Usage:
 *   SPOTIFY_CLIENT_ID=xxx SPOTIFY_CLIENT_SECRET=yyy node scripts/spotify-refresh-token.mjs
 */

import http from "node:http";
import crypto from "node:crypto";
import { URL, URLSearchParams } from "node:url";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const PORT = 8888;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`;

// Only what the panel actually renders. Nothing speculative.
const SCOPES = ["user-read-currently-playing", "user-read-recently-played"];

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET first.");
  process.exit(1);
}

const state = crypto.randomBytes(16).toString("hex");

const authorizeUrl =
  "https://accounts.spotify.com/authorize?" +
  new URLSearchParams({
    response_type: "code",
    client_id: CLIENT_ID,
    scope: SCOPES.join(" "),
    redirect_uri: REDIRECT_URI,
    state,
  });

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
  if (url.pathname !== "/callback") {
    res.writeHead(404).end();
    return;
  }

  const error = url.searchParams.get("error");
  if (error) {
    finish(res, `Authorization failed: ${error}`);
    console.error(`\nSpotify returned: ${error}`);
    server.close();
    process.exit(1);
  }

  if (url.searchParams.get("state") !== state) {
    finish(res, "State mismatch. Nothing was exchanged.");
    console.error("\nState mismatch — possible CSRF. Aborting.");
    server.close();
    process.exit(1);
  }

  const code = url.searchParams.get("code");

  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });

  const body = await tokenRes.json();

  if (!tokenRes.ok) {
    finish(res, "Token exchange failed. Check the terminal.");
    console.error("\nToken exchange failed:", body);
    server.close();
    process.exit(1);
  }

  finish(res, "Done. You can close this tab.");

  console.log("\n  Refresh token:\n");
  console.log("    " + body.refresh_token + "\n");
  console.log("  Store it (do not commit it):\n");
  console.log("    cd worker && npx wrangler secret put SPOTIFY_REFRESH_TOKEN\n");
  console.log(`  Scopes granted: ${body.scope}\n`);

  server.close();
  process.exit(0);
});

function finish(res, message) {
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(
    `<!doctype html><meta charset="utf-8"><title>Spotify</title>` +
      `<body style="font:16px/1.5 ui-monospace,Menlo,monospace;background:#F2EEE6;color:#171412;padding:48px">` +
      `<p>${message}</p></body>`
  );
}

server.listen(PORT, "127.0.0.1", () => {
  console.log("\n  Open this URL and approve access:\n");
  console.log("    " + authorizeUrl + "\n");
});
