// ─────────────────────────────────────────────────────────────────────────────
//  SITE CONTENT — edit your copy here. This is the single place for the text
//  that isn't a blog post (blog posts live as markdown in src/content/writing/).
//  Change a value, save, and the site updates.
// ─────────────────────────────────────────────────────────────────────────────

export const site = {
  name: "Arden Tsang   (曾)善蘅",
  // Small mono kicker above the name on the home hero.
  eyebrow: "Theoretical & computational physics",
  // One-line identity — the home hero lead.
  tagline: "Symmetry and computation, from quantum physics to artificial intelligence to cosmology.",
  // The home hero paragraph: who you are, in a few honest sentences.
  intro:
    "I am heading to Cambridge for my MASt in Astrophysics, having graduated with a BSc in Physics with Theoretical Physics from King's College London. While my past research spans computational molecular physics and applying machine learning to experimental particle physics, I have shifted to working on the safety and reliability of automated discovery. My focus is now entirely on Safe AI for Science. I work on mechanistic interpretability, scalable oversight, and grounded verification, with the long-term vision of building a research institute that ensures autonomous AI systems remain trustworthy tools for human inquiry.",
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
    slug: "cosmology",
    label: "Cosmology & astrophysics",
    short: "Cosmology",
    eyebrow: "Genesis",
    blurb:
      "Inflationary correlators, the cosmological collider, and scalar-induced gravitational waves.",
    icon: "tabler:planet",
  },
  {
    slug: "neutrino",
    label: "Neutrinos at the edge",
    short: "Neutrinos",
    eyebrow: "Beyond the Standard Model",
    blurb: "Quantised CNNs and Edge-TPU triggers for LArTPC detectors.",
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
      "I approach machine learning the way I approach physics — by looking for the structure inside the system. AI safety is where I want that habit to matter most.",
    icon: "tabler:shield",
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
  // The public benchmark repository (linked from the /eden page header).
  repo: {
    label: "The A-Lab benchmark: code, data, results",
    href: "https://github.com/ArdenTSH/Verification-layer-A-lab",
  },
  // Home-page teaser (the linked island on the home page).
  teaser:
    "A verification layer for automated science. It decides whether an automated result means what it claims, and says so in a way you can open up and check.",
  // The /eden page header lead.
  lead:
    "Autonomous labs can now run an experiment with no human in the loop. Eden is the layer that decides whether the result means what it claims, and says so in a form you can open up and check for yourself.",
  // The page body: one island per section.
  sections: [
    {
      heading: "The gap",
      body: [
        "Producing a scientific result is getting cheap, fast. Checking one is not. Automated labs already run hundreds of experiments with no one watching, and the models reading that data get better every month. The step that turns a measurement into a claim you can trust has barely moved.",
        "One flagship autonomous-lab demonstration took two years to settle a few dozen results. Both sides were capable and both argued in good faith. They were applying two different, unwritten decision rules to the same data, and no one had written the rule down. That is the gap Eden closes.",
      ],
    },
    {
      heading: "Write the check, don't be the check",
      body: [
        "The design comes from how mathematics already solved this. In a proof assistant, an arbitrarily clever program searches for a proof and then hands it to a small, boring kernel that checks it, and the kernel is the only part you have to trust. Eden is the empirical version of that idea.",
        "An untrusted model reads a scientific claim, breaks it into atomic assertions, and writes checks from a fixed vocabulary of domain primitives. A sealed kernel runs them. A check is never allowed to return \"verified\". It refutes the claim with a specific witness (a file, a value, the condition it violated), or it abstains. Verification is only ever the emergent statement that every rival was refuted and nothing refuted the claim. A refutation comes with evidence anyone can check. A plain confirmation does not, and that asymmetry is what lets a small checker police a large model.",
      ],
    },
    {
      heading: "When the measurement can't decide",
      body: [
        "The half I care about most is knowing when a measurement could not have decided the question at all. For a real class of instruments this is computable. Given a claim, a named rival, and the physics of the measurement, you can work out how much observation it would have taken to tell them apart.",
        "When that is more than the experiment actually collected, the verdict is a proposal: here is the experiment that would settle it, and here is roughly what it costs. Collect those across a field and you get a ranked, costed queue of the highest-information experiments no one has run yet.",
      ],
    },
    {
      heading: "Why this",
      body: [
        "Every research role I have taken has sat at the same joint, where a number coming off an instrument has to become a claim about the world. A trigger deciding in microseconds what to keep. A network asserting an energy no one will ever measure directly. A spectrum that either is, or is not, that molecule.",
        "A model that is confidently wrong looks exactly like one that is right, until something checks. Automating that check is what makes automating the science worth doing. It is the same instinct that pulls me toward interpretability: get the legible structure out of a system rather than trust it because it sounds right.",
      ],
    },
    {
      heading: "What's built so far",
      body: [
        "The first benchmark is public: the code, the verified label data, and every computed result behind it.",
        "The first compiled check found that 10 of the 42 deposited structure files describe an ordered phase while carrying mixed or fractional site occupancy, a contradiction you can see by opening the files. A computed distinguishability score, how much counting it would take to tell a claimed structure from its disordered rival, lines up with the difficulty judgments the expert critics reached independently. Standard fit quality turns out to be uncorrelated with their verdicts, so a good fit was never evidence either way. A sealed, contamination-checked model, given only a claim and its file, wrote claim-against-file checks on its own, including for a compound that never existed.",
        "From here the same machinery extends outward: more checks, a second measurement class, and the ranked, costed queue of experiments that the abstentions produce.",
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
