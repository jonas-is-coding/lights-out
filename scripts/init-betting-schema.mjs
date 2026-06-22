import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// Load .env if DATABASE_URL is not already set
if (!process.env.DATABASE_URL) {
  try {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const envPath = join(__dirname, "..", ".env");
    const envContent = readFileSync(envPath, "utf8");
    for (const line of envContent.split("\n")) {
      const match = line.match(/^([^#=\s]+)\s*=\s*(.*)$/);
      if (match) {
        process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    // .env not found — rely on process.env
  }
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL is missing.");
  process.exit(1);
}

const sql = neon(connectionString);

const schemaSql = `
ALTER TABLE bets ADD COLUMN IF NOT EXISTS market_key TEXT;

ALTER TABLE bets ADD COLUMN IF NOT EXISTS selection_key TEXT;

ALTER TABLE bets ADD COLUMN IF NOT EXISTS event_label TEXT;

ALTER TABLE bets ADD COLUMN IF NOT EXISTS free_bet BOOLEAN DEFAULT false;

ALTER TABLE bets ADD COLUMN IF NOT EXISTS boosted BOOLEAN DEFAULT false;

ALTER TABLE bets ADD COLUMN IF NOT EXISTS cashout_value NUMERIC(12,2);

ALTER TABLE bets ADD COLUMN IF NOT EXISTS bonus_id INTEGER REFERENCES bonuses(id);

CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(24) NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  balance_after NUMERIC(12,2) NOT NULL,
  description TEXT,
  bet_id INTEGER REFERENCES bets(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions ("userId", created_at DESC);
`;

const statements = schemaSql
  .split(";")
  .map((s) => s.trim())
  .filter(Boolean);

for (const statement of statements) {
  await sql.query(statement);
}

console.log("Betting schema initialized.");
