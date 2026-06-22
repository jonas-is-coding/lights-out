export type FooterPageKey =
  | "live-betting"
  | "race-winner"
  | "podium"
  | "underdogs"
  | "fastest-lap"
  | "free-bets"
  | "cash-out"
  | "payout-boost"
  | "acca-insurance"
  | "loyalty"
  | "support"
  | "responsible-gaming"
  | "self-exclusion"
  | "payment-methods"
  | "faq";

export type FooterPageContent = {
  key: FooterPageKey;
  path: string;
  label: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  badge: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  sections: Array<{
    title: string;
    items: string[];
  }>;
  stats: Array<{
    label: string;
    value: string;
    note: string;
  }>;
  koalaPrompt: string;
};

const koalaBase =
  "3D koala mascot for LIGHTS OUT sportsbook, premium Formula 1 betting style, red and black racing suit, white studio background, soft product lighting, clean commercial render, no text, no logos, full body, expressive but polished";

export const footerPages: Record<FooterPageKey, FooterPageContent> = {
  "live-betting": {
    key: "live-betting",
    path: "/live-betting",
    label: "Live-Wetten",
    eyebrow: "Rennen in Echtzeit",
    title: "Live-Wetten auf jede Rennphase",
    subtitle:
      "Setze wahrend Training, Qualifying, Sprint und Grand Prix auf dynamische Markte. Quoten bewegen sich mit Reifenstrategie, Safety-Car-Phasen und Positionskampfen.",
    badge: "Live-Markt · Dynamisch",
    image: "/wettschein.png",
    imageWidth: 1122,
    imageHeight: 1402,
    sections: [
      {
        title: "So funktionieren Live-Wetten",
        items: [
          "Live-Quoten aktualisieren sich, sobald sich Rennlage, Wetter oder Strategie verandern.",
          "Markte konnen bei Zwischenfallen kurz gesperrt werden, bis neue Daten bestatigt sind.",
          "Dein Wettschein zeigt immer die finale Quote an, bevor du den Einsatz bestatigst.",
        ],
      },
      {
        title: "Typische Live-Markte",
        items: [
          "Nachster Positionsgewinn, Podium nach Rennphase, schnellste Stint-Zeit und Teamduelle.",
          "Safety-Car-, Boxenstopp- und Reifenfenster-Markte fur erfahrene Rennfans.",
          "Cash Out kann bei berechtigten Live-Wetten verfugbar sein.",
        ],
      },
    ],
    stats: [
      { label: "Update-Takt", value: "Live", note: "Datengetriebene Marktbewegung wahrend Sessions." },
      { label: "Cash Out", value: "Optional", note: "Abhangig von Markt und Rennlage." },
      { label: "Bestatigung", value: "Finale Quote", note: "Vor Abgabe sichtbar im Wettschein." },
    ],
    koalaPrompt: `${koalaBase}, koala holding a glowing live betting tablet, pit wall monitors behind, red timing lights reflected on visor, energetic race-control mood`,
  },
  "race-winner": {
    key: "race-winner",
    path: "/race-winner",
    label: "Rennsieger",
    eyebrow: "Grand-Prix-Siegermarkt",
    title: "Rennsieger vor Start und live",
    subtitle:
      "Analysiere Pace, Startposition, Reifenfenster und Teamform, bevor du auf den Fahrer setzt, der als Erster die Ziellinie uberquert.",
    badge: "Klassischer Markt · Vorstart",
    image: "/champion.png",
    imageWidth: 1122,
    imageHeight: 1402,
    sections: [
      {
        title: "Was zahlt als Rennsieger?",
        items: [
          "Der offiziell klassifizierte Sieger nach Rennende und Ergebnisbestatigung zahlt.",
          "Strafen nach Rennende konnen die Abrechnung beeinflussen.",
          "Bei Abbruch gelten die in den Marktregeln ausgewiesenen offiziellen Resultate.",
        ],
      },
      {
        title: "Worauf du achten solltest",
        items: [
          "Startplatz, Long-Run-Pace und Reifenabbau sind oft wichtiger als reine Trainingsbestzeiten.",
          "Wetter und Safety-Car-Wahrscheinlichkeit konnen Favoriten stark verschieben.",
          "Teamstrategie und Boxenstopp-Fenster sind zentrale Faktoren fur Siegchancen.",
        ],
      },
    ],
    stats: [
      { label: "Abrechnung", value: "Offiziell", note: "Nach bestatigtem Rennergebnis." },
      { label: "Live-Variante", value: "Ja", note: "Wenn die Session stabil bepreist werden kann." },
      { label: "Risiko", value: "Mittel", note: "Stark von Strategie und Zwischenfallen gepragt." },
    ],
    koalaPrompt: `${koalaBase}, koala on top of a Formula 1 podium holding a winner trophy, champagne mist, red confetti, confident champion pose`,
  },
  podium: {
    key: "podium",
    path: "/podium",
    label: "Podium",
    eyebrow: "Top-3-Markt",
    title: "Podiumswetten mit breiterem Spielraum",
    subtitle:
      "Setze darauf, welcher Fahrer das Rennen unter den ersten drei beendet. Podiumsmarkte sind ideal, wenn du Pace erkennst, aber den Sieg offen lassen willst.",
    badge: "Top 3 · Rennende",
    image: "/erfolg.png",
    imageWidth: 1122,
    imageHeight: 1402,
    sections: [
      {
        title: "Marktlogik",
        items: [
          "Ein Tipp gewinnt, wenn der gewahlte Fahrer offiziell auf Platz 1, 2 oder 3 klassifiziert wird.",
          "Nachtragliche Strafen konnen die Reihenfolge und damit die Abrechnung verandern.",
          "Podiumswetten konnen als Einzelwette oder Teil einer Kombi angeboten werden.",
        ],
      },
      {
        title: "Gute Podiumssignale",
        items: [
          "Konstante Rennpace uber mehrere Stints ist wichtiger als eine einzelne schnelle Runde.",
          "Stabile Boxenstopps und geringe Strafrisiken erhohen die Podiumschance.",
          "Fahrer mit hoher Uberholstarke bleiben auch von Startplatz 5-8 interessant.",
        ],
      },
    ],
    stats: [
      { label: "Ziel", value: "Top 3", note: "Offizielle Endklassifikation." },
      { label: "Varianz", value: "Niedriger", note: "Breiter als reiner Siegermarkt." },
      { label: "Kombi", value: "Geeignet", note: "Kann in mehrteiligen Wettscheinen genutzt werden." },
    ],
    koalaPrompt: `${koalaBase}, koala standing beside three podium steps marked by abstract red light bars, wearing laurel wreath and racing gloves, celebratory but premium`,
  },
  underdogs: {
    key: "underdogs",
    path: "/underdogs",
    label: "Außenseiter",
    eyebrow: "Value- und Risiko-Markt",
    title: "Außenseiter mit echter Quote",
    subtitle:
      "Finde Fahrer und Teams, deren Chancen vom Markt unterschätzt werden. Außenseiterwetten brauchen Geduld, Kontext und klare Risikolimits.",
    badge: "High Odds · Hohere Varianz",
    image: "/drivers/albon.png",
    imageWidth: 1122,
    imageHeight: 1402,
    sections: [
      {
        title: "Was Außenseiter interessant macht",
        items: [
          "Starke Sektorzeiten, die im Gesamtergebnis durch Verkehr oder Gelbphasen verdeckt wurden.",
          "Regen, Safety-Car-Risiko oder alternative Reifenstrategien konnen Quoten verschieben.",
          "Neue Upgrades oder Streckencharakteristik konnen Teams plotzlich naher an die Spitze bringen.",
        ],
      },
      {
        title: "Risikohinweise",
        items: [
          "Hohe Quoten bedeuten niedrigere Eintrittswahrscheinlichkeit und groBere Schwankungen.",
          "Setze klare Einsatzlimits und vermeide Nachsetzen aus Frust.",
          "Außenseiter eignen sich eher fur kleine Einsatze oder klar begrundete Value-Spots.",
        ],
      },
    ],
    stats: [
      { label: "Quote", value: "Hoch", note: "Potenzial gegen hohere Varianz." },
      { label: "Einsatz", value: "Klein", note: "Konservatives Staking empfohlen." },
      { label: "Timing", value: "Wichtig", note: "Vor Wetter- oder Setup-News oft entscheidend." },
    ],
    koalaPrompt: `${koalaBase}, koala as a clever underdog strategist in a garage corner, holding a red odds slip, shadowed race car silhouette, focused expression`,
  },
  "fastest-lap": {
    key: "fastest-lap",
    path: "/fastest-lap",
    label: "Schnellste Runde",
    eyebrow: "Pace- und Reifenmarkt",
    title: "Schnellste Runde richtig lesen",
    subtitle:
      "Wette auf den Fahrer mit der schnellsten offiziellen Rennrunde. Dieser Markt dreht sich um freie Luft, frische Reifen und den richtigen Zeitpunkt.",
    badge: "Rundenzeit · Rennstatistik",
    image: "/boost.png",
    imageWidth: 1402,
    imageHeight: 1122,
    sections: [
      {
        title: "Entscheidende Faktoren",
        items: [
          "Spate Boxenstopps auf weichen Reifen erzeugen oft die besten Chancen.",
          "Fahrer im Niemandsland konnen ohne Positionsrisiko pushen.",
          "Verkehr, Track Limits und gelbe Flaggen konnen schnelle Runden zunichtemachen.",
        ],
      },
      {
        title: "Abrechnung",
        items: [
          "Es zahlt die offiziell gewertete schnellste Rennrunde nach Sessionende.",
          "Aberkannte Runden werden nicht als schnellste Runde akzeptiert.",
          "Bei Sonderregeln oder Abbruch gelten die im Markt angegebenen Bedingungen.",
        ],
      },
    ],
    stats: [
      { label: "Schlussphase", value: "Kritisch", note: "Frische Reifen entscheiden haufig." },
      { label: "Datenpunkt", value: "Lap Time", note: "Offizielle Rundentabelle." },
      { label: "Varianz", value: "Hoch", note: "Stark durch Strategie gepragt." },
    ],
    koalaPrompt: `${koalaBase}, koala crouched beside a glowing red stopwatch and racing tire, motion streaks, fastest lap energy, sleek technical render`,
  },
  "free-bets": {
    key: "free-bets",
    path: "/free-bets",
    label: "Gratiswetten",
    eyebrow: "Koala-Prompt",
    title: "Gratiswetten",
    subtitle: "",
    badge: "",
    image: "/erfolg.png",
    imageWidth: 1122,
    imageHeight: 1402,
    sections: [],
    stats: [],
    koalaPrompt: `${koalaBase}, koala joyfully presenting two red free bet tokens, clean sportsbook wallet UI shapes floating around, friendly promotional mood`,
  },
  "cash-out": {
    key: "cash-out",
    path: "/cash-out",
    label: "Cash Out",
    eyebrow: "Koala-Prompt",
    title: "Cash Out",
    subtitle: "",
    badge: "",
    image: "/cashout.png",
    imageWidth: 1122,
    imageHeight: 1402,
    sections: [],
    stats: [],
    koalaPrompt: `${koalaBase}, koala pressing a red cash out button on a racing pit wall console, market graph line locking in profit, controlled confident expression`,
  },
  "payout-boost": {
    key: "payout-boost",
    path: "/payout-boost",
    label: "Auszahlungs-Boost",
    eyebrow: "Koala-Prompt",
    title: "Auszahlungs-Boost",
    subtitle: "",
    badge: "",
    image: "/boost.png",
    imageWidth: 1402,
    imageHeight: 1122,
    sections: [],
    stats: [],
    koalaPrompt: `${koalaBase}, koala holding a glowing red boost token, payout multiplier numbers as abstract UI elements, dynamic upward motion, premium render`,
  },
  "acca-insurance": {
    key: "acca-insurance",
    path: "/acca-insurance",
    label: "Kombi-Versicherung",
    eyebrow: "Koala-Prompt",
    title: "Kombi-Versicherung",
    subtitle: "",
    badge: "",
    image: "/versicherung.png",
    imageWidth: 1370,
    imageHeight: 1148,
    sections: [],
    stats: [],
    koalaPrompt: `${koalaBase}, koala protecting a multi-bet slip under a transparent red racing shield, calm secure pose, insurance concept, clean studio render`,
  },
  loyalty: {
    key: "loyalty",
    path: "/loyalty",
    label: "Treueprogramm",
    eyebrow: "Koala-Prompt",
    title: "Treueprogramm",
    subtitle: "",
    badge: "",
    image: "/champion.png",
    imageWidth: 1122,
    imageHeight: 1402,
    sections: [],
    stats: [],
    koalaPrompt: `${koalaBase}, koala wearing a champion loyalty jacket with red racing points badges, standing beside tier cards, proud but approachable`,
  },
  support: {
    key: "support",
    path: "/support",
    label: "Support",
    eyebrow: "Hilfe-Center",
    title: "Support fur dein LIGHTS OUT Konto",
    subtitle:
      "Finde schnelle Hilfe zu Login, Wetten, Zahlungen, Promotions und Konto-Sicherheit. Unser Support ist auf klare Schritte statt Warteschleifen ausgelegt.",
    badge: "Hilfe · 24/7 Orientierung",
    image: "/faq.png",
    imageWidth: 1402,
    imageHeight: 1122,
    sections: [
      {
        title: "Wobei Support hilft",
        items: [
          "Probleme mit Anmeldung, Registrierung, Verifizierung oder Kontodaten.",
          "Fragen zu abgerechneten Wetten, offenen Wettscheinen und Promotions.",
          "Zahlungsstatus, Bonusguthaben, Cash Out und verantwortungsvolle Spieltools.",
        ],
      },
      {
        title: "Was du bereithalten solltest",
        items: [
          "E-Mail-Adresse des Kontos und ungefahrer Zeitpunkt des Problems.",
          "Wettschein-ID oder Transaktions-ID, wenn es um eine konkrete Buchung geht.",
          "Screenshots nur ohne sensible Zahlungsdaten oder Passwortinformationen.",
        ],
      },
    ],
    stats: [
      { label: "Antworttyp", value: "Schrittweise", note: "Klare Handlungsanweisungen." },
      { label: "Sensible Daten", value: "Nie teilen", note: "Passwort und Karten-CVC bleiben privat." },
      { label: "Prioritat", value: "Konto-Schutz", note: "Sicherheitsfalle zuerst." },
    ],
    koalaPrompt: `${koalaBase}, koala support agent with headset at a clean pit wall desk, red help icons and chat bubbles, calm friendly service mood`,
  },
  "responsible-gaming": {
    key: "responsible-gaming",
    path: "/responsible-gaming",
    label: "Verantwortungsvolles Spielen",
    eyebrow: "Kontrolle behalten",
    title: "Verantwortungsvolles Spielen",
    subtitle:
      "Wetten soll Unterhaltung bleiben. Diese Seite sammelt Limits, Pausen und Warnsignale, damit du bewusste Entscheidungen treffen kannst.",
    badge: "18+ · Schutztools",
    image: "/leerer-zustand.png",
    imageWidth: 1122,
    imageHeight: 1402,
    sections: [
      {
        title: "Empfohlene Limits",
        items: [
          "Lege Einsatz-, Einzahlungs- und Zeitlimits fest, bevor du spielst.",
          "Nutze Reality Checks, wenn du wahrend langer Sessions den Uberblick behalten willst.",
          "Erhohe Limits nicht spontan nach Verlusten oder emotionalen Rennen.",
        ],
      },
      {
        title: "Warnsignale",
        items: [
          "Du wettest, um Verluste zuruckzuholen oder Stress zu verdrangen.",
          "Du verheimlichst Einsatze oder verlierst den Uberblick uber Ausgaben.",
          "Du kannst schwer aufhoren, obwohl du dir vorher ein Limit gesetzt hast.",
        ],
      },
    ],
    stats: [
      { label: "Mindestalter", value: "18+", note: "Nur fur volljahrige Nutzer." },
      { label: "Limits", value: "Empfohlen", note: "Vor dem Spielen festlegen." },
      { label: "Pause", value: "Jederzeit", note: "Bei Kontrollverlust sofort stoppen." },
    ],
    koalaPrompt: `${koalaBase}, koala calmly holding a red stop sign and limit slider UI, supportive non-alarmist expression, responsible gaming theme, soft light`,
  },
  "self-exclusion": {
    key: "self-exclusion",
    path: "/self-exclusion",
    label: "Selbstausschluss",
    eyebrow: "Spielpause aktivieren",
    title: "Selbstausschluss und Auszeiten",
    subtitle:
      "Wenn Wetten nicht mehr kontrollierbar wirkt, ist eine Pause der richtige Schritt. Hier findest du klare Optionen fur temporare und langere Sperren.",
    badge: "Schutzfunktion · Konto-Pause",
    image: "/404.png",
    imageWidth: 1402,
    imageHeight: 1122,
    sections: [
      {
        title: "Welche Optionen es gibt",
        items: [
          "Kurzpause fur einige Stunden oder Tage, wenn du Abstand brauchst.",
          "Langere Selbstausschluss-Zeitraume, wenn Spielen dich belastet.",
          "Nach Aktivierung konnen Sperren je nach Dauer nicht sofort aufgehoben werden.",
        ],
      },
      {
        title: "Wichtige Hinweise",
        items: [
          "Wahrend einer Sperre sind neue Wetten und Einzahlungen nicht moglich.",
          "Offene Wetten werden nach den regulären Marktregeln abgerechnet.",
          "Bei akuter Belastung solltest du zusatzlich professionelle Hilfe kontaktieren.",
        ],
      },
    ],
    stats: [
      { label: "Neue Wetten", value: "Gesperrt", note: "Wahrend aktiver Pause." },
      { label: "Einzahlungen", value: "Blockiert", note: "Schutz vor Impulsentscheidungen." },
      { label: "Aufhebung", value: "Begrenzt", note: "Abhangig vom gewahlten Zeitraum." },
    ],
    koalaPrompt: `${koalaBase}, koala gently closing a red racing garage door with a pause symbol, protective quiet mood, self-exclusion concept, respectful tone`,
  },
  "payment-methods": {
    key: "payment-methods",
    path: "/payment-methods",
    label: "Zahlungsmethoden",
    eyebrow: "Wallet und Transaktionen",
    title: "Zahlungsmethoden transparent verwalten",
    subtitle:
      "Uberblicke Einzahlungen, Auszahlungen und Bearbeitungszeiten. Alle Zahlungen sollten nachvollziehbar, sicher und klar begrenzt sein.",
    badge: "Wallet · Sicher",
    image: "/cashout.png",
    imageWidth: 1122,
    imageHeight: 1402,
    sections: [
      {
        title: "Unterstutzte Ablaufe",
        items: [
          "Einzahlungen werden dem Wallet nach erfolgreicher Bestatigung gutgeschrieben.",
          "Auszahlungen konnen je nach Methode und Prufstatus Bearbeitungszeit benotigen.",
          "Bonusguthaben und Echtgeldguthaben werden im Konto getrennt ausgewiesen.",
        ],
      },
      {
        title: "Sicherheit",
        items: [
          "Nutze nur Zahlungsmethoden, die auf deinen eigenen Namen laufen.",
          "Teile nie Karten-CVC, Passwort oder Einmalcodes mit Dritten.",
          "Setze Einzahlungslimits, wenn du dein Budget klar begrenzen willst.",
        ],
      },
    ],
    stats: [
      { label: "Wallet", value: "EUR", note: "Standardkonto in Euro." },
      { label: "Prufung", value: "Moglich", note: "Bei Auszahlungen oder Risikosignalen." },
      { label: "Limits", value: "Sinnvoll", note: "Budgetkontrolle direkt vorab." },
    ],
    koalaPrompt: `${koalaBase}, koala holding a secure red wallet card and payment dashboard, subtle lock icon, clean fintech sportsbook visual, trustworthy mood`,
  },
  faq: {
    key: "faq",
    path: "/faq",
    label: "FAQ",
    eyebrow: "Schnelle Antworten",
    title: "Häufig gestellte Fragen",
    subtitle:
      "Kurze Antworten zu Quoten, Abrechnung, Live-Märkten, Boni und Konto-Sicherheit. Für Details führen dich die Hilfeseiten weiter.",
    badge: "FAQ · Kompakt",
    image: "/faq.png",
    imageWidth: 1402,
    imageHeight: 1122,
    sections: [
      {
        title: "Häufige Fragen",
        items: [
          "Quoten ändern sich durch neue Daten, Marktbewegung und Rennereignisse.",
          "Wetten werden nach offiziellen Ergebnissen und den jeweiligen Marktregeln abgerechnet.",
          "Promotions können Mindestquoten, Ablaufzeiten und regionale Einschränkungen haben.",
        ],
      },
      {
        title: "Wo du mehr findest",
        items: [
          "Support hilft bei Konto- und Wettscheinfragen.",
          "Zahlungsmethoden erklärt Wallet, Einzahlungen und Auszahlungen.",
          "Verantwortungsvolles Spielen sammelt Limits, Pausen und Schutzfunktionen.",
        ],
      },
    ],
    stats: [
      { label: "Format", value: "Kurz", note: "Schnelle Orientierung." },
      { label: "Details", value: "Verlinkt", note: "Vertiefung auf Hilfeseiten." },
      { label: "Sprache", value: "Deutsch", note: "Konsistent mit der App." },
    ],
    koalaPrompt: `${koalaBase}, koala beside oversized red question mark icons and neatly stacked FAQ cards, curious helpful expression, clean support illustration`,
  },
};

export const footerPageList = Object.values(footerPages);
