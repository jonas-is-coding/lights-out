import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// The hosting network blocks raw Postgres TCP (port 5432), so the standard
// `pg` driver times out. Neon's serverless driver tunnels Postgres over a
// WebSocket on port 443, which works everywhere. In Node we must supply the
// WebSocket implementation; the browser/edge runtimes provide a native one.
neonConfig.webSocketConstructor = ws;

// Reuse a single Pool across hot-reloads in development.
const globalForPool = globalThis as unknown as { __dbPool?: Pool };

export const pool: Pool =
  globalForPool.__dbPool ??
  new Pool({ connectionString: process.env.DATABASE_URL });

if (process.env.NODE_ENV !== "production") {
  globalForPool.__dbPool = pool;
}
