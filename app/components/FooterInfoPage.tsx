import Image from "next/image";
import Link from "next/link";
import Footer from "./Footer";
import type { FooterPageContent } from "../footerPageContent";
import styles from "./FooterInfoPage.module.css";

export default function FooterInfoPage({ page }: { page: FooterPageContent }) {
  return (
    <div className={`${styles.page} lightApp`}>
      <main className={styles.main}>
        <div className="container">
          <div className={styles.top}>
            <Link href="/" className={styles.back}>
              Zurück zur Startseite
            </Link>
            <span className={styles.badge}>{page.badge}</span>
          </div>

          <section className={styles.hero}>
            <div>
              <p className="eyebrow">{page.eyebrow}</p>
              <h1 className={styles.title}>{page.title}</h1>
              <p className={styles.subtitle}>{page.subtitle}</p>
            </div>
            <Image
              src={page.image}
              alt=""
              width={page.imageWidth}
              height={page.imageHeight}
              priority
              sizes="(max-width: 900px) 78vw, 320px"
              className={styles.mascot}
            />
          </section>

          <section className={styles.grid}>
            {page.sections.map((section) => (
              <article key={section.title} className={styles.panel}>
                <h2 className={styles.panelTitle}>{section.title}</h2>
                <ul className={styles.list}>
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </section>

          <section className={styles.stats}>
            {page.stats.map((stat) => (
              <article key={stat.label} className={styles.stat}>
                <span className={styles.statLabel}>{stat.label}</span>
                <strong className={styles.statValue}>{stat.value}</strong>
                <p className={styles.statNote}>{stat.note}</p>
              </article>
            ))}
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}
