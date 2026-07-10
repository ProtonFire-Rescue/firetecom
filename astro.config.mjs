// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

// TODO: reemplazar por el dominio real de producción cuando esté definido
const SITE_URL = 'https://example.com';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  output: 'server',
  adapter: cloudflare(),
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()]
  }
});