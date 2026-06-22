#!/usr/bin/env node
// Entfernt den weißen Hintergrund der Fahrer-Koalas in public/drivers/.
//
// Technik: Flood-Fill von den Bildrändern aus (über einen 1px weißen Rahmen),
// sodass NUR der zusammenhängende äußere weiße Hintergrund transparent wird.
// Innenliegendes Weiß (weißer Anzug/Helm) bleibt erhalten.
//
// Nutzung:
//   node scripts/remove-driver-bg.mjs           einmalig alle Bilder freistellen
//   node scripts/remove-driver-bg.mjs --watch    Ordner überwachen, neue Bilder
//                                                 automatisch freistellen
//   FUZZ=18% node scripts/remove-driver-bg.mjs   Toleranz für Anti-Aliasing erhöhen

import { readdirSync, existsSync, watch } from "node:fs";
import { join, extname } from "node:path";
import { execFileSync } from "node:child_process";

const DIR = join(process.cwd(), "public", "drivers");
const FUZZ = process.env.FUZZ ?? "12%";
const WATCH = process.argv.includes("--watch");

function hasMagick() {
  try {
    execFileSync("magick", ["-version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

// Bereits freigestelltes Bild (mit Transparenz) erneut zu bearbeiten ist
// unnötig — und würde im Watch-Modus eine Endlosschleife auslösen.
function isOpaque(file) {
  try {
    const out = execFileSync("magick", ["identify", "-format", "%[opaque]", file], {
      encoding: "utf8",
    }).trim();
    return out.toLowerCase() === "true";
  } catch {
    return true; // im Zweifel verarbeiten
  }
}

function stripBackground(file) {
  execFileSync("magick", [
    file,
    "-alpha", "set",
    "-bordercolor", "white",
    "-border", "1",
    "-fuzz", FUZZ,
    "-fill", "none",
    "-draw", "alpha 0,0 floodfill",
    "-shave", "1x1",
    file,
  ]);
}

function processFile(name) {
  if (extname(name).toLowerCase() !== ".png") return;
  const file = join(DIR, name);
  if (!existsSync(file)) return;
  if (!isOpaque(file)) {
    console.log("·", name, "(bereits freigestellt)");
    return;
  }
  try {
    stripBackground(file);
    console.log("✓", name);
  } catch (e) {
    console.error("✗", name, "—", e.message);
  }
}

if (!hasMagick()) {
  console.error(
    "ImageMagick nicht gefunden. Installieren mit:  brew install imagemagick"
  );
  process.exit(1);
}

if (!existsSync(DIR)) {
  console.error(`Ordner fehlt: ${DIR}`);
  process.exit(1);
}

const pngs = readdirSync(DIR).filter((f) => extname(f).toLowerCase() === ".png");
if (pngs.length === 0) {
  console.log("Noch keine PNGs in public/drivers/ — lege Bilder ab und starte erneut.");
} else {
  console.log(`Verarbeite ${pngs.length} Bild(er) (FUZZ=${FUZZ})…`);
  pngs.forEach(processFile);
}

if (WATCH) {
  console.log("\n👀 Watch-Modus aktiv — neue Bilder werden automatisch freigestellt. (Strg+C zum Beenden)");
  const pending = new Map();
  watch(DIR, (_event, filename) => {
    if (!filename || extname(filename).toLowerCase() !== ".png") return;
    clearTimeout(pending.get(filename));
    pending.set(
      filename,
      setTimeout(() => {
        pending.delete(filename);
        processFile(filename);
      }, 600)
    );
  });
}
