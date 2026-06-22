import { NextResponse } from "next/server";
import { getMarkets } from "@/lib/betting/markets";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const markets = await getMarkets();
    return NextResponse.json({ markets });
  } catch {
    return NextResponse.json({ markets: [] }, { status: 200 });
  }
}
