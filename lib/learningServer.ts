import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function getTeacherActiveEnrollments(userId: string) {
  const sb = getSupabaseAdmin();

  const { data: teacher, error: teacherError } = await sb
    .from("teachers")
    .select("id,full_name,teacher_code")
    .eq("user_id", userId)
    .maybeSingle();

  if (teacherError) throw teacherError;
  if (!teacher) return { teacher: null, enrollments: [] };

  const { data, error } = await sb
    .from("enrollments")
    .select(`
      id,
      status,
      students(id,student_code,full_name,timezone),
      courses(id,name_en,name_ur),
      class_schedules(id,days_of_week,start_time,duration_minutes,timezone,status)
    `)
    .eq("teacher_id", teacher.id)
    .eq("status", "active")
    .order("created_at");

  if (error) throw error;

  return { teacher, enrollments: data || [] };
}

export async function saveClassRecord(input: {
  enrollmentId: string;
  teacherUserId: string;
  classDate: string;
  attendanceStatus: string;
  lessonType: string;
  lessonTitle?: string;
  lessonFrom?: string;
  lessonTo?: string;
  newLesson?: string;
  sabqiRevision?: string;
  manzilRevision?: string;
  tajweedFocus?: string;
  mistakesNotes?: string;
  homework?: string;
  teacherNotes?: string;
  performanceScore?: number | null;
  durationMinutes?: number;
}) {
  const sb = getSupabaseAdmin();

  const { data: teacher, error: teacherError } = await sb
    .from("teachers")
    .select("id")
    .eq("user_id", input.teacherUserId)
    .maybeSingle();

  if (teacherError) throw teacherError;
  if (!teacher) throw new Error("Teacher academic profile not found.");

  const { data: enrollment, error: enrollmentError } = await sb
    .from("enrollments")
    .select("id,student_id,teacher_id")
    .eq("id", input.enrollmentId)
    .eq("teacher_id", teacher.id)
    .maybeSingle();

  if (enrollmentError) throw enrollmentError;
  if (!enrollment) throw new Error("This enrollment is not assigned to the logged-in teacher.");

  const attendance = input.attendanceStatus;
  const completed = attendance === "cancelled" ? "cancelled" : "completed";

  const payload = {
    enrollment_id: enrollment.id,
    student_id: enrollment.student_id,
    teacher_id: teacher.id,
    class_date: input.classDate,
    attendance_status: attendance,
    class_status: completed,
    lesson_type: input.lessonType,
    lesson_title: input.lessonTitle || null,
    lesson_from: input.lessonFrom || null,
    lesson_to: input.lessonTo || null,
    new_lesson: input.newLesson || null,
    sabqi_revision: input.sabqiRevision || null,
    manzil_revision: input.manzilRevision || null,
    tajweed_focus: input.tajweedFocus || null,
    mistakes_notes: input.mistakesNotes || null,
    homework: input.homework || null,
    teacher_notes: input.teacherNotes || null,
    performance_score: input.performanceScore || null,
    duration_minutes: input.durationMinutes || 30,
    completed_at: completed === "completed" ? new Date().toISOString() : null,
  };

  const { data, error } = await sb
    .from("class_records")
    .upsert(payload, { onConflict: "enrollment_id,class_date" })
    .select("id")
    .single();

  if (error) throw error;
  return data;
}

export async function getStudentClassRecordsByUser(userId: string, limit = 30) {
  const sb = getSupabaseAdmin();

  const { data: student, error: studentError } = await sb
    .from("students")
    .select("id,full_name,student_code")
    .eq("user_id", userId)
    .maybeSingle();

  if (studentError) throw studentError;
  if (!student) return { student: null, records: [], reports: [] };

  const { data: records, error } = await sb
    .from("class_record_overview")
    .select("*")
    .eq("student_id", student.id)
    .order("class_date", { ascending: false })
    .limit(limit);

  if (error) throw error;

  const { data: reports, error: reportError } = await sb
    .from("monthly_reports")
    .select("*")
    .eq("student_id", student.id)
    .eq("status", "published")
    .order("report_month", { ascending: false })
    .limit(12);

  if (reportError) throw reportError;

  return { student, records: records || [], reports: reports || [] };
}

export async function getParentProgressByUser(userId: string) {
  const sb = getSupabaseAdmin();

  const { data: parent, error: parentError } = await sb
    .from("parents")
    .select("id,full_name")
    .eq("user_id", userId)
    .maybeSingle();

  if (parentError) throw parentError;
  if (!parent) return { parent: null, children: [] };

  const { data: students, error: studentError } = await sb
    .from("students")
    .select("id,full_name,student_code")
    .eq("parent_id", parent.id)
    .order("full_name");

  if (studentError) throw studentError;

  const children = [];

  for (const student of students || []) {
    const { data: records, error } = await sb
      .from("class_record_overview")
      .select("*")
      .eq("student_id", student.id)
      .order("class_date", { ascending: false })
      .limit(10);

    if (error) throw error;

    const { data: reports, error: reportsError } = await sb
      .from("monthly_reports")
      .select("*")
      .eq("student_id", student.id)
      .eq("status", "published")
      .order("report_month", { ascending: false })
      .limit(3);

    if (reportsError) throw reportsError;

    children.push({
      ...student,
      records: records || [],
      reports: reports || [],
    });
  }

  return { parent, children };
}

export async function listAttendanceRecords(limit = 200) {
  const sb = getSupabaseAdmin();

  const { data, error } = await sb
    .from("class_record_overview")
    .select("*")
    .order("class_date", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

export async function listMonthlyReports(limit = 200) {
  const sb = getSupabaseAdmin();

  const { data, error } = await sb
    .from("monthly_reports")
    .select(`
      *,
      students(full_name,student_code),
      teachers(full_name),
      enrollments(courses(name_en,name_ur))
    `)
    .order("report_month", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

export async function generateMonthlyReport(input: {
  studentId: string;
  month: string;
  publish?: boolean;
  progressSummary?: string;
  strengths?: string;
  improvementAreas?: string;
  nextMonthGoal?: string;
  teacherComment?: string;
}) {
  const sb = getSupabaseAdmin();

  const monthStart = `${input.month}-01`;
  const [year, monthNum] = input.month.split("-").map(Number);
  const nextMonth = new Date(Date.UTC(year, monthNum, 1));
  const nextMonthStart = nextMonth.toISOString().slice(0, 10);

  const { data: records, error } = await sb
    .from("class_records")
    .select("attendance_status,performance_score,enrollment_id,teacher_id")
    .eq("student_id", input.studentId)
    .gte("class_date", monthStart)
    .lt("class_date", nextMonthStart);

  if (error) throw error;

  const rows = records || [];
  const total = rows.length;
  const present = rows.filter((r) => r.attendance_status === "present").length;
  const absent = rows.filter((r) => r.attendance_status === "absent").length;
  const late = rows.filter((r) => r.attendance_status === "late").length;
  const leave = rows.filter((r) => r.attendance_status === "leave").length;

  const scores = rows
    .map((r) => r.performance_score)
    .filter((v): v is number => typeof v === "number");

  const avg = scores.length
    ? Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2))
    : null;

  const attendanceBase = Math.max(total - leave, 0);
  const attendancePercentage = attendanceBase
    ? Number((((present + late) / attendanceBase) * 100).toFixed(2))
    : 0;

  const enrollmentId = rows[0]?.enrollment_id || null;
  const teacherId = rows[0]?.teacher_id || null;

  const payload = {
    student_id: input.studentId,
    enrollment_id: enrollmentId,
    teacher_id: teacherId,
    report_month: monthStart,
    total_classes: total,
    present_classes: present,
    absent_classes: absent,
    late_classes: late,
    leave_classes: leave,
    attendance_percentage: attendancePercentage,
    average_performance: avg,
    progress_summary: input.progressSummary || null,
    strengths: input.strengths || null,
    improvement_areas: input.improvementAreas || null,
    next_month_goal: input.nextMonthGoal || null,
    teacher_comment: input.teacherComment || null,
    status: input.publish ? "published" : "draft",
    published_at: input.publish ? new Date().toISOString() : null,
  };

  const { data, error: saveError } = await sb
    .from("monthly_reports")
    .upsert(payload, { onConflict: "student_id,report_month" })
    .select("*")
    .single();

  if (saveError) throw saveError;
  return data;
}
