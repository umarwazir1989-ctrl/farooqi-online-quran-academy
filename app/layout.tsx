import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://farooqi-online-quran-academy.vercel.app"
  ),
  title: {
    default: "فاروقی آن لائن قرآن اکیڈمی | Farooqi Online Quran Academy",
    template: "%s | Farooqi Online Quran Academy",
  },
  description:
    "مستند قراء و معلمات کے ساتھ انفرادی آن لائن قرآن کلاسز۔ نورانی قاعدہ مع آڈیو، تجوید القرآن، حفظ، فہمِ حدیث و فقہ۔ One-to-one online Quran classes with Tajweed, Hifz, Noorani Qaida and Islamic studies for children, women and adults worldwide.",
  keywords: [
    "Online Quran Academy",
    "Learn Quran Online",
    "Noorani Qaida with Audio",
    "Tajweed Quran Classes",
    "Female Quran Teacher Online",
    "Online Quran Classes Lahore",
    "Quran Memorization Hifz",
    "Qari Muhammad Umar Farooqi",
    "فاروقی آن لائن قرآن اکیڈمی",
    "آن لائن قرآن اکیڈمی",
    "نورانی قاعدہ آن لائن",
    "تجوید قرآن آن لائن",
    "خواتین کے لیے آن لائن قرآن کلاسز",
    "حفظ قرآن آن لائن",
  ],
  authors: [{ name: "Qari Muhammad Umar Farooqi" }],
  creator: "Farooqi Online Quran Academy",
  publisher: "Farooqi Online Quran Academy",
  icons: { icon: "/logo.jpg", apple: "/logo.jpg" },
  openGraph: {
    type: "website",
    url: "https://farooqi-online-quran-academy.vercel.app",
    title: "فاروقی آن لائن قرآن اکیڈمی | Farooqi Online Quran Academy",
    description:
      "تجوید، محبت اور اعتماد کے ساتھ بچوں، خواتین اور بڑوں کے لیے معیاری آن لائن قرآن تعلیم۔ مستند مرد و خواتین اساتذہ، مفت ٹرائل اور لائیو پورٹل۔",
    images: [
      {
        url: "/logo.jpg",
        width: 800,
        height: 800,
        alt: "Farooqi Online Quran Academy Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Farooqi Online Quran Academy | آن لائن قرآن اکیڈمی",
    description:
      "One-to-one online Quran classes with qualified male and female tutors. Noorani Qaida, Tajweed, Hifz and Islamic studies worldwide.",
    images: ["/logo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      "@id": "https://farooqi-online-quran-academy.vercel.app/#organization",
      name: "Farooqi Online Quran Academy",
      alternateName: "فاروقی آن لائن قرآن اکیڈمی",
      url: "https://farooqi-online-quran-academy.vercel.app",
      logo: "https://farooqi-online-quran-academy.vercel.app/logo.jpg",
      description:
        "Worldwide premier online Quran academy based in Lahore, Pakistan providing private 1-to-1 Quranic and Islamic education with certified scholars and female tutors.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Lahore",
        addressRegion: "Punjab",
        addressCountry: "PK",
      },
      telephone: "+923336519527",
      email: "umarwazir1989@gmail.com",
      sameAs: [
        "https://github.com/umarwazir1989-ctrl/farooqi-online-quran-academy",
        "https://farooqi-online-quran-academy.vercel.app",
      ],
      founder: {
        "@type": "Person",
        name: "Qari Muhammad Umar Farooqi",
        jobTitle: "Founder & Principal",
        knowsAbout: ["Qira'at Sab'ah", "Qira'at 'Asharah", "Dars-e-Nizami", "Tajweed", "Hifz"],
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://farooqi-online-quran-academy.vercel.app/#website",
      url: "https://farooqi-online-quran-academy.vercel.app",
      name: "Farooqi Online Quran Academy",
      inLanguage: ["ur", "en"],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
