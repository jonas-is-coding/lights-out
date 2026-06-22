import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Footer from "../components/Footer";
import LoginForm from "./LoginForm";
import styles from "./LoginPage.module.css";

export const metadata: Metadata = {
  title: "Anmelden | LIGHTS OUT",
  description: "Melde dich bei deinem LIGHTS OUT Konto an.",
};

export default function LoginPage() {
  return (
    <div className={`${styles.page} lightApp`}>
      <main className={styles.main}>
        <div className={styles.shell}>
          <Image
            src="/Login.png"
            alt=""
            width={1122}
            height={1402}
            priority
            className={styles.mascot}
          />
          <div className={styles.card}>
            <h1 className={styles.title}>Willkommen zurück</h1>
            <p className={styles.lead}>Melde dich an, um auf deine Märkte, Boosts und Live-Rennwetten zuzugreifen.</p>
            <LoginForm />
          </div>
          <p className={styles.meta}>
            Noch kein Konto? <Link href="/register">Jetzt erstellen</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
