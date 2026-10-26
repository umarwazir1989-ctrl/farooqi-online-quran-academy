"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
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
  const isUrdu = locale === "ur";
  const [open, setOpen] = useState(false);

  return (
    <div dir={t.dir} lang={locale} className={isUrdu ? "urdu" : "english"}>
      <div className="topbar">
        <div className="wrap topbar-inner">
          <span className="topbar-tagline">
            <i className="topbar-dot" aria-hidden="true" />
            {isUrdu
              ? "لاہور، پاکستان · دنیا بھر کے لیے آن لائن قرآن کلاسز"
              : "Lahore, Pakistan · Worldwide Online Quran Classes"}
          </span>
          <div className="topbar-contacts">
            <a href="tel:+923336519527">☎ 0333-6519527</a>
            <a href="mailto:umarwazir1989@gmail.com">✉ umarwazir1989@gmail.com</a>
          </div>
        </div>
      </div>

      <header>
        <div className="wrap nav">
          <Link href={`/${locale}`} className="brand">
            <div className="brand-logo-frame">
              <Image src="/logo.jpg" alt={t.academy} width={50} height={50} priority />
            </div>
            <span>
              <strong>{t.academy}</strong>
              <small>{isUrdu ? "لاہور · پاکستان" : "Lahore · Pakistan"}</small>
            </span>
          </Link>

          <nav className={open ? "nav-links internal-nav open" : "nav-links internal-nav"} aria-label="Primary navigation">
            <Link href={`/${locale}`} onClick={() => setOpen(false)}>{t.home}</Link>
            <Link href={`/${locale}/about`} onClick={() => setOpen(false)}>{t.about}</Link>
            <Link href={`/${locale}/courses`} onClick={() => setOpen(false)}>{t.courses}</Link>
            <Link href={`/${locale}/teachers`} onClick={() => setOpen(false)}>{t.teachers}</Link>
            <Link href={`/${locale}/fees`} onClick={() => setOpen(false)}>{t.fees}</Link>
            <Link href={`/${locale}/contact`} onClick={() => setOpen(false)}>{t.contact}</Link>
            <Link className="portal-mobile" href="/portal" onClick={() => setOpen(false)}>{t.portal}</Link>
            <Link className="language-mobile" href={`${t.otherPath}${pagePath}`} onClick={() => setOpen(false)}>
              {t.other}
            </Link>
          </nav>

          <div className="nav-actions">
            <Link className="portal-link" href="/portal">{t.portal}</Link>
            <Link className="language" href={`${t.otherPath}${pagePath}`}>
              {t.other}
            </Link>
            <Link className="btn btn-gold btn-small" href={`/${locale}/free-trial`}>
              {t.trial}
            </Link>
            <button
              className="menu"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-label="Toggle navigation"
              type="button"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="inner-hero">
          <div className="wrap inner-hero-grid">
            <div>
              <span className="eyebrow">
                <b className="eyebrow-star" aria-hidden="true">✦</b> {t.academy}
              </span>
              <h1>{title}</h1>
              <p>{intro}</p>
            </div>
            <div className="inner-verse">
              <div className="hero-card-badge">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
              <div className="arabic">وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا</div>
              <p>{isUrdu ? "اور قرآن کو خوب ٹھہر ٹھہر کر پڑھیں۔ (سورۃ المزمل: ۴)" : "And recite the Quran with measured recitation. (Surah Al-Muzzammil: 4)"}</p>
            </div>
          </div>
        </section>

        {children}
      </main>

      <footer>
        <div className="wrap footer">
          <div className="brand">
            <div className="brand-logo-frame">
              <Image src="/logo.jpg" alt="" width={46} height={46} />
            </div>
            <span>
              <strong>{t.academy}</strong>
              <small>{isUrdu ? "لاہور · پاکستان" : "Lahore · Pakistan"}</small>
            </span>
          </div>
          <p>{t.tagline}</p>
          <p>
            {isUrdu
              ? `© ${new Date().getFullYear()} فاروقی آن لائن قرآن اکیڈمی · جملہ حقوق محفوظ ہیں`
              : `© ${new Date().getFullYear()} Farooqi Online Quran Academy`}
          </p>
        </div>
      </footer>

      <a
        className="floating-whatsapp"
        href="https://wa.me/923336519527"
        target="_blank"
        rel="noreferrer"
        aria-label={isUrdu ? "واٹس ایپ" : "WhatsApp"}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.625.846 5.059 2.284 7.033l-1.492 5.448 5.601-1.469c1.912 1.044 4.103 1.638 6.433 1.638 6.627 0 12-5.373 12-12s-5.373-12-12-12z"/>
        </svg>
      </a>
    </div>
  );
}
