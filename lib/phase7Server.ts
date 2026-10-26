import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { writeAudit } from "@/lib/adminOpsServer";

export async function createCalendarEvent(input: {
  adminUserId: string;
  titleEn: string;
  titleUr?: string;
  eventType: string;
  startDate: string;
  endDate: string;
  descriptionEn?: string;
  descriptionUr?: string;
  appliesTo: string;
}) {
  const sb = getSupabaseAdmin();

  const { data, error } = await sb.from("academic_calendar").insert({
    title_en: input.titleEn,
    title_ur: input.titleUr || null,
    event_type: input.eventType,
    start_date: input.startDate,
    end_date: input.endDate,
    description_en: input.descriptionEn || null,
    description_ur: input.descriptionUr || null,
    applies_to: input.appliesTo,
    created_by: input.adminUserId,
    status: "active",
  }).select("*").single();

  if (error) throw error;

  await writeAudit({
    actorUserId: input.adminUserId,
    actorRole: "admin",
    action: "calendar_event_created",
    entityType: "academic_calendar",
    entityId: data.id,
    description: input.titleEn,
  });

  return data;
}

export async function updateCalendarEvent(id: string, input: Record<string, unknown>, adminUserId: string) {
  const sb = getSupabaseAdmin();

  const allowed: Record<string,string> = {
    titleEn:"title_en", titleUr:"title_ur", eventType:"event_type",
    startDate:"start_date", endDate:"end_date",
    descriptionEn:"description_en", descriptionUr:"description_ur",
    appliesTo:"applies_to", status:"status",
  };

  const patch: Record<string, unknown> = {};
  for (const [key, column] of Object.entries(allowed)) {
    if (key in input) patch[column] = input[key] || null;
  }

  const { data, error } = await sb.from("academic_calendar")
    .update(patch).eq("id", id).select("*").single();

  if (error) throw error;

  await writeAudit({
    actorUserId: adminUserId,
    actorRole: "admin",
    action: "calendar_event_updated",
    entityType: "academic_calendar",
    entityId: id,
  });

  return data;
}

export async function createSubstitution(input: {
  adminUserId: string;
  originalTeacherId: string;
  substituteTeacherId: string;
  studentId?: string;
  enrollmentId?: string;
  startDate: string;
  endDate: string;
  reason?: string;
}) {
  const sb = getSupabaseAdmin();

  const { data, error } = await sb.from("teacher_substitutions").insert({
    original_teacher_id: input.originalTeacherId,
    substitute_teacher_id: input.substituteTeacherId,
    student_id: input.studentId || null,
    enrollment_id: input.enrollmentId || null,
    start_date: input.startDate,
    end_date: input.endDate,
    reason: input.reason || null,
    status: "active",
    created_by: input.adminUserId,
  }).select("*").single();

  if (error) throw error;

  await writeAudit({
    actorUserId: input.adminUserId,
    actorRole: "admin",
    action: "teacher_substitution_created",
    entityType: "teacher_substitution",
    entityId: data.id,
  });

  return data;
}

export async function listSubstitutions() {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb.from("teacher_substitution_overview")
    .select("*").order("start_date", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function transferStudent(input: {
  adminUserId: string;
  enrollmentId: string;
  toTeacherId: string;
  effectiveDate: string;
  reason?: string;
}) {
  const sb = getSupabaseAdmin();

  const { data: enrollment, error: fetchError } = await sb.from("enrollments")
    .select("id,student_id,teacher_id")
    .eq("id", input.enrollmentId).maybeSingle();

  if (fetchError) throw fetchError;
  if (!enrollment) throw new Error("Enrollment not found.");

  const fromTeacherId = enrollment.teacher_id;

  const { error: updateError } = await sb.from("enrollments")
    .update({ teacher_id: input.toTeacherId })
    .eq("id", input.enrollmentId);

  if (updateError) throw updateError;

  const { data: transfer, error } = await sb.from("student_transfers").insert({
    student_id: enrollment.student_id,
    enrollment_id: enrollment.id,
    from_teacher_id: fromTeacherId,
    to_teacher_id: input.toTeacherId,
    effective_date: input.effectiveDate,
    reason: input.reason || null,
    status: "completed",
    created_by: input.adminUserId,
  }).select("*").single();

  if (error) throw error;

  await writeAudit({
    actorUserId: input.adminUserId,
    actorRole: "admin",
    action: "student_transferred",
    entityType: "student_transfer",
    entityId: transfer.id,
    metadata: { enrollmentId: enrollment.id, fromTeacherId, toTeacherId: input.toTeacherId },
  });

  return transfer;
}

export async function listTransfers() {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb.from("student_transfer_overview")
    .select("*").order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function archiveEntity(input: {
  adminUserId: string;
  entityType: string;
  entityId: string;
  reason?: string;
  restore?: boolean;
}) {
  const sb = getSupabaseAdmin();

  const map: Record<string, { table: string; statusColumn: string; active: string; archived: string }> = {
    student: { table:"students", statusColumn:"status", active:"active", archived:"paused" },
    teacher: { table:"teachers", statusColumn:"status", active:"active", archived:"inactive" },
    parent: { table:"parents", statusColumn:"status", active:"active", archived:"inactive" },
    trial: { table:"trial_applications", statusColumn:"status", active:"new", archived:"closed" },
    announcement: { table:"announcements", statusColumn:"status", active:"published", archived:"archived" },
  };

  const config = map[input.entityType];
  if (!config) throw new Error("Unsupported archive entity.");

  if (input.restore) {
    const { error } = await sb.from(config.table)
      .update({ [config.statusColumn]: config.active })
      .eq("id", input.entityId);
    if (error) throw error;

    await sb.from("archive_records")
      .update({
        status:"restored",
        restored_by: input.adminUserId,
        restored_at: new Date().toISOString(),
      })
      .eq("entity_type", input.entityType)
      .eq("entity_id", input.entityId)
      .eq("status","archived");

    await writeAudit({
      actorUserId: input.adminUserId,
      actorRole:"admin",
      action:"entity_restored",
      entityType: input.entityType,
      entityId: input.entityId,
    });

    return { restored:true };
  }

  const { error } = await sb.from(config.table)
    .update({ [config.statusColumn]: config.archived })
    .eq("id", input.entityId);
  if (error) throw error;

  const { data, error: archiveError } = await sb.from("archive_records").insert({
    entity_type: input.entityType,
    entity_id: input.entityId,
    reason: input.reason || null,
    archived_by: input.adminUserId,
    status:"archived",
  }).select("*").single();

  if (archiveError) throw archiveError;

  await writeAudit({
    actorUserId: input.adminUserId,
    actorRole:"admin",
    action:"entity_archived",
    entityType: input.entityType,
    entityId: input.entityId,
    description: input.reason || null,
  });

  return data;
}

export async function listArchiveRecords() {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb.from("archive_records")
    .select("*").order("archived_at", { ascending:false }).limit(250);

  if (error) throw error;
  return data || [];
}

export async function adminSearch(q: string) {
  const sb = getSupabaseAdmin();
  const term = q.trim();
  if (!term) return { students:[], teachers:[], parents:[], trials:[] };

  const [students, teachers, parents, trials] = await Promise.all([
    sb.from("students").select("id,full_name,email,whatsapp,student_code,status").or(
      `full_name.ilike.%${term}%,email.ilike.%${term}%,whatsapp.ilike.%${term}%,student_code.ilike.%${term}%`
    ).limit(30),
    sb.from("teachers").select("id,full_name,email,teacher_code,status").or(
      `full_name.ilike.%${term}%,email.ilike.%${term}%,teacher_code.ilike.%${term}%`
    ).limit(30),
    sb.from("parents").select("id,full_name,email,phone,status").or(
      `full_name.ilike.%${term}%,email.ilike.%${term}%,phone.ilike.%${term}%`
    ).limit(30),
    sb.from("trial_applications").select("id,student_name,parent_name,email,whatsapp,status").or(
      `student_name.ilike.%${term}%,parent_name.ilike.%${term}%,email.ilike.%${term}%,whatsapp.ilike.%${term}%`
    ).limit(30),
  ]);

  for (const result of [students,teachers,parents,trials]) {
    if (result.error) throw result.error;
  }

  return {
    students: (students.data || []).map((s: any) => ({ ...s, phone: s.whatsapp || "" })),
    teachers: (teachers.data || []).map((t: any) => ({ ...t, phone: t.phone || "" })),
    parents: parents.data || [],
    trials: (trials.data || []).map((tr: any) => ({ ...tr, phone: tr.whatsapp || "" })),
  };
}
