<!--
  Quantum gravity write-up. Edit this file to change /research/gravity (the old
  /research/cosmology URL redirects here). The page title and one-line blurb
  come from src/config/site.ts; everything below is the body. Islands split by
  heading level: text before the first heading is the intro island, "##" is a
  section lead, "###" is a part. The essay will decide which route goes first;
  reshape this file when it does.
-->

The physics I want is quantum gravity. I care about the routes to it that make
contact with data, and I hold the order strictly: fundamental first, then
beautiful, then unifying. A theory that cannot touch a measurement does not get
to be the first of those.

At Cambridge I am taking the MASt in Astrophysics: quantum field theory,
general relativity, black holes, field theory in cosmology, and gravitational
waves with numerical relativity. The essay is where the first result comes
from, and it decides which of the routes below I take up first.

## Routes

Four ways in, each with an empirical handle. These are the interests the year
will narrow.

### Cosmological correlators

The early universe is the one regime where gravity and quantum fields were both
strong and left a record. Inflationary correlators, the stochastic
gravitational-wave background, and the survey data now arriving make it the
route with the most data behind it.

### Holography

Gravity as the dual description of a quantum system without gravity. The
entanglement side of it, and the tabletop analogues (dS/CFT and emergent-AdS
proposals) that might realise a holographic geometry in the laboratory, are
the parts with a route to measurement.

### Gravity from entropy

Whether the gravitational field equations are thermodynamic in origin, so that
gravity is emergent rather than fundamental. Any version of the idea has to
predict something that survey data can kill, which is why it interests me.

### Gravitationally induced entanglement

Tabletop tests of whether gravity can entangle two quantum systems. The nearest
thing to a direct experiment on the quantum nature of gravity.

## Theory meets data

The problem I would most like to do is a test of gravity from entropy against
cosmological survey data. It needs both sides: the theory, and the machinery
that decides whether the data can tell the claim from its rival. That second
half is what Eden builds.

## Data side

At the KCL Cosmology Hackathon (June 2026) I built an ML pipeline inferring
galaxy redshifts from five-band SDSS photometry, combining gradient-boosted
trees with an MLP ensemble, RMSE ≈ 0.052.
