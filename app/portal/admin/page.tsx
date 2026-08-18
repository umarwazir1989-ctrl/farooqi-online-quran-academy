import DashboardShell from "@/components/portal/DashboardShell";
import { requireRole } from "@/lib/portalAuth";
export default async function Page(){const p=await requireRole(["admin"]);return <DashboardShell role="Admin" name={p.full_name}
title="Admin Dashboard" subtitle="Manage admissions, portal accounts, teachers, students and schedules."
cards={[["50+","Students","Current academy learners"],["5","Teachers","Qualified male & female tutors"],["Portal","Accounts","Student, parent & teacher access"],["Live","Supabase","Production database connected"]]}
links={[["Dashboard","/portal/admin"],["Trial Applications","/portal/admin/trials"],["Portal Accounts","/portal/admin/accounts"],["Students","/portal/admin/students"],["Teachers","/portal/admin/teachers"],["Schedules","/portal/admin/schedules"]]}/>;}
