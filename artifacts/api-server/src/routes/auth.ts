import { Router } from "express";
import crypto from "crypto";

const router = Router();

interface StateEntry {
  verifier: string;
  expires: number;
}

const stateStore = new Map<string, StateEntry>();

function generateCodeVerifier(): string {
  return crypto.randomBytes(32).toString("base64url");
}

function generateCodeChallenge(verifier: string): string {
  return crypto.createHash("sha256").update(verifier).digest("base64url");
}

function generateState(): string {
  return crypto.randomBytes(16).toString("hex");
}

function getRedirectUri(req: Parameters<Parameters<typeof router.get>[1]>[0]): string {
  const host = (req.headers["x-forwarded-host"] as string) || req.headers.host || process.env["REPLIT_DEV_DOMAIN"];
  const proto = (req.headers["x-forwarded-proto"] as string) || "https";
  return `${proto}://${host}/api/auth/x/callback`;
}

function popupHtml(script: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="background:#0a0f1a;color:#fff;font-family:monospace;display:flex;align-items:center;justify-content:center;height:100vh;margin:0"><p>Closing...</p><script>${script}</script></body></html>`;
}

router.get("/auth/x/login", (req, res) => {
  const clientId = process.env["X_CLIENT_ID"];
  if (!clientId) {
    res.status(500).send("X OAuth not configured");
    return;
  }

  const verifier = generateCodeVerifier();
  const challenge = generateCodeChallenge(verifier);
  const state = generateState();

  stateStore.set(state, { verifier, expires: Date.now() + 10 * 60 * 1000 });

  // Clean up expired entries
  for (const [k, v] of stateStore) {
    if (v.expires < Date.now()) stateStore.delete(k);
  }

  const redirectUri = getRedirectUri(req);

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "users.read tweet.read",
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
  });

  res.redirect(`https://twitter.com/i/oauth2/authorize?${params}`);
});

router.get("/auth/x/callback", async (req, res) => {
  const { code, state, error } = req.query as Record<string, string>;

  const fail = (msg: string) => {
    res.send(popupHtml(`window.opener?.postMessage({type:"x-auth-error",error:${JSON.stringify(msg)}},"*");window.close();`));
  };

  if (error) { fail(error); return; }
  if (!code || !state) { fail("Missing code or state"); return; }

  const stored = stateStore.get(state);
  if (!stored || stored.expires < Date.now()) {
    stateStore.delete(state);
    fail("Session expired — please try again");
    return;
  }
  stateStore.delete(state);

  const clientId = process.env["X_CLIENT_ID"]!;
  const clientSecret = process.env["X_CLIENT_SECRET"]!;
  const redirectUri = getRedirectUri(req);

  try {
    const tokenRes = await fetch("https://api.twitter.com/2/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        code_verifier: stored.verifier,
      }),
    });

    if (!tokenRes.ok) {
      const txt = await tokenRes.text();
      fail(`Token exchange failed: ${txt}`);
      return;
    }

    const tokenData = (await tokenRes.json()) as { access_token?: string };
    const accessToken = tokenData.access_token;
    if (!accessToken) { fail("No access token returned"); return; }

    const userRes = await fetch(
      "https://api.twitter.com/2/users/me?user.fields=username,name,profile_image_url",
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    if (!userRes.ok) { fail("Failed to fetch X profile"); return; }

    const userData = (await userRes.json()) as { data?: { username?: string } };
    const username = userData.data?.username;
    if (!username) { fail("Could not read username from X"); return; }

    res.send(popupHtml(`window.opener?.postMessage({type:"x-auth-success",username:${JSON.stringify(username)}},"*");window.close();`));
  } catch {
    fail("Authentication failed — please try again");
  }
});

export default router;
