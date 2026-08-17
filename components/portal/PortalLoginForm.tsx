"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function PortalLoginForm() {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setStatus("");

    const form = new FormData(e.currentTarget);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      setStatus(data.error || "Login failed.");
      setBusy(false);
      return;
    }

    router.push("/portal");
    router.refresh();
  }

  return (
    <form className="portal-login-form" onSubmit={submit}>
      <label>
        Email
        <input type="email" name="email" required autoComplete="email" />
      </label>

      <label>
        Password
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
        />
      </label>

      <button className="btn" type="submit" disabled={busy}>
        {busy ? "Signing in…" : "Sign in"}
      </button>

      <p className="portal-login-status" aria-live="polite">
        {status}
      </p>
    </form>
  );
}
