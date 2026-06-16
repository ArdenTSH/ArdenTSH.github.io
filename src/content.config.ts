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

// Research write-ups (Phase 1.3). One Markdown file per research direction in
// src/content/research/ — the FILE NAME is the slug (cosmology.md →
// /research/cosmology). The card label + one-line blurb still live in
// src/config/site.ts; this file's prose is the BODY of the page. Edit a file,
// save, the page updates. Frontmatter is optional (add `updated:` if you like).
const research = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/research" }),
  schema: z.object({
    updated: z.coerce.date().optional(),
    draft: z.boolean().default(false),
  }),
});

// CV (Phase 1.4). ONE Markdown file per section in src/content/cv/ — each becomes
// its own island on /cv, ordered by `order`; `title` is the island heading and
// the body is the section's Markdown. See src/content/cv/_README.md to update it.
const cv = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/cv" }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
  }),
});

export const collections = { writing, research, cv };
