<!--
  Computational molecular & materials write-up. Edit this file to change
  /research/materials. Title + one-line blurb live in src/config/site.ts.

  ISLAND SKELETON: the page is split into islands by heading level (see
  src/pages/research/[slug].astro):
    • text up here, before the first heading  → the INTRO island (page opener)
    • "## ..."   → a SECTION-LEAD island: a project title + ~2 lines on it
    • "### ..."  → a PART island: one piece of that project
  A paragraph reading exactly [[viewer:c20]] becomes the interactive C₂₀ figure
  (ClusterViewer, fed by public/structures/C20_fullerene.xyz).

  Sources: the BSc dissertation (May 2026) for method, validation and benchmark
  numbers; the CV for what has happened since (fullerene converged, C₈O₂/C₈S₂,
  first-author manuscript). Add the paper link here once the journal publishes.
-->

I came into scientific research through computational physics. I want to
harness modern computational methods for research, and machine-learnt tools
have changed what that means: learned potentials and surrogate models now stand
in for the calculations that used to set the ceiling on what could be
attempted.

What fascinates me is representation. A system has to become something a
machine can operate on before a search runs, and that choice sets the boundary
of what can be found. That makes it a matter of technical epistemics as much as
method, since the encoding decides what a result is able to establish. The same
choice recurs in what a detector event is to a network, and in what a
scientific claim is to a checker.

## Carbon nanoclusters by particle-swarm search

The centrepiece: finding the lowest-energy shapes of small carbon clusters by
coupling a stochastic global search to quantum-chemical energies, with
**C₂₀**, the smallest fullerene cage, as the headline test.

### Why it matters

Structure dictates properties: the same atoms arranged as a ring, a bowl, or a
cage behave like different materials. Small carbon clusters are also fullerene
precursors, and their vibrational fingerprints fall in the infrared bands seen
toward molecular clouds, so getting the geometry right is the first step
toward reading the chemistry of the interstellar medium.

### The problem

The number of plausible arrangements explodes with cluster size, and the energy
landscape is rugged, many near-degenerate minima separated by barriers, so
brute force is hopeless. You need a search that is smart about where to look,
paired with energies that are *accurate enough but affordable*. Screen cheaply,
then refine the survivors.

### Method

**Particle-swarm optimisation (PSO)** treats each candidate geometry as a
particle exploring the landscape, pulled between its own best find and the
swarm's best:

```
v ← w·v + c₁·r₁·(p_best − x) + c₂·r₂·(g_best − x)
x ← x + v
```

These two updates *are* the mechanism: inertia (`w`) keeps a particle
exploring, while the cognitive and social pulls (`c₁`, `c₂`) draw it toward
known-good basins. A particle here is a whole cluster: an N × 3 matrix of
displacements from a reference frame, so for C₁₀ the search space is
30-dimensional and every atom moves at once.

The energies come in two tiers. During the search, every particle's fitness is
its **GFN2-xTB** energy, a fast tight-binding method that gets bond lengths and
coordination right at a fraction of the cost of DFT. Only the swarm's final
best is handed on to a GPU **PBE+VV10/def2-tzvp** relaxation, a
dispersion-corrected functional, because the weak long-range attraction that
VV10 captures matters for how carbon cages and sheets sit.
Deferring DFT to one final relaxation replaces the swarm-size × iterations DFT
calls per run of the DFT-in-the-loop literature with a single one, which is
what makes C₂₀ reachable.

[[figure:pipeline]]

Three additions made the workflow usable at scale. A **step-cap** on the DFT
relaxation, because LBFGS oscillates rather than converges at the linear
even-N chains (the polyynic, bond-alternating ones), and the lowest-energy frame
is kept instead. A **restart** that re-centres the reference frame on the best
structure and resets the inertia schedule, so a stagnated swarm gets a fresh
exploratory phase; it doubles as the tool for promoting a chosen candidate to
DFT. And a Bash **HPC framework** for the Young supercomputer that managed more
than 700 independent searches with reproducible directory and logging
conventions. The PSO optimiser itself is the De Tomas group's; the two-tier
workflow, the benchmark and the pipeline are mine.

### Results

[[viewer:c20]]

The headline is C₂₀. It is a hard target: the cage, bowl, and
monocyclic-ring isomers sit within a narrow energy window, and which one wins
depends on the level of theory, which is why it is a standard stress test for a
blind search. From random starts, with
restart-assisted searches, the workflow converged the **C₂₀ fullerene cage**
shown above, the smallest cluster size at which closed cages are geometrically
possible and the size at which carbon clusters cross from chains and rings into
three-dimensional topologies.

Below that size the workflow was validated against the published PSO results
for C₃ through C₁₀: it reproduced the reported low-energy isomers, with bond
lengths typically within 0.005 to 0.03 Å and angles within 1 to 3° of the
literature values, the D₁₀h C₁₀ ring being the one exception. That exception
traced to initialisation: the published recovery started from visibly
ring-arranged seeds, where this workflow starts from random placements in a
sphere.

### What the benchmark showed

Four inertia schedules (linear, adaptive, random, chaotic) were run across eight
cluster sizes, ten trials each, then repeated at forty trials for C₅ and C₁₀.
The **adaptive** schedule is the worst for every size from N = 5 upward, in both
sample sizes: its variance-triggered collapse toward the minimum weight stops
exploration before a good basin is found. Among the other three, the ranking
shifts with sample size, and what separates them is spread rather than mean:
**linear** has the narrowest trial-to-trial variance, chaotic the widest.
Even-N sizes converge more consistently than odd-N, matching the two-isomer
(chain versus ring) energetics of even carbon clusters. The initialisation
sphere turned out to matter as much as any schedule: at C₄ the rhombic isomer
is reached at a radius of 2.1 Å and the linear one at 2.4 Å, and no single
setting finds both.

### Where it's heading

I am first-authoring a manuscript on this work, with submission targeted for
September 2026. Beyond the paper, the machinery generalises: I have extended
the swarm search to **C₈O₂ and C₈S₂**, automated kinetic-state discovery with
PySoftK, and started interpretability work on **random-forest feature
attribution**, asking the surrogate models to say *why* they rank structures
as they do. The astrophysical thread continues too: comparing simulated IR
spectra of the recovered clusters against molecular-cloud observations.

### Resources

- Code: the [Hybrid-PSO HPC pipeline](https://github.com/ArdenTSH/Hybrid-PSO_HPC_pipeline), with the analysis scripts, submission templates and benchmarking utilities behind the runs above.
- Structure: the refined C₂₀ fullerene as a downloadable [`.xyz`](/structures/C20_fullerene.xyz), the same file the figure above is drawn from.

## Rotational spectroscopy (KURF)

A self-contained spectroscopy project, and external paid validation: a King's
Undergraduate Research Fellowship reading molecular-cluster geometries off
their rotational spectra.

### From spectrum back to structure

Working on the limonene–(SO₂)₂ system, I identified the **lowest-energy isomer**
consistent with the observed rotational constants, pinning down a specific
three-body geometry from spectroscopic data. It is the mirror image of the
cluster search: there, structure predicts the spectrum; here, the spectrum pins
down the structure. The same idea, read in both directions.

## Photonics

A year in a photovoltaics laboratory, cutting structure into a material to
control what it does with light.

### Nanostructuring perovskite

I integrated CAD (Fusion 360 and Inkscape) with a V4.75 CO₂ laser to
nanostructure perovskite for spectral filtering, and investigated dichroic
filters and perovskite for agrivoltaics, panels that pass the wavelengths a
crop needs and harvest the rest.
