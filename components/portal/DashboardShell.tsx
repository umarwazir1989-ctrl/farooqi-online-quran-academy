import Link from "next/link";
import type { ReactNode } from "react";
import { getPortalLanguage, portalDictionary } from "@/lib/portalLanguage";
import PortalLanguageToggle from "@/components/portal/PortalLanguageToggle";

type Props = {
  role: string;
  name?: string | null;
  title: string;
  titleUr?: string;
  subtitle: string;
  subtitleUr?: string;
  cards: Array<[string, string, string, string?, string?]>;
  links: Array<[string, string, string?]>;
  children?: ReactNode;
};

export default async function DashboardShell({
  role,
  name,
  title,
  titleUr,
  subtitle,
  subtitleUr,
  cards,
  links,
  children,
}: Props) {
  const lang = await getPortalLanguage();
  const t = portalDictionary[lang];
  const rtl = lang === "ur";

  return (
    <main className={`dashboard-shell ${rtl ? "portal-rtl" : ""}`} dir={rtl ? "rtl" : "ltr"}>
      <aside className="dashboard-sidebar">
        <div>
          <span className="dashboard-brand">FQ</span>
          <strong>Farooqi Quran Portal</strong>
          <small>{role}</small>
        </div>

        <nav>
          {links.map(([label, href, labelUr]) => (
            <Link href={href} key={`${label}-${href}`}>
              {rtl && labelUr ? labelUr : label}
            </Link>
          ))}
        </nav>

        <PortalLanguageToggle current={lang} label={t.switchLanguage} />

        <form action="/api/auth/logout" method="post">
          <button className="dashboard-logout" type="submit">
            {t.logout}
          </button>
        </form>
      </aside>

      <section className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <span className="eyebrow">{role}</span>
            <h1>{rtl && titleUr ? titleUr : title}</h1>
            <p>{rtl && subtitleUr ? subtitleUr : subtitle}</p>
          </div>

          <div className="dashboard-user">
            <span>{t.welcome}</span>
            <strong>{name || "User"}</strong>
          </div>
        </header>

        <div className="dashboard-cards">
          {cards.map(([number, label, detail, labelUr, detailUr]) => (
            <article key={label}>
              <strong>{number}</strong>
              <h2>{rtl && labelUr ? labelUr : label}</h2>
              <p>{rtl && detailUr ? detailUr : detail}</p>
            </article>
          ))}
        </div>

        {children || (
          <section className="dashboard-panel">
            <h2>{t.dashboard}</h2>
          </section>
        )}
      </section>
    </main>
  );
}
