import { requireRole } from "@/lib/portalAuth";
import DashboardShell from "@/components/portal/DashboardShell";
import AdminQuranMonitor from "@/components/quran/AdminQuranMonitor";
import AdminQuranHealth from "@/components/quran/AdminQuranHealth";

export const dynamic = "force-dynamic";

export default async function Page() {
  const p = await requireRole(["admin"]);

  return <DashboardShell
    role="Admin"
    name={p.full_name}
    title="Quran System Monitor"
    titleUr="قرآن سسٹم مانیٹر"
    subtitle="Operational overview and release health checks."
    subtitleUr="قرآن سسٹم کی سرگرمی، صحت اور ریلیز تیاری کا انتظامی جائزہ۔"
    cards={[
      ["Monitor","Activity","Attempts and assignments","مانیٹر","سرگرمیاں"],
      ["Health","Checks","Database and environment","صحت","سسٹم چیک"],
      ["Review","Queue","Pending teacher reviews","تصحیح","زیر التوا"],
      ["Release","Ready","Production readiness","ریلیز","تیاری"],
    ]}
    links={[
      ["Dashboard","/portal/admin","ڈیش بورڈ"],
      ["Accounts","/portal/admin/accounts","اکاؤنٹس"],
      ["Quran Monitor","/portal/admin/quran-monitor","قرآن مانیٹر"],
      ["Analytics","/portal/admin/analytics","تجزیات"],
    ]}
  >
    <AdminQuranHealth/>
    <AdminQuranMonitor/>
  </DashboardShell>;
}
