import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://farooqiquranacademy.com"),
  title: { default: "Farooqi Online Quran Academy", template: "%s | Farooqi Quran Academy" },
  description: "Online Quran classes with Tajweed for children, women and adults in Lahore and worldwide.",
  icons: { icon: "/logo.jpg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html suppressHydrationWarning><body>{children}</body></html>;
}
