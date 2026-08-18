import { requireRole } from "@/lib/portalAuth";
import { getTeacherLeaveData } from "@/lib/adminOpsServer";
import DashboardShell from "@/components/portal/DashboardShell";
import TeacherLeaveForm from "@/components/portal/TeacherLeaveForm";

export const dynamic = "force-dynamic";

export default async function TeacherLeavePage() {
  const profile = await requireRole(["teacher"]);
  const { teacher, requests } = await getTeacherLeaveData(profile.id);

  return (
    <DashboardShell
      role="Teacher"
      name={teacher?.full_name || profile.full_name}
      title="Teacher Leave"
      subtitle="Submit and review your leave requests."
      cards={[
        [String(requests.length), "Requests", "All submitted leave requests"],
        [String(requests.filter((r: any) => r.status === "pending").length), "Pending", "Awaiting admin decision"],
        [String(requests.filter((r: any) => r.status === "approved").length), "Approved", "Approved requests"],
        ["Calendar", "Planning", "Coordinate classes around leave"],
      ]}
      links={[
        ["Dashboard", "/portal/teacher"],
        ["Record Classes", "/portal/teacher/classes"],
        ["Class Calendar", "/portal/teacher/calendar"],
        ["Leave", "/portal/teacher/leave"],
      ]}
    >
      <TeacherLeaveForm />

      <section className="dashboard-panel">
        <h2>My Leave Requests</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Start</th>
                <th>End</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r: any) => (
                <tr key={r.id}>
                  <td>{r.leave_type}</td>
                  <td>{r.start_date}</td>
                  <td>{r.end_date}</td>
                  <td>{r.reason || "—"}</td>
                  <td><span className={`status-pill status-${r.status}`}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardShell>
  );
}
