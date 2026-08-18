import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/supabaseAuth";
import { exportRows, writeAudit } from "@/lib/adminOpsServer";

function csvEscape(value: unknown) {
  if (value === null || value === undefined) return "";

  const text =
    typeof value === "object"
      ? JSON.stringify(value)
      : String(value);

  return `"${text.replaceAll('"', '""')}"`;
}

export async function GET(
  request: Request,
  context: { params: Promise<{ type: string }> }
) {
  const profile = await getCurrentProfile();

  if (!profile || profile.role !== "admin" || profile.status !== "active") {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { type } = await context.params;

    const rows = await exportRows(type);

    // Supabase's generic return type can be wider than the actual
    // row shape here, so normalize it for CSV generation.
    const safeRows = rows as unknown as Record<string, unknown>[];

    if (!safeRows.length) {
      return new NextResponse("", {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${type}-empty.csv"`,
        },
      });
    }

    const headers = Array.from(
      new Set(
        safeRows.flatMap((row) => Object.keys(row))
      )
    );

    const lines = [
      headers.map(csvEscape).join(","),
      ...safeRows.map((row) =>
        headers.map((header) => csvEscape(row[header])).join(",")
      ),
    ];

    await writeAudit({
      actorUserId: profile.id,
      actorRole: "admin",
      action: "data_exported",
      entityType: type,
      description: `${safeRows.length} rows exported`,
    });

    return new NextResponse(
      "\uFEFF" + lines.join("\r\n"),
      {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="farooqi-${type}.csv"`,
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Export failed.",
      },
      { status: 500 }
    );
  }
}
