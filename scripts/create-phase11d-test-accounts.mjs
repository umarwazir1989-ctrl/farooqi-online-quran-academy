import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

function loadEnvFile(file) {
  if (!fs.existsSync(file)) return;
  const text = fs.readFileSync(file, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const i = trimmed.indexOf("=");
    if (i < 1) continue;
    const key = trimmed.slice(0, i).trim();
    let value = trimmed.slice(i + 1).trim();
    value = value.replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(path.resolve(".env.local"));

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !secret) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const sb = createClient(url, secret, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const accounts = {
  teacher: {
    email: "teacher.qaida.test@example.com",
    password: "Teacher@FQ2026!",
    fullName: "Qaida Test Teacher",
  },
  student: {
    email: "student.qaida.test@example.com",
    password: "Student@FQ2026!",
    fullName: "Qaida Test Student",
  },
};

async function getOrCreateUser({ email, password, fullName, role }) {
  const { data: listed, error: listError } = await sb.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });
  if (listError) throw listError;

  let user = listed.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());

  if (!user) {
    const { data, error } = await sb.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        role,
        academy: "Farooqi Online Quran Academy",
      },
    });
    if (error) throw error;
    user = data.user;
  } else {
    const { data, error } = await sb.auth.admin.updateUserById(user.id, {
      password,
      email_confirm: true,
      user_metadata: {
        ...(user.user_metadata || {}),
        full_name: fullName,
        role,
        academy: "Farooqi Online Quran Academy",
      },
    });
    if (error) throw error;
    user = data.user;
  }

  const { error: profileError } = await sb.from("profiles").upsert(
    {
      id: user.id,
      full_name: fullName,
      role,
      status: "active",
    },
    { onConflict: "id" }
  );
  if (profileError) throw profileError;

  return user;
}

const teacherUser = await getOrCreateUser({
  ...accounts.teacher,
  role: "teacher",
});

const studentUser = await getOrCreateUser({
  ...accounts.student,
  role: "student",
});

let { data: teacher, error: teacherFindError } = await sb
  .from("teachers")
  .select("id")
  .eq("teacher_code", "T-TEST-QAIDA")
  .maybeSingle();

if (teacherFindError) throw teacherFindError;

if (!teacher) {
  const { data, error } = await sb
    .from("teachers")
    .insert({
      user_id: teacherUser.id,
      teacher_code: "T-TEST-QAIDA",
      full_name: accounts.teacher.fullName,
      gender: "male",
      qualification: "Test account only",
      languages: ["Urdu", "Arabic"],
      specialties: ["Noorani Qaida"],
      timezone: "Asia/Karachi",
      max_students: 5,
      status: "active",
    })
    .select("id")
    .single();
  if (error) throw error;
  teacher = data;
} else {
  const { error } = await sb
    .from("teachers")
    .update({
      user_id: teacherUser.id,
      full_name: accounts.teacher.fullName,
      status: "active",
    })
    .eq("id", teacher.id);
  if (error) throw error;
}

let { data: student, error: studentFindError } = await sb
  .from("students")
  .select("id")
  .eq("student_code", "S-TEST-QAIDA")
  .maybeSingle();

if (studentFindError) throw studentFindError;

if (!student) {
  const { data, error } = await sb
    .from("students")
    .insert({
      user_id: studentUser.id,
      student_code: "S-TEST-QAIDA",
      full_name: accounts.student.fullName,
      email: accounts.student.email,
      age: 12,
      gender: "male",
      country: "Pakistan",
      city: "Lahore",
      timezone: "Asia/Karachi",
      preferred_language: "ur",
      status: "active",
      notes: "Phase 11D test account only",
    })
    .select("id")
    .single();
  if (error) throw error;
  student = data;
} else {
  const { error } = await sb
    .from("students")
    .update({
      user_id: studentUser.id,
      email: accounts.student.email,
      full_name: accounts.student.fullName,
      status: "active",
    })
    .eq("id", student.id);
  if (error) throw error;
}

const { data: course, error: courseError } = await sb
  .from("courses")
  .select("id")
  .eq("code", "NQ")
  .single();

if (courseError) throw courseError;

const { data: existingEnrollment, error: enrollmentFindError } = await sb
  .from("enrollments")
  .select("id")
  .eq("student_id", student.id)
  .eq("course_id", course.id)
  .eq("status", "active")
  .maybeSingle();

if (enrollmentFindError) throw enrollmentFindError;

if (existingEnrollment) {
  const { error } = await sb
    .from("enrollments")
    .update({ teacher_id: teacher.id })
    .eq("id", existingEnrollment.id);
  if (error) throw error;
} else {
  const { error } = await sb.from("enrollments").insert({
    student_id: student.id,
    course_id: course.id,
    teacher_id: teacher.id,
    status: "active",
    notes: "Phase 11D Qaida test enrollment",
  });
  if (error) throw error;
}

console.log("");
console.log("Phase 11D test accounts are ready:");
console.log("");
console.log("TEACHER");
console.log("Email:    " + accounts.teacher.email);
console.log("Password: " + accounts.teacher.password);
console.log("");
console.log("STUDENT");
console.log("Email:    " + accounts.student.email);
console.log("Password: " + accounts.student.password);
console.log("");
console.log("Delete or change these test credentials after testing.");
