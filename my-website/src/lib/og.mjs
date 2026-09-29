/**
 * The social preview card, 1200 by 630. Rendered at build time for every
 * project at /projects/<slug>/og.png, so it is never out of date.
 */
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { authorName, pageUrl } from "./project.mjs";

const require = createRequire(import.meta.url);
const fontFile = (pkg, file) => readFile(require.resolve(`${pkg}/files/${file}`));

let fontsPromise;
function loadFonts() {
  fontsPromise ??= Promise.all([
    fontFile("@fontsource/newsreader", "newsreader-latin-500-normal.woff").then((data) => ({ name: "Newsreader", data, weight: 500, style: "normal" })),
    fontFile("@fontsource/newsreader", "newsreader-latin-400-normal.woff").then((data) => ({ name: "Newsreader", data, weight: 400, style: "normal" })),
    fontFile("@fontsource/schibsted-grotesk", "schibsted-grotesk-latin-500-normal.woff").then((data) => ({ name: "Schibsted Grotesk", data, weight: 500, style: "normal" })),
  ]);
  return fontsPromise;
}

const MIME = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp", svg: "image/svg+xml" };

/** @param {object} project frontmatter plus slug  @param {string|null} posterPath file on disk */
export async function renderOgPng(project, posterPath) {
  const fonts = await loadFonts();
  let posterUri = null;
  if (posterPath) {
    const ext = path.extname(posterPath).slice(1).toLowerCase();
    if (MIME[ext] && ext !== "webp") posterUri = `data:${MIME[ext]};base64,${(await readFile(posterPath)).toString("base64")}`;
  }

  const h = (type, style, children, extra = {}) => ({ type, props: { style, children, ...extra } });
  const ink = "#1b1f24";
  const muted = "#5a626b";
  const accent = "#2c45c9";
  // One box per author so lines only break between names, never inside El-Assady.
  const names = project.authors.map(authorName);
  const byline = names.map((n, i) => h("div", { display: "flex", marginRight: 7 }, i < names.length - 1 ? `${n},` : n));
  const host = pageUrl(project).replace(/^https?:\/\//, "").replace(/\/$/, "");

  const textCol = h("div", { display: "flex", flexDirection: "column", justifyContent: "space-between", width: posterUri ? 610 : 1080, height: "100%" }, [
    h("div", { display: "flex", flexDirection: "column" }, [
      h("div", { fontFamily: "Newsreader", fontWeight: 500, fontSize: project.title.length > 34 ? 60 : 72, lineHeight: 1.02, letterSpacing: -1.5, color: ink }, project.title),
      project.subtitle ? h("div", { fontFamily: "Newsreader", fontSize: 32, lineHeight: 1.2, color: muted, marginTop: 14 }, project.subtitle) : null,
      h("div", { fontFamily: "Newsreader", fontWeight: 400, fontSize: 28, lineHeight: 1.35, color: ink, marginTop: 36 }, project.summary),
    ].filter(Boolean)),
    h("div", { display: "flex", flexDirection: "column", fontFamily: "Schibsted Grotesk", fontWeight: 500, fontSize: 20, color: muted }, [
      h("div", { display: "flex", flexWrap: "wrap" }, byline),
      h("div", { display: "flex", color: accent, marginTop: 6 }, host),
    ]),
  ]);

  const children = [textCol];
  if (posterUri) {
    children.push(h("img", { width: 470, height: 530, objectFit: "cover", borderRadius: 4, border: "1px solid #dadde0" }, undefined, { src: posterUri }));
  }
  const tree = h("div", { display: "flex", justifyContent: "space-between", width: 1200, height: 630, padding: 50, background: "#fcfcfb", borderTop: `10px solid ${accent}` }, children);

  const svg = await satori(tree, { width: 1200, height: 630, fonts });
  return new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng();
}
