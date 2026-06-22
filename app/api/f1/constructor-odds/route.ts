import { NextResponse } from "next/server";

type ConstructorStanding = {
  position?: string;
  points?: string;
  wins?: string;
  Constructor?: {
    constructorId?: string;
    name?: string;
  };
};

const teamColorByConstructorId: Record<string, string> = {
  red_bull: "#0a2d6b",
  ferrari: "#e10600",
  mclaren: "#ff8000",
  mercedes: "#00d2be",
  aston_martin: "#006f62",
  williams: "#005aff",
  rb: "#1660ad",
  sauber: "#52e252",
  alpine: "#0090ff",
  haas: "#c4c4c4",
  audi: "#3a3a3a",
  cadillac: "#1d4ed8",
};

const fallbackDriversByConstructorId: Record<string, string> = {
  red_bull: "Verstappen / Hadjar",
  ferrari: "Hamilton / Leclerc",
  mclaren: "Norris / Piastri",
  mercedes: "Russell / Antonelli",
  aston_martin: "Alonso / Stroll",
  williams: "Albon / Sainz",
  rb: "Lawson / Lindblad",
  sauber: "Bortoleto / Hülkenberg",
  alpine: "Gasly / Colapinto",
  haas: "Ocon / Bearman",
  audi: "Bortoleto / Hülkenberg",
  cadillac: "Pérez / Bottas",
};

export async function GET() {
  try {
    const res = await fetch("https://api.jolpi.ca/ergast/f1/current/constructorstandings.json", {
      next: { revalidate: 1800 },
      headers: { Accept: "application/json" },
    });

    if (!res.ok) throw new Error(`Upstream returned ${res.status}`);

    const data = await res.json();
    const standings: ConstructorStanding[] =
      data?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings ?? [];

    const toOdds = (score: number, min: number, max: number) => {
      const clamped = Math.max(min, Math.min(max, score));
      return clamped.toFixed(2);
    };

    const rows = standings.map((row) => {
      const constructorId = row?.Constructor?.constructorId ?? "unknown";
      const teamName = row?.Constructor?.name ?? "Unknown";
      const points = Number(row?.points ?? "0");
      const wins = Number(row?.wins ?? "0");
      const pos = Number(row?.position ?? "20");

      const competitiveness = points + wins * 15 - (pos - 1) * 6;
      const odds = toOdds(14 - competitiveness * 0.02, 1.15, 1001);

      return {
        pos,
        constructorId,
        team: teamName,
        drivers: fallbackDriversByConstructorId[constructorId] ?? "TBA",
        points,
        odds,
        color: teamColorByConstructorId[constructorId] ?? "#8a8a8a",
      };
    });

    return NextResponse.json({
      source: "jolpica",
      updatedAt: new Date().toISOString(),
      rows,
    });
  } catch {
    return NextResponse.json({
      source: "fallback",
      rows: [],
    });
  }
}
