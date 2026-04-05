import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), sitemap()],
  site: 'https://clover-babymap.netlify.app',
  outDir: './dist',
  output: 'static',
  adapter: netlify(),
});
