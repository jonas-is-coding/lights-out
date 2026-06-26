# User Journey – LIGHTS OUT 🏁

> Strategisches Konzept der Nutzerführung für die **LIGHTS OUT** Formel-1-Wett-Web-App
> Fach: Softwaretechnologie und Datenmanagement (SUD) · Carl-Severing-Berufskolleg

---

## 1. Ausgangslage: One-Pager vs. Web App

Das Unterrichtsbeispiel beschreibt die User Journey eines **One-Pagers** – einer einzelnen,
scrollbaren Seite mit linearer Reihenfolge (Hero → Nutzen → Leistungen → Vertrauen → CTA → Footer).

**LIGHTS OUT ist kein One-Pager, sondern eine vollständige Web App.** Damit ist unsere User
Journey deutlich komplexer: Sie ist nicht *linear* (einmal von oben nach unten scrollen),
sondern **verzweigt und zyklisch**. Wir kombinieren zwei Welten:

| Bereich | Typ | Aufgabe | Journey-Form |
|---------|-----|---------|--------------|
| **Marketing-Seite** (`/`) | One-Pager / Landing Page | Besucher überzeugen & zur Registrierung führen | linear (AIDA) |
| **Info-Seiten** (`/cash-out`, `/loyalty`, …) | Microsite-Sektionen | Features & Pflichtinfos erklären | sternförmig vom Footer |
| **App / Dashboard** (`/dashboard/*`) | Web App (eingeloggt) | Wetten platzieren, verwalten, auszahlen | zyklisch (Loop) |

Die Landing Page nutzt also bewusst die **One-Pager-Logik aus dem Unterricht**, um den Nutzer in
die dahinterliegende **Web App** zu überführen. Ab dem Login beginnt eine neue, nicht-lineare
Journey, die sich beliebig oft wiederholt (der „Wett-Loop").

---

## 2. Personas (Zielgruppen)

| Persona | Beschreibung | Ziel auf der Seite | Einstiegspunkt |
|---------|--------------|--------------------|----------------|
| 🆕 **Der Neugierige** (Erstbesucher) | Kennt LIGHTS OUT nicht, kommt über Werbung/Social. | Verstehen „Bin ich hier richtig?" → evtl. registrieren | Hero (`/`) |
| 🎯 **Der Wett-Profi** (wiederkehrend) | Hat ein Konto, kennt F1, will schnell wetten. | Direkt Quoten checken & Wette setzen | `/login` → `/dashboard/markets` |
| 💸 **Der Bonus-Jäger** | Reagiert auf Gratiswetten, Cash Out, Treueprogramm. | Boni einlösen, maximalen Wert holen | `/free-bets`, `/loyalty` |
| 🛡️ **Der Vorsichtige** | Achtet auf Sicherheit, Legalität, Spielerschutz. | Vertrauen prüfen (Impressum, Spielerschutz) | Footer → `/responsible-gaming` |

---

## 3. Die übergeordnete Journey (Macro-Flow)

Das klassische One-Pager-Prinzip **Aufmerksamkeit → Interesse → Überzeugung → Aktion** (AIDA)
erweitern wir für die Web App um zwei entscheidende Phasen: **Conversion** (Registrierung) und
**Retention** (Wiederkehr & Bindung).

```
  AWARENESS        INTEREST        CONSIDERATION      CONVERSION         RETENTION
 (Aufmerksamkeit)  (Interesse)    (Überzeugung)      (Aktion)          (Bindung)
      │                │                │                 │                  │
   Hero ───────►  Nutzen/Stats ──►  Fahrer/Quoten ──► Registrierung ──►  Dashboard-Loop
   Marquee        Telemetrie        WM-Tabelle         + €10 Gratis      Wetten · CashOut
   Imagefilm      FAQ               CTA-Bereich        Login              Treueprogramm · Boni
      │                                                    │                  │
      └──────────── LANDING PAGE (One-Pager) ──────────────┘     └─ WEB APP (eingeloggt) ─┘
                                                                            │
                                                          ┌─────────────────┘
                                                          ▼
                                                  ♻ DER WETT-LOOP (zyklisch)
                                          Markt wählen → Quote prüfen → Einsatz →
                                          Wette setzen → Live verfolgen → Cash Out /
                                          Abrechnung → Guthaben → nächste Wette …
```

---

## 4. Phase 1 – Landing Page (`/`): Der One-Pager-Teil

Hier wird die im Unterricht besprochene Sektions-Logik 1:1 angewandt. Jede Sektion ist über die
**Anker-Navigation** der fixierten Navbar erreichbar.

| # | Sektion | Komponente | Zweck (Journey) | Screendesign-Elemente |
|---|---------|-----------|-----------------|------------------------|
| – | **Navigation** (fix) | `Navbar.tsx` | Orientierung, Anker-Links, Sprung zu Login/Konto | Orientierung · Navigation |
| – | **Loading-Intro** | `LoadingIntro.tsx` | Erster Eindruck, Markeninszenierung | Motivation (Animation) |
| 1 | **Hero** „Above the Fold" | `Hero.tsx` | Hauptbotschaft *„Fünf rote Lichter. Ein grünes."* + CTA | Inhalt · Interaktion |
| 2 | **Marquee** | `Marquee.tsx` | Laufband mit USPs, Dynamik | Motivation |
| 3 | **Live-Kennzahlen** | `StatsGrid.tsx` / `Telemetry.tsx` | Nutzenversprechen mit Echtzeit-Zahlen | Inhalt · Motivation |
| 4 | **Imagefilm** | `public/…-imagefilm.html` | Emotionales Storytelling | Inhalt (Video) |
| 5 | **Fahrer & Favoriten** | `Drivers.tsx` | Kerninhalt: Fahrer + aktuelle Quoten | Inhalt · Interaktion |
| 6 | **Strecke / Circuit** | `Circuit.tsx` (3D, three.js) | Nächstes Rennen visualisieren | Inhalt · Motivation |
| 7 | **WM-Tabelle** | `Standings.tsx` | Aktualität & Kompetenz zeigen (Vertrauen) | Inhalt · Motivation |
| 8 | **FAQ** | `Faq.tsx` | Einwände entkräften | Inhalt · Interaktion |
| 9 | **CTA-Bereich** „Bereit für den Start?" | `CTA.tsx` | Handlungsaufruf → Registrierung | Interaktion |
| – | **Footer** | `Footer.tsx` | Rechtliches + Links zu allen Info-Seiten | Orientierung · Navigation |

**Reihenfolge ist Strategie:** Der Nutzer wird von der emotionalen Hauptbotschaft (Hero) über
konkreten Nutzen (Stats) und Inhalt (Fahrer/Quoten) zu Vertrauen (WM-Tabelle, FAQ) und schließlich
zur Aktion (CTA → `/register`) geführt – exakt das AIDA-Prinzip aus dem Unterricht.

---

## 5. Phase 2 – Conversion: Registrierung & Login

Der Übergang vom anonymen Besucher zum Nutzer. Dies ist die **kritische Schwelle** zwischen
One-Pager und Web App.

```
   CTA / Navbar
       │
       ├── „Konto erstellen" ──► /register ──► Formular ──► Server Action (auth.ts)
       │                            │                          │
       │                            │                    Erfolg → +€10 Gratiswette
       │                            │                          │
       │                       Validierung ◄── Fehler          ▼
       │                                                  /dashboard (eingeloggt)
       │
       └── „Anmelden" ────────► /login ──────► next-auth ──► /dashboard
```

- **Registrierung** (`/register`): Name, E-Mail, Passwort + Bestätigung. Anreiz: **+€10
  Gratiswetten** (Motivationselement). Bei Erfolg direkter Sprung ins Dashboard.
- **Login** (`/login`): E-Mail + Passwort über `next-auth`. Bei Fehler klare Fehlermeldung.
- **Schutz:** Alle `/dashboard/*`-Routen prüfen die Session und leiten sonst auf `/login` um
  (`redirect("/login")`).

---

## 6. Phase 3 – Die Web App: Der Wett-Loop (zyklisch)

Ab hier ist die Journey **nicht mehr linear**. Über die **Sidebar** (`Sidebar.tsx`) springt der
Nutzer frei zwischen den App-Bereichen. Der zentrale, sich wiederholende Ablauf ist der Wett-Loop:

```
        ┌──────────────────────────────────────────────────────────┐
        │                    ♻  DER WETT-LOOP                        │
        │                                                          │
        │   /dashboard ──► Übersicht: Guthaben, nächstes Rennen,   │
        │      │            aktive Wetten, Kennzahlen               │
        │      ▼                                                    │
        │   /dashboard/markets ──► Markt wählen (Sieger, Podium,   │
        │      │                   schnellste Runde, Pole …)        │
        │      ▼                   Auswahl + Einsatz → Wettschein   │
        │   Wette setzen ─────────► (placeBetAction, Guthaben −)    │
        │      │                                                    │
        │      ▼                                                    │
        │   /dashboard/bets ──► Wette verfolgen                     │
        │      │                 ├─ Cash Out (cashOutAction)        │
        │      │                 └─ Abrechnung (Gewinn/Verlust)     │
        │      ▼                                                    │
        │   Guthaben aktualisiert ──► zurück zu /dashboard ─────────┘
        │                                                          
        └──────────────────────────────────────────────────────────┘
                    │                              │
            /dashboard/account            /dashboard/bonuses
            (Einzahlung, Profil)          (Boni & Treuestufe)
```

### App-Bereiche (Sidebar-Navigation)

| Route | Bereich | Aufgabe in der Journey |
|-------|---------|------------------------|
| `/dashboard` | **Übersicht** | Cockpit: Guthaben, Countdown nächstes Rennen, aktive Wetten, Netto-G/V, Trefferquote, Guthaben-Verlauf |
| `/dashboard/markets` | **Wette platzieren** | Märkte + Quoten, Auswahl, Einsatz, Wettschein, Gratiswette nutzen → `placeBetAction` |
| `/dashboard/bets` | **Meine Wetten** | Offene/abgerechnete Wetten, Filter, **Cash Out** vor Rennende |
| `/dashboard/bonuses` | **Boni** | Gratiswetten, Treuestufe (Pole Position → Champion), Rennpunkte |
| `/dashboard/account` | **Konto** | Einzahlung (€25/€50/€100), Transaktionsverlauf, Profil |

### Retention-Mechaniken (Bindung)
- **Gamification:** Treuestufen (*Pole Position → Champion*), Rennpunkte, Fortschrittsbalken.
- **Cash Out:** Kontrolle & Spannung – Wette vorzeitig auszahlen.
- **Boni & Gratiswetten:** Wiederkehr-Anreiz.
- **Countdown** zum nächsten Rennen erzeugt zeitliche Dringlichkeit (zurück in den Loop).

---

## 7. Phase 4 – Info- & Pflicht-Seiten (sternförmige Journey)

Vom **Footer** aus erreichbar – kein linearer Pfad, sondern gezieltes Nachschlagen. Diese Seiten
bedienen v. a. die Persona „Der Vorsichtige" und „Der Bonus-Jäger".

**Feature-/Marketing-Seiten:** `/cash-out` · `/free-bets` · `/payout-boost` · `/acca-insurance`
· `/loyalty` · `/live-betting` · `/race-winner` · `/podium` · `/fastest-lap` · `/underdogs`

**Service & Recht (Vertrauen):** `/faq` · `/support` · `/payment-methods` ·
`/responsible-gaming` · `/self-exclusion` · `/docs`

> **Spielerschutz** (`/responsible-gaming`, `/self-exclusion`) ist nicht nur Pflicht, sondern
> stärkt aktiv das Vertrauen – ein bewusstes Motivationselement.

---

## 8. Touchpoint-Matrix: Persona × Journey-Phase

| Persona | Awareness | Interest | Conversion | Retention |
|---------|-----------|----------|------------|-----------|
| 🆕 Neugieriger | Hero, Imagefilm | Stats, FAQ | `/register` (+€10) | erste Wette |
| 🎯 Wett-Profi | – (kennt es) | Quoten-Check | `/login` | `/markets` Loop |
| 💸 Bonus-Jäger | Gratiswetten-Werbung | `/free-bets`, `/loyalty` | `/register` | Boni, Treuestufen |
| 🛡️ Vorsichtiger | – | `/responsible-gaming` | nach Vertrauensprüfung | `/account`, Limits |

---

## 9. Gestalterische Abgrenzung der Sektionen

Wie im Unterricht beschrieben, werden Sektionen durch **Farbe, Hintergründe, Abstände und
Trennlinien** gegliedert. LIGHTS OUT setzt zusätzlich auf ein **F1-Renn-Theme**:

- **Leitmotiv:** „Fünf rote Lichter. Ein grünes." – die Startampel (= *lights out*) als Metapher
  für den Start einer Wette.
- **Akzentfarbe Rot** (`#e03131`) für CTAs und aktive Zustände, **Grün** für Gewinne/positive
  Aktionen.
- **Bewegung & Storytelling:** Smooth-Scroll (Lenis), GSAP-Animationen, 3D-Strecke & 3D-Auto
  (three.js / react-three-fiber), Loading-Intro – starke Motivationselemente.

---

## 10. Zusammenfassung – Das Wichtigste auf einen Blick

- ✅ LIGHTS OUT verbindet einen **One-Pager** (Landing Page nach AIDA) mit einer vollwertigen
  **Web App** (Dashboard).
- ✅ Die Journey ist **nicht linear**, sondern: linear (Landing) → Schwelle (Login/Register) →
  **zyklisch** (Wett-Loop) → sternförmig (Info-Seiten).
- ✅ Erweiterung des Unterrichts-Modells um **Conversion** und **Retention**.
- ✅ Vier **Personas** mit unterschiedlichen Einstiegspunkten und Touchpoints.
- ✅ Strategische Reihenfolge auf der Landing Page: **Aufmerksamkeit → Interesse → Überzeugung →
  Aktion → Bindung**.
- ✅ Der **Wett-Loop** (Markt → Einsatz → Wette → Cash Out/Abrechnung → Guthaben) ist das Herz der
  Web App und wird durch Gamification, Boni und Countdown immer wieder neu angestoßen.

---

*Zugehörige Wireframes: [`wireframes/lights-out-wireframe.excalidraw`](../wireframes/lights-out-wireframe.excalidraw)
(öffnen unter [excalidraw.com](https://excalidraw.com)).*
