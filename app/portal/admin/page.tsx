import DashboardShell from "@/components/portal/DashboardShell";
import { requireRole } from "@/lib/portalAuth";

export default async function AdminDashboard() {
  const profile = await requireRole(["admin"]);

  return (
    <DashboardShell
      role="Admin"
      name={profile.full_name}
      title="Admin Dashboard"
      subtitle="Manage admissions, teachers, students and academy operations."
      cards={[
        ["50+", "Students", "Current academy learners"],
        ["5", "Teachers", "Qualified male & female tutors"],
        ["New", "Trial Applications", "Open trial applications"],
        ["—", "Today's Classes", "Scheduling connects in Phase 3B"],
      ]}
      links={[
        ["Dashboard", "/portal/admin"],
        ["Trial Applications", "/portal/admin/trials"],
        ["Students", "/portal/admin/students"],
        ["Teachers", "/portal/admin/teachers"],
        ["Schedules", "/portal/admin/schedules"],
      ]}
    />
  );
}
