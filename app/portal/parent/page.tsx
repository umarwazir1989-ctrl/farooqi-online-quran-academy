import DashboardShell from "@/components/portal/DashboardShell";
import { requireRole } from "@/lib/portalAuth";

export default async function ParentDashboard() {
  const profile = await requireRole(["parent"]);

  return (
    <DashboardShell
      role="Parent"
      name={profile.full_name}
      title="Parent Dashboard"
      subtitle="Monitor your children's classes, attendance and progress."
      cards={[
        ["—", "Children", "Linked student accounts"],
        ["—", "Next Class", "Upcoming family class"],
        ["—", "Attendance", "Monthly attendance"],
        ["—", "Reports", "Available progress reports"],
      ]}
      links={[
        ["Dashboard", "/portal/parent"],
        ["My Children", "/portal/parent/children"],
        ["Classes", "/portal/parent/classes"],
        ["Reports", "/portal/parent/reports"],
        ["Fees", "/portal/parent/fees"],
      ]}
    />
  );
}
