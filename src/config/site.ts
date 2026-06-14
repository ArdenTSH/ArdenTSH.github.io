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
    "I'm heading to Cambridge for the MASt in Astrophysics. My path — computational materials, particle-physics machine learning, now theoretical cosmology — follows one thread: encode the symmetry, and what's left over is the physics. Right now I'm asking whether cosmological-collider signatures survive into the gravitational-wave background, where PTA and LISA might one day reach them. Alongside physics, I write on AI safety.",
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
  { label: "Google Scholar", href: "#", icon: "tabler:school" },
  { label: "Inspire HEP", href: "#", icon: "tabler:atom" },
  { label: "ORCID", href: "#", icon: "tabler:id" },
  { label: "LinkedIn", href: "#", icon: "tabler:brand-linkedin" },
  { label: "GitHub", href: "#", icon: "tabler:brand-github" },
];
