import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import { SITE_URL } from "./src/lib/project.mjs";

export default defineConfig({
  site: SITE_URL,
  trailingSlash: "ignore",
  integrations: [react(), mdx()],
});
