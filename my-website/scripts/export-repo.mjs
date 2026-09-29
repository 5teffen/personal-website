#!/usr/bin/env node
/**
 * Writes the parts of a project's code repo that mirror its page, so the
 * README and the page cannot drift apart.
 *
 *   npm run export:repo -- <slug> <path to the project repo> [--check]
 *
 * It updates three things in the project repo
 *   README.md     the block between the project-page markers, which mirrors the
 *                 page's first screen. Everything below the block is left alone.
 *   CITATION.cff  which GitHub shows as "Cite this repository"
 *   docs/poster.png  the image the README block shows
 *
 * With --check nothing is written, and the script exits 1 if any file is stale.
 */
import { readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
import path from "node:path";
import { readProject } from "./lib.mjs";
import { renderReadmeHero, applyReadmeHero, renderCitationCff } from "../src/lib/project.mjs";

const args = process.argv.slice(2).filter((a) => a !== "--");
const check = args.includes("--check");
const [slug, repoArg] = args.filter((a) => !a.startsWith("--"));
if (!slug || !repoArg) {
  console.log("usage  npm run export:repo -- <slug> <path to project repo> [--check]");
  process.exit(1);
}

const project = await readProject(slug);
const repo = path.resolve(process.cwd(), repoArg);
const read = (p) => readFile(p, "utf8").catch(() => "");

const posterSrc = path.resolve(project.dir, project.hero.poster);
const posterRel = "docs/poster.png";

const readmePath = path.join(repo, "README.md");
const currentReadme = await read(readmePath);
const readme = applyReadmeHero(currentReadme, renderReadmeHero(project, { heroImagePath: posterRel }));
const cffPath = path.join(repo, "CITATION.cff");
const cff = renderCitationCff(project);

const stale = [];
if (readme !== currentReadme) stale.push("README.md");
if (cff !== (await read(cffPath))) stale.push("CITATION.cff");
const posterDst = path.join(repo, posterRel);
const [a, b] = await Promise.all([readFile(posterSrc), readFile(posterDst).catch(() => null)]);
if (!b || !a.equals(b)) stale.push(posterRel);

if (check) {
  if (stale.length) {
    console.error(`out of date in ${repoArg}  ${stale.join(", ")}\nrun  npm run export:repo -- ${slug} ${repoArg}`);
    process.exit(1);
  }
  console.log(`${slug}  repo files are up to date`);
} else {
  await writeFile(readmePath, readme);
  await writeFile(cffPath, cff);
  await mkdir(path.dirname(posterDst), { recursive: true });
  await copyFile(posterSrc, posterDst);
  console.log(stale.length ? `${slug}  updated ${stale.join(", ")} in ${repo}` : `${slug}  already up to date`);
}
