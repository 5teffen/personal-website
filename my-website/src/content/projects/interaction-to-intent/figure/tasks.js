/**
 * Task metadata, mirrored from src/constants.py in the pipeline.
 * Keep the ids and the fine to coarse mapping in sync with TASK_LABEL_MAP and FINE_TO_COARSE.
 */
export const FAMILIES = [
  { id: 0, name: "Local exploration", short: "Local" },
  { id: 1, name: "Global scanning", short: "Global" },
  { id: 2, name: "Comparative probing", short: "Compare" },
];

// Ordered by family so the legend and the bars group naturally.
export const TASKS = [
  { id: 1, name: "Name cluster", short: "NameCl", family: 0 },
  { id: 2, name: "Find similar points", short: "FindSim", family: 0 },
  { id: 3, name: "Identify outliers", short: "IdOutl", family: 0 },
  { id: 0, name: "Generate clusters", short: "GenClust", family: 1 },
  { id: 4, name: "Add data to projection", short: "AddData", family: 1 },
  { id: 5, name: "Compare clusters", short: "CompCl", family: 2 },
  { id: 6, name: "Map synthesized to original dimension", short: "MapDim", family: 2 },
];

export const TASK_BY_ID = Object.fromEntries(TASKS.map((t) => [t.id, t]));
export const FINE_TO_COARSE = Object.fromEntries(TASKS.map((t) => [t.id, t.family]));

/** Collapse a 7-way probability vector (indexed by task id) into the 3 families. */
export function toCoarse(probs) {
  const out = [0, 0, 0];
  probs.forEach((p, id) => { out[FINE_TO_COARSE[id]] += p; });
  return out;
}
