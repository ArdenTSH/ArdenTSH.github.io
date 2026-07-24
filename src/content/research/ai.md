<!--
  Interpretability & AI safety — the write-up for /research/ai. Edit this freely,
  in your own tone. The page TITLE and the one-line lead live in
  src/config/site.ts (the "ai" entry: label + blurb); everything below is the body.
  Honesty split built into the draft: the first three sections are present tense
  (what you've done / bring); the last is explicitly future ("where I'm heading").
  Keep that split when you re-voice it.
-->

## Interpretability as effective theory

In physics you almost never track every degree of freedom. You find the handful of collective variables that actually govern how a system behaves — the move the renormalisation group makes precise. Mechanistic interpretability is the same idea aimed at a trained network: recover the small set of internal mechanisms that explain what a model really does, instead of treating it as a black box.

The other half of that instinct I already practise: build the constraint in by construction. An equivariant network carries its symmetries by design, so it *can't* learn to violate them — and a model whose structure you imposed is a model you can reason about. Encode the constraint, then read out the effective description. That's the lens I bring from physics to safety.

## I build these systems

I don't comment on AI from the outside — I build and take these systems apart. I've trained and quantised convolutional networks for a published physics experiment, built and quantised graph networks (GATs and GCNs) and am architecting equivariant GNNs from the ground up for edge hardware, fine-tuned language models, and designed scheduling for neural-accelerator inference. The hands-on footing is the point: it lets me treat alignment, interpretability and scale as engineering problems with real internals, not abstractions.

And the interpretability work itself has begun: within KCL's neutrino group I'm contributing to mechanistic-interpretability work on the set-transformer and graph-attention models we use for event reconstruction — physics models whose internals we have every reason, and every right, to open up.

## Writing and engagement

I've been arguing about this in public for a while. As a staff writer for the King's International Security Journal I've written on misalignment, the collapse of information scarcity, AI's authoritarian pull, and the macroeconomic strain ahead. While at HKUST I sought out and interviewed published safety researchers directly — I wanted the field's own account, not a summary of it.

I'm also putting the engagement on formal footing: this summer I'm taking BlueDot Impact's **Technical AI Safety** course (alignment & RLHF, mechanistic interpretability, evaluations & red-teaming, AI control, scalable oversight, with a capstone project) alongside its **Frontier AI Governance** course (compute governance, safety standards, liability, international coordination). Technical and policy tracks together, deliberately — the problems don't respect that boundary.

<!-- Once the writing `ai-safety` tag is wired up, selected essays will list here automatically. -->

## Where I'm heading

What's above is groundwork. The work I actually want to do is interpretability — pulling human-legible structure out of trained models the way physics pulls effective theories out of complicated ones. The first steps are underway: mechanistic-interpretability contributions on real physics models, and structured safety training through BlueDot. I intend this work to sit *alongside* my physics, not behind it. The track record here is young — but it has started, and the technical footing it stands on is real.
