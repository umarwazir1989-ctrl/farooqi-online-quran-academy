import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function listPortalAccounts() {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb.from("portal_account_overview").select("*").order("role").order("full_name");
  if (error) throw error;
  return data || [];
}

export async function getTeacherPortalData(userId: string) {
  const sb = getSupabaseAdmin();
  const { data: teacher, error: te } = await sb.from("teachers").select("*").eq("user_id", userId).maybeSingle();
  if (te) throw te;
  if (!teacher) return { teacher: null, enrollments: [] };
  const { data, error } = await sb.from("enrollments").select(`
    id,status,start_date,
    students(id,student_code,full_name,country,timezone),
    courses(id,name_en,name_ur),
    class_schedules(id,days_of_week,start_time,duration_minutes,timezone,status)
  `).eq("teacher_id", teacher.id).eq("status","active").order("start_date");
  if (error) throw error;
  return { teacher, enrollments: data || [] };
}

export async function getStudentPortalData(userId: string) {
  const sb = getSupabaseAdmin();
  const { data: student, error: se } = await sb.from("students").select("*").eq("user_id", userId).maybeSingle();
  if (se) throw se;
  if (!student) return { student: null, enrollments: [] };
  const { data, error } = await sb.from("enrollments").select(`
    id,status,start_date,
    courses(id,name_en,name_ur),
    teachers(id,full_name),
    class_schedules(id,days_of_week,start_time,duration_minutes,timezone,status)
  `).eq("student_id", student.id).eq("status","active");
  if (error) throw error;
  return { student, enrollments: data || [] };
}

export async function getParentPortalData(userId: string) {
  const sb = getSupabaseAdmin();
  const { data: parent, error: pe } = await sb.from("parents").select("*").eq("user_id", userId).maybeSingle();
  if (pe) throw pe;
  if (!parent) return { parent: null, children: [] };
  const { data, error } = await sb.from("students").select(`
    id,student_code,full_name,status,country,
    enrollments(
      id,status,
      courses(id,name_en,name_ur),
      teachers(id,full_name),
      class_schedules(id,days_of_week,start_time,duration_minutes,timezone,status)
    )
  `).eq("parent_id", parent.id).order("full_name");
  if (error) throw error;
  return { parent, children: data || [] };
}
