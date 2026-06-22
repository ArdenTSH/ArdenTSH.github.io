<!--
  Computational molecular & materials write-up. Edit this file to change
  /research/materials. Title + one-line blurb live in src/config/site.ts.

  ISLAND SKELETON — the page is split into islands by heading level (see
  src/pages/research/[slug].astro):
    • text up here, before the first heading  → the INTRO island (page opener)
    • "## ..."   → a SECTION-LEAD island: a project title + ~2 lines on it
    • "### ..."  → a PART island: one piece of that project

  This is a STRUCTURAL DRAFT. Prose is placeholder-grade; [bracketed notes] mark
  the spots that need your real numbers / claims / links before this goes live.
  Interactive pieces (3D viewer, charts, the method flowchart) are left as
  labelled slots on purpose — no animation is built in this pass.
-->

My first research was computational, and it set the pattern for everything
since: take a system you can't solve by hand, search its space intelligently,
and let the structure that falls out tell you the physics. The quiet thread
through this work is **from structure to spectrum** — first *where the atoms
sit*, then *what that geometry would let us observe*.

## Carbon nanoclusters by particle-swarm search

The centrepiece: finding the lowest-energy shapes of small carbon clusters by
coupling a stochastic global search to quantum-chemical energies — with
**C₂₀**, the smallest fullerene cage, as the headline test.

### Why it matters

Structure dictates properties: the same atoms arranged as a ring, a bowl, or a
cage behave like different materials. Small carbon clusters are also fullerene
precursors, and their vibrational fingerprints fall in the infrared bands seen
toward molecular clouds — so getting the geometry right is the first step
toward reading the chemistry of the interstellar medium.

### The problem

The number of plausible arrangements explodes with cluster size, and the energy
landscape is rugged — many near-degenerate minima separated by barriers — so
brute force is hopeless. You need a search that is smart about where to look,
paired with energies that are *accurate enough but affordable*. Screen cheaply,
then refine the survivors: that trade-off is the whole game.

### Method

**Particle-swarm optimisation (PSO)** treats each candidate geometry as a
particle exploring the landscape, pulled between its own best find and the
swarm's best:

```
v ← w·v + c₁·r₁·(p_best − x) + c₂·r₂·(g_best − x)
x ← x + v
```

[rendered math to come] These two updates *are* the mechanism: inertia (`w`)
keeps a particle exploring, while the cognitive and social pulls (`c₁`, `c₂`)
draw it toward known-good basins.

The energies come in two tiers. Candidates are first **screened with GFN2-xTB**,
a fast tight-binding method, to discard the obviously bad geometries cheaply.
Survivors are then **refined with PBE+VV10** — a dispersion-corrected
functional, because the weak long-range (van der Waals) attraction that VV10
captures genuinely matters for how carbon cages and sheets prefer to sit. The
best structures are benchmarked against established references (GAP-20, AIRSS).

[method flowchart slot — PSO proposes → GFN2-xTB screens → PBE+VV10 refines → benchmark]

### Results

[3D structure viewer slot — C₂₀ as the hero; flip through the C₃–C₁₀ isomers]

The headline is C₂₀. It is a genuinely hard target: the cage, bowl, and
monocyclic-ring isomers sit within a razor-thin energy window, and which one
wins is famously sensitive to the level of theory — exactly why it is a standard
stress test for a blind search. From a random start, the swarm **recovers the
cage isomer**. [Lock the precise claim before publishing — "lowest-energy at
this level of theory" vs. "recovered the cage isomer" — to match what the
numbers actually support.]

[convergence chart slot — energy vs. iteration; the best-so-far structure
morphing from a random blob into the cage]

[benchmark plot slot — our energies against GAP-20 / AIRSS]

### Resources

Staged with the write-up: a teaser now, full data when the preprint goes up
(EPJC / Springer are preprint-friendly, so this is timing, not a restriction).

- Preprint — *[title]*, [link when posted]
- Code — [Git repository]
- Structures — downloadable `.xyz` for every cluster, alongside the live viewer
- READMEs — how to reproduce the search and the benchmarks

## Rotational spectroscopy (KURF)

A self-contained spectroscopy project, and external paid validation: a King's
Undergraduate Research Fellowship reading molecular-cluster geometries off
their rotational spectra.

### From spectrum back to structure

Working on the limonene–(SO₂)₂ system, I identified the **lowest-energy isomer**
consistent with the observed rotational constants — pinning down a specific
three-body geometry from spectroscopic data. It is the mirror image of the
cluster search: there, structure predicts the spectrum; here, the spectrum pins
down the structure. The same idea, read in both directions.

## Photonics

A briefer thread: [one-paragraph mention — what the photonics work was, what you
did, and one concrete outcome]. It rounds out the computational-physics breadth
without competing with the cluster search for attention.
