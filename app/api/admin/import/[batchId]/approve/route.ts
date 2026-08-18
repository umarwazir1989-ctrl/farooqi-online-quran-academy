import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/supabaseAuth";
import { approveImportBatch } from "@/lib/phase9Server";

export async function POST(
  request: Request,
  context: { params: Promise<{ batchId: string }> }
) {
  const profile = await getCurrentProfile();

  if (!profile || profile.role !== "admin" || profile.status !== "active") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { batchId } = await context.params;

    const result = await approveImportBatch({
      adminUserId: profile.id,
      batchId,
    });

    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Import approval failed.",
      },
      { status: 500 }
    );
  }
}
