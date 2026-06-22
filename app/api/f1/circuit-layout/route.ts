import { NextResponse } from "next/server";

type NextRace = {
  season?: string;
  round?: string;
  raceName?: string;
  Circuit?: { circuitId?: string; circuitName?: string };
};

type MVCorner = {
  number: number;
  trackPosition: { x: number; y: number };
};

type MVCircuit = {
  x?: number[];
  y?: number[];
  corners?: MVCorner[];
  marshalSectors?: Array<{ number: number; length: number; trackPosition: { x: number; y: number } }>;
};

const CIRCUIT_KEY_BY_ERGAST_ID: Record<string, number> = {
  monaco: 61,
  silverstone: 2,
  spa: 7,
  monza: 14,
  suzuka: 46,
  villeneuve: 23,
  interlagos: 50,
  marina_bay: 10,
  bahrain: 63,
  yas_marina: 70,
  jeddah: 149,
  miami: 151,
  imola: 6,
  hungaroring: 4,
  zandvoort: 55,
  catalunya: 9,
  red_bull_ring: 68,
  baku: 144,
  las_vegas: 152,
  losail: 150,
  shanghai: 49,
  rodriguez: 65,
};

function normalizePoints(x: number[], y: number[]) {
  let nx = [...x];
  let ny = [...y];

  // Align the dominant geometric axis horizontally (PCA-like).
  const meanX = nx.reduce((a, b) => a + b, 0) / nx.length;
  const meanY = ny.reduce((a, b) => a + b, 0) / ny.length;
  let sxx = 0;
  let syy = 0;
  let sxy = 0;
  for (let i = 0; i < nx.length; i++) {
    const dx = nx[i] - meanX;
    const dy = ny[i] - meanY;
    sxx += dx * dx;
    syy += dy * dy;
    sxy += dx * dy;
  }
  const theta = 0.5 * Math.atan2(2 * sxy, sxx - syy);
  const ct = Math.cos(-theta);
  const st = Math.sin(-theta);
  nx = nx.map((vx, i) => {
    const dx = vx - meanX;
    const dy = ny[i] - meanY;
    return dx * ct - dy * st;
  });
  ny = ny.map((vy, i) => {
    const dx = x[i] - meanX;
    const dy = vy - meanY;
    return dx * st + dy * ct;
  });

  // Safety: if still portrait-ish, rotate 90deg.
  const w0 = Math.max(...nx) - Math.min(...nx);
  const h0 = Math.max(...ny) - Math.min(...ny);
  if (h0 > w0) {
    const rx: number[] = [];
    const ry: number[] = [];
    for (let i = 0; i < nx.length; i++) {
      rx.push(ny[i]);
      ry.push(-nx[i]);
    }
    nx = rx;
    ny = ry;
  }

  const minX = Math.min(...nx);
  const maxX = Math.max(...nx);
  const minY = Math.min(...ny);
  const maxY = Math.max(...ny);

  const width = 1000;
  const height = 420;
  const pad = 20;

  const spanX = Math.max(1, maxX - minX);
  const spanY = Math.max(1, maxY - minY);
  const sx = (width - pad * 2) / spanX;
  const sy = (height - pad * 2) / spanY;
  const s = Math.min(sx, sy);
  const usedW = spanX * s;
  const usedH = spanY * s;
  const offX = (width - usedW) / 2;
  const offY = (height - usedH) / 2;

  return nx.map((vx, i) => ({
    x: (vx - minX) * s + offX,
    y: (maxY - ny[i]) * s + offY,
  }));
}

function pathFromPoints(points: Array<{ x: number; y: number }>) {
  if (points.length === 0) return "";
  return `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)} ` +
    points.slice(1).map((p) => `L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" ");
}

function pathRange(points: Array<{ x: number; y: number }>, start: number, end: number) {
  if (points.length === 0) return "";
  const s = Math.max(0, Math.min(points.length - 1, start));
  const e = Math.max(s + 1, Math.min(points.length - 1, end));
  return pathFromPoints(points.slice(s, e + 1));
}

function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

const DRS_BY_CIRCUIT_ID: Record<string, Array<{ startSector: number; endSector: number }>> = {
  monaco: [{ startSector: 15, endSector: 16 }],
  silverstone: [{ startSector: 2, endSector: 3 }, { startSector: 11, endSector: 12 }],
  spa: [{ startSector: 1, endSector: 2 }, { startSector: 13, endSector: 14 }],
  monza: [{ startSector: 2, endSector: 3 }, { startSector: 9, endSector: 10 }],
  suzuka: [{ startSector: 15, endSector: 16 }],
  villeneuve: [{ startSector: 8, endSector: 9 }, { startSector: 15, endSector: 16 }],
  interlagos: [{ startSector: 2, endSector: 3 }, { startSector: 15, endSector: 16 }],
  marina_bay: [{ startSector: 13, endSector: 14 }, { startSector: 15, endSector: 16 }],
  bahrain: [{ startSector: 3, endSector: 4 }, { startSector: 13, endSector: 14 }, { startSector: 15, endSector: 16 }],
  yas_marina: [{ startSector: 4, endSector: 5 }, { startSector: 13, endSector: 14 }],
  jeddah: [{ startSector: 8, endSector: 9 }, { startSector: 14, endSector: 15 }, { startSector: 16, endSector: 17 }],
};

function nearestPointIndex(points: Array<{ x: number; y: number }>, p: { x: number; y: number }) {
  let best = 0;
  let bestD = Number.POSITIVE_INFINITY;
  for (let i = 0; i < points.length; i++) {
    const d = dist(points[i], p);
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  }
  return best;
}

export async function GET() {
  try {
    const nextRes = await fetch("https://api.jolpi.ca/ergast/f1/current/next.json", {
      next: { revalidate: 1800 },
      headers: { Accept: "application/json" },
    });
    if (!nextRes.ok) throw new Error("next race fetch failed");

    const nextData = await nextRes.json();
    const race: NextRace | undefined = nextData?.MRData?.RaceTable?.Races?.[0];
    const circuitId = race?.Circuit?.circuitId ?? "monaco";
    const circuitKey = CIRCUIT_KEY_BY_ERGAST_ID[circuitId] ?? 61;

    const mvRes = await fetch(`https://api.multiviewer.app/api/v1/circuits/${circuitKey}/2023`, {
      next: { revalidate: 86400 },
      headers: { Accept: "application/json" },
    });
    if (!mvRes.ok) throw new Error("track fetch failed");

    const mv = (await mvRes.json()) as MVCircuit;
    const x = mv.x ?? [];
    const y = mv.y ?? [];
    if (x.length === 0 || x.length !== y.length) throw new Error("invalid track points");

    const points = normalizePoints(x, y);
    const fullPath = pathFromPoints(points);

    const marshalSectors = mv.marshalSectors ?? [];
    const trackLength = Math.max(...marshalSectors.map((m) => m.length), 1);
    const sectorIndices = marshalSectors.map((m) => {
      const ratio = m.length / trackLength;
      return Math.max(0, Math.min(points.length - 1, Math.round(ratio * (points.length - 1))));
    });

    const marshalSegments: Array<{
      number: number;
      path: string;
      startIdx: number;
      endIdx: number;
      marker: { x: number; y: number };
    }> = [];
    for (let i = 0; i < sectorIndices.length; i++) {
      const startIdx = sectorIndices[i];
      const endIdx = i === sectorIndices.length - 1 ? points.length - 1 : sectorIndices[i + 1];
      marshalSegments.push({
        number: marshalSectors[i]?.number ?? i + 1,
        path: pathRange(points, startIdx, endIdx),
        startIdx,
        endIdx,
        marker: points[Math.floor((startIdx + endIdx) / 2)] ?? points[0],
      });
    }

    const drsTemplate = DRS_BY_CIRCUIT_ID[circuitId] ?? [];
    const drs = drsTemplate
      .map((zone, idx) => {
        const start = marshalSegments.find((s) => s.number === zone.startSector);
        const end = marshalSegments.find((s) => s.number === zone.endSector);
        if (!start || !end) return null;
        const startIdx = Math.min(start.startIdx, end.startIdx);
        const endIdx = Math.max(start.endIdx, end.endIdx);
        return {
          label: `DRS ${idx + 1}`,
          path: pathRange(points, startIdx, endIdx),
          marker: points[Math.floor((startIdx + endIdx) / 2)] ?? points[0],
        };
      })
      .filter((v): v is { label: string; path: string; marker: { x: number; y: number } } => Boolean(v));

    const corners = (mv.corners ?? []).slice(0, 12).map((c) => {
      const normPt = normalizePoints([c.trackPosition.x], [c.trackPosition.y])[0];
      const idx = nearestPointIndex(points, normPt);
      return {
        id: `T${String(c.number).padStart(2, "0")}`,
        x: points[idx].x,
        y: points[idx].y,
      };
    });

    return NextResponse.json({
      race: {
        round: race?.round ?? "",
        raceName: race?.raceName ?? "",
        circuitName: race?.Circuit?.circuitName ?? "",
        circuitId,
      },
      layout: {
        viewBox: "0 0 1000 420",
        fullPath,
        startPoint: points[0],
        marshalSegments,
        drs,
        corners,
      },
    });
  } catch {
    return NextResponse.json({ race: null, layout: null });
  }
}
