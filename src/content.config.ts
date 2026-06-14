// Content collections (Phase 1.1). Add a blog post by dropping a .md file into
// src/content/writing/ — the front-matter must match the schema below. The
// Writing page (Phase 1.5) will list these automatically.
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const writing = defineCollection({
  // Files starting with "_" are ignored, so you can keep drafts around.
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/writing" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { writing };
