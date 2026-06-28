"use client";

import { useActionState } from "react";
import { registerUser } from "@/app/actions/auth";
import styles from "./RegisterPage.module.css";

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerUser, null);

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

    </>
  );
}
