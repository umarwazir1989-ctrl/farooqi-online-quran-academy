import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

type LimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

export async function enforceQuranRateLimit(
  userId: string,
  bucket: string,
  limit = 30,
  windowSeconds = 60
): Promise<LimitResult> {
  const sb = getSupabaseAdmin();
  const now = Date.now();
  const windowStartMs = Math.floor(now / (windowSeconds * 1000)) * windowSeconds * 1000;
  const windowStart = new Date(windowStartMs).toISOString();

  const { data: existing, error: readError } = await sb
    .from("quran_api_rate_limits")
    .select("id,hit_count")
    .eq("user_id", userId)
    .eq("bucket", bucket)
    .eq("window_start", windowStart)
    .maybeSingle();

  if (readError) throw readError;

  if (!existing) {
    const { error } = await sb.from("quran_api_rate_limits").insert({
      user_id: userId,
      bucket,
      window_start: windowStart,
      hit_count: 1,
      updated_at: new Date().toISOString(),
    });
    if (error) throw error;

    return {
      allowed: true,
      remaining: Math.max(0, limit - 1),
      retryAfterSeconds: 0,
    };
  }

  if (existing.hit_count >= limit) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((windowStartMs + windowSeconds * 1000 - now) / 1000)
    );

    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  const next = existing.hit_count + 1;

  const { error } = await sb
    .from("quran_api_rate_limits")
    .update({
      hit_count: next,
      updated_at: new Date().toISOString(),
    })
    .eq("id", existing.id);

  if (error) throw error;

  return {
    allowed: true,
    remaining: Math.max(0, limit - next),
    retryAfterSeconds: 0,
  };
}
