import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { writeAudit } from "@/lib/adminOpsServer";

export async function advancedStudentSearch(input: {
  q?: string;
  status?: string;
  country?: string;
  course?: string;
  teacher?: string;
}) {
  const sb = getSupabaseAdmin();

  let query = sb
    .from("student_admin_search")
    .select("*")
    .order("full_name");

  const q = (input.q || "").trim();

  if (q) {
    query = query.or(
      `full_name.ilike.%${q}%,student_code.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%,parent_name.ilike.%${q}%`
    );
  }

  if (input.status) query = query.eq("status", input.status);
  if (input.country) query = query.ilike("country", `%${input.country}%`);
  if (input.course) query = query.ilike("course_name", `%${input.course}%`);
  if (input.teacher) query = query.ilike("teacher_name", `%${input.teacher}%`);

  const { data, error } = await query.limit(300);
  if (error) throw error;

  return data || [];
}

export async function createImportBatch(input: {
  adminUserId: string;
  fileName: string;
  sourceType: "csv" | "xlsx";
  rows: Array<Record<string, unknown>>;
}) {
  const sb = getSupabaseAdmin();

  const normalized = input.rows.map((row, index) => {
    const studentName = String(
      row.student_name ??
      row.student ??
      row.name ??
      row["Student Name"] ??
      ""
    ).trim();

    const parentName = String(
      row.parent_name ??
      row.parent ??
      row["Parent Name"] ??
      ""
    ).trim();

    const email = String(row.email ?? row["Email"] ?? "").trim();
    const phone = String(row.phone ?? row.mobile ?? row["Phone"] ?? "").trim();
    const country = String(row.country ?? row["Country"] ?? "").trim();
    const timezone = String(row.timezone ?? row["Timezone"] ?? "").trim();
    const course = String(row.course ?? row["Course"] ?? "").trim();
    const notes = String(row.notes ?? row["Notes"] ?? "").trim();

    const errors: string[] = [];
    if (!studentName) errors.push("Student name is required.");
    if (!phone && !email) errors.push("Phone or email is required.");

    return {
      row_number: index + 2,
      student_name: studentName || null,
      parent_name: parentName || null,
      email: email || null,
      phone: phone || null,
      country: country || null,
      timezone: timezone || null,
      course: course || null,
      notes: notes || null,
      validation_status: errors.length ? "invalid" : "valid",
      validation_message: errors.length ? errors.join(" ") : null,
    };
  });

  const valid = normalized.filter((r) => r.validation_status === "valid").length;
  const invalid = normalized.length - valid;

  const { data: batch, error: batchError } = await sb
    .from("student_import_batches")
    .insert({
      file_name: input.fileName,
      source_type: input.sourceType,
      total_rows: normalized.length,
      valid_rows: valid,
      invalid_rows: invalid,
      status: "review",
      uploaded_by: input.adminUserId,
    })
    .select("*")
    .single();

  if (batchError) throw batchError;

  if (normalized.length) {
    const { error: rowError } = await sb
      .from("student_import_rows")
      .insert(normalized.map((row) => ({ ...row, batch_id: batch.id })));

    if (rowError) throw rowError;
  }

  await writeAudit({
    actorUserId: input.adminUserId,
    actorRole: "admin",
    action: "student_import_uploaded",
    entityType: "student_import_batch",
    entityId: batch.id,
    description: `${input.fileName}: ${normalized.length} rows`,
  });

  return batch;
}

export async function listImportBatches() {
  const sb = getSupabaseAdmin();

  const { data, error } = await sb
    .from("student_import_batches")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) throw error;
  return data || [];
}

export async function getImportRows(batchId: string) {
  const sb = getSupabaseAdmin();

  const { data, error } = await sb
    .from("student_import_rows")
    .select("*")
    .eq("batch_id", batchId)
    .order("row_number");

  if (error) throw error;
  return data || [];
}

export async function queueEmail(input: {
  adminUserId: string;
  recipientEmail: string;
  recipientName?: string;
  subject: string;
  bodyText: string;
  templateKey?: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
}) {
  const sb = getSupabaseAdmin();

  const { data, error } = await sb
    .from("email_notification_queue")
    .insert({
      recipient_email: input.recipientEmail,
      recipient_name: input.recipientName || null,
      subject: input.subject,
      body_text: input.bodyText,
      template_key: input.templateKey || null,
      related_entity_type: input.relatedEntityType || null,
      related_entity_id: input.relatedEntityId || null,
      status: "pending",
      created_by: input.adminUserId,
    })
    .select("*")
    .single();

  if (error) throw error;

  await writeAudit({
    actorUserId: input.adminUserId,
    actorRole: "admin",
    action: "email_queued",
    entityType: "email_notification",
    entityId: data.id,
    description: input.subject,
  });

  return data;
}

export async function listEmailQueue() {
  const sb = getSupabaseAdmin();

  const { data, error } = await sb
    .from("email_notification_queue")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(250);

  if (error) throw error;
  return data || [];
}

export async function getStudentPrintProfile(studentId: string) {
  const sb = getSupabaseAdmin();

  const { data: student, error } = await sb
    .from("student_admin_search")
    .select("*")
    .eq("id", studentId)
    .maybeSingle();

  if (error) throw error;
  if (!student) throw new Error("Student not found.");

  const { data: recentClasses, error: classError } = await sb
    .from("class_record_overview")
    .select("*")
    .eq("student_id", studentId)
    .order("class_date", { ascending: false })
    .limit(12);

  if (classError) throw classError;

  const { data: reports, error: reportError } = await sb
    .from("monthly_reports")
    .select("*")
    .eq("student_id", studentId)
    .order("report_month", { ascending: false })
    .limit(6);

  if (reportError) throw reportError;

  return {
    student,
    recentClasses: recentClasses || [],
    reports: reports || [],
  };
}
