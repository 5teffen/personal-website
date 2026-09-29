#!/usr/bin/env node
/**
 * Starts a new project page from src/content/projects/_template.
 *
 *   npm run new:project -- <slug>
 *
 * The slug becomes the URL, /projects/<slug>/, and should match the GitHub repo
 * name. The page starts as a draft, which shows in `npm run dev` only.
 */
import { cp, access, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { Resvg } from "@resvg/resvg-js";
import { PROJECTS_DIR } from "./lib.mjs";

const slug = process.argv.slice(2).find((a) => a !== "--");
if (!slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
  console.log("usage  npm run new:project -- <slug>   (lowercase letters, digits and hyphens)");
  process.exit(1);
}
const dir = path.join(PROJECTS_DIR, slug);
if (await access(dir).then(() => true, () => false)) {
  console.error(`src/content/projects/${slug} already exists`);
  process.exit(1);
}

await cp(path.join(PROJECTS_DIR, "_template"), dir, { recursive: true });
const mdx = path.join(dir, "index.mdx");
const today = new Date().toISOString().slice(0, 10);
await writeFile(mdx, (await readFile(mdx, "utf8")).replaceAll("SLUG", slug).replace("date: 2026-01-01", `date: ${today}`));

// A plain placeholder, so the page builds until the real poster exists.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="760"><rect width="1200" height="760" fill="#f2f3f4"/><text x="600" y="390" font-family="sans-serif" font-size="36" fill="#5a626b" text-anchor="middle">poster.png placeholder</text></svg>`;
await writeFile(path.join(dir, "poster.png"), new Resvg(svg).render().asPng());

console.log(`created src/content/projects/${slug}/
  1. fill in index.mdx
  2. replace poster.png
  3. npm run dev, then open http://localhost:4321/projects/${slug}/
  4. remove draft: true when it is ready`);
