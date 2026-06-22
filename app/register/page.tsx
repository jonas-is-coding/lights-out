import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Footer from "../components/Footer";
import RegisterForm from "./RegisterForm";
import styles from "./RegisterPage.module.css";

export const metadata: Metadata = {
  title: "Registrieren | LIGHTS OUT",
  description:
    "Erstelle dein LIGHTS OUT Konto und schalte Live-Rennmärkte, Boosts und Loyalitätsprämien frei.",
};

export default function RegisterPage() {
  return (
    <div className={`${styles.page} lightApp`}>
      <main className={styles.main}>
        <div className="container">
          <div className={styles.shell}>
            <section className={styles.brandPanel}>
              <p className={styles.kicker}>Grid-Eintrag offen</p>
              <h1 className={styles.title}>
                Tritt dem
                <br />
                Startfeld bei
              </h1>
              <p className={styles.lead}>
                Erstelle dein Konto, um auf Live-Rennmärkte, verbesserte Auszahlungen und exklusive Kampagnen zu jedem Formel-Rennwochenende zuzugreifen.
              </p>
              <Image
                src="/drivers/Register.png"
                alt=""
                width={1122}
                height={1402}
                priority
                className={styles.mascot}
              />

              <div className={styles.highlights}>
                <article className={styles.highlight}>
                  <span className={styles.idx}>01</span>
                  <p className={styles.text}>Sofortiger Zugriff auf Vor- und Live-Märkte.</p>
                </article>
                <article className={styles.highlight}>
                  <span className={styles.idx}>02</span>
                  <p className={styles.text}>Automatische Registrierung in Loyalitätsstufen und Prämienleitern.</p>
                </article>
                <article className={styles.highlight}>
                  <span className={styles.idx}>03</span>
                  <p className={styles.text}>Schnelle Auszahlungen und sicherer Kontoüberprüfungsablauf.</p>
                </article>
              </div>
            </section>

            <section className={styles.formPanel}>
              <div className={styles.formTop}>
                <h2 className={styles.formTitle}>Konto erstellen</h2>
                <Link href="/" className={styles.back}>
                  Startseite
                </Link>
              </div>

              <RegisterForm />
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
