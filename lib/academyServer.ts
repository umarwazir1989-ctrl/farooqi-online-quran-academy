const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function env() {
  if (!supabaseUrl || !secretKey) {
    throw new Error("Missing Supabase server environment variables");
  }
  return { supabaseUrl, secretKey };
}

async function rest(path: string, init: RequestInit = {}) {
  const { supabaseUrl, secretKey } = env();

  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: secretKey,
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Supabase ${response.status}: ${body}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export async function getTrialById(id: string) {
  const rows = await rest(
    `trial_applications?id=eq.${encodeURIComponent(id)}&select=*`
  );
  return rows?.[0] || null;
}

export async function listCourses() {
  return rest(`courses?status=eq.active&select=*&order=name_en.asc`);
}

export async function listTeachers() {
  return rest(`teachers?status=eq.active&select=*&order=full_name.asc`);
}

export async function listStudents() {
  return rest(
    `student_enrollment_overview?select=*&order=student_name.asc`
  );
}

export async function listSchedules() {
  return rest(
    `class_schedules?select=id,days_of_week,start_time,duration_minutes,timezone,status,students(full_name,student_code),teachers(full_name),enrollments(courses(name_en,name_ur))&status=eq.active&order=start_time.asc`
  );
}

export async function createStudentFromTrial(input: {
  trialId: string;
  courseId: string;
  teacherId?: string | null;
  days: string[];
  startTime?: string | null;
  durationMinutes: number;
  timezone: string;
  adminNotes?: string | null;
}) {
  const trial = await getTrialById(input.trialId);
  if (!trial) throw new Error("Trial application not found");

  // Parent record (only when some parent/contact data exists)
  let parentId: string | null = null;
  if (trial.parent_name || trial.email || trial.whatsapp) {
    const parentRows = await rest("parents", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        full_name: trial.parent_name || null,
        email: trial.email || null,
        phone: trial.whatsapp || null,
        country: trial.country || null,
        city: trial.city || null,
        status: "active",
      }),
    });
    parentId = parentRows?.[0]?.id || null;
  }

  const code = `FQA-${Date.now().toString().slice(-8)}`;

  const studentRows = await rest("students", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      parent_id: parentId,
      source_trial_id: trial.id,
      student_code: code,
      full_name: trial.student_name,
      email: trial.email || null,
      whatsapp: trial.whatsapp || null,
      age: trial.age || null,
      gender: trial.gender || null,
      country: trial.country || null,
      city: trial.city || null,
      timezone: trial.timezone || input.timezone || "Asia/Karachi",
      preferred_language: trial.preferred_language || null,
      status: "active",
      notes: input.adminNotes || trial.message || null,
    }),
  });

  const student = studentRows?.[0];
  if (!student?.id) throw new Error("Student creation failed");

  const enrollmentRows = await rest("enrollments", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      student_id: student.id,
      course_id: input.courseId,
      teacher_id: input.teacherId || null,
      status: "active",
      notes: input.adminNotes || null,
    }),
  });

  const enrollment = enrollmentRows?.[0];
  if (!enrollment?.id) throw new Error("Enrollment creation failed");

  if (input.days.length || input.startTime) {
    await rest("class_schedules", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        enrollment_id: enrollment.id,
        student_id: student.id,
        teacher_id: input.teacherId || null,
        days_of_week: input.days,
        start_time: input.startTime || null,
        duration_minutes: input.durationMinutes,
        timezone: input.timezone || "Asia/Karachi",
        status: "active",
      }),
    });
  }

  await rest(
    `trial_applications?id=eq.${encodeURIComponent(trial.id)}`,
    {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        status: "enrolled",
        assigned_teacher: input.teacherId || null,
        admin_notes: input.adminNotes || trial.admin_notes || null,
      }),
    }
  );

  return { studentId: student.id, studentCode: code };
}
