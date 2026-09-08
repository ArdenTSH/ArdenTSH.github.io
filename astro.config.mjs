// @ts-check
import { defineConfig } from 'astro/config';
import icon from 'astro-icon';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://ardentsh.github.io',
  integrations: [icon(), sitemap()],
  // The cosmology direction was re-scoped to quantum gravity; keep the old URL alive.
  redirects: { '/research/cosmology': '/research/gravity' },
});