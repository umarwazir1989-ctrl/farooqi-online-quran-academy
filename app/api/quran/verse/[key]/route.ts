import { NextResponse } from "next/server";
import { requireRole } from "@/lib/portalAuth";
import { qfFetch, wordAudioAbsoluteUrl } from "@/lib/quranFoundationClient";

export const runtime = "nodejs";

function validKey(key: string) {
  const m = key.match(/^(\d{1,3}):(\d{1,3})$/);
  if (!m) return false;
  const surah = Number(m[1]);
  const ayah = Number(m[2]);
  return surah >= 1 && surah <= 114 && ayah >= 1;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ key: string }> }
) {
  await requireRole(["student", "teacher", "parent", "admin"]);

  try {
    const { key } = await context.params;

    if (!validKey(key)) {
      return NextResponse.json(
        { ok: false, error: "Invalid verse key." },
        { status: 400 }
      );
    }

    const params = new URLSearchParams({
      words: "true",
      word_fields:
        "id,position,text_uthmani,text_uthmani_tajweed,text_indopak,audio,location",
      fields: "text_uthmani,text_uthmani_tajweed,text_indopak",
      language: "ur",
    });

    const data = await qfFetch<any>(
      `/content/api/v4/verses/by_key/${encodeURIComponent(key)}?${params.toString()}`
    );

    const verse = data.verse || data;

    const words = (verse.words || []).map((word: any) => {
      const rawAudio =
        word.audio_url ||
        word.audioUrl ||
        word.audio ||
        null;

      return {
        ...word,
        audio_url: wordAudioAbsoluteUrl(rawAudio),
      };
    });

    return NextResponse.json({
      ok: true,
      verse: {
        ...verse,
        words,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed." },
      { status: 500 }
    );
  }
}
