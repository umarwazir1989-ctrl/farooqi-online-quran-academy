import Link from "next/link";
import { requireRole } from "@/lib/portalAuth";
import { getTeacherForEdit } from "@/lib/phase10Server";
import TeacherEditForm from "@/components/portal/TeacherEditForm";

export const dynamic="force-dynamic";

export default async function Page({params}:{params:Promise<{id:string}>}) {
  await requireRole(["admin"]);
  const {id}=await params;
  const teacher=await getTeacherForEdit(id);

  return <main className="admin-shell">
    <div className="admin-top">
      <div>
        <span className="eyebrow">Farooqi Admin</span>
        <h1>Edit Teacher</h1>
        <p>{teacher.teacher_code}</p>
      </div>
      <Link className="btn btn-outline" href="/portal/admin/teachers">Back</Link>
    </div>
    <TeacherEditForm teacher={teacher}/>
  </main>;
}
