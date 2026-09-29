/**
 * The schema every project page must satisfy. This is where the consistency
 * rules live. A project that breaks one fails `npm run build` with a message
 * naming the field, so it can never reach the live site.
 */
import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import { summaryProblems } from "./lib/project.mjs";

const url = z.url({ protocol: /^https?$/, error: "must be an absolute http(s) URL" });

const author = z
  .object({
    given: z.string().optional(),
    family: z.string().optional(),
    name: z.string().optional(),
    url: url.optional(),
    orcid: z.string().optional(),
    /** 1-based indexes into `affiliations`. Numbers only show when there are several. */
    affiliations: z.array(z.number().int().positive()).optional(),
  })
  .strict()
  .refine((a) => a.name || a.family, "an author needs `family` (and usually `given`) or `name`");

const projects = defineCollection({
  // Folders starting with an underscore, such as _template, are skipped.
  loader: glob({ pattern: "[!_]*/index.{md,mdx}", base: "./src/content/projects", generateId: ({ entry }) => entry.split("/")[0] }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        subtitle: z.string().optional(),

        // Rule 2. One plain-language sentence.
        summary: z.string().superRefine((s, ctx) => {
          for (const p of summaryProblems(s)) ctx.addIssue({ code: "custom", message: `summary ${p}` });
        }),

        authors: z.array(author).min(1),
        affiliations: z.array(z.string()).default([]),
        venue: z.string().optional(),

        /** Sorts the /projects/ index, newest first. */
        date: z.coerce.date(),
        /** Drafts render in `npm run dev` and are left out of the production build. */
        draft: z.boolean().default(false),

        // Rule 3. Only these keys are allowed, the order is fixed by LinkRow.
        links: z
          .object({
            paper: url.optional(),
            demo: url.optional(),
            video: url.optional(),
            code: url,
            data: url.optional(),
          })
          .strict(),

        // Every page ends in a citation, and BibTeX is always the last link.
        bibtex: z.string().min(1),
        citation: z
          .object({
            type: z.string().default("article"),
            title: z.string().optional(),
            year: z.number().int().optional(),
            journal: z.string().optional(),
            conference: z.string().optional(),
            doi: z.string().optional(),
            url: url.optional(),
          })
          .strict()
          .optional(),
        license: z.string().optional(),

        // Rule 1. The first screen always shows the work. The poster is required
        // because the social card, the README and the no-JS fallback all use it.
        // A live figure goes in Hero.astro next to index.mdx and takes priority.
        hero: z
          .object({
            poster: image(),
            /** Path under public/ or an absolute URL. A looping muted MP4 or WebM. */
            video: z.string().optional(),
            alt: z.string().min(10, "hero.alt should describe what the image shows"),
          })
          .strict(),

        /** Self-hosted Umami, off unless set. */
        analytics: z.object({ umami: z.object({ src: url, websiteId: z.string() }) }).optional(),
      })
      .strict(),
});

export const collections = { projects };
