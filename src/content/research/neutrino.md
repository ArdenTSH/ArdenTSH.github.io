<!--
  Neutrino edge-AI write-up. Edit this file to change /research/neutrino.
  Title + blurb live in src/config/site.ts; the prose below is the page body.
  Starting draft — rewrite freely.
-->

Liquid-argon time-projection chambers (LArTPCs) photograph neutrino interactions
in exquisite detail, but the data rates are enormous and most of what they see is
background. The idea here is to push the first trigger decision onto the detector
itself.

I work on **quantised convolutional networks** small and fast enough to run on
edge accelerators (Edge-TPU-class hardware), so event selection can happen in
real time, at the source, inside a tight power budget — physics at the edge.

That work is now widening from CNNs to **graph networks**: I'm leading the
build–train–quantise cycle for GATs and GCNs, and architecting **equivariant
GNNs** from the ground up to run on the same edge hardware — a LArTPC event is
a point cloud, and a network that carries the geometry in its structure should
read it better and smaller. On the reconstruction side I run Pandora within
LArSoft, writing ROOT feature-vector files that feed the group's
set-transformer models, and I contribute to **mechanistic-interpretability**
work on those set-transformer and graph-attention models — opening up the
internals of the networks we ask to make physics decisions.

## Outputs

- *Physics at the Edge* — co-author. [arXiv:2603.24607](https://arxiv.org/abs/2603.24607), submitted to EPJC.
- Poster — AI for Science Conference, Alan Turing Institute, London, March 2026.

<!-- Add posters, talks and code as they land. -->
