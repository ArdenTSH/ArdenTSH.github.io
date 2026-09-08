<!--
  Interpretability & AI safety, the write-up for /research/ai. The page TITLE and
  the one-line lead live in src/config/site.ts (the "ai" entry: label + blurb);
  everything below is the body. The first three sections are present tense (what
  is done / brought); the last is explicitly future. Keep that split.
-->

## Interpretability as effective theory

In physics you rarely track every degree of freedom. You find the handful of collective variables that govern how a system behaves, the move the renormalisation group makes precise. Mechanistic interpretability is the same idea aimed at a trained network: recover the small set of internal mechanisms that explain what a model does, instead of treating it as a black box.

The other half of that instinct I already practise: build the constraint in by construction. An equivariant network carries its symmetries in its architecture, so it cannot learn to violate them, and a model whose structure you imposed is a model you can reason about. Encode the constraint, then read out the effective description. That is the lens I bring from physics to safety.

## What I build

I take these systems apart from the inside. I have trained and quantised convolutional networks for a published physics experiment, built and quantised graph networks (GATs and GCNs) and am architecting equivariant GNNs from the ground up for edge hardware, fine-tuned language models, and designed scheduling for neural-accelerator inference. That footing lets me treat alignment, interpretability and scale as engineering problems with real internals.

The interpretability work itself has artefacts behind it. Within KCL's neutrino group I am building the mechanistic-interpretability tooling for the set-transformer and graph-attention models we use for event reconstruction, physics models we are free to open up. At Apart's Secret Loyalties hackathon (July 2026) I built an interpretability suite (logit lens, tuned lens, causal attention ablations) to search for hidden loyalties in fine-tuned language models.

## Writing and engagement

I have been arguing about this in public for a while. As a staff writer for the King's International Security Journal I have written on misalignment, the collapse of information scarcity, AI's authoritarian pull, and the macroeconomic strain ahead. While at HKUST I sought out and interviewed published safety researchers directly: I wanted the field's own account of itself.

In July 2026 I completed BlueDot Impact's **Technical AI Safety** course (alignment and RLHF, mechanistic interpretability, evaluations and red-teaming, AI control, scalable oversight, with a capstone project) alongside its **Frontier AI Governance** course (compute governance, safety standards, liability, international coordination). Technical and policy tracks together, because the problems do not respect that boundary.

<!-- Once the writing `ai-safety` tag is wired up, selected essays will list here automatically. -->

## Where I'm heading

What's above is groundwork. The work I want to do is interpretability: pulling human-legible structure out of trained models the way physics pulls effective theories out of complicated ones. The first steps are underway, on real physics models and in the hackathon suite, with structured safety training behind them. I intend this work to sit alongside my physics.
