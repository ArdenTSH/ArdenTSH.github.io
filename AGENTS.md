# Personal Website — project brief for Codex

Academic website for **Arden Tsang** (theoretical & computational physicist; KCL BSc → Cambridge MASt in Astrophysics). It doubles as a PhD-application calling card. Built with **Astro**; deploy host TBD (Cloudflare Pages / Vercel / GitHub Pages). See `PLAN.md` for the step-by-step checklist and current status.

## Run it
- Dev server: from this folder, `npm run dev -- --port 4321` → http://localhost:4321
- Node v24 lives at `/usr/local/bin`. In Codex's Bash, prefix commands with `export PATH="/usr/local/bin:$PATH"` and run npm/dev-server unsandboxed (they need network + port binding).
- Keep all editable copy centralised (Phase 1.1) — never scatter text across components.

## Who Arden is (for tone)
Physics-first right now (astro/cosmology/theory is home), with unusually broad computational + ML research: materials (PSO–DFT carbon nanoclusters), neutrino edge-AI (quantised CNNs for LArTPC; co-author "Physics at the Edge", arXiv:2603.24607), cosmology (SDSS photometric-redshift ML), AI/NPU scheduling + LLM fine-tuning, and AI-safety writing. Output so far: 1 preprint, 3 posters, 1 AI-safety essay; 2–4 more papers expected by end of summer 2026.

## Design philosophy (hard constraints)
- **Serious, never "vibe-coded."** Dynamism comes from real physics or a quiet GR nod — never decoration. Physics owns the page; ML is a tasteful accent.
- **Opaque islands over full-bleed grandeur backgrounds.** Readable content lives in opaque cards; each page has its own background. Islands guarantee legibility, so backgrounds can be rich.
- **Dark-leaning, restrained palette** (single cool blue/teal accent — not rainbow), **strong typography, exactly two font weights (~400/500), sentence case** everywhere.
- No decorative gradients, glassmorphism-everywhere, or neon glow.
- **Every animation: lazy-loaded, pauses off-screen, reduced-motion static fallback.** Removing any one must never break the site.

## Information architecture
- **Home** = "meet me" + the four research-direction islands (visible, not buried). Click an island → its own page. Background: accreting black hole (the merger remnant). Foot: MNIST forward-pass strip (scroll = inference; doubles as a progress indicator). Gentle "spherical" scroll.
- **Research direction pages** (own background + one shared island micro-motif each): Materials (crystal lattice) · Neutrino edge-AI (LArTPC event) · Cosmology (galaxy field) · AI/NPUs/safety (NPU/attention). Outputs attach to their direction.
- **Writing** — one page, one background; posts open in place (no new background per post).
- **CV** — formal record + full publication list; background dialled down for legibility.
- **Nav** — bottom floating dock (hover-expands labels upward); mobile bottom bar. Everything reachable. No standalone Publications page (only 1 paper; folded into Research + CV).

## Signature set
GW black-hole merger **intro** (once/session, skip button, reduced-motion fallback) → opens Home. Accreting BH home background (MIT `Adriwin06/black-hole`, Three.js, low quality tier; its bundled Milky Way image is NOT MIT — replace it). Spacetime-lensing cursor grid (a micro-motif). MNIST foot-strip (real tiny in-browser model, new digit each load). Per-area canvas backgrounds. Spherical scroll.

## Hosting / deploy
Source on GitHub; deploy via Cloudflare Pages or Vercel (auto-build on push, preview URLs) or GitHub Pages. **Not pushed yet — local only until Arden says go.**

## More context
Full design history + user profile live in Codex's auto-memory (index `MEMORY.md`: see `academic-website`, `arden-tsang-profile`).
