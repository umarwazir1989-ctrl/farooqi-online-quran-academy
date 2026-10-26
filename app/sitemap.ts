import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL || "https://farooqiquranacademy.com";
  const locales = ["en", "ur"] as const;
  const routes = [
    { path: "", priority: 1.0 },
    { path: "/courses", priority: 0.9 },
    { path: "/fees", priority: 0.9 },
    { path: "/free-trial", priority: 0.95 },
    { path: "/teachers", priority: 0.85 },
    { path: "/about", priority: 0.8 },
    { path: "/contact", priority: 0.8 },
  ];

  return locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${base}/${locale}${route.path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: locale === "en" ? route.priority : Number((route.priority * 0.95).toFixed(2)),
    }))
  );
}
