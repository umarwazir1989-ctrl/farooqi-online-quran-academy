import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { getCurrentProfile } from "@/lib/supabaseAuth";
import { createImportBatch } from "@/lib/phase8Server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const profile = await getCurrentProfile();

  if (!profile || profile.role !== "admin" || profile.status !== "active") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "File is required." }, { status: 400 });
    }

    const ext = file.name.toLowerCase().endsWith(".xlsx") ? "xlsx" : "csv";
    const bytes = new Uint8Array(await file.arrayBuffer());

    const workbook = XLSX.read(bytes, { type: "array" });
    const sheetName = workbook.SheetNames[0];

    if (!sheetName) {
      return NextResponse.json({ ok: false, error: "Workbook has no sheets." }, { status: 400 });
    }

    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(
      workbook.Sheets[sheetName],
      { defval: "" }
    );

    const batch = await createImportBatch({
      adminUserId: profile.id,
      fileName: file.name,
      sourceType: ext,
      rows,
    });

    return NextResponse.json({ ok: true, batch });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Import failed." },
      { status: 500 }
    );
  }
}
