# GW black-hole-merger intro

The intro is a once-per-session, hand-drawn gravitational-wave merger: two black holes spiral in, collide, throw a comic "POW," and fade out to reveal the real WebGL accreting black hole that is the Home background. The 2D sketch and the 3D renderer share the same screen for a beat — the explosion paints over the cut so the cream notebook grid cross-dissolves into ray-traced Kerr spacetime without a visible seam.

It is built to disappear cleanly: lazy (desktop-only, src set on demand), pauses off-screen (the iframe ray-tracer parks when hidden), a reduced-motion static fallback (one frame, no animation), and fully removable — deleting `GwMerger` leaves Home with a static black-hole background and zero downstream errors.

## The sequence

Time is normalized as `p = t / T`, `T = 4500 ms`. The 2D sketch runs `render(t)` every frame; the listed events fire from inside it (each guarded by a `…Fired` flag so they fire once per play).

| Phase | p-threshold | What fires | Effect |
|---|---|---|---|
| Inspiral start | `tI = 600 ms` (`P_I`) | — | strain LUT + spiral arms begin; the binary chirps `W_LO → W_HI` |
| Warm the renderer | `p >= 0.50` | `gw:reveal-soon` | un-pauses the BH iframe so the WebGL is warm before reveal |
| Merger | `tM = 2900 ms` (`P_M`) | — | two discs collapse to one remnant; metric grid begins fading |
| Camera fly-in | `p >= 0.62` | `gw:explode` | `zoomIntro` flies the iframe BH in; explosion is painting on top |
| Explosion window | `eT - tM ∈ [-STEP, 850)` | — | spiky star + 11 bolts + 18 debris, `prog = burst/850` |
| Done | `p >= 0.985` | `gw:done` | persist the seen flag; arm the 7s reveal safety net |
| Reveal lands | `BlackHole.astro` | `bh:reveal-done` | `.gw-intro` removed → site chrome fades in over 800 ms |

The dramatic beat is the explosion (`p ≈ 0.62` onward); the reveal is the cream + grid fading under it; the camera fly-in (`zoomIntro`) and the spin-up to the Home framing run concurrently with the fade. "Rest" is the landed Home BH at `distance 11, spin 0.9, polar 1.519`.

Under reduced motion the whole timeline collapses to `staticFrame() = render(tM + 2*TAU_RD) = render(3380)` — the settled remnant, drawn once.

## How the cut is hidden

The masking is the non-obvious part, and it works because three alphas fade on three different schedules. `cl(a, b) = clamp01((p - a) / (b - a))` is the local window helper, and `ease(t) = 1 - (1 - t)^3`.

1. **The cream fill and the metric grid fade per-element**, not via canvas opacity. The cream background rect is filled at `globalAlpha = creamA`, and every strain dot multiplies its own alpha by `creamA`:
   ```js
   creamA = 1 - ease(cl(0.70, 0.86));
   ```
   (The grid also gets an earlier fade through merger: `gridA = 1 - ease(cl(P_M - 0.06, P_M + 0.12))`.) As `creamA` falls, the sketch's paper goes transparent — and because the canvas itself is still `opacity: 1`, the revealing WebGL black hole shows **through** the now-transparent cream.

2. **The explosion paints after, at its own full alpha** — it is *not* multiplied by `creamA`. So while the cream is dissolving, the opaque spiky star + bolts + debris sit at full strength on an `opacity-1` canvas, directly over the cross-dissolve, hiding the moment the 2D paper gives way to 3D spacetime.

3. **The whole-canvas opacity fades only later**, to clear the one thing left behind — the residual hand-drawn remnant blob:
   ```js
   canvas.style.opacity = String(1 - ease(cl(0.83, 0.93)));
   ```
   By `p ≈ 0.83` the explosion is spent and the cream is gone; this last fade dissolves the leftover black sketch-blob into the black WebGL shadow. Black-blob → black BH, so the swap is invisible.

The three windows in order: `cl(0.70, 0.86)` (cream + dots), `cl(0.83, 0.93)` (whole canvas), with the grid leading slightly at `cl(P_M-0.06, P_M+0.12)`.

## Files & roles

| File | Role |
|---|---|
| `src/components/GwMerger.astro` | The 2D sketch overlay: inspiral → merger → explosion → fade. Owns the timeline, the strain physics, and the masking model. Self-skips when `.gw-off` is on `<html>`. |
| `src/scripts/bhReveal.ts` | `zoomIntro(frame, opts)` — the camera fly-in that lands on Home framing. Drives the iframe via `setLook` with a ready-poll and postMessage fallback. |
| `src/pages/intro.astro` | Standalone `/intro` demo page. Hard-codes the iframe src and wires `GwMerger` to a home-preview fade. |
| `src/components/BlackHole.astro` | The reusable Home/page-background iframe component. Lazily sets src, manages perf pausing + IntersectionObserver, exposes live toggles, and runs `zoomIntro` on `gw:explode`. |
| `src/layouts/PageShell.astro` | Home wiring. Pre-paint gate sets `.gw-intro`/`.gw-off`; hides chrome during the intro; reveals islands on `bh:reveal-done`/`gw:done`; persists the seen flag. |
| `public/blackhole/` | The vendored MIT black-hole ray-tracer (`index.html` + `js/app/core/renderer.js`). Exposes the renderer contract below. |

## Renderer contract

The iframe (`/blackhole/index.html`) is same-origin, so the parent calls its hooks directly; each has a `bh:*` postMessage fallback (accepted only when `ev.source === window.parent`).

**Direct hooks**

| Hook | Argument | Notes |
|---|---|---|
| `window.blackHoleSetLook(o)` | look object (see keys) | each key guarded by `typeof === 'number'`; writes both the look field and the live uniform |
| `window.blackHoleSetPaused(p)` | boolean | resets the frame clock on resume to avoid a dt jump; RAF stays alive |
| `window.blackHoleSetStyle(s)` | `'sketch'` \| `'photoreal'` | no shader recompile; resets TAA |
| `window.blackHoleSetGrid(on)` | boolean | notebook grid; only visible in sketch style |

**`setLook` keys**

| Key | Meaning |
|---|---|
| `disk_gain`, `disk_reveal_r` | accretion-disk brightness; inside-out reveal radius (0 hidden … ~1.12 full) |
| `star_gain`, `galaxy_gain` | starfield + Milky-Way sky gains |
| `exposure`, `glow` | tone-map exposure; bloom glow |
| `spin` | `a/M`; `0` = centred circular shadow, `0.9` = asymmetric Kerr (Home default) |
| `distance` | `observer.distance` — apparent BH size along the orbit-camera view direction |
| `polar`, `azimuth` | camera placement (set together): `polar` is angle from `+Y` (top-down = 0 → grazing); `azimuth` orbits around `Y` |

**URL params** (`/blackhole/index.html?…`)

| Param | Values | Effect |
|---|---|---|
| `style` | `sketch` \| (else photoreal) | initial render style |
| `grid` | `0` \| `1` | initial grid state |
| `perf` | `bg` | pins the `mobile` tier (`resolution_scale 0.55`, `n_steps` 28 standard / 120 kerr), caps DPR to 1.0, disables the auto-benchmark |
| `reveal` | `zoom` \| `staged` | seeds the starting look |

`reveal=zoom` seeds the new flow's starting frame: `disk_gain 1, disk_reveal_r 1.12, star_gain 0, galaxy_gain 0, spin 0, distance 28, polar 0.30, azimuth -1.5` — disk on, far and small, ready for `zoomIntro` to fly in. (`reveal=staged` is the legacy bare-sphere landing.)

postMessage fallback shapes: `{type:'bh:setLook', look}`, `{type:'bh:setPaused', paused}`, `{type:'bh:setStyle', style}`, `{type:'bh:setGrid', on}`, all posted to `location.origin`.

## Events

| Event | Fired by | When | Effect |
|---|---|---|---|
| `gw:reveal-soon` | `GwMerger.render()` | `p >= 0.50` | `BlackHole`/`intro` clear `introHold` + `sync()` → un-pauses the warm iframe |
| `gw:explode` | `GwMerger.render()` | `p >= 0.62` | `BlackHole`/`intro` run `zoomIntro(frame, …)` to fly the camera in |
| `gw:done` | `GwMerger.render()` | `p >= 0.985` | `PageShell` persists `gw-intro-seen="1"` + `setTimeout(revealIslands, 7000)` safety net |
| `gw:reset` | `GwMerger.play()` | each playthrough start | listeners re-arm: `introHold = true`, `sync()`, `resetZoomStart()` |
| `bh:reveal-done` | `BlackHole.astro` | `zoomIntro` `onDone` | `PageShell` removes `.gw-intro` → islands + chrome fade in |

`gw:reset` also clears the per-play guard flags (`revealSoonFired` / `explodeFired` / `doneFired`). On `/intro`, `gw:explode`'s `onDone` instead fades a home preview in after 300 ms.

## Tunables

**Explosion size & duration** — in `GwMerger.astro`:
- Base radius: `explosion(0, 0, baseR * 9 * Math.cbrt(mTot), prog, seed*13)` — change the `* 9` factor (`baseR = 0.022 * minWH`).
- Burst length: the `< 850` (ms) gate and `prog = clamp01(burst / 850)`.
- Element counts: `spikes = 20`, `11` lightning bolts, `18` debris bits; line weights scale `* (minWH / 900)`.
- Cadence: `STEP = 1000 / 12` (12 fps stop-motion).

**Masking windows** — the `cl(a, b)` constants in `render(t)`:
- Cream + dots: `cl(0.70, 0.86)` (`creamA`).
- Grid lead: `cl(P_M - 0.06, P_M + 0.12)` (`gridA`).
- Whole-canvas opacity: `cl(0.83, 0.93)`.

**Fly-in trajectory** — the local constants in `zoomIntro` (`bhReveal.ts`):

| Constant | Default | Tweens |
|---|---|---|
| `ms` | `4500` | total flight duration |
| `FROM` / `TO` | `28` / `11` | `distance` 28 → 11 |
| `POL0` / `POL1` | `0.30` / `1.519` | `polar` top-down → ~3° grazing |
| `AZ0` / `AZ1` | `-1.5` / `0` | `azimuth` orbit → Home |
| `SPIN` | `0.9` | `spin` 0 → 0.9 |
| `STAR` / `GAL` | `0.4` / `0.4` | `star_gain` / `galaxy_gain` 0 → 0.4 |

The whole flight uses `easeInOut` (slow start and settle). The pre-tween frame is set to the `FROM`/`POL0`/`AZ0`/`spin 0`/`gains 0` state, and landing snaps exactly to the `TO`/`POL1`/`AZ1`/`SPIN`/`STAR`/`GAL` values before calling `onDone`.

## Kept but dead

The old 2D "dive into the remnant" code is intentionally retained in `GwMerger.astro` though never called, so Arden can revert without re-deriving it. Dead but present: `render3D` (its own `gw:reveal-soon` at `p >= 0.85`, `gw:done`, `gw:diving`, and a `cl(0.92, 0.99)` canvas fade), `drawDiveGrid`, `drawAccretion`, the 3D camera helpers (`setCam3` / `proj3` / `projPlane` / `linePos` / `samplePos`), the starfield (`buildStars` is still called in `resize` but `drawStars` never is), and `P_DIVE = 0.38` / `FINAL_R`. In `bhReveal.ts`, `revealStaged` (the older staged disk/sky fade) is still exported but unused; the module-level `ease` function (line 23) is referenced as `revealStaged`'s `tween` default `easeFn`, so it is dead only because `revealStaged` is. The live `zoomIntro` path uses `easeInOut` (line 24), not `ease`.

## Deploy

Ships as part of the Astro site to GitHub Pages — no separate build or runtime for the intro.
