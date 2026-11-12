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
import { URL } from "node:url";
import { authorizeUrl, exchangeCode, receipt, REDIRECT_PATH } from "./spotify-auth.mjs";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const PORT = 8888;
const REDIRECT_URI = `http://127.0.0.1:${PORT}${REDIRECT_PATH}`;

// Only what the panel actually renders. Nothing speculative.
const SCOPES = ["user-read-currently-playing", "user-read-recently-played"];

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET first.");
  process.exit(1);
}

const state = crypto.randomBytes(16).toString("hex");
const consentUrl = authorizeUrl({ clientId: CLIENT_ID, redirectUri: REDIRECT_URI, scopes: SCOPES, state });

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
  if (url.pathname !== REDIRECT_PATH) {
    res.writeHead(404).end();
    return;
  }

  const error = url.searchParams.get("error");
  if (error) {
    respond(res, `Authorization failed: ${error}`);
    console.error(`\nSpotify returned: ${error}`);
    shutdown(1);
  }

  if (url.searchParams.get("state") !== state) {
    respond(res, "State mismatch. Nothing was exchanged.");
    console.error("\nState mismatch — possible CSRF. Aborting.");
    shutdown(1);
  }

  const { ok, body } = await exchangeCode({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    code: url.searchParams.get("code"),
    redirectUri: REDIRECT_URI,
  });

  if (!ok) {
    respond(res, "Token exchange failed. Check the terminal.");
    console.error("\nToken exchange failed:", body);
    shutdown(1);
  }

  respond(res, "Done. You can close this tab.");

  console.log("\n  Refresh token:\n");
  console.log("    " + body.refresh_token + "\n");
  console.log("  Store it (do not commit it):\n");
  console.log("    cd worker && npx wrangler secret put SPOTIFY_REFRESH_TOKEN\n");
  console.log(`  Scopes granted: ${body.scope}\n`);

  shutdown(0);
});

function respond(res, message) {
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(receipt(message));
}

function shutdown(code) {
  server.close();
  process.exit(code);
}

server.listen(PORT, "127.0.0.1", () => {
  console.log("\n  Open this URL and approve access:\n");
  console.log("    " + consentUrl + "\n");
});
