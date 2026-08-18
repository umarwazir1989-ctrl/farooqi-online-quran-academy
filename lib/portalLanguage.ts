import { cookies } from "next/headers";

export type PortalLanguage = "en" | "ur";

export async function getPortalLanguage(): Promise<PortalLanguage> {
  const store = await cookies();
  const value = store.get("fq_portal_lang")?.value;
  return value === "ur" ? "ur" : "en";
}

export const portalDictionary = {
  en: {
    dashboard: "Dashboard",
    students: "Students",
    teachers: "Teachers",
    parents: "Parents",
    classes: "Classes",
    progress: "Progress",
    reports: "Reports",
    attendance: "Attendance",
    announcements: "Announcements",
    notifications: "Notifications",
    leave: "Leave",
    calendar: "Academic Calendar",
    analytics: "Analytics",
    audit: "Audit Log",
    backup: "Backup & Export",
    accounts: "Portal Accounts",
    trials: "Trial Applications",
    reschedules: "Reschedules",
    substitutions: "Substitutions",
    transfers: "Student Transfers",
    archive: "Archive",
    search: "Search",
    logout: "Logout",
    welcome: "Welcome",
    switchLanguage: "اردو",
  },
  ur: {
    dashboard: "ڈیش بورڈ",
    students: "طلبہ",
    teachers: "اساتذہ",
    parents: "والدین",
    classes: "کلاسز",
    progress: "تعلیمی پیش رفت",
    reports: "رپورٹس",
    attendance: "حاضری",
    announcements: "اعلانات",
    notifications: "اطلاعات",
    leave: "رخصت",
    calendar: "تعلیمی کیلنڈر",
    analytics: "تجزیاتی رپورٹ",
    audit: "سرگرمی ریکارڈ",
    backup: "بیک اَپ اور ایکسپورٹ",
    accounts: "پورٹل اکاؤنٹس",
    trials: "ٹرائل درخواستیں",
    reschedules: "کلاس تبدیلی",
    substitutions: "متبادل اساتذہ",
    transfers: "طالب علم منتقلی",
    archive: "آرکائیو",
    search: "تلاش",
    logout: "لاگ آؤٹ",
    welcome: "خوش آمدید",
    switchLanguage: "English",
  },
} as const;
