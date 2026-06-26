# 🏁 LIGHTS OUT

> **„Fünf rote Lichter. Ein grünes. Deine Wette ist aktiv."**
> Das ultimative Formel-1-Wettbüro als moderne Web App – Vor- & Live-Märkte, Cash Out,
> Gratiswetten und Treueprogramm.

Schulprojekt im Fach **Softwaretechnologie und Datenmanagement (SUD)**
· Carl-Severing-Berufskolleg · Lehrkraft: Niklas Teich

---

## 📑 Inhalt

- [Projektüberblick](#-projektüberblick)
- [User Journey](#-user-journey)
- [Wireframes](#-wireframes)
- [Technischer Aufbau](#-technischer-aufbau)
- [Projektstruktur](#-projektstruktur)
- [Lokal starten](#-lokal-starten)

---

## 🎯 Projektüberblick

LIGHTS OUT ist eine vollständige **Web App** rund ums Formel-1-Wetten. Anders als ein klassischer
One-Pager besteht das Projekt aus mehreren Bereichen:

- eine **Landing Page** (`/`), die nach One-Pager-Prinzip Besucher überzeugt,
- ein geschützter **Dashboard-Bereich** (`/dashboard/*`) – die eigentliche Web App zum Wetten,
- zahlreiche **Info- und Pflichtseiten** (Features, FAQ, Spielerschutz, Impressum …).

---

## 🧭 User Journey

Weil LIGHTS OUT **kein einfacher One-Pager, sondern eine komplette Web App** ist, ist unsere User
Journey deutlich komplexer als das Unterrichtsbeispiel: Sie ist nicht nur linear, sondern
**verzweigt und zyklisch**.

> 📄 **Vollständiges Konzept:** [`docs/USER-JOURNEY.md`](docs/USER-JOURNEY.md)
> 📕 **Als PDF (lineare Reise Landing → erste Wette):** [`docs/user-journey.pdf`](docs/user-journey.pdf)

### Die fünf Phasen (AIDA + Web-App-Erweiterung)

```
  AWARENESS        INTEREST        CONSIDERATION      CONVERSION         RETENTION
 (Aufmerksamkeit)  (Interesse)    (Überzeugung)      (Aktion)          (Bindung)
      │                │                │                 │                  │
   Hero ───────►  Nutzen/Stats ──►  Fahrer/Quoten ──► Registrierung ──►  Dashboard-Loop
   Marquee        Telemetrie        WM-Tabelle         + €10 Gratis      Wetten · CashOut
   Imagefilm      FAQ               CTA-Bereich        Login              Treue · Boni
      │                                                    │                  │
      └──────────── LANDING PAGE (One-Pager) ──────────────┘     └─ WEB APP (eingeloggt) ─┘
```

Die **Landing Page** nutzt die lineare One-Pager-Logik aus dem Unterricht
(*Aufmerksamkeit → Interesse → Überzeugung → Aktion*), um den Nutzer zur **Registrierung** zu
führen. Ab dem Login beginnt eine neue, **nicht-lineare Journey** – der zyklische **Wett-Loop**:

```
  ♻  DER WETT-LOOP
  /dashboard (Übersicht) ──► /dashboard/markets (Markt + Einsatz wählen)
        ▲                              │
        │                              ▼  Wette setzen
  Guthaben aktualisiert  ◄──  /dashboard/bets (verfolgen · Cash Out · Abrechnung)
```

### Personas

| Persona | Ziel | Einstieg |
|---------|------|----------|
| 🆕 Der Neugierige | Verstehen & evtl. registrieren | Hero (`/`) |
| 🎯 Der Wett-Profi | Schnell wetten | `/login` → `/dashboard/markets` |
| 💸 Der Bonus-Jäger | Boni & Gratiswetten holen | `/free-bets`, `/loyalty` |
| 🛡️ Der Vorsichtige | Vertrauen & Sicherheit prüfen | Footer → `/responsible-gaming` |

Details, Touchpoint-Matrix und Sektions-Analyse: **[`docs/USER-JOURNEY.md`](docs/USER-JOURNEY.md)**.

---

## ✏️ Wireframes

Die Wireframes sind in **Excalidraw** erstellt und decken die wichtigsten Screens der Web App ab:

> 🎨 **Datei:** [`wireframes/lights-out-wireframe.excalidraw`](wireframes/lights-out-wireframe.excalidraw)
> Zum Ansehen/Bearbeiten unter [excalidraw.com](https://excalidraw.com) öffnen
> (*Menü → Open → Datei auswählen*).

Enthaltene Screens:

| Screen | Route | Inhalt |
|--------|-------|--------|
| **Landing Page** | `/` | Hero, Stats, Fahrer & Quoten, WM-Tabelle, FAQ, CTA, Footer |
| **Auth** | `/login`, `/register` | Login- & Registrierungs-Formular (+ €10 Gratiswette) |
| **Dashboard** | `/dashboard` | Guthaben, nächstes Rennen, Kennzahlen, Treuestufe, Transaktionen |
| **Wette platzieren** | `/dashboard/markets` | Märkte, Quoten-Auswahl, Wettschein, Gratiswette |
| **Meine Wetten** | `/dashboard/bets` | Wettverlauf, Filter, Cash Out |

---

## 🛠️ Technischer Aufbau

- **Framework:** Next.js 16 (App Router) · React 19 · TypeScript
- **Auth:** next-auth (v5) mit Neon-Adapter, bcrypt-Passwörter
- **Datenbank:** Neon (serverless Postgres)
- **3D & Animation:** three.js / react-three-fiber / drei, GSAP, Framer Motion, Lenis (Smooth Scroll)
- **Styling:** CSS Modules + globale Styles

---

## 📂 Projektstruktur

```
lights-out/
├─ app/                    # Next.js App Router
│  ├─ page.tsx             # Landing Page (One-Pager)
│  ├─ components/          # Hero, Drivers, Standings, Circuit, FAQ, CTA …
│  ├─ login/ · register/   # Auth-Seiten
│  ├─ dashboard/           # Web App (Übersicht, markets, bets, bonuses, account)
│  ├─ actions/             # Server Actions (auth, betting)
│  └─ api/                 # F1-Daten- & Auth-Routen
├─ lib/                    # Geschäftslogik (betting, wallet, markets, f1)
├─ docs/
│  └─ USER-JOURNEY.md      # 📄 Vollständiges User-Journey-Konzept
├─ wireframes/
│  └─ lights-out-wireframe.excalidraw   # 🎨 Wireframes
└─ public/                 # Bilder, 3D-Modelle, Imagefilm
```

---

## 🚀 Lokal starten

```bash
npm install
npm run dev
```

Anschließend [http://localhost:3000](http://localhost:3000) im Browser öffnen.

> Hinweis: Für Auth & Wetten werden Umgebungsvariablen (Neon-Datenbank, next-auth Secret)
> benötigt. Die Datenbank-Schemata lassen sich über die Skripte in `scripts/` initialisieren.
