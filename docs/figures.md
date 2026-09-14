# Figures on this site — how they are made

How a scientific figure gets from a paper render onto a page here, written after
doing it three times (the LArTPC event triptych, the energy/latency chart, the
GNN edge classifier panels). Follow this and a new figure will match the ones
already on the site. Companion to `docs/intro.md`; the site brief is `CLAUDE.md`.

The short version: **the image carries only ink, the page carries all the type.**
Everything else below follows from that one rule.

---

## 1. The invariants

A figure on this site is right when all of these hold. Check them at the end.

1. **No baked-in type.** Titles, axis labels, tick labels, colourbar labels and
   legends are cropped off. They are a few pixels tall at the size a figure
   actually renders here, and they are set in matplotlib's fonts on a white
   ground, which fights every other word on the page.
2. **No white plate.** The white ground is removed so the ink sits directly on
   the island. A white rectangle pasted into cream paper reads as a foreign
   object.
3. **Keys rebuilt in HTML**, in site type, with colours *sampled from the source*
   so the key and the panel agree. A key is not optional: if the reader cannot
   tell what the colours mean, the figure is decoration.
4. **Panels that are compared share one scale**, so features line up between
   them. This is the difference between a comparison and two pictures.
5. **A light and a dark variant per image**, swapped on `data-theme`.
6. **Framed in a hairline box** from the theme tokens, so the figure follows the
   notebook/dark toggle.
7. **Removable.** Delete the component and the page loses the figure and nothing
   else. No page imports it directly; it goes through the registry (§6).
8. **Responsive.** Multi-panel rows collapse to a stack below 640px.

---

## 2. Get the real source

Find the **original render**, not a screenshot and not a figure lifted out of a
PDF page. The GNN panels came from
`~/Documents/ML for LArTPC on EdgeAI/OpenSamples/gnn_merge/figures/gnn_graph_event_273.png`
at 3570×1190. Working from the source is what makes exact spine detection
possible.

```bash
find ~/Downloads ~/Desktop ~/Documents -maxdepth 5 \
  \( -iname "*<topic>*" \) \( -name "*.png" -o -name "*.pdf" \) -newermt "2026-01-01" 2>/dev/null
```

**If the source is a PDF** (the event triptych was), do **not** use `sips` — it
silently renders a clipped, offset partial page. Use QuickLook:

```bash
qlmanage -t -s 1400 -o outdir figure.pdf     # -> outdir/figure.pdf.png
```

Resolution needed is modest. A panel renders about 190px wide in a three-across
row, so roughly 600–750px of source per panel is already generous. Do not
upscale.

---

## 3. Find the plot boundaries exactly

Never eyeball crop boxes. Matplotlib draws the axes as a dark rectangle
("spines"); find it. A column belonging to a spine is dark for almost the whole
height of the axes.

```python
from PIL import Image
im = Image.open(SRC).convert("L"); px = im.load(); W, H = im.size
y0, y1 = 150, 1090                       # a band safely inside the axes
for x in range(W):
    dark = sum(1 for y in range(y0, y1, 4) if px[x, y] < 200)
    if dark > 0.90 * len(range(y0, y1, 4)):
        print("V spine x =", x)
# horizontal spines: same idea, swap the loops, threshold ~0.28 across the row
```

This gave the GNN figure's three axes as x 292–1042, 1504–2254, 2657–3407, all
**exactly 750px wide**, which is the fact that mattered (§4). It also shows up
the colourbars as wide dark runs — ignore those, they are not spines.

Then crop **inside** the spine by 3–4px so the frame line itself is not in the
image; the CSS border replaces it.

A row scan over the same band tells you what to drop vertically: a typical
matplotlib figure reads as suptitle / panel title / axes / tick labels / axis
label, and only the axes survive.

---

## 4. Scale: crop identically, resample only if you must

If the panels you are comparing have **equal axes widths in the source**, crop
them to identical boxes and do not resize at all. They are already on one scale
and resampling can only degrade them.

If the axes widths differ **but the data limits are the same**, resize each crop
to one common box. That puts the same data range in the same pixel box, which is
what "same scale" means, and it corrects the source's own inconsistency.

If the data limits differ, they are not comparable and should not be presented as
a comparison. Say so rather than forcing it.

> Failure worth remembering: the first pass here cropped the three panels at
> different widths (the detected runs had swallowed the tick labels) and resized
> them to a common box. The panels no longer lined up, which defeats the point of
> showing a scored graph next to its truth.

**Verify alignment.** For panels that are genuinely the same object, overlay them:

```python
from PIL import Image, ImageChops
a = Image.open("...-scored.png").convert("L"); b = Image.open("...-truth.png").convert("L")
d = ImageChops.difference(a, b)
print(sum(d.getdata()) / (a.width * a.height))   # structure should coincide
```

---

## 5. The image pipeline

System python has **PIL but not numpy**. Everything below is pure PIL.

### 5.1 Paint out legends first

Matplotlib legends sit *inside* the axes and their type is unreadable at final
size. Find them, then fill them white **before** the alpha step. A legend is a
large near-white run inside the lower part of the axes:

```python
def legend_bbox(px, xa, xb, ytop, ybot, min_run=120):
    best = None
    for y in range(ytop, ybot):
        runs, run, start = [], 0, None
        for x in range(xa, xb):
            if px[x, y] > 246:
                if start is None: start = x
                run += 1
            else:
                if run >= min_run: runs.append((start, x - 1))
                run, start = 0, None
        if run >= min_run: runs.append((start, xb - 1))
        if runs:
            lo, hi = min(r[0] for r in runs), max(r[1] for r in runs)
            best = [y, y, lo, hi] if best is None else [best[0], y, min(best[2], lo), max(best[3], hi)]
    return (best[2], best[0], best[3], best[1]) if best else None
```

Then `ImageDraw.Draw(work).rectangle([x0-8, y0-8, x1, y1], fill=(255,255,255))`
with a small margin, because the legend's rounded border sits outside the white
fill.

### 5.2 Crop, alpha, and the dark variant

```python
from PIL import Image, ImageChops, ImageDraw

im = Image.open(SRC).convert("RGB")     # see the gotcha in §8 about RGBA
work = im.copy()
# ... paint out legends here ...

for key, x0 in CROPS.items():           # identical box per panel
    c = work.crop((x0, YTOP, x0 + WP, YBOT))

    # white ground -> transparent. alpha = 255 - min(r,g,b): white vanishes,
    # saturated colour stays fully opaque, antialiasing stays soft.
    #
    # ORDER MATTERS. Take the alpha from the ORIGINAL crop and reuse it for both
    # variants. Recolour first and the rule turns your new ink transparent: a
    # node repainted white is exactly the thing this alpha is designed to delete.
    r, g, b = c.split()
    mn = ImageChops.darker(ImageChops.darker(r, g), b)
    alpha = ImageChops.invert(mn)

    light = c.copy(); light.putalpha(alpha)
    light.save(f"{OUT}/{key}.png", optimize=True)

    # Dark variant: repaint ONLY the neutral near-blacks (axis ink, marker dots),
    # here to white, and keep the original alpha so they stay opaque. Never invert
    # the whole panel: that inverts the colourmap and destroys what colours mean.
    dk = c.copy(); dp = dk.load()
    for y in range(dk.height):
        for x in range(dk.width):
            pr, pg, pb = dp[x, y]
            mx, mnv = max(pr, pg, pb), min(pr, pg, pb)
            if mx < 100 and (mx - mnv) < 45:      # dark AND unsaturated
                dp[x, y] = (255, 255, 255)
    dk.putalpha(alpha)
    dk.save(f"{OUT}/{key}-dark.png", optimize=True)
```

**When the ink is dark on a transparent ground and nothing is neutral-black to
lift** (the event triptych: navy-to-cyan on white), skip the per-pixel pass and
use one CSS filter in the component instead:

```css
:global(:root[data-theme="dark"]) .event img { filter: brightness(4.2) saturate(0.9); }
```

Pick the multiplier by compositing candidates against the real dark island colour
(`--surface` is `#0e1219`) in a scratch HTML page and screenshotting it, not by
guessing.

Files go in `public/images/<page>/`, e.g. `public/images/neutrino/gnn-scored.png`.
Typical sizes are 30–260KB per panel; sparse scatter plots compress well.

### 5.3 Sample the key colours

Read the stops straight off the source colourbar so the HTML key cannot drift
from the image:

```python
def stops(px, x, y_bottom, y_top, n=6):
    return [px[x, int(y_bottom + (y_top - y_bottom) * i / (n - 1))] for i in range(n)]
```

Sample a few pixels *inside* the bar, not at its ends (the outermost sample often
lands on the white margin). For the GNN figure this produced
`#443882 #31678e #218f8d #34b679 #8ed645 #fbe723` (viridis) and
`#6e90f2 #a9c6fd #dbdcde #f7b99e #e8765c #b50927` (coolwarm), and for categorical
legends, sample the drawn elements directly: crimson `#b01c33`, steel blue
`#2c6daf`.

---

## 6. The component

Copy `src/components/GnnEdgeFigure.astro` and edit it; it is the most complete
example. The shape is:

- A `PANELS` array of plain data: `slug`, `tag` (mono, accent), `desc`, `alt`,
  and a `key` describing either a gradient bar or a set of swatches.
- A `<figure>` with a `.gnn-row` grid of three `.gnn-panel` columns, each holding
  a `.gnn-frame` (the hairline box) with the light and dark `<img>` pair, then the
  tag, the key, the description.
- A `<figcaption>` carrying the one thing that belongs to the whole figure.
- Scoped CSS using **only theme tokens**: `--hairline`, `--border`, `--radius-sm`,
  `--space-*`, `--text-xs/sm`, `--font-mono`, `--tracking-label`, `--accent`,
  `--text-muted`, `--text-secondary`.

Two details that are easy to get wrong:

- `width`/`height` on `<img>` must be the **real pixel dimensions** of the file,
  so the browser reserves the right box and the page does not jump on load.
- The theme swap keys on the attribute the site actually sets, not the OS:

```css
.gnn-img--dark { display: none; }
:global(:root[data-theme="dark"]) .gnn-img--light { display: none; }
:global(:root[data-theme="dark"]) .gnn-img--dark  { display: block; }
```

### Wiring it in

Figures are addressed from Markdown by a marker, so the write-up stays plain
Markdown and the figure stays removable. In `src/pages/research/[slug].astro`:

```ts
import GnnEdgeFigure from "../../components/GnnEdgeFigure.astro";

const FIGURES: Record<string, any> = {
  pipeline: PipelineFigure,       // materials: the PSO + DFT workflow
  quantisation: QuantPipeline,    // neutrino: the two deployment routes
  events: EventTriptych,          // neutrino: the three interaction classes
  energy: EnergyChart,            // neutrino: energy against latency
  gnn: GnnEdgeFigure,             // neutrino: one event through the edge classifier
};
```

Then in the page's Markdown, on **its own paragraph**, with blank lines around it:

```markdown
[[figure:gnn]]
```

The renderer matches `/<p>\[\[(viewer|figure):([a-z0-9-]+)\]\]<\/p>/g` after the
Markdown pass, so the marker must be a standalone paragraph or it will not match.
`[[viewer:KEY]]` is the same mechanism for interactive figures (`ClusterViewer`).

---

## 7. Verify

There is no visual test harness, so screenshot it.

```bash
export PATH="/usr/local/bin:$PATH"
./node_modules/.bin/astro build          # see §9 about concurrent builds
npm run preview -- --port 4399
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless \
  --disable-gpu --hide-scrollbars --window-size=1280,9000 --virtual-time-budget=8000 \
  --screenshot=page.png "http://localhost:4399/research/neutrino/"
```

Then crop to the figure rather than squinting at a 9000px tall image. Finding it
by its own ink is quicker than counting pixels:

```python
px = im.load()
rows = [y for y in range(0, H, 4)
        if any((lambda c: c[0] > 140 and c[1] < 70 and c[2] < 80)(px[x, y]) for x in range(60, 900, 4))]
im.crop((40, rows[0] - 260, 900, rows[-1] + 240)).save("fig.png")
```

Check at **1280px and at 420px**, and check both themes. For the dark theme,
compositing the PNGs over `#0e1219` in a scratch script is faster than driving the
site's toggle, which lives in `localStorage`.

---

## 8. Gotchas, each one paid for

- **`Image.convert("RGB")` on an RGBA source composites transparency onto
  BLACK.** A PDF rendered to PNG has a transparent ground, so this turns half the
  figure into a black slab and wrecks the bounding box. Flatten onto white first:
  `Image.alpha_composite(Image.new("RGBA", im.size, (255,)*4), im.convert("RGBA")).convert("RGB")`.
- **`sips` clips PDFs.** Use `qlmanage -t -s 1400 -o out file.pdf`.
- **No numpy** on `/usr/bin/python3`. Use `ImageChops` (`darker`, `invert`,
  `difference`) and `getbbox`.
- **Near-white ink goes transparent.** `alpha = 255 - min(r,g,b)` is what removes
  the plate, so a colourmap's pale centre (an "uncertain" value around 0.5) nearly
  vanishes. Usually acceptable, since the confident ends carry the message, but
  say so in the caption rather than letting a reader think those edges are absent.
- **Do not invert for dark mode.** It inverts the colourmap too.
- **Alpha before recolour.** `alpha = 255 - min(r,g,b)` deletes white, so if you
  recolour dark ink to white *before* taking the alpha, that ink disappears.
  Compute the alpha once from the original crop and reuse it for both variants.
- **`timeout` does not exist on macOS.** The command silently fails and you get no
  screenshot and no error.
- **Killing headless Chrome:** match on something specific. `pkill -f "Google
  Chrome"` also closes the user's browser.
- **GFM tables** emit `align="right"` as a presentational attribute, which any
  author `text-align` rule beats. If you style table cells, re-assert it:
  `.research-part :global([align="right"]) { text-align: right; }`.

---

## 9. One build at a time

Astro and Vite share `.astro/`, `node_modules/.vite/` and `dist/` with **no
locking between processes**. Two sessions running `astro build` or `astro dev` in
this directory at once produces builds that hang at 0% CPU for minutes and
`esbuild: The service is no longer running` errors. It looks like CPU starvation
and is not. Before building, check nothing else is:

```bash
ps aux | grep "[a]stro"
```

If a build is wedged, `pkill -f "astro build"; pkill -f esbuild` and start one
fresh build.

---

## 10. Checklist

- [ ] Source is the original render, at adequate resolution, not upscaled
- [ ] Crop boxes derived from detected spines, not eyeballed
- [ ] Compared panels share one scale, and alignment is verified numerically
- [ ] Legends painted out before the alpha step
- [ ] All baked-in type gone
- [ ] White ground transparent; light and dark variants both written
- [ ] Key rebuilt in HTML, colours sampled from the source
- [ ] `width`/`height` attributes match the real files
- [ ] `alt` on the light image; dark image `alt=""` and `aria-hidden="true"`
- [ ] Component uses theme tokens only
- [ ] Registered in `FIGURES` and marked with `[[figure:KEY]]` on its own paragraph
- [ ] Screenshotted at 1280px and 420px, in both themes
- [ ] Deleting the component leaves the page working
