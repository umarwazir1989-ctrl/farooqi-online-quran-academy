import { requireRole } from "@/lib/portalAuth";
import DashboardShell from "@/components/portal/DashboardShell";
import AdminLaunchDiagnostics from "@/components/quran/AdminLaunchDiagnostics";
import AdminQuranHealth from "@/components/quran/AdminQuranHealth";

export const dynamic = "force-dynamic";

export default async function Page() {
  const p = await requireRole(["admin"]);

  return (
    <DashboardShell
      role="Admin"
      name={p.full_name}
      title="Live Launch Tests"
      titleUr="لائیو لانچ ٹیسٹس"
      subtitle="Check database tables, storage buckets, environment and release health."
      subtitleUr="ڈیٹابیس، اسٹوریج، ماحول اور ریلیز صحت کی حتمی جانچ۔"
      cards={[
        ["Database", "Schema", "Required tables", "ڈیٹابیس", "ضروری ٹیبلز"],
        ["Storage", "Buckets", "Private recordings", "اسٹوریج", "ریکارڈنگ"],
        ["Environment", "Secrets", "Server configuration", "ماحول", "کنفیگریشن"],
        ["Release", "Status", "Ready for role tests", "ریلیز", "حالت"],
      ]}
      links={[
        ["Dashboard", "/portal/admin", "ڈیش بورڈ"],
        ["Quran Monitor", "/portal/admin/quran-monitor", "قرآن مانیٹر"],
        ["Launch Readiness", "/portal/admin/quran-launch", "لانچ تیاری"],
        ["Live Tests", "/portal/admin/launch-tests", "لائیو ٹیسٹس"],
      ]}
    >
      <AdminQuranHealth />
      <AdminLaunchDiagnostics />
    </DashboardShell>
  );
}
