import { requireRole } from "@/lib/portalAuth";
import DashboardShell from "@/components/portal/DashboardShell";
import AdminQuranHealth from "@/components/quran/AdminQuranHealth";
import AdminLaunchAudit from "@/components/quran/AdminLaunchAudit";

export const dynamic = "force-dynamic";

export default async function Page(){
  const p=await requireRole(["admin"]);

  return <DashboardShell
    role="Admin"
    name={p.full_name}
    title="Quran Launch Readiness"
    titleUr="قرآن سسٹم لانچ تیاری"
    subtitle="Final release health, audit history and launch decision."
    subtitleUr="ریلیز سے پہلے سسٹم کی صحت، آڈٹ اور حتمی لانچ فیصلہ۔"
    cards={[
      ["Health","Check","Database + provider env","صحت","سسٹم چیک"],
      ["Security","Verify","Private keys and roles","سکیورٹی","رسائی"],
      ["Audit","Record","Pass / Warn / Fail","آڈٹ","فیصلہ"],
      ["Launch","Ready","Production candidate","لانچ","تیاری"],
    ]}
    links={[
      ["Dashboard","/portal/admin","ڈیش بورڈ"],
      ["Quran Monitor","/portal/admin/quran-monitor","قرآن مانیٹر"],
      ["Launch Readiness","/portal/admin/quran-launch","لانچ تیاری"],
      ["Accounts","/portal/admin/accounts","اکاؤنٹس"],
    ]}
  >
    <AdminQuranHealth/>
    <AdminLaunchAudit/>
  </DashboardShell>;
}
