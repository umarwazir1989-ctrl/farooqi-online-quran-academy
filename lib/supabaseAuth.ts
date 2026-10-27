import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export type PortalRole = "admin" | "teacher" | "student" | "parent";

function requireEnv() {
  if (!supabaseUrl || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }
}

export async function getSessionTokens() {
  const store = await cookies();
  return {
    accessToken: store.get("fq_access_token")?.value || "",
    refreshToken: store.get("fq_refresh_token")?.value || "",
  };
}

export async function getCurrentUser() {
  requireEnv();
  const { accessToken } = await getSessionTokens();
  if (!accessToken) return null;

  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) return null;
  const text = await response.text(); return text ? JSON.parse(text) : null;
}

export async function getCurrentProfile() {
  requireEnv();
  const user = await getCurrentUser();
  if (!user?.id) return null;

  const { accessToken } = await getSessionTokens();

  const response = await fetch(
    `${supabaseUrl}/rest/v1/profiles?id=eq.${encodeURIComponent(user.id)}&select=*`,
    {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) return null;
  const text = await response.text(); const rows = text ? JSON.parse(text) : [];
  return rows[0] || null;
}

export async function signInWithPassword(email: string, password: string) {
  requireEnv();

  const response = await fetch(
    `${supabaseUrl}/auth/v1/token?grant_type=password`,
    {
      method: "POST",
      headers: {
        apikey: anonKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    }
  );

  const text = await response.text(); const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(data?.error_description || data?.msg || "Login failed");
  }

  return data;
}

export async function signOut(accessToken: string) {
  requireEnv();
  if (!accessToken) return;

  await fetch(`${supabaseUrl}/auth/v1/logout`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  }).catch(() => null);
}
