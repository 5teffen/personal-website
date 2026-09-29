/**
 * Writes shared/data/sample.json with SYNTHETIC hover sessions.
 *
 * This exists only so the page and the demo can be built before the real export
 * is done. Replace it with real sessions from the Zenodo data by running
 *
 *   python web/scripts/export_sample.py
 *
 * The file carries `"synthetic": true`, and the figure shows a visible note while
 * that flag is set, so a synthetic sample can never ship silently.
 */
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(here, "../data/sample.json");

// Deterministic RNG so the sample is stable across builds.
function mulberry32(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(7);
const gauss = () => Math.sqrt(-2 * Math.log(rand() + 1e-9)) * Math.cos(2 * Math.PI * rand());
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const between = (a, b) => a + rand() * (b - a);

// ── Projection: five clusters plus scattered outliers ─────────────────────────
const centers = [[0.22, 0.28], [0.72, 0.22], [0.5, 0.55], [0.2, 0.78], [0.8, 0.75]];
const spreads = [0.07, 0.06, 0.08, 0.06, 0.07];
const points = [];
centers.forEach(([cx, cy], c) => {
  for (let i = 0; i < 62; i++) {
    points.push([cx + gauss() * spreads[c], cy + gauss() * spreads[c] * 0.85, c]);
  }
});
for (let i = 0; i < 18; i++) {
  const c = Math.floor(rand() * 5);
  points.push([between(0.04, 0.96), between(0.04, 0.96), c]);
}
const clamp = (v) => Math.min(0.98, Math.max(0.02, v));
for (const p of points) { p[0] = clamp(p[0]); p[1] = clamp(p[1]); }
const round = (v) => Math.round(v * 1000) / 1000;
const pts = points.map(([x, y, c]) => [round(x), round(y), c]);

const byCluster = [0, 1, 2, 3, 4].map((c) => pts.map((p, i) => [p, i]).filter(([p]) => p[2] === c).map(([, i]) => i));

function nearest(x, y, exclude = -1) {
  let best = 0, bd = Infinity;
  pts.forEach(([px, py], i) => {
    if (i === exclude) return;
    const d = (px - x) ** 2 + (py - y) ** 2;
    if (d < bd) { bd = d; best = i; }
  });
  return best;
}

// ── Task generators. Each returns point indices and dwell times in ms. ────────
const local = () => Math.round(between(350, 1400));
const quick = () => Math.round(between(120, 450));

const generators = {
  // Generate clusters, a global sweep over every cluster
  0(n) {
    const order = [0, 1, 2, 3, 4].sort(() => rand() - 0.5);
    const seq = [];
    for (let k = 0; k < n; k++) {
      const c = order[Math.floor((k / n) * order.length)];
      seq.push([pick(byCluster[c]), quick()]);
    }
    return seq;
  },
  // Name cluster, a slow wander inside one cluster
  1(n) {
    const c = Math.floor(rand() * 5);
    return Array.from({ length: n }, () => [pick(byCluster[c]), local()]);
  },
  // Find similar points, small steps around an anchor
  2(n) {
    const anchor = pick(pts);
    return Array.from({ length: n }, () => [nearest(anchor[0] + gauss() * 0.035, anchor[1] + gauss() * 0.035), local()]);
  },
  // Identify outliers, hops along the periphery and out to stray points
  3(n) {
    const outliers = pts.map((_, i) => i).slice(-18);
    return Array.from({ length: n }, (_, k) => {
      if (k % 3 === 0) return [pick(outliers), local()];
      const c = Math.floor(rand() * 5);
      const a = rand() * Math.PI * 2;
      return [nearest(centers[c][0] + Math.cos(a) * spreads[c] * 2.2, centers[c][1] + Math.sin(a) * spreads[c] * 2.2), quick()];
    });
  },
  // Add data to projection, broad jumps across the whole plot
  4(n) {
    return Array.from({ length: n }, () => [nearest(between(0.05, 0.95), between(0.05, 0.95)), quick()]);
  },
  // Compare clusters, back and forth between two clusters
  5(n) {
    const a = Math.floor(rand() * 5);
    let b = Math.floor(rand() * 5); if (b === a) b = (a + 2) % 5;
    const seq = [];
    let side = a;
    for (let k = 0; k < n; k++) {
      if (k % Math.round(between(3, 6)) === 0) side = side === a ? b : a;
      seq.push([pick(byCluster[side]), Math.round(between(250, 800))]);
    }
    return seq;
  },
  // Map synthesized to original dimension, sweeps along one axis
  6(n) {
    const y = between(0.25, 0.75);
    return Array.from({ length: n }, (_, k) => {
      const phase = (k / n) * 2;
      const x = phase <= 1 ? 0.05 + phase * 0.9 : 0.95 - (phase - 1) * 0.9;
      return [nearest(x, y + gauss() * 0.05), Math.round(between(200, 700))];
    });
  },
};

const FAMILY = { 0: 1, 1: 0, 2: 0, 3: 0, 4: 1, 5: 2, 6: 2 };

// ── Simulated online predictions ──────────────────────────────────────────────
// Evidence for the true task builds up over the first steps of a segment, most of
// the confusion stays inside the same family, and the previous task lingers briefly
// after a boundary. This imitates the qualitative behaviour of an online labeler.
function predict(truth) {
  const probs = [];
  let segStart = 0;
  let prevTask = null;
  for (let t = 0; t < truth.length; t++) {
    if (t > 0 && truth[t] !== truth[t - 1]) { prevTask = truth[t - 1]; segStart = t; }
    const since = t - segStart;
    const logits = Array.from({ length: 7 }, () => gauss() * 1.0);
    const task = truth[t];
    logits[task] += Math.min(1.5, 0.12 * since) + 0.1;
    for (let k = 0; k < 7; k++) if (k !== task && FAMILY[k] === FAMILY[task]) logits[k] += Math.min(0.9, 0.08 * since);
    if (prevTask !== null) logits[prevTask] += Math.max(0, 2.2 - 0.3 * since);
    const m = Math.max(...logits);
    const e = logits.map((l) => Math.exp(l - m));
    const s = e.reduce((a, b) => a + b, 0);
    probs.push(e.map((v) => Math.round((v / s) * 1000) / 1000));
  }
  return probs;
}

// ── Sessions ──────────────────────────────────────────────────────────────────
const plans = [
  [2, 5, 0],
  [3, 6, 1, 4],
  [0, 2, 5],
];
const sessions = plans.map((plan, s) => {
  const events = [];
  const truth = [];
  let t = 0;
  plan.forEach((task, k) => {
    if (k > 0) t += 3000;
    const n = Math.round(between(28, 48));
    for (const [p, dwell] of generators[task](n)) {
      events.push({ p, t });
      truth.push(task);
      t += dwell;
    }
  });
  return { id: `synthetic-${s + 1}`, label: `Session ${s + 1}`, events, truth, pred: predict(truth) };
});

const sample = {
  synthetic: true,
  source: "Synthetic sample generated by web/shared/scripts/make-synthetic-sample.mjs. Not real data.",
  projection: { name: "Synthetic projection", points: pts },
  sessions,
};

await mkdir(path.dirname(out), { recursive: true });
await writeFile(out, JSON.stringify(sample));
console.log(`wrote ${path.relative(process.cwd(), out)} with ${pts.length} points and ${sessions.length} sessions`);
