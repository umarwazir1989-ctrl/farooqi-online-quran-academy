import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL || "https://farooqi-online-quran-academy.vercel.app";
  const locales = ["en", "ur"] as const;
  const routes = [
    { path: "", priority: 1.0 },
    { path: "/courses", priority: 0.95 },
    { path: "/teachers", priority: 0.9 },
    { path: "/fees", priority: 0.85 },
    { path: "/free-trial", priority: 0.95 },
    { path: "/about", priority: 0.8 },
    { path: "/contact", priority: 0.8 },
  ];

  return locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${base}/${locale}${route.path}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: locale === "ur" ? route.priority : Number((route.priority * 0.95).toFixed(2)),
    }))
  );
}
