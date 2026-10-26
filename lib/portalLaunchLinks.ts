export type PortalLink = [string, string, string];

export const adminQuranLinks: PortalLink[] = [
  ["Dashboard", "/portal/admin", "ڈیش بورڈ"],
  ["Quran Monitor", "/portal/admin/quran-monitor", "قرآن مانیٹر"],
  ["Launch Readiness", "/portal/admin/quran-launch", "لانچ تیاری"],
  ["Live Tests", "/portal/admin/launch-tests", "لائیو ٹیسٹس"],
];

export const teacherQuranLinks: PortalLink[] = [
  ["Dashboard", "/portal/teacher", "ڈیش بورڈ"],
  ["Qaida Review", "/portal/teacher/qaida-review", "قاعدہ تصحیح"],
  ["Qaida Control", "/portal/teacher/qaida-control", "قاعدہ کنٹرول"],
  ["Quran Assignments", "/portal/teacher/quran-assignments", "قرآن اسائنمنٹس"],
  ["Quran Review", "/portal/teacher/quran-review", "قرآن تصحیح"],
  ["Quran Analytics", "/portal/teacher/quran-analytics", "قرآن تجزیہ"],
];

export const studentQuranLinks: PortalLink[] = [
  ["Dashboard", "/portal/student", "ڈیش بورڈ"],
  ["Qaida", "/portal/student/qaida", "قاعدہ"],
  ["Qaida Practice", "/portal/student/qaida-practice", "قاعدہ مشق"],
  ["Quran Reading", "/portal/student/quran-reading", "قرآن خوانی"],
  ["Quran Assignments", "/portal/student/quran-assignments", "قرآن اسائنمنٹس"],
  ["Quran Progress", "/portal/student/quran-progress", "قرآن پیش رفت"],
];

export const parentQuranLinks: PortalLink[] = [
  ["Dashboard", "/portal/parent", "ڈیش بورڈ"],
  ["Qaida Progress", "/portal/parent/qaida-progress", "قاعدہ پیش رفت"],
  ["Quran Progress", "/portal/parent/quran-progress", "قرآن پیش رفت"],
  ["Weekly Quran", "/portal/parent/quran-weekly", "ہفتہ وار قرآن"],
];
