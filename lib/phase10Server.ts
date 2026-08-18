import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { writeAudit } from "@/lib/adminOpsServer";
import { queueEmail } from "@/lib/phase8Server";

export async function getStudentForEdit(id: string) {
  const sb = getSupabaseAdmin();

  const { data, error } = await sb
    .from("students")
    .select(`
      *,
      parents(id,full_name,email,phone,country,status)
    `)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("Student not found.");

  return data;
}

export async function updateStudentProfile(input: {
  adminUserId: string;
  studentId: string;
  fullName: string;
  email?: string;
  country?: string;
  timezone?: string;
  status: string;
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
}) {
  const sb = getSupabaseAdmin();

  const { data: student, error: studentError } = await sb
    .from("students")
    .select("id,parent_id")
    .eq("id", input.studentId)
    .maybeSingle();

  if (studentError) throw studentError;
  if (!student) throw new Error("Student not found.");

  const { error: updateError } = await sb
    .from("students")
    .update({
      full_name: input.fullName,
      email: input.email || null,
      country: input.country || null,
      timezone: input.timezone || null,
      status: input.status,
    })
    .eq("id", input.studentId);

  if (updateError) throw updateError;

  if (student.parent_id) {
    const { error: parentError } = await sb
      .from("parents")
      .update({
        full_name: input.parentName || null,
        email: input.parentEmail || null,
        phone: input.parentPhone || null,
      })
      .eq("id", student.parent_id);

    if (parentError) throw parentError;
  }

  await writeAudit({
    actorUserId: input.adminUserId,
    actorRole: "admin",
    action: "student_profile_updated",
    entityType: "student",
    entityId: input.studentId,
    description: input.fullName,
  });

  return { ok: true };
}

export async function getTeacherForEdit(id: string) {
  const sb = getSupabaseAdmin();

  const { data, error } = await sb
    .from("teachers")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("Teacher not found.");

  return data;
}

export async function updateTeacherProfile(input: {
  adminUserId: string;
  teacherId: string;
  fullName: string;
  email?: string;
  phone?: string;
  country?: string;
  timezone?: string;
  maxStudents?: number | null;
  status: string;
}) {
  const sb = getSupabaseAdmin();

  const { error } = await sb
    .from("teachers")
    .update({
      full_name: input.fullName,
      email: input.email || null,
      phone: input.phone || null,
      country: input.country || null,
      timezone: input.timezone || null,
      max_students: input.maxStudents || null,
      status: input.status,
    })
    .eq("id", input.teacherId);

  if (error) throw error;

  await writeAudit({
    actorUserId: input.adminUserId,
    actorRole: "admin",
    action: "teacher_profile_updated",
    entityType: "teacher",
    entityId: input.teacherId,
    description: input.fullName,
  });

  return { ok: true };
}

export async function detectBatchDuplicates(batchId: string) {
  const sb = getSupabaseAdmin();

  const { data: rows, error } = await sb
    .from("student_import_rows")
    .select("*")
    .eq("batch_id", batchId)
    .in("validation_status", ["valid", "invalid"])
    .order("row_number");

  if (error) throw error;

  const findings: Array<Record<string, unknown>> = [];

  for (const row of rows || []) {
    let suspectedStudent = null;
    let suspectedParent = null;
    const reasons: string[] = [];

    if (row.email) {
      const { data } = await sb
        .from("students")
        .select("id,full_name,email,student_code")
        .eq("email", row.email)
        .limit(1)
        .maybeSingle();

      if (data) {
        suspectedStudent = data;
        reasons.push("Student email already exists");
      }
    }

    if (!suspectedStudent && row.student_name) {
      const { data } = await sb
        .from("students")
        .select("id,full_name,email,student_code")
        .ilike("full_name", row.student_name)
        .limit(1)
        .maybeSingle();

      if (data) {
        suspectedStudent = data;
        reasons.push("Student name matches existing record");
      }
    }

    if (row.phone) {
      const { data } = await sb
        .from("parents")
        .select("id,full_name,email,phone")
        .eq("phone", row.phone)
        .limit(1)
        .maybeSingle();

      if (data) {
        suspectedParent = data;
        reasons.push("Parent phone already exists");
      }
    }

    if (!suspectedParent && row.email) {
      const { data } = await sb
        .from("parents")
        .select("id,full_name,email,phone")
        .eq("email", row.email)
        .limit(1)
        .maybeSingle();

      if (data) {
        suspectedParent = data;
        reasons.push("Parent email already exists");
      }
    }

    if (reasons.length) {
      const { data: review, error: insertError } = await sb
        .from("import_duplicate_reviews")
        .upsert({
          batch_id: batchId,
          import_row_id: row.id,
          suspected_student_id: suspectedStudent?.id || null,
          suspected_parent_id: suspectedParent?.id || null,
          match_reason: reasons.join("; "),
          decision: "pending",
        }, {
          onConflict: "import_row_id,suspected_student_id,suspected_parent_id",
        })
        .select("*")
        .single();

      if (insertError) throw insertError;

      findings.push({
        ...review,
        importRow: row,
        suspectedStudent,
        suspectedParent,
      });
    }
  }

  return findings;
}

export async function listBatchDuplicateReviews(batchId: string) {
  const sb = getSupabaseAdmin();

  const { data, error } = await sb
    .from("import_duplicate_reviews")
    .select(`
      *,
      student_import_rows(
        row_number,
        student_name,
        parent_name,
        email,
        phone,
        course,
        validation_status
      ),
      students(
        full_name,
        student_code,
        email
      ),
      parents(
        full_name,
        email,
        phone
      )
    `)
    .eq("batch_id", batchId)
    .order("created_at");

  if (error) throw error;

  return data || [];
}

export async function getVerificationByCode(code: string) {
  const sb = getSupabaseAdmin();

  const { data, error } = await sb
    .from("student_public_verification")
    .select("*")
    .eq("verification_code", code)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function queueAutomaticEventEmail(input: {
  eventType: string;
  recipientEmail?: string | null;
  recipientName?: string | null;
  entityId?: string | null;
  subject: string;
  bodyText: string;
}) {
  if (!input.recipientEmail) return null;

  // The queue record is created server-side.
  return queueEmail({
    adminUserId: "",
    recipientEmail: input.recipientEmail,
    recipientName: input.recipientName || "",
    subject: input.subject,
    bodyText: input.bodyText,
    templateKey: input.eventType,
    relatedEntityType: input.eventType,
    relatedEntityId: input.entityId || "",
  });
}
