import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://farooqiquranacademy.com";
  return [
    { locale: "en", priority: 1 },
    { locale: "ur", priority: 0.8 },
  ].map(({ locale, priority }) => ({
    url: `${base}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority,
  }));
}
