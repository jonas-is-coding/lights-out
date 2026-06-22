import type { Metadata } from "next";
import Link from "next/link";
import styles from "./Docs.module.css";

export const metadata: Metadata = {
  title: "Docs | LIGHTS OUT",
  description:
    "Projektdokumentation für LIGHTS OUT — Aufbau, Architektur und alle Features der Formel-1-Wettplattform.",
};

// ── Inhaltsverzeichnis ──────────────────────────────────────────────
const toc = [
  { id: "ueberblick", label: "Überblick" },
  { id: "tech-stack", label: "Tech-Stack" },
  { id: "struktur", label: "Projektstruktur" },
  { id: "routen", label: "Routen-Übersicht" },
  { id: "features", label: "Features" },
  { id: "wett-engine", label: "Wett-Engine & Live-Quoten" },
  { id: "maerkte", label: "Wettmärkte" },
  { id: "produktseiten", label: "Produktseiten" },
  { id: "design", label: "Design-System" },
  { id: "datenbank", label: "Datenbank & Sicherheit" },
];

const stack = [
  { name: "Next.js 16", role: "App Router, Server Components, Server Actions" },
  { name: "React 19", role: "UI-Bibliothek, Client-Interaktivität" },
  { name: "TypeScript", role: "Typsicherheit im gesamten Code" },
  { name: "NextAuth v5", role: "Authentifizierung & Sessions" },
  { name: "PostgreSQL (Neon)", role: "Datenbank für Nutzer, Wallet & Wetten" },
  { name: "Three.js / R3F", role: "3D-Formel-1-Wagen auf der Startseite" },
  { name: "GSAP & Framer Motion", role: "Animationen & Übergänge" },
  { name: "Lenis", role: "Smooth-Scrolling auf der Landingpage" },
  { name: "jolpica / Ergast API", role: "Live-F1-Daten für Quotenberechnung" },
];

const tree = `lights-out/
├─ app/
│  ├─ page.tsx               Landingpage (Hero, 3D-Wagen, FAQ …)
│  ├─ layout.tsx             Root-Layout + globale Navbar
│  ├─ docs/                  Diese Dokumentationsseite
│  ├─ login/  register/      Authentifizierung
│  ├─ dashboard/             Eingeloggter Bereich
│  │  ├─ page.tsx            Übersicht
│  │  ├─ markets/            Wetten platzieren (Wettschein)
│  │  ├─ bets/               Meine Wetten + Cash-Out
│  │  ├─ bonuses/            Boni & Gratiswetten
│  │  └─ account/            Konto & Einzahlung
│  ├─ free-bets/  cash-out/  Produkt-/Marketingseiten
│  ├─ payout-boost/  loyalty/
│  ├─ acca-insurance/
│  ├─ actions/               Server Actions (auth, betting)
│  ├─ api/                   Route Handler (F1-Daten, Auth)
│  └─ components/            Hero, Navbar, FAQ, 3D-Wagen …
├─ lib/betting/              Server-autoritative Wett-Engine
│  ├─ markets.ts             Märkte + Live-Quotenberechnung
│  ├─ bets.ts                Wette platzieren / cashout / settle
│  ├─ wallet.ts              Guthaben & Einzahlungen
│  ├─ loyalty.ts             Treuepunkte
│  └─ types.ts               Domänentypen
├─ auth.ts  db.ts            Auth-Config & DB-Pool
└─ scripts/                  DB-Schema-Initialisierung`;

const routes = [
  { path: "/", desc: "Landingpage mit Hero, 3D-Wagen, Strecke, Tabellen, FAQ", access: "Öffentlich" },
  { path: "/register · /login", desc: "Konto erstellen & anmelden", access: "Öffentlich" },
  { path: "/dashboard", desc: "Übersicht: Guthaben, offene Wetten, nächstes Rennen", access: "Eingeloggt" },
  { path: "/dashboard/markets", desc: "Wetten platzieren über den Wettschein", access: "Eingeloggt" },
  { path: "/dashboard/bets", desc: "Meine Wetten — mit Cash-Out", access: "Eingeloggt" },
  { path: "/dashboard/bonuses", desc: "Boni & Gratiswetten", access: "Eingeloggt" },
  { path: "/dashboard/account", desc: "Kontodaten & Einzahlung", access: "Eingeloggt" },
  { path: "/free-bets · /cash-out · …", desc: "Erklärseiten zu Produkten & Aktionen", access: "Öffentlich" },
  { path: "/api/f1/*  ·  /api/markets", desc: "Route Handler für Live-F1-Daten & Quoten", access: "Intern" },
];

const features = [
  {
    title: "Landingpage",
    points: [
      "Cinematischer Hero mit animiertem „Lights Out\"-Startampel-Effekt.",
      "Interaktiver 3D-Formel-1-Wagen (Three.js / React-Three-Fiber).",
      "Streckenlayout, Live-Fahrer- & Konstrukteurs-Tabellen, Telemetrie-Optik.",
      "FAQ-Sektion und animierter Marquee-Lauftext.",
    ],
  },
  {
    title: "Authentifizierung",
    points: [
      "Registrierung & Login mit NextAuth v5 und PostgreSQL-Adapter.",
      "Passwörter werden mit bcrypt gehasht — nie im Klartext gespeichert.",
      "Geschützte Routen: /dashboard leitet ohne Session auf /login um.",
      "Google-OAuth ist vorbereitet (wartet auf API-Schlüssel).",
    ],
  },
  {
    title: "Dashboard",
    points: [
      "Eigene Sidebar-Navigation statt der Marketing-Navbar.",
      "Übersicht mit Guthaben, offenen Wetten und nächstem Rennen.",
      "Wettschein zum Platzieren, „Meine Wetten\" mit Cash-Out, Boni & Konto.",
      "Einzahlungs-Formular zum Aufladen des Spielguthabens.",
    ],
  },
];

const markets = [
  { name: "Rennsieger", key: "race_winner", desc: "Wer gewinnt das nächste Rennen — alle Fahrer im Feld." },
  { name: "Podestplatz", key: "podium", desc: "Schafft es der Fahrer in die Top 3?" },
  { name: "Pole-Position", key: "pole", desc: "Wer startet von ganz vorne ins Rennen?" },
  { name: "Schnellste Runde", key: "fastest_lap", desc: "Wer fährt die schnellste Rennrunde?" },
  { name: "Konstrukteurs-WM", key: "constructor_champion", desc: "Welches Team wird Konstrukteurs-Weltmeister — alle Teams." },
];

const products = [
  { name: "Gratiswetten", desc: "Wetten ohne eigenen Einsatz; nur der Nettogewinn wird gutgeschrieben." },
  { name: "Cash Out", desc: "Offene Wetten vor Rennende zum aktuellen Wert auszahlen lassen." },
  { name: "Auszahlungs-Boost", desc: "Prozentualer Aufschlag auf den Gewinn ausgewählter Wetten." },
  { name: "Kombi-Versicherung", desc: "Rückerstattung, wenn nur eine Auswahl einer Kombiwette verliert." },
  { name: "Treueprogramm", desc: "Rennpunkte sammeln, Stufen freischalten, Belohnungen einlösen." },
];

export default function DocsPage() {
  return (
    <div className={`${styles.page} lightApp`}>
      {/* ── Eigener Docs-Header: Logo oben rechts + „Docs“ ── */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.back}>
            ← Zurück zur Seite
          </Link>
          <Link href="/docs" className={styles.brand}>
            <span className={styles.brandBars}>
              <span className={styles.brandBar} />
              <span className={styles.brandBar} />
              <span className={styles.brandBar} />
              <span className={styles.brandBar} />
              <span className={styles.brandBar} />
            </span>
            <span className={styles.brandText}>
              LIGHTS<span className={styles.brandRed}>OUT</span>
            </span>
            <span className={styles.docsBadge}>Docs</span>
          </Link>
        </div>
      </header>

      <div className={styles.layout}>
        {/* ── Inhaltsverzeichnis ── */}
        <aside className={styles.toc}>
          <p className={styles.tocTitle}>Dokumentation</p>
          <nav className={styles.tocNav}>
            {toc.map((t) => (
              <a key={t.id} href={`#${t.id}`} className={styles.tocLink}>
                {t.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* ── Inhalt ── */}
        <main className={styles.content}>
          <section id="ueberblick" className={styles.section}>
            <p className="eyebrow">Schulprojekt · Softwaretechnologie</p>
            <h1 className={styles.h1}>LIGHTS OUT — Projektdokumentation</h1>
            <p className={styles.lead}>
              <strong>LIGHTS OUT</strong> ist eine fiktive Formel-1-Wettplattform.
              Nutzer registrieren sich, laden Spielguthaben auf und platzieren
              Wetten auf reale F1-Märkte — Rennsieger, Podest, Pole, schnellste
              Runde und Konstrukteurs-Weltmeister. Die Quoten werden aus{" "}
              <strong>echten Live-Daten</strong> berechnet, wie bei einer echten
              Tippseite. Diese Seite erklärt Aufbau, Technik und alle Features.
            </p>
            <div className={styles.callout}>
              Mit Geld wird hier nicht gespielt — alle Beträge sind reines
              Spielguthaben. Das Projekt demonstriert Webentwicklung mit Next.js,
              eine echte Datenbankanbindung und die Verarbeitung von Live-APIs.
            </div>
          </section>

          <section id="tech-stack" className={styles.section}>
            <h2 className={styles.h2}>Tech-Stack</h2>
            <p className={styles.p}>
              Modernes React-Setup auf Basis des Next.js App Routers. Logik läuft
              wo möglich auf dem Server (Server Components & Server Actions).
            </p>
            <div className={styles.cards}>
              {stack.map((s) => (
                <div key={s.name} className={styles.card}>
                  <strong className={styles.cardTitle}>{s.name}</strong>
                  <span className={styles.cardDesc}>{s.role}</span>
                </div>
              ))}
            </div>
          </section>

          <section id="struktur" className={styles.section}>
            <h2 className={styles.h2}>Projektstruktur</h2>
            <p className={styles.p}>
              Klare Trennung: Seiten & UI in <code className={styles.code}>app/</code>,
              die server-autoritative Wett-Engine in{" "}
              <code className={styles.code}>lib/betting/</code>.
            </p>
            <pre className={styles.tree}>{tree}</pre>
          </section>

          <section id="routen" className={styles.section}>
            <h2 className={styles.h2}>Routen-Übersicht</h2>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Route</th>
                    <th>Beschreibung</th>
                    <th>Zugriff</th>
                  </tr>
                </thead>
                <tbody>
                  {routes.map((r) => (
                    <tr key={r.path}>
                      <td><code className={styles.code}>{r.path}</code></td>
                      <td>{r.desc}</td>
                      <td><span className={styles.tag}>{r.access}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="features" className={styles.section}>
            <h2 className={styles.h2}>Features</h2>
            <div className={styles.featureGrid}>
              {features.map((f) => (
                <article key={f.title} className={styles.featureCard}>
                  <h3 className={styles.h3}>{f.title}</h3>
                  <ul className={styles.list}>
                    {f.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section id="wett-engine" className={styles.section}>
            <h2 className={styles.h2}>Wett-Engine & Live-Quoten</h2>
            <p className={styles.p}>
              Das Herzstück liegt in <code className={styles.code}>lib/betting/</code>.
              Quoten sind <strong>server-autoritativ</strong>: Sie werden nie vom
              Browser übernommen, sondern beim Platzieren auf dem Server frisch
              nachgeschlagen — so kann niemand die Quote manipulieren.
            </p>
            <div className={styles.steps}>
              <div className={styles.step}>
                <span className={styles.stepNum}>1</span>
                <div>
                  <strong>Live-Daten ziehen.</strong> Die aktuelle Fahrer- und
                  Konstrukteurs-WM wird live von der jolpica/Ergast-F1-API geladen.
                </div>
              </div>
              <div className={styles.step}>
                <span className={styles.stepNum}>2</span>
                <div>
                  <strong>Stärke berechnen.</strong> Aus Punkten, Siegen und
                  Tabellenplatz wird pro Fahrer/Team ein Stärkewert gebildet.
                </div>
              </div>
              <div className={styles.step}>
                <span className={styles.stepNum}>3</span>
                <div>
                  <strong>Quote ableiten.</strong> Stärkere Fahrer bekommen
                  niedrigere Quoten, Außenseiter höhere — gedeckelt in realistische
                  Spannen. Bei API-Ausfall greift ein statisches Backup-Feld.
                </div>
              </div>
              <div className={styles.step}>
                <span className={styles.stepNum}>4</span>
                <div>
                  <strong>Wette verbuchen.</strong> Einsatz prüfen, Guthaben
                  abziehen, möglichen Gewinn (Einsatz × Quote) berechnen und alles
                  in einer DB-Transaktion speichern.
                </div>
              </div>
            </div>
            <p className={styles.p}>
              Weitere Engine-Funktionen: <strong>Einzahlung</strong> (Wallet
              aufladen), <strong>Cash-Out</strong> (offene Wette vorzeitig
              auszahlen), <strong>Settle</strong> (Wette als gewonnen/verloren
              abrechnen) und <strong>Treuepunkte</strong> pro Einsatz.
            </p>
          </section>

          <section id="maerkte" className={styles.section}>
            <h2 className={styles.h2}>Wettmärkte</h2>
            <p className={styles.p}>
              Fünf Märkte, jeweils mit live berechneten Quoten für das{" "}
              <strong>gesamte</strong> Starterfeld bzw. alle Teams.
            </p>
            <div className={styles.cards}>
              {markets.map((m) => (
                <div key={m.key} className={styles.card}>
                  <strong className={styles.cardTitle}>{m.name}</strong>
                  <span className={styles.cardDesc}>{m.desc}</span>
                  <code className={styles.codeMini}>{m.key}</code>
                </div>
              ))}
            </div>
          </section>

          <section id="produktseiten" className={styles.section}>
            <h2 className={styles.h2}>Produktseiten</h2>
            <p className={styles.p}>
              Eigene Erklärseiten im Stil echter Wettanbieter — jede mit
              Koala-Maskottchen, das das jeweilige Feature illustriert.
            </p>
            <div className={styles.featureGrid}>
              {products.map((p) => (
                <article key={p.name} className={styles.featureCard}>
                  <h3 className={styles.h3}>{p.name}</h3>
                  <p className={styles.cardDesc}>{p.desc}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="design" className={styles.section}>
            <h2 className={styles.h2}>Design-System</h2>
            <p className={styles.p}>
              Zwei abgestimmte Welten: ein dunkler, cinematischer Marketing-Look
              für die Startseite und ein helles, ruhiges „App“-Theme (Clerk-Stil)
              für Login, Dashboard und Produktseiten. Alle Farben, Radien und
              Schatten sind als CSS-Variablen in{" "}
              <code className={styles.code}>globals.css</code> zentralisiert.
            </p>
            <div className={styles.swatches}>
              <div className={styles.swatch} style={{ background: "#e10600" }}>
                <span>Akzent</span><code>#e10600</code>
              </div>
              <div className={styles.swatch} style={{ background: "#18181b" }}>
                <span>Text</span><code>#18181b</code>
              </div>
              <div className={`${styles.swatch} ${styles.swatchLight}`} style={{ background: "#fbfbfc" }}>
                <span>App-BG</span><code>#fbfbfc</code>
              </div>
              <div className={styles.swatch} style={{ background: "#15803d" }}>
                <span>Gewinn</span><code>#15803d</code>
              </div>
            </div>
            <p className={styles.p}>
              Schrift: <strong>Geist</strong> (Display) & <strong>Geist Mono</strong>.
              Das wiederkehrende Maskottchen ist ein 3D-Koala im rot-schwarzen
              Rennanzug, der jedes Feature und jeden Wettmarkt visuell begleitet.
            </p>
          </section>

          <section id="datenbank" className={styles.section}>
            <h2 className={styles.h2}>Datenbank & Sicherheit</h2>
            <p className={styles.p}>
              Daten liegen in <strong>PostgreSQL</strong> (Neon). Tabellen für
              Nutzer/Sessions, Wallet (Guthaben), Wetten und Boni; das Schema wird
              über Skripte in <code className={styles.code}>scripts/</code> angelegt.
            </p>
            <ul className={styles.list}>
              <li>Passwörter werden mit <strong>bcrypt</strong> gehasht.</li>
              <li>Quoten werden <strong>serverseitig</strong> nachgeschlagen — der Client kann sie nicht fälschen.</li>
              <li>Geld-Operationen laufen in <strong>DB-Transaktionen</strong> mit Zeilen-Sperren.</li>
              <li>Einsätze werden an den Systemgrenzen <strong>validiert</strong> (Min/Max).</li>
              <li>Geschützte Routen erzwingen eine gültige <strong>Session</strong>.</li>
            </ul>
          </section>

          <footer className={styles.footer}>
            <span>LIGHTS OUT · Projektdokumentation</span>
            <Link href="/" className={styles.footerLink}>Zur Startseite →</Link>
          </footer>
        </main>
      </div>
    </div>
  );
}
