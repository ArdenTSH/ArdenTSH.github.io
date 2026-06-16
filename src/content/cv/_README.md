# Updating the CV page

The website's `/cv` page is built from the Markdown files in this folder —
**one file per section, and each file becomes its own island (card) on the page**,
shown in ascending `order`. There is also a downloadable PDF.

## To update from a new CV (the whole job)

1. Read the new CV (PDF or text).
2. Make the files in `src/content/cv/` match it — add, edit, delete, or reorder
   section files so the set of sections and their contents match the new CV.
   Keep the format below.
3. Replace the downloadable PDF at `public/cv/Arden_Tsang_CV.pdf` (same filename)
   so the page's "Download" button matches.

That's the entire task. No other file needs editing — `src/pages/cv.astro` renders
whatever files are here, in `order`. (Run `npm run build` to sanity-check.)

## File format

Each section is one file:

```
---
title: "Research & experience"   # the island heading (shown as the section's h2)
order: 2                          # sections appear in ascending order
---

### Role or degree                 ← an entry title (renders as a bold h3)
Organisation · Place · Dates       ← the line DIRECTLY under it = the grey mono "meta" line

- a bullet
- another bullet
```

Conventions the page styles:

- `### Title` = one entry (a job, degree, role, activity).
- The single line **immediately after** a `### Title` — *no blank line between them* —
  renders as the grey monospace **meta line** (organisation · place · dates). Leave a
  blank line before the bullets.
- `- ` for bullets. `**bold**` (e.g. **Tsang, A.** in publications), `*italics*` for
  paper titles, `[text](url)` for links — all work.
- A section that is just a list (e.g. Publications, Technical skills) skips the `###`
  entries and uses bullets straight away.

## Rules / gotchas

- **Do not** put a `## Heading` in the body — the section heading comes from `title:`
  in the frontmatter.
- `order` controls the on-page order; filenames don't matter (keep them lowercase and
  descriptive, e.g. `education.md`).
- Files starting with `_` (like this README) are ignored by the page.
- Use proper Unicode where the CV does (e.g. `C₂₀`, `CO₂`, `–` en-dash, `·` for separators).
