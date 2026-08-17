import Link from "next/link";

type Props = {
  role: string;
  name?: string | null;
  title: string;
  subtitle: string;
  cards: Array<[string, string, string]>;
  links: Array<[string, string]>;
};

export default function DashboardShell({
  role,
  name,
  title,
  subtitle,
  cards,
  links,
}: Props) {
  return (
    <main className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <div>
          <span className="dashboard-brand">FQ</span>
          <strong>Farooqi Quran Portal</strong>
          <small>{role}</small>
        </div>

        <nav>
          {links.map(([label, href]) => (
            <Link href={href} key={href}>{label}</Link>
          ))}
        </nav>

        <form action="/api/auth/logout" method="post">
          <button className="dashboard-logout" type="submit">Logout</button>
        </form>
      </aside>

      <section className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <span className="eyebrow">{role}</span>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          <div className="dashboard-user">
            <span>Welcome</span>
            <strong>{name || "User"}</strong>
          </div>
        </header>

        <div className="dashboard-cards">
          {cards.map(([number, label, detail]) => (
            <article key={label}>
              <strong>{number}</strong>
              <h2>{label}</h2>
              <p>{detail}</p>
            </article>
          ))}
        </div>

        <section className="dashboard-panel">
          <h2>Portal foundation is ready</h2>
          <p>
            Detailed data modules will be connected in the next phase.
          </p>
        </section>
      </section>
    </main>
  );
}
