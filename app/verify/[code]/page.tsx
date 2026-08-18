import { getVerificationByCode } from "@/lib/phase10Server";

export const dynamic="force-dynamic";

export default async function Page({params}:{params:Promise<{code:string}>}) {
  const {code}=await params;
  const data=await getVerificationByCode(code);

  return <main className="verification-page">
    <section className="verification-card">
      <span className="eyebrow">Farooqi Quran Academy</span>

      {data ? <>
        <div className="verification-icon">✓</div>
        <h1>Verified Student</h1>
        <p>This student record is valid in the Farooqi Quran Portal.</p>

        <dl>
          <div><dt>Student</dt><dd>{data.full_name}</dd></div>
          <div><dt>Student Code</dt><dd>{data.student_code}</dd></div>
          <div><dt>Course</dt><dd>{data.course_name||"—"}</dd></div>
          <div><dt>Teacher</dt><dd>{data.teacher_name||"—"}</dd></div>
          <div><dt>Status</dt><dd>{data.student_status}</dd></div>
        </dl>
      </> : <>
        <div className="verification-icon verification-invalid">×</div>
        <h1>Verification Failed</h1>
        <p>This code is invalid or has been revoked.</p>
      </>}
    </section>
  </main>;
}
