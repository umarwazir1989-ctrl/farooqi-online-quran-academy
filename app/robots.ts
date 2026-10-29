import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://farooqi-online-quran-academy.vercel.app";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/portal/admin", "/api/admin"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
