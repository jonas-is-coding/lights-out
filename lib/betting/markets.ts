import "server-only";
import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Market, MarketKey, Selection } from "./types";
import { getNextRace } from "@/lib/f1/nextRace";

// Resolve a driver's koala portrait from /public/drivers, if one exists.
// Tries the API driverId and a slugified family name so both "max_verstappen"
// and "verstappen.png" resolve. Returns undefined when no image is present,
// so the UI gracefully falls back to the text-only card.
const slug = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");

function resolveDriverImage(driverId: string, last: string): string | undefined {
  const candidates = Array.from(
    new Set([slug(driverId), slug(last)].filter(Boolean))
  );
  for (const name of candidates) {
    if (existsSync(join(process.cwd(), "public", "drivers", `${name}.png`))) {
      return `/drivers/${name}.png`;
    }
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// Markets catalog — the SERVER-AUTHORITATIVE source of odds.
//
// Odds are derived from the live jolpica/Ergast standings using the same
// formulas as the public F1 API routes, with a static fallback so betting
// keeps working when the upstream feed is unavailable. Bet placement must
// look odds up here via findSelection() and never trust client-sent values.
// ---------------------------------------------------------------------------

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));
const r2 = (v: number) => Math.round((v + Number.EPSILON) * 100) / 100;

type FeaturedDriver = {
  driverId: string;
  last: string;
  team: string;
  raceWinner: number;
  podium: number;
  pole: number;
  fastestLap: number;
};

type ConstructorRow = {
  constructorId: string;
  team: string;
  odds: number;
};

const FALLBACK_DRIVERS: FeaturedDriver[] = [
  { driverId: "verstappen", last: "Verstappen", team: "Oracle Red Bull", raceWinner: 1.75, podium: 1.12, pole: 1.85, fastestLap: 3.5 },
  { driverId: "norris", last: "Norris", team: "McLaren", raceWinner: 3.0, podium: 1.4, pole: 2.6, fastestLap: 4.0 },
  { driverId: "piastri", last: "Piastri", team: "McLaren", raceWinner: 3.4, podium: 1.5, pole: 2.9, fastestLap: 4.5 },
  { driverId: "leclerc", last: "Leclerc", team: "Scuderia Ferrari", raceWinner: 4.5, podium: 1.65, pole: 3.5, fastestLap: 6.0 },
  { driverId: "hamilton", last: "Hamilton", team: "Scuderia Ferrari", raceWinner: 5.0, podium: 1.8, pole: 3.8, fastestLap: 4.5 },
  { driverId: "russell", last: "Russell", team: "Mercedes", raceWinner: 6.0, podium: 2.0, pole: 4.5, fastestLap: 5.5 },
  { driverId: "antonelli", last: "Antonelli", team: "Mercedes", raceWinner: 11.0, podium: 3.2, pole: 7.0, fastestLap: 8.0 },
  { driverId: "alonso", last: "Alonso", team: "Aston Martin", raceWinner: 17.0, podium: 4.5, pole: 9.0, fastestLap: 9.0 },
  { driverId: "stroll", last: "Stroll", team: "Aston Martin", raceWinner: 34.0, podium: 8.0, pole: 15.0, fastestLap: 12.0 },
  { driverId: "gasly", last: "Gasly", team: "Alpine", raceWinner: 41.0, podium: 9.0, pole: 17.0, fastestLap: 11.0 },
  { driverId: "doohan", last: "Doohan", team: "Alpine", raceWinner: 67.0, podium: 14.0, pole: 26.0, fastestLap: 15.0 },
  { driverId: "albon", last: "Albon", team: "Williams", raceWinner: 41.0, podium: 9.0, pole: 17.0, fastestLap: 11.0 },
  { driverId: "sainz", last: "Sainz", team: "Williams", raceWinner: 26.0, podium: 6.0, pole: 12.0, fastestLap: 9.0 },
  { driverId: "hadjar", last: "Hadjar", team: "RB", raceWinner: 81.0, podium: 17.0, pole: 30.0, fastestLap: 17.0 },
  { driverId: "tsunoda", last: "Tsunoda", team: "RB", raceWinner: 51.0, podium: 11.0, pole: 21.0, fastestLap: 13.0 },
  { driverId: "hulkenberg", last: "Hülkenberg", team: "Kick Sauber", raceWinner: 67.0, podium: 14.0, pole: 26.0, fastestLap: 15.0 },
  { driverId: "bortoleto", last: "Bortoleto", team: "Kick Sauber", raceWinner: 101.0, podium: 21.0, pole: 34.0, fastestLap: 19.0 },
  { driverId: "ocon", last: "Ocon", team: "Haas", raceWinner: 67.0, podium: 14.0, pole: 26.0, fastestLap: 15.0 },
  { driverId: "bearman", last: "Bearman", team: "Haas", raceWinner: 81.0, podium: 17.0, pole: 30.0, fastestLap: 17.0 },
];

const FALLBACK_CONSTRUCTORS: ConstructorRow[] = [
  { constructorId: "mclaren", team: "McLaren F1 Team", odds: 1.3 },
  { constructorId: "red_bull", team: "Oracle Red Bull Racing", odds: 4.0 },
  { constructorId: "ferrari", team: "Scuderia Ferrari", odds: 4.5 },
  { constructorId: "mercedes", team: "Mercedes-AMG Petronas", odds: 9.0 },
  { constructorId: "williams", team: "Williams Racing", odds: 67.0 },
  { constructorId: "aston_martin", team: "Aston Martin Aramco", odds: 151.0 },
  { constructorId: "rb", team: "Racing Bulls", odds: 251.0 },
  { constructorId: "alpine", team: "Alpine F1 Team", odds: 251.0 },
  { constructorId: "haas", team: "Haas F1 Team", odds: 501.0 },
  { constructorId: "sauber", team: "Kick Sauber", odds: 751.0 },
];

type CatalogData = {
  drivers: FeaturedDriver[];
  constructors: ConstructorRow[];
  event: string;
  season: string;
};

async function loadDriverStandings(): Promise<FeaturedDriver[] | null> {
  try {
    const res = await fetch(
      "https://api.jolpi.ca/ergast/f1/current/driverstandings.json",
      { next: { revalidate: 600 }, headers: { Accept: "application/json" } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const standings =
      data?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings ?? [];
    if (!Array.isArray(standings) || standings.length === 0) return null;

    const drivers = standings.map((row: Record<string, unknown>) => {
      const driver = row.Driver as Record<string, unknown>;
      const id = (driver?.driverId as string) ?? "";
      if (!id) return null;
      const constructors = row.Constructors as Array<{ name?: string }> | undefined;
      const position = Number(row.position ?? "20");
      const points = Number(row.points ?? "0");
      const wins = Number(row.wins ?? "0");
      const c = points + wins * 12 - (position - 1) * 4;
      return {
        driverId: id,
        last: (driver.familyName as string) ?? id,
        team: constructors?.[0]?.name ?? "",
        raceWinner: r2(clamp(6.5 - c * 0.05, 1.2, 251)),
        podium: r2(clamp(2.4 - c * 0.018, 1.05, 67)),
        pole: r2(clamp(4.8 - c * 0.032, 1.2, 101)),
        fastestLap: r2(clamp(6.2 - c * 0.028, 1.3, 51)),
      } as FeaturedDriver;
    }).filter((d): d is FeaturedDriver => d !== null);

    return drivers.length > 0 ? drivers : null;
  } catch {
    return null;
  }
}

async function loadConstructorStandings(): Promise<ConstructorRow[] | null> {
  try {
    const res = await fetch(
      "https://api.jolpi.ca/ergast/f1/current/constructorstandings.json",
      { next: { revalidate: 600 }, headers: { Accept: "application/json" } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const standings =
      data?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings ?? [];
    if (!Array.isArray(standings) || standings.length === 0) return null;

    const rows: ConstructorRow[] = standings.map((row: Record<string, unknown>) => {
      const constructor = row.Constructor as Record<string, unknown>;
      const points = Number(row.points ?? "0");
      const wins = Number(row.wins ?? "0");
      const pos = Number(row.position ?? "20");
      const c = points + wins * 15 - (pos - 1) * 6;
      return {
        constructorId: (constructor?.constructorId as string) ?? "unknown",
        team: (constructor?.name as string) ?? "Unbekannt",
        odds: r2(clamp(14 - c * 0.02, 1.15, 1001)),
      };
    });

    return rows.length > 0 ? rows : null;
  } catch {
    return null;
  }
}

async function loadNextEvent(): Promise<{ event: string; season: string }> {
  const race = await getNextRace();
  return {
    event: race.raceName,
    season: race.season,
  };
}

async function loadCatalog(): Promise<CatalogData> {
  const [drivers, constructors, ev] = await Promise.all([
    loadDriverStandings(),
    loadConstructorStandings(),
    loadNextEvent(),
  ]);

  return {
    drivers: drivers ?? FALLBACK_DRIVERS,
    constructors: constructors ?? FALLBACK_CONSTRUCTORS,
    event: ev.event,
    season: ev.season,
  };
}

const DRIVER_MARKETS: { key: MarketKey; title: string; pick: keyof FeaturedDriver }[] = [
  { key: "race_winner", title: "Rennsieger", pick: "raceWinner" },
  { key: "podium", title: "Podestplatz", pick: "podium" },
  { key: "pole", title: "Pole-Position", pick: "pole" },
  { key: "fastest_lap", title: "Schnellste Runde", pick: "fastestLap" },
];

export async function getMarkets(): Promise<Market[]> {
  const { drivers, constructors, event, season } = await loadCatalog();

  const driverMarkets: Market[] = DRIVER_MARKETS.map(({ key, title, pick }) => ({
    key,
    title,
    event,
    selections: drivers.map<Selection>((d) => ({
      key: d.driverId,
      label: d.last,
      sub: d.team,
      odds: d[pick] as number,
      image: resolveDriverImage(d.driverId, d.last),
    })),
  }));

  const constructorMarket: Market = {
    key: "constructor_champion",
    title: "Konstrukteurs-Weltmeister",
    event: `Saison ${season}`,
    selections: constructors.map<Selection>((c) => ({
      key: c.constructorId,
      label: c.team,
      odds: c.odds,
    })),
  };

  return [...driverMarkets, constructorMarket];
}

export async function findSelection(
  marketKey: string,
  selectionKey: string
): Promise<{ market: Market; selection: Selection } | null> {
  const markets = await getMarkets();
  const market = markets.find((m) => m.key === marketKey);
  if (!market) return null;
  const selection = market.selections.find((s) => s.key === selectionKey);
  if (!selection) return null;
  return { market, selection };
}
