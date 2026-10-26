type QfToken = {
  access_token: string;
  expires_in: number;
};

let cachedToken: string | null = null;
let tokenExpiresAt = 0;
let inflightToken: Promise<string> | null = null;

function qfEnv() {
  const env = process.env.QF_ENV || "prelive";
  if (env !== "prelive" && env !== "production") {
    throw new Error("QF_ENV must be 'prelive' or 'production'.");
  }
  return env;
}

function authBase() {
  return qfEnv() === "production"
    ? "https://oauth2.quran.foundation"
    : "https://prelive-oauth2.quran.foundation";
}

function apiBase() {
  return qfEnv() === "production"
    ? "https://apis.quran.foundation"
    : "https://apis-prelive.quran.foundation";
}

async function requestToken() {
  const clientId = process.env.QF_CLIENT_ID;
  const clientSecret = process.env.QF_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "Missing QF_CLIENT_ID or QF_CLIENT_SECRET. Add them to server environment variables."
    );
  }

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(`${authBase()}/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      scope: "content",
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Quran Foundation token request failed: ${response.status}`);
  }

  const token = (await response.json()) as QfToken;

  cachedToken = token.access_token;
  tokenExpiresAt = Date.now() + Number(token.expires_in || 3600) * 1000;

  return cachedToken;
}

async function getToken() {
  if (cachedToken && Date.now() < tokenExpiresAt - 30_000) {
    return cachedToken;
  }

  if (!inflightToken) {
    inflightToken = requestToken().finally(() => {
      inflightToken = null;
    });
  }

  return inflightToken;
}

async function qfFetchOnce(path: string, token: string) {
  const clientId = process.env.QF_CLIENT_ID;
  if (!clientId) throw new Error("Missing QF_CLIENT_ID.");

  return fetch(`${apiBase()}${path}`, {
    headers: {
      "x-auth-token": token,
      "x-client-id": clientId,
    },
    cache: "no-store",
  });
}

export async function qfFetch<T = any>(path: string): Promise<T> {
  let token = await getToken();
  let response = await qfFetchOnce(path, token);

  if (response.status === 401) {
    cachedToken = null;
    tokenExpiresAt = 0;
    token = await requestToken();
    response = await qfFetchOnce(path, token);
  }

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(
      `Quran Foundation API failed: ${response.status}${body ? ` — ${body.slice(0, 300)}` : ""}`
    );
  }

  return response.json() as Promise<T>;
}

export function wordAudioAbsoluteUrl(path?: string | null) {
  if (!path) return null;
  return new URL(path.replace(/^\/+/, ""), "https://audio.qurancdn.com/").toString();
}
