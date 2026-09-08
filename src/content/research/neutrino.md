<!--
  Neutrino + ML write-up. Edit this file to change /research/neutrino.
  Title + blurb live in src/config/site.ts; the prose below is the page body.

  ISLAND SKELETON (see src/pages/research/[slug].astro):
    • text before the first heading -> the INTRO island
    • "## ..."  -> a SECTION-LEAD island (merges with the first "###" under it)
    • "### ..." -> a PART island

  Numbers in "What the numbers show" come from arXiv:2603.24607v2 (Tables 1-3).
  Do not edit them without checking the paper.
-->

Liquid-argon time-projection chambers photograph neutrino interactions in
detail. The next generation of them will produce more data than anyone can
afford to keep, and almost all of it is background. Something has to decide what
is worth recording, in the time it takes the ionisation charge to drift to the
anode.

I work on machine learning small enough and cheap enough to make that decision at
the detector itself.

## Physics at the edge

What quantisation actually costs you when a convolutional network for neutrino
interaction recognition has to run on a two-watt accelerator. Co-authored with
collaborators at King's, Cambridge, Rochester, Fermilab and Milan, and submitted
to EPJC. My part was the training and quantisation side.

### The setup

The dataset is 22,338 simulated neutrino interactions from GENIE, with a 1 to
4 GeV flux roughly approximating DUNE's, passed through a Geant4 simulation of a
five-metre cube of liquid argon at 87 K. Each event becomes a 224 by 224 image at
one centimetre per pixel, with the three readout views stacked the way colour
channels would be. The task is three-way: charged-current muon neutrino,
charged-current electron neutrino, neutral current. A long muon track, an
electromagnetic shower, or neither of them.

[[figure:events]]

We trained four standard convolutional networks on it: ResNet-50V2, DenseNet-169,
EfficientNetV2B0 and InceptionV3. The Google Coral Edge TPU runs 8-bit integers
only, at roughly four trillion operations per second for about two watts, so
every model has to be quantised before it can be deployed at all. We compared the
two ways of getting there. Post-training quantisation converts a finished
float model using a small calibration set. Quantisation-aware training simulates
the low-precision arithmetic during the forward pass, so the weights adapt to it
before conversion.

[[figure:quantisation]]

### What the numbers show

| Model | Float | Edge TPU, PTQ | Edge TPU, QAT |
| --- | ---: | ---: | ---: |
| InceptionV3 | 87.5 | 87.1 | 88.2 |
| DenseNet-169 | 83.6 | 80.1 | 56.1 |
| ResNet-50V2 | 79.3 | 61.5 | 46.2 |
| EfficientNetV2B0 | 80.2 | 33.3 | 33.4 |

Balanced accuracy in percent. Chance is 33.3 for three classes.

InceptionV3 comes through both routes intact. Nothing else does.
EfficientNetV2B0 lands exactly at chance, which means the deployed model has
stopped classifying altogether. Quantisation-aware training, the route that is
supposed to protect accuracy, is the worse of the two once the compiler has run:
DenseNet-169 holds 81.2% as a quantised graph and 56.1% after compilation for the
device. The compiler is proprietary, so the step doing the damage is the one step
we cannot open up.

The energy figures are the reason to care. Per inference, measured as thermal
design power times latency, the Edge TPU costs 25 to 80 mJ. The A100 costs 640 to
2300 mJ and the CPU 5300 to 18600 mJ. That is a worst-case proxy rather than a
wall-plug measurement, and it still puts the device one to two orders of
magnitude below the GPU and more than two below the CPU. Latency is comparable to
the CPU and an order of magnitude behind the GPU. The gain is in power.

[[figure:energy]]

### What it is for

A trigger has to hold accuracy, latency and power at once. GPUs sitting in a
data centre away from the detector fail the last two, and the experiments that
need this most are the ones where the interesting signal arrives once. A
supernova burst, or a rare decay. What the benchmark establishes is that a device
costing two watts and connecting over USB can run a large convolutional network
at close to its full accuracy, near enough to the cryostat to sit inside the
trigger path.

## Where the work goes now

Images were the starting point. A LArTPC event is a point cloud, and treating it
as one changes both the architecture and what it costs to run.

### Graph networks on the edge

I lead the build, train and quantise cycle for graph attention networks and graph
convolutional networks on this data, and I am architecting equivariant GNNs from
the ground up for the same edge hardware. A network carrying the geometry of the
detector in its structure does not spend capacity learning that geometry from
scratch, which is the property that matters when the parameter budget is set by a
two-watt chip.

### Reconstruction and interpretability

On the reconstruction side I run Pandora inside LArSoft and write the ROOT
feature-vector files that feed the group's set-transformer models.

I am building the group's mechanistic-interpretability tooling for those
set-transformer and graph-attention models. These are networks we ask to make
physics decisions, trained on simulation where the true answer is known exactly,
which makes them an unusually clean place to ask what a model has actually
learned to use.

### Quantum machine learning

I benchmark an equivariant quantum classifier on the same LArTPC task across
quantum hardware platforms, on accuracy, speed and energy. The variable the study
is built around is qubit connectivity. The circuit entangles qubits that sit far
apart, diagonally opposite pixels of a patch for instance, so on a processor with
a fixed nearest-neighbour lattice each of those gates becomes a chain of swaps,
and the two-qubit gate count and the accumulated error climb with it. Hardware
reaches all-to-all connectivity by very different physical routes: a central
resonator that any pair of transmons can couple through, ions in a shared trap
coupling through collective modes, neutral atoms rearranged in optical tweezers
to match the circuit. Comparing two processors built on the same transmon stack
that differ only in how their qubits are wired isolates connectivity from
everything else, and one transpilation method applied identically to every device
keeps the rest of the comparison honest. Energy is the hard part, because no
cloud provider reports a per-job figure, so the quantum side has to be modelled
from system power and the time a job occupies the processor while the classical
side is measured directly. The question is the one the Edge TPU paper asks, put
to a very different machine: what does the hardware take from you, and what does
it give back.

## Outputs

- *Physics at the Edge: benchmarking quantisation techniques and the Edge TPU for neutrino interaction recognition.* Co-author. [arXiv:2603.24607](https://arxiv.org/abs/2603.24607), submitted to EPJC.
- Poster, AI for Science Conference, Alan Turing Institute, London, March 2026.
