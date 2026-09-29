# steffenholter.com

Astro site. The homepage is built from `src/data/*.json`, and every research
project has a page at `/projects/<slug>/` built from one template.

```bash
npm install
npm run dev        # http://localhost:4321, drafts included
npm run build      # type check, schema check, static site in dist/
npm run preview    # serve dist/ to check the real output
```

Node 22.12 or newer.

## Where things live

```
src/pages/index.astro                   homepage
src/pages/projects/index.astro          /projects/, every published project
src/pages/projects/[slug]/index.astro   the one project page template
src/pages/projects/[slug]/og.png.ts     social card, rendered at build time
src/components/home/                    homepage components and styles
src/components/project/                 hero, link row, figure, sidenote, citation, footer
src/styles/tokens.css, base.css         design tokens and typography for project pages
src/content.config.ts                   the schema every project must satisfy
src/content/projects/<slug>/            one folder per project
src/content/projects/_template/         copied by new:project
```

## Adding a project

```bash
npm run new:project -- my-project-slug
```

This copies `_template` into `src/content/projects/my-project-slug/` as a draft.
Fill in the frontmatter of `index.mdx`, write the body, replace `poster.png`,
and remove `draft: true` when it is ready. Drafts show in `npm run dev` only.

A project folder holds

- `index.mdx`, frontmatter for the first screen, body for the rest. `<Figure>`
  and `<Sidenote>` work without an import.
- `poster.png`, required. Used on the page, the social card, the README and as
  the no-JavaScript fallback.
- `Hero.astro`, optional. A live figure for the first screen, which replaces
  the poster there. See `interaction-to-intent/Hero.astro`.
- anything else the page needs, such as figure components, data and scripts.

To link a publication on the homepage to its page, add `"project": "<slug>"` to
its entry in `src/data/publications.json`.

## Consistency rules

The build fails with a message naming the field if a project breaks one.

1. The first screen shows the work. A poster is required, a live figure or a
   looping muted video is optional.
2. The summary is one plain-language sentence, with no em dash and no colon.
3. One link row in the fixed order Paper, Demo, Video, Code, Data, BibTeX.
   Missing links are omitted. Code is required. Other keys are rejected.
4. Every page gets a social card from its frontmatter at `/projects/<slug>/og.png`.
5. The code repo's README mirrors the first screen. Run

   ```bash
   npm run export:repo -- <slug> ../path/to/project-repo           # write
   npm run export:repo -- <slug> ../path/to/project-repo --check   # verify only
   ```

   It rewrites the marked block at the top of the repo's README, `CITATION.cff`
   and `docs/poster.png`. The rest of the README is left alone.

## Deploy

`.github/workflows/deploy.yml` builds every pull request and deploys `main` to
GitHub Pages. `CNAME` at the repo root is copied into the build.
