// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';

// Dominio real de producción. Se usa para canonical URLs, Open Graph y el sitemap.
const SITE_URL = 'https://firetecom.com.ec';

// https://astro.build/config
// Nota: NO usamos @astrojs/sitemap porque el sitio es SSR (output: 'server') y sus
// páginas de producto son dinámicas (vienen de la API de Strapi). Ese integration solo
// lista rutas estáticas conocidas en build, así que dejaría fuera todos los productos.
// En su lugar generamos un sitemap dinámico en src/pages/sitemap.xml.ts.
export default defineConfig({
  site: SITE_URL,
  output: 'server',
  adapter: cloudflare({
    imageService: 'passthrough',

  }),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()]
  }
});