/** Small helpers for the scripts in this folder. They run in plain Node, without Astro. */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const PROJECTS_DIR = path.join(ROOT, "src/content/projects");

/** Frontmatter of a project's index.mdx, plus its slug. */
export async function readProject(slug) {
  const file = path.join(PROJECTS_DIR, slug, "index.mdx");
  const text = await readFile(file, "utf8").catch(() => null);
  if (text == null) throw new Error(`No project at ${path.relative(ROOT, file)}`);
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) throw new Error(`${path.relative(ROOT, file)} has no frontmatter`);
  return { ...parse(m[1]), slug, dir: path.dirname(file) };
}
