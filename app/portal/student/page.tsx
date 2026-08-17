import DashboardShell from "@/components/portal/DashboardShell";
import { requireRole } from "@/lib/portalAuth";

export default async function StudentDashboard() {
  const profile = await requireRole(["student"]);

  return (
    <DashboardShell
      role="Student"
      name={profile.full_name}
      title="Student Dashboard"
      subtitle="Your classes, lessons, homework and Quran progress."
      cards={[
        ["—", "Next Class", "Upcoming lesson"],
        ["—", "Current Course", "Your active course"],
        ["—", "Attendance", "Monthly attendance"],
        ["—", "Progress", "Academic progress"],
      ]}
      links={[
        ["Dashboard", "/portal/student"],
        ["My Classes", "/portal/student/classes"],
        ["My Progress", "/portal/student/progress"],
        ["Homework", "/portal/student/homework"],
      ]}
    />
  );
}
