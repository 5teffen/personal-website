/**
 * Helpers shared by the project pages and the scripts in scripts/.
 *
 * Every project is one folder in src/content/projects/<slug>/. The frontmatter of
 * its index.mdx is the single source of truth. The page, the social card, the
 * README first screen and CITATION.cff of the project repo are all generated from
 * it, so they cannot drift apart.
 *
 * Plain JavaScript on purpose, so the Node scripts can import it without Astro.
 * A `project` here is the entry's frontmatter plus its `slug`.
 */

/** Change this when the domain changes. astro.config.mjs reads it too. */
export const SITE_URL = "https://www.steffenholter.com";
export const SITE_OWNER = { label: "Steffen Holter", url: "/" };

/** The fixed link order. Missing links are omitted, never shown disabled. */
export const LINK_ORDER = ["paper", "demo", "video", "code", "data", "bibtex"];

export const LINK_LABELS = {
  paper: "Paper",
  demo: "Demo",
  video: "Video",
  code: "Code",
  data: "Data",
  bibtex: "BibTeX",
};

export function authorName(a) {
  return a.name ?? [a.given, a.family].filter(Boolean).join(" ");
}

/** Links in the canonical order, skipping any that are not set. */
export function orderedLinks(project) {
  const links = project.links ?? {};
  return LINK_ORDER.filter((key) =>
    key === "bibtex" ? Boolean(project.bibtex) : Boolean(links[key]),
  ).map((key) => ({
    key,
    label: LINK_LABELS[key],
    url: key === "bibtex" ? null : links[key],
  }));
}

/** Absolute URL of the project page, used for canonical and social tags. */
export function pageUrl(project) {
  return new URL(`/projects/${project.slug}/`, SITE_URL).toString();
}

/**
 * Checks on the one-sentence summary. Used by the content schema, so a
 * summary that breaks a rule fails the build with this message.
 */
export function summaryProblems(summary) {
  const problems = [];
  const s = summary.trim();
  const sentences = s.split(/(?<=[.!?])\s+(?=[A-Z])/);
  if (sentences.length > 1) problems.push("must be a single sentence");
  if (!/[.!?]$/.test(s)) problems.push("must end with a full stop");
  if (/[\u2014\u2013]/.test(s)) problems.push("must not contain an em or en dash");
  if (/:/.test(s)) problems.push("must not contain a colon");
  if (s.length > 240) problems.push(`is ${s.length} characters, keep it under 240 so it fits the social card`);
  return problems;
}

/** The README first screen. Mirrors the page hero. */
export function renderReadmeHero(project, { heroImagePath } = {}) {
  const page = pageUrl(project);
  const links = project.links ?? {};
  // In the README, "Code" would link to the repo you are already reading,
  // so the slot is used for the project page instead.
  const row = [
    ["Project page", page],
    ["Paper", links.paper],
    ["Demo", links.demo],
    ["Video", links.video],
    ["Data", links.data],
    ["BibTeX", project.bibtex ? "#citation" : null],
  ]
    .filter(([, url]) => url)
    .map(([label, url]) => `<a href="${url}"><strong>${label}</strong></a>`)
    .join(" &nbsp;|&nbsp; ");

  const lines = [
    `<h1 align="center">${project.title}</h1>`,
    project.subtitle ? `<p align="center"><em>${project.subtitle}</em></p>` : null,
    `<p align="center">${row}</p>`,
    heroImagePath
      ? `<p align="center"><a href="${page}"><img src="${heroImagePath}" alt="${escapeAttr(project.hero?.alt ?? project.title)}" width="100%"></a></p>`
      : null,
    `<p align="center">${project.summary}</p>`,
  ];
  return lines.filter(Boolean).join("\n\n");
}

export const README_START = "<!-- project-page:start (generated from the website repo, run `npm run export:repo` there) -->";
export const README_END = "<!-- project-page:end -->";

/** Replace the generated block in a README, or prepend it if missing. */
export function applyReadmeHero(readme, block) {
  const wrapped = `${README_START}\n${block}\n${README_END}`;
  const start = readme.indexOf("<!-- project-page:start");
  const end = readme.indexOf(README_END);
  if (start !== -1 && end !== -1) {
    return readme.slice(0, start) + wrapped + readme.slice(end + README_END.length);
  }
  return `${wrapped}\n\n${readme}`;
}

/** CITATION.cff, which GitHub renders as a "Cite this repository" box. */
export function renderCitationCff(project) {
  const q = (s) => JSON.stringify(String(s));
  const out = [
    "# Generated from the project page in 5teffen/personal-website. Do not edit by hand.",
    "cff-version: 1.2.0",
    `message: ${q("If you use this work, please cite the paper below.")}`,
    `title: ${q(project.title + (project.subtitle ? `: ${project.subtitle}` : ""))}`,
    "type: software",
    "authors:",
  ];
  for (const a of project.authors) {
    if (a.family) {
      out.push(`  - family-names: ${q(a.family)}`);
      if (a.given) out.push(`    given-names: ${q(a.given)}`);
    } else {
      out.push(`  - name: ${q(authorName(a))}`);
    }
    if (a.orcid) out.push(`    orcid: ${q(a.orcid)}`);
  }
  if (project.links?.code) out.push(`repository-code: ${q(project.links.code)}`);
  out.push(`url: ${q(pageUrl(project))}`);
  if (project.license) out.push(`license: ${q(project.license)}`);

  const pc = project.citation;
  if (pc) {
    out.push("preferred-citation:");
    out.push(`  type: ${pc.type ?? "article"}`);
    out.push(`  title: ${q(pc.title ?? project.title)}`);
    out.push("  authors:");
    for (const a of project.authors) {
      if (a.family) {
        out.push(`    - family-names: ${q(a.family)}`);
        if (a.given) out.push(`      given-names: ${q(a.given)}`);
      } else {
        out.push(`    - name: ${q(authorName(a))}`);
      }
    }
    if (pc.year) out.push(`  year: ${pc.year}`);
    if (pc.journal) out.push(`  journal: ${q(pc.journal)}`);
    if (pc.conference) out.push(`  conference:\n    name: ${q(pc.conference)}`);
    if (pc.doi) out.push(`  doi: ${q(pc.doi)}`);
    if (pc.url) out.push(`  url: ${q(pc.url)}`);
  }
  return out.join("\n") + "\n";
}

function escapeAttr(s) {
  return String(s).replace(/"/g, "&quot;");
}
