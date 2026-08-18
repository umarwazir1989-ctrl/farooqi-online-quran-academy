import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { writeAudit } from "@/lib/adminOpsServer";

function makeStudentCode() {
  const stamp = Date.now().toString().slice(-6);
  const rand = Math.floor(Math.random() * 90 + 10);
  return `FQ-${stamp}${rand}`;
}

async function findCourseId(courseName?: string | null) {
  if (!courseName) return null;
  const sb = getSupabaseAdmin();

  const { data } = await sb
    .from("courses")
    .select("id,name_en,name_ur")
    .or(`name_en.ilike.%${courseName}%,name_ur.ilike.%${courseName}%`)
    .limit(1)
    .maybeSingle();

  return data?.id || null;
}

export async function approveImportBatch(input: {
  adminUserId: string;
  batchId: string;
}) {
  const sb = getSupabaseAdmin();

  const { data: batch, error: batchError } = await sb
    .from("student_import_batches")
    .select("*")
    .eq("id", input.batchId)
    .maybeSingle();

  if (batchError) throw batchError;
  if (!batch) throw new Error("Import batch not found.");
  if (batch.status === "completed") throw new Error("This batch is already completed.");

  const { data: rows, error: rowsError } = await sb
    .from("student_import_rows")
    .select("*")
    .eq("batch_id", input.batchId)
    .eq("validation_status", "valid")
    .order("row_number");

  if (rowsError) throw rowsError;

  let imported = 0;

  for (const row of rows || []) {
    try {
      let parentId: string | null = null;

      if (row.parent_name || row.email || row.phone) {
        let parentQuery = sb.from("parents").select("id,full_name,email,phone");

        if (row.email) {
          const { data: existingParent } = await parentQuery
            .eq("email", row.email)
            .limit(1)
            .maybeSingle();

          if (existingParent) parentId = existingParent.id;
        }

        if (!parentId && row.phone) {
          const { data: existingParentByPhone } = await sb
            .from("parents")
            .select("id")
            .eq("phone", row.phone)
            .limit(1)
            .maybeSingle();

          if (existingParentByPhone) parentId = existingParentByPhone.id;
        }

        if (!parentId) {
          const { data: createdParent, error: parentError } = await sb
            .from("parents")
            .insert({
              full_name: row.parent_name || `${row.student_name} Parent`,
              email: row.email || null,
              phone: row.phone || null,
              country: row.country || null,
              status: "active",
            })
            .select("id")
            .single();

          if (parentError) throw parentError;
          parentId = createdParent.id;
        }
      }

      let existingStudent: { id: string } | null = null;

      if (row.email) {
        const { data } = await sb
          .from("students")
          .select("id")
          .eq("email", row.email)
          .limit(1)
          .maybeSingle();
        existingStudent = data;
      }

      let studentId: string;

      if (existingStudent) {
        studentId = existingStudent.id;
      } else {
        const { data: createdStudent, error: studentError } = await sb
          .from("students")
          .insert({
            student_code: makeStudentCode(),
            full_name: row.student_name,
            email: row.email || null,
            country: row.country || null,
            timezone: row.timezone || "Asia/Karachi",
            parent_id: parentId,
            status: "active",
          })
          .select("id")
          .single();

        if (studentError) throw studentError;
        studentId = createdStudent.id;
      }

      let enrollmentId: string | null = null;
      const courseId = await findCourseId(row.course);

      if (courseId) {
        const { data: existingEnrollment } = await sb
          .from("enrollments")
          .select("id")
          .eq("student_id", studentId)
          .eq("course_id", courseId)
          .eq("status", "active")
          .limit(1)
          .maybeSingle();

        if (existingEnrollment) {
          enrollmentId = existingEnrollment.id;
        } else {
          const { data: enrollment, error: enrollmentError } = await sb
            .from("enrollments")
            .insert({
              student_id: studentId,
              course_id: courseId,
              status: "active",
              start_date: new Date().toISOString().slice(0, 10),
            })
            .select("id")
            .single();

          if (enrollmentError) throw enrollmentError;
          enrollmentId = enrollment.id;
        }
      }

      await sb
        .from("student_import_rows")
        .update({
          validation_status: "imported",
          validation_message: null,
          imported_student_id: studentId,
          imported_parent_id: parentId,
          imported_enrollment_id: enrollmentId,
        })
        .eq("id", row.id);

      imported += 1;
    } catch (error) {
      await sb
        .from("student_import_rows")
        .update({
          validation_status: "invalid",
          validation_message:
            error instanceof Error ? error.message : "Import failed.",
        })
        .eq("id", row.id);
    }
  }

  const { error: finalError } = await sb
    .from("student_import_batches")
    .update({
      status: "completed",
      imported_rows: imported,
      completed_at: new Date().toISOString(),
    })
    .eq("id", input.batchId);

  if (finalError) throw finalError;

  await writeAudit({
    actorUserId: input.adminUserId,
    actorRole: "admin",
    action: "student_import_approved",
    entityType: "student_import_batch",
    entityId: input.batchId,
    description: `${imported} rows imported to live records`,
  });

  return { imported };
}

export async function getActionCenter() {
  const sb = getSupabaseAdmin();

  const { data, error } = await sb
    .from("admin_action_center")
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function processPendingEmails(limit = 20) {
  const sb = getSupabaseAdmin();

  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.EMAIL_FROM_ADDRESS;
  const senderName = process.env.EMAIL_FROM_NAME || "Farooqi Online Quran Academy";

  if (!apiKey || !senderEmail) {
    throw new Error(
      "BREVO_API_KEY and EMAIL_FROM_ADDRESS must be configured in server environment."
    );
  }

  const { data: rows, error } = await sb
    .from("email_notification_queue")
    .select("*")
    .eq("status", "pending")
    .or(`next_attempt_at.is.null,next_attempt_at.lte.${new Date().toISOString()}`)
    .order("created_at")
    .limit(limit);

  if (error) throw error;

  let sent = 0;
  let failed = 0;

  for (const row of rows || []) {
    try {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey,
        },
        body: JSON.stringify({
          sender: { name: senderName, email: senderEmail },
          to: [
            {
              email: row.recipient_email,
              name: row.recipient_name || undefined,
            },
          ],
          subject: row.subject,
          textContent: row.body_text,
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          payload?.message || `Brevo request failed with ${response.status}`
        );
      }

      await sb
        .from("email_notification_queue")
        .update({
          status: "sent",
          attempts: Number(row.attempts || 0) + 1,
          sent_at: new Date().toISOString(),
          provider_message_id: payload?.messageId || null,
          last_error: null,
        })
        .eq("id", row.id);

      sent += 1;
    } catch (error) {
      const attempts = Number(row.attempts || 0) + 1;
      const shouldFail = attempts >= 3;

      const retryAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

      await sb
        .from("email_notification_queue")
        .update({
          status: shouldFail ? "failed" : "pending",
          attempts,
          last_error: error instanceof Error ? error.message : "Send failed.",
          next_attempt_at: shouldFail ? null : retryAt,
        })
        .eq("id", row.id);

      failed += 1;
    }
  }

  return { sent, failed };
}
