import Link from "next/link";
import { requireRole } from "@/lib/portalAuth";
import { getStudentForEdit } from "@/lib/phase10Server";
import StudentEditForm from "@/components/portal/StudentEditForm";

export const dynamic="force-dynamic";

export default async function Page({params}:{params:Promise<{id:string}>}) {
  await requireRole(["admin"]);
  const {id}=await params;
  const student=await getStudentForEdit(id);

  return <main className="admin-shell">
    <div className="admin-top">
      <div>
        <span className="eyebrow">Farooqi Admin</span>
        <h1>Edit Student</h1>
        <p>{student.student_code}</p>
      </div>
      <Link className="btn btn-outline" href="/portal/admin/students/advanced">Back</Link>
    </div>
    <StudentEditForm student={student}/>
  </main>;
}
