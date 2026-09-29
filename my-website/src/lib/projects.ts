import { getCollection } from "astro:content";

/** All projects that should be built. Drafts show in `npm run dev` only. */
export async function publishedProjects() {
  const all = await getCollection("projects", ({ data }) => import.meta.env.DEV || !data.draft);
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}
