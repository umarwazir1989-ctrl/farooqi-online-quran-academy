import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/portalAuth";
import { getTrialById, listCourses, listTeachers } from "@/lib/academyServer";
import ConvertTrialForm from "@/components/portal/ConvertTrialForm";

export const dynamic = "force-dynamic";

export default async function TrialDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole(["admin"]);
  const { id } = await params;

  const [trial, courses, teachers] = await Promise.all([
    getTrialById(id),
    listCourses(),
    listTeachers(),
  ]);

  if (!trial) notFound();

  return (
    <main className="admin-detail-shell">
      <div className="admin-detail-top">
        <div>
          <Link href="/portal/admin/trials" className="text-link">← Trial Applications</Link>
          <h1>{trial.student_name}</h1>
          <p>{trial.country}{trial.city ? ` · ${trial.city}` : ""}</p>
        </div>
        <span className={`status-pill status-${trial.status}`}>{trial.status}</span>
      </div>

      <div className="admin-detail-grid">
        <section className="admin-detail-card">
          <h2>Trial Application</h2>
          <dl className="detail-list">
            <div><dt>Parent</dt><dd>{trial.parent_name || "—"}</dd></div>
            <div><dt>WhatsApp</dt><dd>{trial.whatsapp}</dd></div>
            <div><dt>Email</dt><dd>{trial.email || "—"}</dd></div>
            <div><dt>Age</dt><dd>{trial.age || "—"}</dd></div>
            <div><dt>Gender</dt><dd>{trial.gender || "—"}</dd></div>
            <div><dt>Requested course</dt><dd>{trial.course}</dd></div>
            <div><dt>Teacher preference</dt><dd>{trial.preferred_teacher_gender || "—"}</dd></div>
            <div><dt>Language</dt><dd>{trial.preferred_language || "—"}</dd></div>
            <div><dt>Preferred days</dt><dd>{(trial.preferred_days || []).join(", ") || "—"}</dd></div>
            <div><dt>Preferred time</dt><dd>{trial.preferred_time || "—"}</dd></div>
            <div><dt>Timezone</dt><dd>{trial.timezone || "—"}</dd></div>
            <div><dt>Current level</dt><dd>{trial.previous_level || "—"}</dd></div>
          </dl>
        </section>

        {trial.status === "enrolled" ? (
          <section className="admin-detail-card">
            <h2>Already Enrolled</h2>
            <p>This trial application has already been converted to a student.</p>
            <Link className="btn" href="/portal/admin/students">View Students</Link>
          </section>
        ) : (
          <ConvertTrialForm
            trialId={trial.id}
            courses={courses || []}
            teachers={teachers || []}
            preferredDays={trial.preferred_days || []}
            preferredTime={trial.preferred_time}
            timezone={trial.timezone}
          />
        )}
      </div>
    </main>
  );
}
