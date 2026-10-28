import type { Metadata } from "next";
import AcademySite from "@/components/AcademySite";

export const metadata: Metadata = {
  title: "فاروقی آن لائن قرآن اکیڈمی | تجوید کے ساتھ آن لائن قرآن کلاسز",
  description:
    "بچوں، خواتین اور بڑوں کے لیے مستند مرد و خواتین اساتذہ کے ساتھ ناظرہ، تجوید، حفظ، نورانی قاعدہ اور اسلامی تعلیمات کی انفرادی آن لائن کلاسز۔",
  alternates: {
    canonical: "/ur",
    languages: {
      "ur-PK": "/ur",
      en: "/en",
      "x-default": "/en",
    },
  },
  openGraph: {
    type: "website",
    locale: "ur_PK",
    title: "فاروقی آن لائن قرآن اکیڈمی",
    description:
      "گھر بیٹھے مستند اساتذہ سے تجوید کے ساتھ قرآنِ مجید سیکھیے۔",
    images: ["/logo.jpg"],
  },
};

export default function UrduHomePage() {
  return <AcademySite locale="ur" />;
}
