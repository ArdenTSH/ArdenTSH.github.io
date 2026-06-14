// ─────────────────────────────────────────────────────────────────────────────
//  SITE CONTENT — edit your copy here. This is the single place for the text
//  that isn't a blog post (blog posts live as markdown in src/content/writing/).
//  Change a value, save, and the site updates.
// ─────────────────────────────────────────────────────────────────────────────

export const site = {
  name: "Arden Tsang",
  // Small mono kicker above the name on the home hero.
  eyebrow: "Theoretical & computational physics",
  // One-line identity — the home hero lead.
  tagline: "Symmetry and computation, from quantum materials to cosmology.",
  // The home hero paragraph: who you are, in a few honest sentences.
  intro:
    "I'm heading to Cambridge for the MASt in Astrophysics, graduating from an undergrad degree in Physics with Theoretical Physics at King's College London, with the aim to do a PhD in Theoretical Physics. \
    My path: computational materials, particle-physics machine learning, \
    now theoretical cosmology. I am fascinated by the symmetries of nature and how to observe them. Right now I'm looking into the beginning of the unvierse, asking whether \
    cosmological-collider signatures survive into the gravitational-wave background. \
    Alongside physics, I write on AI safety and have a deep interest in interpretability.",
  // Public contact address (used by the dock's Contact links).
  email: "arden.tsang@gmail.com",
};

export interface ResearchArea {
  slug: string;
  label: string;
  short: string; // compact label for the dock's pull-apart
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
    blurb:
      "Inflationary correlators, the cosmological collider, and scalar-induced gravitational waves.",
    icon: "tabler:planet",
  },
  {
    slug: "neutrino",
    label: "Neutrino edge-AI",
    short: "Neutrino",
    blurb: "Quantised CNNs and Edge-TPU triggers for LArTPC detectors.",
    icon: "tabler:cpu",
  },
  {
    slug: "materials",
    label: "Computational materials",
    short: "Materials",
    blurb:
      "Stochastic search and DFT for carbon nanoclusters and atmospheric clusters.",
    icon: "tabler:atom",
  },
  {
    slug: "ai",
    label: "Machine learning & AI safety",
    short: "ML & safety",
    blurb: "Symmetry-preserving models, interpretability, and AI safety.",
    icon: "tabler:shield",
  },
];

export interface ContactLink {
  label: string;
  href: string;
  icon: string;
}

// Contact + profile links (mirrors the CV). Fill in the real URLs — the "#"
// placeholders are intentional until you paste them in.
export const contactLinks: ContactLink[] = [
  { label: "Email", href: `mailto:${site.email}`, icon: "tabler:mail" },
  { label: "Google Scholar", href: "https://scholar.google.co.uk/citations?user=yJ3dzdAAAAAJ&hl=en", icon: "tabler:school" },
  { label: "Inspire HEP", href: "https://inspirehep.net/authors/3136464", icon: "tabler:atom" },
  { label: "ORCID", href: "https://orcid.org/0009-0008-0782-5394", icon: "tabler:id" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/arden-tsang-22224b2a0/", icon: "tabler:brand-linkedin" },
  { label: "GitHub", href: "https://github.com/ArdenTSH", icon: "tabler:brand-github" },
];
