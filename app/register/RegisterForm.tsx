"use client";

import { useActionState } from "react";
import { signIn } from "next-auth/react";
import { registerUser } from "@/app/actions/auth";
import styles from "./RegisterPage.module.css";

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerUser, null);

  function handleGoogle() {
    signIn("google", { redirectTo: "/dashboard" });
  }

  return (
    <>
      <form action={formAction}>
        <div className={styles.grid}>
          <label className={styles.field}>
            <span className={styles.label}>Vorname</span>
            <input
              className={styles.input}
              type="text"
              name="firstName"
              placeholder="Max"
              required
              disabled={isPending}
            />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Nachname</span>
            <input
              className={styles.input}
              type="text"
              name="lastName"
              placeholder="Verstappen"
              required
              disabled={isPending}
            />
          </label>

          <label className={`${styles.field} ${styles.span2}`}>
            <span className={styles.label}>E-Mail</span>
            <input
              className={styles.input}
              type="email"
              name="email"
              placeholder="du@beispiel.de"
              required
              disabled={isPending}
            />
          </label>

          <label className={`${styles.field} ${styles.span2}`}>
            <span className={styles.label}>Land</span>
            <select
              className={styles.select}
              name="country"
              defaultValue=""
              disabled={isPending}
            >
              <option value="" disabled>
                Land auswählen
              </option>
              <option>Deutschland</option>
              <option>Österreich</option>
              <option>Schweiz</option>
              <option>Vereinigtes Königreich</option>
              <option>Niederlande</option>
            </select>
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Passwort</span>
            <input
              className={styles.input}
              type="password"
              name="password"
              placeholder="Mindestens 8 Zeichen"
              required
              disabled={isPending}
            />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Promo-Code</span>
            <input
              className={styles.input}
              type="text"
              name="promo"
              placeholder="Optional"
              disabled={isPending}
            />
          </label>
        </div>

        <label className={styles.terms}>
          <input type="checkbox" name="terms" value="true" disabled={isPending} />
          <span>
            Ich bin 18+ und stimme den Nutzungsbedingungen, Datenschutzrichtlinie und Richtlinien zu verantwortungsvollem Spiel zu.
          </span>
        </label>

        {state?.error && <p className={styles.error}>{state.error}</p>}

        <button className={styles.submit} type="submit" disabled={isPending}>
          {isPending ? "Konto wird erstellt..." : "Konto erstellen"}
        </button>
        <p className={styles.meta}>
          Geschützter Registrierungsablauf · KYC-Überprüfung vor erste Auszahlung erforderlich
        </p>
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
