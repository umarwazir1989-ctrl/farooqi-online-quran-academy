"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type PortalNavSection = {
  title: string;
  titleUr?: string;
  items: Array<{
    label: string;
    labelUr?: string;
    href: string;
  }>;
};

export default function PortalNav({
  sections,
  rtl,
}: {
  sections: PortalNavSection[];
  rtl: boolean;
}) {
  const pathname = usePathname();

  return (
    <nav className="portal-nav-sections">
      {sections.map((section) => (
        <section className="portal-nav-section" key={section.title}>
          <span>{rtl && section.titleUr ? section.titleUr : section.title}</span>

          {section.items.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/portal/admin" && pathname.startsWith(item.href + "/"));

            return (
              <Link
                className={active ? "portal-nav-active" : ""}
                href={item.href}
                key={item.href}
              >
                {rtl && item.labelUr ? item.labelUr : item.label}
              </Link>
            );
          })}
        </section>
      ))}
    </nav>
  );
}
