const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function assertSupabaseEnv() {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
    );
  }
}

export async function createTrialApplication(payload: Record<string, unknown>) {
  assertSupabaseEnv();

  const response = await fetch(`${supabaseUrl}/rest/v1/trial_applications`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey!,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Supabase insert failed: ${response.status} ${detail}`);
  }

  const text = await response.text();
  const rows = text ? JSON.parse(text) : [];
  return rows[0];
}

export async function listTrialApplications(limit = 100) {
  assertSupabaseEnv();

  const url =
    `${supabaseUrl}/rest/v1/trial_applications` +
    `?select=*&order=created_at.desc&limit=${limit}`;

  const response = await fetch(url, {
    headers: {
      apikey: serviceRoleKey!,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Supabase fetch failed: ${response.status} ${detail}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : [];
}
