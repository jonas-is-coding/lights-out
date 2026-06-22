import Image from "next/image";
import Link from "next/link";
import styles from "./NotFound.module.css";

export default function NotFound() {
  return (
    <main className={`${styles.main} lightApp`}>
      <Image
        src="/404.png"
        alt=""
        width={1402}
        height={1122}
        priority
        className={styles.image}
      />
      <p className={styles.kicker}>404</p>
      <h1 className={styles.title}>Diese Runde gibt es nicht</h1>
      <p className={styles.text}>
        Die angeforderte Seite liegt nicht mehr auf der Strecke.
      </p>
      <Link href="/" className={styles.link}>
        Zur Startseite
      </Link>
    </main>
  );
}
