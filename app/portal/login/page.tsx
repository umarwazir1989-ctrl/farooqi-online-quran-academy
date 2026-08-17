import Link from "next/link";
import PortalLoginForm from "@/components/portal/PortalLoginForm";

export const metadata = {
  title: "Portal Login",
};

export default function PortalLoginPage() {
  return (
    <main className="portal-login-page">
      <section className="portal-login-card">
        <span className="eyebrow">Farooqi Quran Portal</span>
        <h1>Academy Portal Login</h1>
        <p>
          Admin, teachers, students and parents can sign in with their
          registered account.
        </p>

        <PortalLoginForm />

        <div className="portal-login-links">
          <Link href="/en">English Website</Link>
          <span>·</span>
          <Link href="/ur">اردو ویب سائٹ</Link>
        </div>
      </section>
    </main>
  );
}
