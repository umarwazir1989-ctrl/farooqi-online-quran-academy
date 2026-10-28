import type { Metadata } from "next";
import AcademySite from "@/components/AcademySite";

const locales = ["ur", "en"] as const;
type Locale = (typeof locales)[number];

export function generateStaticParams() {
  return [{ locale: "ur" }, { locale: "en" }];
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }> | { locale: string };
}): Promise<Metadata> {
  const resolved = await Promise.resolve(props.params);
  const rawLocale = resolved?.locale;
  const locale: Locale = rawLocale === "ur" ? "ur" : "en";
  const isUrdu = locale === "ur";

  return {
    title: isUrdu
      ? "فاروقی آن لائن قرآن اکیڈمی | تجوید کے ساتھ آن لائن قرآن کلاسز"
      : "Farooqi Online Quran Academy | Online Quran Classes with Tajweed",
    description: isUrdu
      ? "بچوں، خواتین اور بڑوں کے لیے مستند مرد و خواتین اساتذہ کے ساتھ ناظرہ، تجوید، حفظ، نورانی قاعدہ اور اسلامی تعلیمات کی انفرادی آن لائن کلاسز۔"
      : "One-to-one online Quran classes with qualified male and female tutors for children, women and adults. Learn Noorani Qaida, Quran reading, Tajweed, Hifz and Islamic studies.",
    alternates: {
      canonical: `/${locale}`,
      languages: {
        "ur-PK": "/ur",
        en: "/en",
        "x-default": "/en",
      },
    },
    openGraph: {
      type: "website",
      locale: isUrdu ? "ur_PK" : "en_US",
      title: isUrdu
        ? "فاروقی آن لائن قرآن اکیڈمی"
        : "Farooqi Online Quran Academy",
      description: isUrdu
        ? "گھر بیٹھے مستند اساتذہ سے تجوید کے ساتھ قرآنِ مجید سیکھیے۔"
        : "Learn the Quran online with qualified male and female tutors through structured one-to-one classes.",
      images: ["/logo.jpg"],
    },
  };
}

export default async function LocalePage(props: {
  params: Promise<{ locale: string }> | { locale: string };
}) {
  const resolved = await Promise.resolve(props.params);
  const rawLocale = resolved?.locale;
  const locale: Locale = rawLocale === "ur" ? "ur" : "en";

  return <AcademySite locale={locale} />;
}
