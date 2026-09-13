// @ts-check
import { defineConfig } from 'astro/config';
import icon from 'astro-icon';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://ardentsh.github.io',
  integrations: [icon(), sitemap()],
  // The cosmology direction was re-scoped to quantum gravity; keep the old URL
  // alive. /cv is retired as a page, but the formatted PDF is still the CV, so
  // the old URL serves that instead of 404ing.
  redirects: {
    '/research/cosmology': '/research/gravity',
    '/cv': '/cv/Arden_Tsang_CV.pdf',
  },
});