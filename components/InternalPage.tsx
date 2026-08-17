
"use client";

import Image from "next/image";
import Link from "next/link";
import { siteData, type Locale } from "@/lib/siteData";

type Props = {
  locale: Locale;
  title: string;
  intro: string;
  pagePath: string;
  children: React.ReactNode;
};

export default function InternalPage({ locale, title, intro, pagePath, children }: Props) {
  const t = siteData[locale];

  return (
    <div dir={t.dir} lang={locale} className={locale === "ur" ? "urdu" : "english"}>
      <div className="topbar">
        <div className="wrap topbar-inner">
          <span>Lahore, Pakistan · Worldwide Online Classes</span>
          <div>
            <a href="tel:+923336519527">0333-6519527</a>
            <a href="mailto:umarwazir1989@gmail.com">umarwazir1989@gmail.com</a>
          </div>
        </div>
      </div>

      <header>
        <div className="wrap nav">
          <Link href={`/${locale}`} className="brand">
            <Image src="/logo.jpg" alt={t.academy} width={52} height={52} priority />
            <span>
              <strong>{t.academy}</strong>
              <small>Lahore · Pakistan</small>
            </span>
          </Link>

          <nav className="nav-links internal-nav" aria-label="Primary navigation">
            <Link href={`/${locale}`}>{t.home}</Link>
            <Link href={`/${locale}/about`}>{t.about}</Link>
            <Link href={`/${locale}/courses`}>{t.courses}</Link>
            <Link href={`/${locale}/teachers`}>{t.teachers}</Link>
            <Link href={`/${locale}/fees`}>{t.fees}</Link>
            <Link href={`/${locale}/contact`}>{t.contact}</Link>
          </nav>

          <div className="nav-actions">
            <Link className="portal-link" href="/portal">{t.portal}</Link>
            <Link className="language" href={`${t.otherPath}${pagePath}`}>
              {t.other}
            </Link>
            <Link className="btn btn-small" href={`/${locale}/free-trial`}>
              {t.trial}
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="inner-hero">
          <div className="wrap inner-hero-grid">
            <div>
              <span className="eyebrow">{t.academy}</span>
              <h1>{title}</h1>
              <p>{intro}</p>
            </div>
            <div className="inner-verse">
              <div className="arabic">وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا</div>
              <p>{locale === "ur" ? "اور قرآن کو خوب ٹھہر ٹھہر کر پڑھیں۔" : "And recite the Quran with measured recitation."}</p>
            </div>
          </div>
        </section>

        {children}
      </main>

      <footer>
        <div className="wrap footer">
          <div className="brand">
            <Image src="/logo.jpg" alt="" width={48} height={48} />
            <span><strong>{t.academy}</strong><small>Lahore · Pakistan</small></span>
          </div>
          <p>{t.tagline}</p>
          <p>© {new Date().getFullYear()} Farooqi Online Quran Academy</p>
        </div>
      </footer>
    </div>
  );
}

