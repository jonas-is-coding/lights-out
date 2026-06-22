import { NextResponse } from "next/server";

type StandingEntry = {
  position?: string;
  points?: string;
  wins?: string;
  Driver: {
    driverId: string;
    permanentNumber?: string;
    givenName: string;
    familyName: string;
    nationality?: string;
  };
  Constructors?: Array<{ name?: string }>;
};

const FEATURED_DRIVER_IDS = ["hamilton", "verstappen", "leclerc", "norris"] as const;
const DRIVER_ALIASES: Record<(typeof FEATURED_DRIVER_IDS)[number], string[]> = {
  hamilton: ["hamilton"],
  verstappen: ["verstappen", "max_verstappen"],
  leclerc: ["leclerc"],
  norris: ["norris"],
};

const nationalityToCode: Record<string, string> = {
  British: "GBR",
  Dutch: "NED",
  Monegasque: "MON",
};

export async function GET() {
  try {
    const res = await fetch("https://api.jolpi.ca/ergast/f1/current/driverstandings.json", {
      next: { revalidate: 1800 },
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      throw new Error(`Upstream returned ${res.status}`);
    }

    const data = await res.json();
    const standings: StandingEntry[] =
      data?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings ?? [];

    const byId = new Map<string, StandingEntry>();
    for (const row of standings) {
      const id = row?.Driver?.driverId;
      if (id) byId.set(id, row);
    }

    const toOdds = (score: number, min: number, max: number) => {
      const clamped = Math.max(min, Math.min(max, score));
      return clamped.toFixed(2);
    };

    const drivers = FEATURED_DRIVER_IDS
      .map((id) => {
        const aliases = DRIVER_ALIASES[id];
        const row = aliases.map((alias) => byId.get(alias)).find(Boolean);
        if (!row?.Driver) return null;

        const first = row.Driver.givenName ?? "";
        const last = row.Driver.familyName ?? "";
        const nationality = row.Driver.nationality ?? "";
        const position = Number(row.position ?? "20");
        const points = Number(row.points ?? "0");
        const wins = Number(row.wins ?? "0");

        const competitiveness = points + wins * 12 - (position - 1) * 4;
        const raceWinner = toOdds(6.5 - competitiveness * 0.05, 1.2, 12);
        const podium = toOdds(2.4 - competitiveness * 0.018, 1.05, 4.2);
        const pole = toOdds(4.8 - competitiveness * 0.032, 1.2, 9.5);
        const fastestLap = toOdds(6.2 - competitiveness * 0.028, 1.3, 11);

        return {
          driverId: id,
          number: row.Driver.permanentNumber ?? "",
          first,
          last,
          team: row.Constructors?.[0]?.name ?? "",
          country: nationality,
          flag: nationalityToCode[nationality] ?? "F1",
          raceWinner,
          podium,
          pole,
          fastestLap,
        };
      })
      .filter(Boolean);

    return NextResponse.json({
      source: "jolpica",
      updatedAt: new Date().toISOString(),
      drivers,
    });
  } catch {
    return NextResponse.json({
      source: "fallback",
      drivers: [],
    });
  }
}
