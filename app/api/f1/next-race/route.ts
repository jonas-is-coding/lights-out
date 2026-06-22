import { NextResponse } from "next/server";
import { getNextRace } from "@/lib/f1/nextRace";

export async function GET() {
  const race = await getNextRace();

  return NextResponse.json({
    source: race.source,
    updatedAt: new Date().toISOString(),
    race,
  });
}
