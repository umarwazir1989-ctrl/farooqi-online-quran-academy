import DashboardShell from "@/components/portal/DashboardShell";
import { requireRole } from "@/lib/portalAuth";

export default async function TeacherDashboard() {
  const profile = await requireRole(["teacher"]);

  return (
    <DashboardShell
      role="Teacher"
      name={profile.full_name}
      title="Teacher Dashboard"
      subtitle="View students, classes, lessons and progress."
      cards={[
        ["—", "Today's Classes", "Daily class schedule"],
        ["—", "My Students", "Assigned learners"],
        ["—", "Reports Due", "Monthly progress reports"],
        ["—", "Attendance", "Teacher attendance summary"],
      ]}
      links={[
        ["Dashboard", "/portal/teacher"],
        ["My Classes", "/portal/teacher/classes"],
        ["My Students", "/portal/teacher/students"],
        ["Reports", "/portal/teacher/reports"],
      ]}
    />
  );
}
