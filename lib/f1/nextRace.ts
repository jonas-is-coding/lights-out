import "server-only";

export type NextRaceInfo = {
  source: "jolpica" | "fallback";
  season: string;
  round: string;
  raceName: string;
  date: string;
  time: string;
  circuitId: string;
  circuitName: string;
  locality: string;
  country: string;
};

type Race = {
  season?: string;
  round?: string;
  raceName?: string;
  date?: string;
  time?: string;
  Circuit?: {
    circuitId?: string;
    circuitName?: string;
    Location?: {
      locality?: string;
      country?: string;
    };
  };
};

export const FALLBACK_NEXT_RACE: NextRaceInfo = {
  source: "fallback",
  season: "2026",
  round: "",
  raceName: "Nächstes Rennen",
  date: "",
  time: "",
  circuitId: "",
  circuitName: "",
  locality: "",
  country: "",
};

export function formatRoundLabel(round: string) {
  if (!round) return "Runde offen";
  return `Runde ${round.padStart(2, "0")}`;
}

export function formatHeroRaceLabel(race: Pick<NextRaceInfo, "round" | "raceName">) {
  return `${formatRoundLabel(race.round)} · ${race.raceName || "Nächstes Rennen"} · Märkte offen`;
}

export function formatMarketsOpenLabel(race: Pick<NextRaceInfo, "round" | "raceName">) {
  if (race.round && race.raceName) {
    return `Offen für ${formatRoundLabel(race.round)} · ${race.raceName}`;
  }
  if (race.raceName) return `Offen für ${race.raceName}`;
  return "Märkte offen";
}

export async function getNextRace(): Promise<NextRaceInfo> {
  try {
    const res = await fetch("https://api.jolpi.ca/ergast/f1/current/next.json", {
      next: { revalidate: 1800 },
      headers: { Accept: "application/json" },
    });

    if (!res.ok) throw new Error(`Upstream returned ${res.status}`);

    const data = await res.json();
    const race: Race | undefined = data?.MRData?.RaceTable?.Races?.[0];

    if (!race) return FALLBACK_NEXT_RACE;

    return {
      source: "jolpica",
      season: race.season ?? FALLBACK_NEXT_RACE.season,
      round: race.round ?? "",
      raceName: race.raceName ?? FALLBACK_NEXT_RACE.raceName,
      date: race.date ?? "",
      time: race.time ?? "",
      circuitId: race.Circuit?.circuitId ?? "",
      circuitName: race.Circuit?.circuitName ?? "",
      locality: race.Circuit?.Location?.locality ?? "",
      country: race.Circuit?.Location?.country ?? "",
    };
  } catch {
    return FALLBACK_NEXT_RACE;
  }
}
