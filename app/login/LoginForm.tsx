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

  function handleGoogle() {
    signIn("google", { redirectTo: "/dashboard" });
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

      <div className={styles.divider}>
        <span>oder</span>
      </div>

      <button
        type="button"
        className={styles.googleBtn}
        onClick={handleGoogle}
        disabled={isPending}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
          />
          <path
            fill="#34A853"
            d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
          />
          <path
            fill="#FBBC05"
            d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"
          />
          <path
            fill="#EA4335"
            d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"
          />
        </svg>
        Mit Google fortfahren
      </button>
    </>
  );
}
