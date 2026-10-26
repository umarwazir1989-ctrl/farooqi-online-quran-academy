import Link from "next/link";
import type { ReactNode } from "react";
import { getPortalLanguage, portalDictionary } from "@/lib/portalLanguage";
import PortalLanguageToggle from "@/components/portal/PortalLanguageToggle";
import PortalNav, { type PortalNavSection } from "@/components/portal/PortalNav";

type Props = {
  role: string;
  name?: string | null;
  title: string;
  titleUr?: string;
  subtitle: string;
  subtitleUr?: string;
  cards: Array<[string, string, string, string?, string?]>;
  links?: Array<[string, string, string?]>;
  children?: ReactNode;
};

const ROLE_SECTIONS: Record<string, PortalNavSection[]> = {
  admin: [
    {
      title: "Overview",
      titleUr: "مرکزی جائزہ",
      items: [
        { label: "Dashboard", labelUr: "ڈیش بورڈ", href: "/portal/admin" },
        { label: "Action Center", labelUr: "ایکشن سینٹر", href: "/portal/admin/action-center" },
        { label: "Analytics", labelUr: "تجزیاتی رپورٹ", href: "/portal/admin/analytics" },
        { label: "Global Search", labelUr: "جامع تلاش", href: "/portal/admin/search" },
      ],
    },
    {
      title: "Admissions & Directory",
      titleUr: "داخلے اور ریکارڈز",
      items: [
        { label: "Trial Applications", labelUr: "ٹرائل درخواستیں", href: "/portal/admin/trials" },
        { label: "Students", labelUr: "طلبہ", href: "/portal/admin/students" },
        { label: "Advanced Student Filter", labelUr: "تفصیلی تلاشِ طلبہ", href: "/portal/admin/students/advanced" },
        { label: "Teachers", labelUr: "اساتذہ", href: "/portal/admin/teachers" },
        { label: "Portal Accounts", labelUr: "پورٹل اکاؤنٹس", href: "/portal/admin/accounts" },
      ],
    },
    {
      title: "Academic Operations",
      titleUr: "تعلیمی نظام",
      items: [
        { label: "Class Schedules", labelUr: "کلاس اوقات", href: "/portal/admin/schedules" },
        { label: "Attendance Log", labelUr: "حاضری ریکارڈ", href: "/portal/admin/attendance" },
        { label: "Monthly Reports", labelUr: "ماہانہ رپورٹس", href: "/portal/admin/reports" },
        { label: "Reschedules", labelUr: "کلاس تبدیلی", href: "/portal/admin/reschedules" },
        { label: "Teacher Leave", labelUr: "اساتذہ رخصت", href: "/portal/admin/leave" },
        { label: "Substitutions", labelUr: "متبادل اساتذہ", href: "/portal/admin/substitutions" },
        { label: "Student Transfers", labelUr: "طالب علم منتقلی", href: "/portal/admin/transfers" },
      ],
    },
    {
      title: "Communications & Tools",
      titleUr: "ابلاغ اور آلات",
      items: [
        { label: "Announcements", labelUr: "اعلانات", href: "/portal/admin/announcements" },
        { label: "Academic Calendar", labelUr: "تعلیمی کیلنڈر", href: "/portal/admin/academic-calendar" },
        { label: "Bulk Student Import", labelUr: "اجتماعی اندراج (CSV/XLSX)", href: "/portal/admin/import" },
        { label: "Email Queue", labelUr: "ای میل قطار", href: "/portal/admin/email-queue" },
        { label: "Backup & Export", labelUr: "بیک اَپ اور ایکسپورٹ", href: "/portal/admin/backup" },
        { label: "Archive", labelUr: "آرکائیو", href: "/portal/admin/archive" },
        { label: "Audit Log", labelUr: "سرگرمی ریکارڈ", href: "/portal/admin/audit" },
      ],
    },
  ],
  teacher: [
    {
      title: "Teacher Workspace",
      titleUr: "استاد پورٹل",
      items: [
        { label: "Dashboard & Students", labelUr: "ڈیش بورڈ اور طلبہ", href: "/portal/teacher" },
        { label: "Record Daily Classes", labelUr: "کلاس اور سبق کا اندراج", href: "/portal/teacher/classes" },
        { label: "Schedule & Reschedule", labelUr: "کلاس اوقات اور تبدیلی", href: "/portal/teacher/calendar" },
        { label: "Leave Requests", labelUr: "رخصت کی درخواست", href: "/portal/teacher/leave" },
      ],
    },
  ],
  student: [
    {
      title: "Student Workspace",
      titleUr: "طالب علم پورٹل",
      items: [
        { label: "My Dashboard & Schedule", labelUr: "میرا ڈیش بورڈ اور اوقات", href: "/portal/student" },
        { label: "Progress & Homework", labelUr: "تعلیمی پیش رفت اور ہوم ورک", href: "/portal/student/progress" },
        { label: "Announcements", labelUr: "اعلانات", href: "/portal/student/announcements" },
      ],
    },
  ],
  parent: [
    {
      title: "Parent Workspace",
      titleUr: "والدین پورٹل",
      items: [
        { label: "Children Overview", labelUr: "بچوں کا جائزہ", href: "/portal/parent" },
        { label: "Attendance & Reports", labelUr: "حاضری اور ماہانہ رپورٹس", href: "/portal/parent/progress" },
        { label: "Notifications", labelUr: "اطلاعات", href: "/portal/parent/notifications" },
        { label: "Announcements", labelUr: "اعلانات", href: "/portal/parent/announcements" },
      ],
    },
  ],
};

export default async function DashboardShell({
  role,
  name,
  title,
  titleUr,
  subtitle,
  subtitleUr,
  cards,
  links,
  children,
}: Props) {
  const lang = await getPortalLanguage();
  const t = portalDictionary[lang];
  const rtl = lang === "ur";
  const normalizedRole = role.trim().toLowerCase();
  const sections = ROLE_SECTIONS[normalizedRole];

  return (
    <main className={`dashboard-shell ${rtl ? "portal-rtl" : ""}`} dir={rtl ? "rtl" : "ltr"}>
      <aside className="dashboard-sidebar">
        <div>
          <span className="dashboard-brand">FQ</span>
          <strong>Farooqi Quran Portal</strong>
          <small>{role}</small>
        </div>

        {sections ? (
          <PortalNav sections={sections} rtl={rtl} />
        ) : (
          <nav>
            {(links || []).map(([label, href, labelUr]) => (
              <Link href={href} key={`${label}-${href}`}>
                {rtl && labelUr ? labelUr : label}
              </Link>
            ))}
          </nav>
        )}

        <PortalLanguageToggle current={lang} label={t.switchLanguage} />

        <form action="/api/auth/logout" method="post">
          <button className="dashboard-logout" type="submit">
            {t.logout}
          </button>
        </form>
      </aside>

      <section className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <span className="eyebrow">{role}</span>
            <h1>{rtl && titleUr ? titleUr : title}</h1>
            <p>{rtl && subtitleUr ? subtitleUr : subtitle}</p>
          </div>

          <div className="dashboard-user">
            <span>{t.welcome}</span>
            <strong>{name || "User"}</strong>
          </div>
        </header>

        <div className="dashboard-cards">
          {cards.map(([number, label, detail, labelUr, detailUr]) => (
            <article key={label}>
              <strong>{number}</strong>
              <h2>{rtl && labelUr ? labelUr : label}</h2>
              <p>{rtl && detailUr ? detailUr : detail}</p>
            </article>
          ))}
        </div>

        {children || (
          <section className="dashboard-panel">
            <h2>{t.dashboard}</h2>
          </section>
        )}
      </section>
    </main>
  );
}
