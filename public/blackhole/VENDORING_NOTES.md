# Vendoring notes — black-hole renderer

This folder is a vendored copy of the MIT-licensed black-hole renderer
**Adriwin06/black-hole** (https://github.com/Adriwin06/black-hole), itself a fork of
**oseiskar/black-hole** (https://github.com/oseiskar/black-hole). It is used as the
home-page background of Arden Tsang's website (https://ardentsh.github.io).

## Changes made to the upstream copy (for clean, license-safe redistribution)

1. **Replaced the non-MIT sky.** Upstream `assets/img/milkyway.jpg` was a Stellarium
   texture based on Nick Risinger's Photopic Sky Survey, licensed **CC-BY-NC 2.0**
   (non-commercial) — not cleanly redistributable. It was **replaced** with an
   original, procedurally-generated equirectangular starfield (2048×1024, NumPy +
   Pillow), released as **CC0 / public domain**. The filename is unchanged, so no
   code edits were needed. (To regenerate: a faint tilted Milky-Way band + ~9000
   stars with size/brightness/colour variation; seed 7.)

2. **Removed the runtime Font Awesome CDN load.** Upstream `index.html` loaded Font
   Awesome 4.5 from MaxCDN for icons in its UI chrome. That chrome is hidden in
   background mode, so the `<link>` was removed — no external runtime dependency.

3. **Background-mode wrapper.** `index.html` was adapted to run as a background: UI
   chrome (dat.GUI panel, FPS meter, CONTROLS/ANIMATIONS tabs, observer gizmo) is
   hidden via CSS + a small runtime cleanup script; **drag-to-orbit is kept**; a
   capture-phase `wheel` handler forwards scroll to the host page so the site still
   scrolls and the renderer never zooms.

4. **Excluded from the vendor copy:** the 20 MB `assets/gif/banner.gif` (readme
   banner) and `docs/` were not copied.

## Licenses in this folder (all permissive / redistributable)

- Fork source code — **MIT**, © 2015 Otto Seiskari, © 2026 Adriwin (see `LICENSE`, `COPYRIGHT.md`).
- `js-libs/` jQuery, three.js (+ OrbitControls, Detector), stats.js, mustache.js, webm-muxer, ShaderLoader — **MIT**.
- `js-libs/dat.gui.min.js` — **Apache-2.0**.
- `assets/img/milkyway.jpg` — **CC0** (our generated starfield).
- `assets/img/{stars,spectra,beach-ball}.png`, `assets/img/icons/*.svg` — first-party repo assets under the repo's **MIT** license.

Net: the shipped bundle is **MIT + Apache-2.0 + CC0** — all permissive, commercially
redistributable, attribution preserved.
