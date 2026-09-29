/**
 * Renders a still of the replay figure from the bundled sample.
 * Output goes to poster.png and poster.svg next to index.mdx.
 * The PNG is used by the README first screen, the social card, and as the
 * no-JavaScript fallback on the page.
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";

const here = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(await readFile(path.resolve(here, "../data/sample.json"), "utf8"));
const outDir = path.resolve(here, "..");

const COLORS = { 1: "#1d7a64", 2: "#3ba784", 3: "#7cc3a6", 0: "#b85a12", 4: "#e59a45", 5: "#5e43b0", 6: "#9e86de" };
const W = 1200, H = 760, PAD = 40;
const px = (x) => PAD + x * (W - 2 * PAD);
const py = (y) => PAD + (1 - y) * (H - 2 * PAD);

// Pick the session with the most task switches, it tells the story best.
const session = [...data.sessions].sort(
  (a, b) => new Set(b.truth).size - new Set(a.truth).size,
)[0];
const ev = session.events;
// Draw a window of recent hovers around the first task switch, the way the
// live figure shows its trailing trace. The whole session is too tangled to read.
const WINDOW = 28;
const switchAt = Math.max(1, session.truth.findIndex((t, i) => i > 0 && t !== session.truth[i - 1]));
const end = Math.min(ev.length, switchAt + Math.round(WINDOW / 2));
const start = Math.max(1, end - WINDOW);
const visited = new Set(ev.slice(start - 1, end).map((e) => e.p));

const parts = [];
parts.push(`<rect width="${W}" height="${H}" fill="#fcfcfb"/>`);
data.projection.points.forEach(([x, y], i) => {
  parts.push(`<circle cx="${px(x).toFixed(1)}" cy="${py(y).toFixed(1)}" r="${visited.has(i) ? 6 : 5}" fill="${visited.has(i) ? "#7d858e" : "#c3c8cd"}"/>`);
});
for (let i = start; i < end; i++) {
  const a = data.projection.points[ev[i - 1].p];
  const b = data.projection.points[ev[i].p];
  const age = (i - start) / Math.max(1, end - start - 1); // 0 oldest, 1 newest
  parts.push(`<line x1="${px(a[0]).toFixed(1)}" y1="${py(a[1]).toFixed(1)}" x2="${px(b[0]).toFixed(1)}" y2="${py(b[1]).toFixed(1)}" stroke="${COLORS[session.truth[i]]}" stroke-width="${(3 + 3 * age).toFixed(1)}" stroke-linecap="round" opacity="${(0.25 + 0.7 * age).toFixed(2)}"/>`);
}
const last = data.projection.points[ev[end - 1].p];
parts.push(`<circle cx="${px(last[0]).toFixed(1)}" cy="${py(last[1]).toFixed(1)}" r="15" fill="none" stroke="#1b1f24" stroke-width="3"/>`);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${parts.join("")}</svg>`;
await writeFile(path.join(outDir, "poster.svg"), svg);
const png = new Resvg(svg, { fitTo: { mode: "width", value: W } }).render().asPng();
await writeFile(path.join(outDir, "poster.png"), png);
console.log(`wrote poster.svg and poster.png from ${session.label}${data.synthetic ? " (synthetic sample)" : ""}`);
