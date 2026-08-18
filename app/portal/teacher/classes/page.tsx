import { requireRole } from "@/lib/portalAuth";
import { getTeacherActiveEnrollments } from "@/lib/learningServer";
import DashboardShell from "@/components/portal/DashboardShell";
import ClassRecordForm from "@/components/portal/ClassRecordForm";

export const dynamic = "force-dynamic";

export default async function TeacherClassesPage() {
  const profile = await requireRole(["teacher"]);
  const { teacher, enrollments } = await getTeacherActiveEnrollments(profile.id);

  return (
    <DashboardShell
      role="Teacher"
      name={teacher?.full_name || profile.full_name}
      title="Record Classes"
      subtitle="Mark attendance, learning progress and homework after each class."
      cards={[
        [String(enrollments.length), "Active Students", "Assigned active enrollments"],
        ["Daily", "Attendance", "Present, absent, late or leave"],
        ["1–5", "Performance", "Simple class performance rating"],
        ["Monthly", "Reports", "Progress is used in monthly reports"],
      ]}
      links={[
        ["Dashboard", "/portal/teacher"],
        ["Record Classes", "/portal/teacher/classes"],
      ]}
    >
      <div className="teacher-class-stack">
        {enrollments.length === 0 ? (
          <section className="dashboard-panel">
            <p>No active students are assigned to this teacher yet.</p>
          </section>
        ) : (
          enrollments.map((e: any) => (
            <ClassRecordForm
              key={e.id}
              enrollmentId={e.id}
              studentName={e.students?.full_name || "Student"}
              defaultDuration={e.class_schedules?.[0]?.duration_minutes || 30}
            />
          ))
        )}
      </div>
    </DashboardShell>
  );
}
