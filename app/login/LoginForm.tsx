"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import styles from "./LoginPage.module.css";

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    setError(null);

    startTransition(async () => {
      try {
        const result = await signIn("credentials", {
          email,
          password,
          redirectTo: "/dashboard",
          redirect: false,
        });

        if (result?.error) {
          setError("E-Mail oder Passwort ungültig.");
        } else if (result?.url) {
          window.location.href = result.url;
        }
      } catch {
        setError("E-Mail oder Passwort ungültig.");
      }
    });
  }

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.field}>
          <span>E-Mail</span>
          <input
            type="email"
            name="email"
            placeholder="du@beispiel.de"
            required
            disabled={isPending}
          />
        </label>
        <label className={styles.field}>
          <span>Passwort</span>
          <input
            type="password"
            name="password"
            placeholder="Passwort eingeben"
            required
            disabled={isPending}
          />
        </label>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.submit} disabled={isPending}>
          {isPending ? "Anmeldung läuft..." : "Anmelden"}
        </button>
      </form>

    </>
  );
}
