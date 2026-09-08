// ─────────────────────────────────────────────────────────────────────────────
//  SITE CONTENT — edit your copy here. This is the single place for the text
//  that isn't a blog post (blog posts live as markdown in src/content/writing/).
//  Change a value, save, and the site updates.
// ─────────────────────────────────────────────────────────────────────────────

export const site = {
  name: "Arden Tsang   (曾)善蘅",
  // Small mono kicker above the name on the home hero.
  eyebrow: "Theoretical & computational physics",
  // One-line lead under the name. Intentionally EMPTY: a single line can only
  // list the two tracks side by side, which amplifies the split rather than
  // holding it. The paragraph below carries both. Put a string here and the
  // lead renders again (Home + the /intro reveal island).
  tagline: "",
  // The home hero paragraph. One sentence (or clause) per line for readability;
  // the lines are joined with single spaces at build time.
  // Proportion rule: this states what Arden is AT. The islands below are the
  // linked list, so don't enumerate the record or the quantum-gravity routes
  // here -- those live on the cards and on /research/gravity.
  // NOTE: this string is rendered with set:html on the home page, so it may
  // contain a link. Keep any markup to a plain <a>.
  intro: [
    "I am starting the MASt in Astrophysics at Cambridge, after a BSc in Physics",
    "with Theoretical Physics at King's College London.",
    "The physics I want is phenomenology for quantum gravity.",
    "I build machine learning for physics: quantised neural networks with EdgeAI, mechanistic",
    "interpretability tooling and quantum machine learning for a neutrino experiment at King's",
    "(<a href=\"https://arxiv.org/abs/2603.24607\" target=\"_blank\" rel=\"noopener\">paper</a>),",
    "as well as particle-swarm structure search for carbon nanoclusters, which I am first-authoring a paper on.",
    "Alongside that I run Eden, a verification layer for automated laboratories,",
    "supported by a <a href=\"https://blog.cosmos-institute.org/p/announcing-80-new-cosmos-grantees\" target=\"_blank\" rel=\"noopener\">Cosmos Institute grant</a>.",
    "I am working on technical epistemics for science, so that we can trust autonomous science, steer it,",
    "and one day point it at the hardest problems: climate, alignment, quantum gravity.",
  ].join(" "),
  // Public contact address (used by the dock's Contact links).
  email: "arden.tsang@gmail.com",
};

export interface ResearchArea {
  slug: string;
  label: string;
  short: string; // compact label for the dock's pull-apart
  eyebrow?: string; // kicker above the page h1 (defaults to "Research direction")
  blurb: string;
  icon: string; // Tabler icon name, e.g. "tabler:atom"
}

// Order = display order on the home page and in the dock. Lead with the current
// focus; reorder freely.
export const researchAreas: ResearchArea[] = [
  {
    slug: "neutrino",
    label: "Neutrinos & machine learning",
    short: "Neutrinos",
    eyebrow: "Physics at the edge",
    blurb:
      "Machine learning that runs inside the detector: quantised CNNs, graph networks and interpretability for LArTPC triggers.",
    icon: "tabler:cpu",
  },
  {
    slug: "materials",
    label: "Computational molecular & materials physics",
    short: "Matter",
    eyebrow: "The Emergent Structure of Matter",
    blurb:
      "Stochastic search and DFT for carbon nanoclusters and atmospheric clusters.",
    icon: "tabler:atom",
  },
  {
    slug: "ai",
    label: "Interpretability & AI safety",
    short: "AI safety",
    eyebrow: "Inside the Black Box",
    blurb:
      "Frontier AI carries a non-trivial chance of catastrophic outcomes, and the systems taking on the most consequential decisions are the ones we can least explain. I work on understanding them.",
    icon: "tabler:shield",
  },
  {
    // Formerly "cosmology"; /research/cosmology redirects here (astro.config.mjs).
    slug: "gravity",
    label: "Quantum gravity",
    short: "Gravity",
    eyebrow: "Genesis",
    blurb:
      "The routes to quantum gravity that make contact with data: cosmological correlators, holography, gravity from entropy, gravitationally induced entanglement.",
    icon: "tabler:planet",
  },
];

// ── Eden — the venture (a standalone page at /eden, NOT a research direction).
// Thesis + problem + an honest status line; no named people, no unverified
// numbers (kept deliberately to what's safe to say in public).
export const eden = {
  slug: "eden",
  icon: "tabler:seeding",
  eyebrow: "What I'm building",
  title: "Eden",
  short: "Eden",
  // Public artefacts linked from the /eden page header. The layer repository is
  // private; add it here when it opens, and add the preprint when it is posted.
  repo: {
    label: "The benchmark: contract, targets, scorer and harness",
    href: "https://github.com/ArdenTSH/verification-layer-benchmark",
  },
  // The grant, shown in the /eden header under the repository line. "Funded"
  // links the announcement that names me; the two names link the organisations
  // that run the programme together.
  funding: {
    announcement: "https://blog.cosmos-institute.org/p/announcing-80-new-cosmos-grantees",
    cosmos: "https://www.cosmos-institute.org/",
    fire: "https://www.fire.org/",
    programme: "AI x Truth-Seeking grant",
    // The grant card, shown once at the foot of the page. Remove this line and
    // the figure disappears; nothing else depends on it.
    card: "/images/cosmos-grant.jpg",
    cardAlt:
      "Cosmos Institute and FIRE grant card: Grounded Verification Benchmark, Arden Tsang, AI x Truth-Seeking grant winner.",
  },
  // Home-page teaser (the linked island on the home page).
  teaser:
    "Scalable oversight for autonomous science. A model proposes the checks, a small trusted kernel decides, and the audited record that leaves is what steering a laboratory consumes.",
  // The /eden page header lead. Drawn from the paper's introduction.
  lead:
    "Machine-generated science has a verification bottleneck, and autonomous laboratories widen it, because a machine that runs experiments produces results and not only hypotheses. They also change what verification can be. Systems that check machine-generated claims work over the record as published, and a laboratory can do what literature cannot, which is perform the measurement that would settle the question. Eden takes verification of autonomous science to belong in the laboratory. Aletheia is the layer that does it.",
  // Section headings follow the paper. `parts` render as sub-sections: the first
  // shares the section's island, the rest each get their own.
  sections: [
    {
      heading: "Alethic complexity",
      body: [
        "Alethic complexity is what it costs to turn what is true into what is known. Most of that cost sits after a result exists, in the observations, the adjudicative work and the trusted code that a verdict on it requires.",
        "The measurable part carries a narrower name, empirical verificational complexity, which studies how scientific claims are made auditable and how scientific activity can be steered when claims and results become abundant. It asks how a claim can be reduced to independently checkable obligations, what observations and adjudicative work are required to discharge them, and how limited experimental capacity should be directed across testing, replication and retirement. That is the research programme. Eden is that programme built as infrastructure.",
      ],
    },
    {
      heading: "The benchmark",
      body: [
        "In November 2023 an autonomous laboratory reported synthesising 41 new inorganic compounds in seventeen days. An independent re-examination of the deposited evidence disputed much of that record within months, and in January 2026 the original authors' correction adjudicated the claims one by one. The disagreement ran compound by compound, between deposited evidence and named rival explanations, and both adjudicating sources published their reasoning at that granularity, which is what supplies per-claim reference labels.",
        "The benchmark asks whether a verifier, given only the deposited evidence the expert panels held, independently reaches the findings they published. It supplies 95 targets across six groups, 55 from the evidence deposited with the original claims and 40 more from an analysis performed after the dispute. The deposits are public, so the record rebuilds and the grounding can be checked by the same criteria the benchmark applies to a verifier. An outside verifier needs none of this project's layer, models, primitives or code: it submits one file, and the same scorer and rubric that produced the results below produce its score.",
      ],
      parts: [
        {
          heading: "The verification contract",
          body: [
            "The contract fixes what counts as having checked a claim. A claim is one assertion about one compound together with the evidence deposited alongside it. A rival is an alternative account of that same evidence, which a verifier deciding for the claim would have to rule out.",
            "No verdict affirms a claim. A refutation cites evidence a third party can re-examine and an affirmation does not, so the grammar inherits the falsifiability asymmetry: a check refutes with a witness, or it abstains. Verification is only ever the emergent statement that every rival was refuted and nothing refuted the claim. Every verdict declares the conditions under which it holds, and a refutation counts only when an independent checker re-establishes it.",
          ],
        },
      ],
    },
    {
      heading: "Aletheia: the verification layer",
      body: [
        "The layer is built on the asymmetry of scalable oversight, that an overseer can be weaker than what it oversees when checking is cheaper than producing. So it separates proposing from deciding. A model writes checks and proposes rivals, and it is untrusted until a program sharing no code with it re-establishes the result.",
        "Proof assistants have the same shape: a kernel small enough to audit, proof terms that are re-checkable objects, and search procedures that may be arbitrary because nothing they produce is trusted until the kernel accepts it. Abstention is the default output, since unfalsified is the default condition of a claim, and an abstention carries a request for the evidence that would settle the question.",
      ],
      parts: [
        {
          heading: "The trusted base",
          body: [
            "What must be trusted is a set of libraries indexed by kind and small enough to read: the functions a check may call to read evidence, the tests that decide whether a proposed rival is admissible, the methods that turn a hypothesis into a predicted observation, the methods that say how much observation separates two hypotheses, and one checker predicate per class of evidence.",
            "A record drawing on other instruments or other kinds of claim is adjudicated by adding entries. That is by design. These libraries should be expanded in versions, upheld openly, sourced communally, and remain human-legible.",
          ],
        },
      ],
    },
    {
      heading: "Results",
      body: [
        "Working from the evidence deposited with the original claims, the layered architecture reaches all 55 first-stage targets, where the strongest unlayered condition reaches 41. Most of that spread sits in one group that is largely earnable by restating the claim, so the comparison carrying the weight is the 20 targets outside it, where the layer reaches 20 and the strongest unlayered condition reaches 11.",
        "The sharper result is about where verification has to happen. From the evidence available when the claims were made, no verifier reproduces the published adjudication, including the system the benchmark scores against. Granted the one analysis the layer asked for, it reaches that adjudication on all 40 compounds.",
      ],
      parts: [
        {
          heading: "Steering",
          body: [
            "When the layer abstains it names the follow-up that would settle the question, committed in the same completion as the check, and what it names depends on what it already holds. Claims that had not been given the re-refinement asked for it in 75 of 79 cases. Claims that had been given it asked for it in 11 of 87, and asked instead for higher-resolution diffraction in 54.",
            "What the layer is shown to do here is decompose, seal, re-establish, and abstain with a request. Pricing a claim against a rival well enough for the price to decide anything is demonstrated as a mechanism and is not yet evaluated as a method.",
          ],
        },
        {
          heading: "Scalable oversight",
          body: [
            "What must be trusted for a refutation to count is around a thousand lines, standard library only, sharing no code with the layer or with the models that wrote the checks. It holds one predicate per class of evidence, so it grows with the variety of a record rather than its volume, and adding compounds adds none of it. The trusted code needed to adjudicate a fixed share of the record stays flat as the record grows.",
          ],
        },
      ],
    },
    {
      heading: "Outlook",
      body: [
        "The measurements are one record. Three conjectures generalise them, and each is stated with what would refute it.",
      ],
      parts: [
        {
          heading: "The kernel",
          body: [
            "Every artifact the layer reads stands in for a measurement made under conditions the layer cannot check. Calibration, specimen identity, instrument state and specimen history enter as declared assumptions. A kernel for empirical claims would have to reach the experiment, where the only trusted kernel is nature itself, and an autonomous laboratory is what would put an experiment within a verifier's reach. The first conjecture is that such a kernel can be built at all. An argument that no empirical primitive can authenticate itself would refute it.",
          ],
        },
        {
          heading: "Scalability",
          body: [
            "The second conjecture is that the flat growth above holds wherever the record comes from: the cost of oversight tracks the variety of a record and not its volume. A domain in which the number of kinds of evidence grows with the number of claims would refute it.",
          ],
        },
        {
          heading: "The laboratory advantage",
          body: [
            "The third conjecture is that verification inside the laboratory reaches what verification over the published record cannot. It has a formal ancestor, since for causal graphs verifying a proposed answer is proven to need fewer interventions than finding one, and interventions are the resource an autonomous laboratory spends. If it holds, verifiers belong where the discriminating measurement can be run, and a verification layer becomes standard laboratory equipment rather than a stage of publication. Two findings would refute it: a domain in which the discriminating experiment costs more than the claim is worth, and a domain in which the published record suffices at scale.",
          ],
        },
        {
          heading: "Hypothesis generation",
          body: [
            "The proposer sits outside the trusted base and what it proposes is priced. For any admissible rival the trusted base returns the measurement that would separate it from the claim, so proposing becomes a search for the admissible alternative that costs the most to exclude. That objective is a number, so a proposer can be trained against it. Any hypothesis worth proposing contradicts something, which makes the rival slot an interface for hypothesis generation: a proposal may come from any system, is admitted and priced like any other, and is excluded from the verdict. High-throughput machine-generated science can therefore be used without being trusted. The open problem is an admission gate that holds against models that game it.",
          ],
        },
        {
          heading: "Representation",
          body: [
            "Aggregating into one row per claim cannot express that a verdict on one claim obliges a re-check of another. Which verdicts carry that obligation and how far it propagates is what a representation has to make computable, and it is the open question the typed-graph programmes are closest to answering.",
          ],
        },
        {
          heading: "Steering policies",
          body: [
            "Several claims stand open at once, each residual names a measurement, and a laboratory has one instrument. Choosing among residuals is an allocation problem this work leaves untouched, and the measurement budget should follow what a claim is worth rather than a fixed count per instance.",
            "The record a steering policy would train on is different in kind from the published literature, because it keeps what publication filters out: refutations, abstentions, and the rivals that survived. Failed syntheses have already outperformed human intuition as training data once. Whether a policy trained on an audited record steers better than one trained on the literature is a measurable question.",
          ],
        },
        {
          heading: "The libraries",
          body: [
            "This instance holds libraries for one class of measurement, so the libraries are where the architecture grows, and how they grow determines what the architecture is worth. They should be open source, versioned, and kept by the communities whose measurements they encode, the way mathematics keeps a shared library of formal proofs: a verdict cites the library version it was decided under, a library change names the verdicts it reopens, and what the trusted base contains is public in the same sense as the claims it judges. What is open is transfer, whether libraries of this shape carry from one domain to another.",
          ],
        },
        {
          heading: "Safety",
          body: [
            "An autonomous laboratory acts on its own results without waiting for review, so an interpretation determines what is synthesised next. The layer supplies what a safety policy needs and does not itself provide: a point at which a proposed action can be stopped, and the evidence trail on which stopping it can be justified. That matters most in areas such as biosecurity. Hazard models, containment and instrument state sit outside the layer. How an evidence-admission contract composes with an action-permission contract is open, and that composition decides whether an audited record can govern what a laboratory does next.",
          ],
        },
      ],
    },
    {
      heading: "Why this",
      body: [
        "Every research role I have taken has involved the same step, where a number coming off an instrument has to become a claim about the world. A trigger deciding in microseconds what to keep. A network asserting an energy no one will ever measure directly. A spectrum that either is, or is not, that molecule.",
        "A model that is confidently wrong looks the same as one that is right, until something checks. Automating that check is what makes automating the science worth doing. It is the same instinct that pulls me toward interpretability: get the legible structure out of a system rather than trust it because it sounds right.",
      ],
    },
  ],
};

export interface ContactLink {
  label: string;
  href: string;
  icon: string;
}

// Contact + profile links (mirrors the CV). Fill in the real URLs — the "#"
// placeholders are intentional until you paste them in.
export const contactLinks: ContactLink[] = [
  { label: "Email", href: `mailto:${site.email}`, icon: "tabler:mail" },
  { label: "Google Scholar", href: 'https://scholar.google.co.uk/citations?user=yJ3dzdAAAAAJ&hl=en', icon: "tabler:school" },
  { label: "Inspire HEP", href: 'https://inspirehep.net/authors/3136464', icon: "tabler:atom" },
  { label: "ORCID", href: 'https://orcid.org/0009-0008-0782-5394', icon: "tabler:id" },
  { label: "LinkedIn", href: 'https://www.linkedin.com/in/arden-tsang-22224b2a0/', icon: "tabler:brand-linkedin" },
  { label: "GitHub", href: 'https://github.com/ArdenTSH', icon: "tabler:brand-github" },
];
