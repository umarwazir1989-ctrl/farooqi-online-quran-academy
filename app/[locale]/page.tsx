import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AcademySite from "@/components/AcademySite";

const locales = ["ur", "en"] as const;
type Locale = (typeof locales)[number];

export function generateStaticParams() { return locales.map((locale) => ({ locale })); }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isUrdu = locale === "ur";
  return {
    title: isUrdu ? "فاروقی آن لائن قرآن اکیڈمی لاہور" : "Online Quran Classes with Tajweed in Lahore",
    description: isUrdu
      ? "مستند مرد و خواتین اساتذہ کے ساتھ بچوں، خواتین اور بڑوں کے لیے آن لائن قرآن، تجوید، حفظ اور اسلامی تعلیمات۔"
      : "Private online Quran classes with Tajweed, Hifz and Islamic studies for children, women and adults.",
    alternates: { canonical: `/${locale}`, languages: { "ur-PK": "/ur", "en": "/en" } },
    openGraph: {
      type: "website", locale: isUrdu ? "ur_PK" : "en_US",
      title: isUrdu ? "فاروقی آن لائن قرآن اکیڈمی" : "Farooqi Online Quran Academy",
      description: isUrdu ? "گھر بیٹھے تجوید کے ساتھ قرآن سیکھیے۔" : "Learn Quran online with qualified male and female tutors.",
      images: ["/logo.jpg"]
    }
  };
}

export default async function LocalePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  return <AcademySite locale={locale as Locale}/>;
}
