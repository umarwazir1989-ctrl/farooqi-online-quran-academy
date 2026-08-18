import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function writeAudit(input: {
  actorUserId?: string | null;
  actorRole?: string | null;
  action: string;
  entityType?: string | null;
  entityId?: string | null;
  description?: string | null;
  metadata?: Record<string, unknown>;
}) {
  const sb = getSupabaseAdmin();
  await sb.from("audit_logs").insert({
    actor_user_id: input.actorUserId || null,
    actor_role: input.actorRole || null,
    action: input.action,
    entity_type: input.entityType || null,
    entity_id: input.entityId || null,
    description: input.description || null,
    metadata: input.metadata || {},
  });
}

export async function createAnnouncement(input: {
  actorUserId: string;
  titleEn: string;
  titleUr?: string;
  bodyEn: string;
  bodyUr?: string;
  audience: string;
  priority: string;
  publishUntil?: string | null;
}) {
  const sb = getSupabaseAdmin();

  const { data, error } = await sb
    .from("announcements")
    .insert({
      title_en: input.titleEn,
      title_ur: input.titleUr || null,
      body_en: input.bodyEn,
      body_ur: input.bodyUr || null,
      audience: input.audience,
      priority: input.priority,
      publish_until: input.publishUntil || null,
      created_by: input.actorUserId,
      status: "published",
    })
    .select("*")
    .single();

  if (error) throw error;

  await writeAudit({
    actorUserId: input.actorUserId,
    actorRole: "admin",
    action: "announcement_created",
    entityType: "announcement",
    entityId: data.id,
    description: input.titleEn,
  });

  return data;
}

export async function listAnnouncements(audience?: string) {
  const sb = getSupabaseAdmin();

  let query = sb
    .from("active_announcements")
    .select("*")
    .order("publish_from", { ascending: false });

  if (audience && audience !== "all") {
    query = query.in("audience", ["all", audience]);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getTeacherLeaveData(userId: string) {
  const sb = getSupabaseAdmin();

  const { data: teacher, error: teacherError } = await sb
    .from("teachers")
    .select("id,full_name,teacher_code")
    .eq("user_id", userId)
    .maybeSingle();

  if (teacherError) throw teacherError;
  if (!teacher) return { teacher: null, requests: [] };

  const { data, error } = await sb
    .from("teacher_leave_requests")
    .select("*")
    .eq("teacher_id", teacher.id)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return { teacher, requests: data || [] };
}

export async function submitTeacherLeave(input: {
  teacherUserId: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason?: string | null;
}) {
  const sb = getSupabaseAdmin();

  const { data: teacher, error: teacherError } = await sb
    .from("teachers")
    .select("id,full_name")
    .eq("user_id", input.teacherUserId)
    .maybeSingle();

  if (teacherError) throw teacherError;
  if (!teacher) throw new Error("Teacher profile not found.");

  const { data, error } = await sb
    .from("teacher_leave_requests")
    .insert({
      teacher_id: teacher.id,
      leave_type: input.leaveType,
      start_date: input.startDate,
      end_date: input.endDate,
      reason: input.reason || null,
      status: "pending",
    })
    .select("*")
    .single();

  if (error) throw error;

  await writeAudit({
    actorUserId: input.teacherUserId,
    actorRole: "teacher",
    action: "leave_requested",
    entityType: "teacher_leave",
    entityId: data.id,
    description: `${teacher.full_name}: ${input.startDate} to ${input.endDate}`,
  });

  return data;
}

export async function listAllLeaveRequests() {
  const sb = getSupabaseAdmin();

  const { data, error } = await sb
    .from("teacher_leave_overview")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function decideTeacherLeave(input: {
  id: string;
  adminUserId: string;
  decision: "approved" | "rejected";
  adminNotes?: string | null;
}) {
  const sb = getSupabaseAdmin();

  const { data, error } = await sb
    .from("teacher_leave_requests")
    .update({
      status: input.decision,
      admin_notes: input.adminNotes || null,
      decided_by: input.adminUserId,
      decided_at: new Date().toISOString(),
    })
    .eq("id", input.id)
    .select("*")
    .single();

  if (error) throw error;

  await writeAudit({
    actorUserId: input.adminUserId,
    actorRole: "admin",
    action: `leave_${input.decision}`,
    entityType: "teacher_leave",
    entityId: input.id,
    description: input.adminNotes || null,
  });

  return data;
}

export async function listAcademicCalendar() {
  const sb = getSupabaseAdmin();

  const { data, error } = await sb
    .from("academic_calendar")
    .select("*")
    .eq("status", "active")
    .order("start_date");

  if (error) throw error;
  return data || [];
}

export async function listAuditLogs(limit = 250) {
  const sb = getSupabaseAdmin();

  const { data, error } = await sb
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

export async function exportRows(type: string) {
  const sb = getSupabaseAdmin();

  const map: Record<string, { table: string; select: string }> = {
    students: { table: "students", select: "*" },
    teachers: { table: "teachers", select: "*" },
    parents: { table: "parents", select: "*" },
    enrollments: { table: "enrollments", select: "*" },
    schedules: { table: "class_schedules", select: "*" },
    attendance: { table: "class_records", select: "*" },
    reports: { table: "monthly_reports", select: "*" },
    trials: { table: "trial_applications", select: "*" },
  };

  const config = map[type];
  if (!config) throw new Error("Unsupported export type.");

  const { data, error } = await sb.from(config.table).select(config.select);
  if (error) throw error;
  return data || [];
}
