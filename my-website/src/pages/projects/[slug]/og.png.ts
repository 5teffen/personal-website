import type { APIRoute, GetStaticPaths } from "astro";
import type { CollectionEntry } from "astro:content";
import { renderOgPng } from "../../../lib/og.mjs";
import { publishedProjects } from "../../../lib/projects";

export const getStaticPaths = (async () => {
  const entries = await publishedProjects();
  return entries.map((entry) => ({ params: { slug: entry.id }, props: { entry } }));
}) satisfies GetStaticPaths;

/** The poster file on disk. Astro keeps the source path on image metadata as fsPath. */
function posterFile(entry: CollectionEntry<"projects">): string | null {
  const meta = entry.data.hero.poster as { fsPath?: string };
  if (meta.fsPath) return meta.fsPath;
  return null;
}

export const GET: APIRoute = async ({ props }) => {
  const entry = (props as { entry: CollectionEntry<"projects"> }).entry;
  const png = await renderOgPng({ ...entry.data, slug: entry.id }, posterFile(entry));
  return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png" } });
};
