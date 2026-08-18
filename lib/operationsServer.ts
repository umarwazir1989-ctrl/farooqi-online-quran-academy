import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function getTeacherCalendarData(userId: string) {
  const sb = getSupabaseAdmin();

  const { data: teacher, error: teacherError } = await sb
    .from("teachers")
    .select("id,full_name,teacher_code")
    .eq("user_id", userId)
    .maybeSingle();

  if (teacherError) throw teacherError;
  if (!teacher) return { teacher: null, enrollments: [], reschedules: [] };

  const { data: enrollments, error } = await sb
    .from("enrollments")
    .select(`
      id,
      status,
      students(id,student_code,full_name,timezone),
      courses(id,name_en,name_ur),
      class_schedules(id,days_of_week,start_time,duration_minutes,timezone,status)
    `)
    .eq("teacher_id", teacher.id)
    .eq("status", "active");

  if (error) throw error;

  const { data: reschedules, error: rError } = await sb
    .from("reschedule_overview")
    .select("*")
    .eq("teacher_id", teacher.id)
    .order("requested_date", { ascending: true });

  if (rError) throw rError;

  return {
    teacher,
    enrollments: enrollments || [],
    reschedules: reschedules || [],
  };
}

export async function createRescheduleRequest(input: {
  teacherUserId: string;
  enrollmentId: string;
  originalDate: string;
  requestedDate: string;
  requestedTime?: string | null;
  timezone?: string | null;
  reason?: string | null;
  requestType?: string | null;
}) {
  const sb = getSupabaseAdmin();

  const { data: teacher, error: teacherError } = await sb
    .from("teachers")
    .select("id")
    .eq("user_id", input.teacherUserId)
    .maybeSingle();

  if (teacherError) throw teacherError;
  if (!teacher) throw new Error("Teacher profile not found.");

  const { data: enrollment, error: enrollmentError } = await sb
    .from("enrollments")
    .select("id,student_id,teacher_id")
    .eq("id", input.enrollmentId)
    .eq("teacher_id", teacher.id)
    .maybeSingle();

  if (enrollmentError) throw enrollmentError;
  if (!enrollment) throw new Error("Enrollment is not assigned to this teacher.");

  const { data, error } = await sb
    .from("class_reschedules")
    .insert({
      enrollment_id: enrollment.id,
      student_id: enrollment.student_id,
      teacher_id: teacher.id,
      original_date: input.originalDate,
      requested_date: input.requestedDate,
      requested_time: input.requestedTime || null,
      timezone: input.timezone || "Asia/Karachi",
      reason: input.reason || null,
      request_type: input.requestType === "makeup" ? "makeup" : "reschedule",
      status: "pending",
    })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function listRescheduleRequests() {
  const sb = getSupabaseAdmin();

  const { data, error } = await sb
    .from("reschedule_overview")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function decideReschedule(input: {
  id: string;
  adminUserId: string;
  decision: "approved" | "rejected";
  adminNotes?: string | null;
}) {
  const sb = getSupabaseAdmin();

  const { data: current, error: fetchError } = await sb
    .from("class_reschedules")
    .select("*, students(parent_id,full_name)")
    .eq("id", input.id)
    .maybeSingle();

  if (fetchError) throw fetchError;
  if (!current) throw new Error("Reschedule request not found.");

  const { data, error } = await sb
    .from("class_reschedules")
    .update({
      status: input.decision,
      admin_notes: input.adminNotes || null,
      approved_by: input.adminUserId,
      approved_at: new Date().toISOString(),
    })
    .eq("id", input.id)
    .select("*")
    .single();

  if (error) throw error;

  const parentId = current.students?.parent_id;

  if (parentId) {
    await sb.from("parent_notifications").insert({
      parent_id: parentId,
      student_id: current.student_id,
      notification_type: "reschedule",
      title:
        input.decision === "approved"
          ? "Class reschedule approved"
          : "Class reschedule not approved",
      message:
        input.decision === "approved"
          ? `A class has been rescheduled to ${current.requested_date}${
              current.requested_time ? ` at ${current.requested_time}` : ""
            }.`
          : `The requested class reschedule for ${current.requested_date} was not approved.`,
      action_url: "/portal/parent/notifications",
    });
  }

  return data;
}

export async function getParentNotifications(userId: string) {
  const sb = getSupabaseAdmin();

  const { data: parent, error: parentError } = await sb
    .from("parents")
    .select("id,full_name")
    .eq("user_id", userId)
    .maybeSingle();

  if (parentError) throw parentError;
  if (!parent) return { parent: null, notifications: [] };

  const { data, error } = await sb
    .from("parent_notifications")
    .select(`
      *,
      students(full_name,student_code)
    `)
    .eq("parent_id", parent.id)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) throw error;

  return { parent, notifications: data || [] };
}

export async function getAdminAnalytics() {
  const sb = getSupabaseAdmin();

  const { data: overview, error } = await sb
    .from("admin_academy_analytics")
    .select("*")
    .single();

  if (error) throw error;

  const { data: teacherLoad, error: teacherLoadError } = await sb
    .from("teachers")
    .select(`
      id,
      full_name,
      teacher_code,
      max_students,
      enrollments(id,status)
    `)
    .eq("status", "active")
    .order("full_name");

  if (teacherLoadError) throw teacherLoadError;

  const { data: studentProgress, error: progressError } = await sb
    .from("student_progress_summary")
    .select("*")
    .order("total_recorded_classes", { ascending: false })
    .limit(50);

  if (progressError) throw progressError;

  return {
    overview,
    teacherLoad: teacherLoad || [],
    studentProgress: studentProgress || [],
  };
}
