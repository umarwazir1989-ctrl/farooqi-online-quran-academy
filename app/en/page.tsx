import type { Metadata } from "next";
import AcademySite from "@/components/AcademySite";

export const metadata: Metadata = {
  title: "Farooqi Online Quran Academy | Online Quran Classes with Tajweed",
  description:
    "One-to-one online Quran classes with qualified male and female tutors for children, women and adults. Learn Noorani Qaida, Quran reading, Tajweed, Hifz and Islamic studies.",
  alternates: {
    canonical: "/en",
    languages: {
      "ur-PK": "/ur",
      en: "/en",
      "x-default": "/en",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Farooqi Online Quran Academy",
    description:
      "Learn the Quran online with qualified male and female tutors through structured one-to-one classes.",
    images: ["/logo.jpg"],
  },
};

export default function EnglishHomePage() {
  return <AcademySite locale="en" />;
}
