import type { APIRoute } from 'astro'
import { getProducts } from '../services/fetch'

// SSR: se genera en cada request (no en build). Necesario porque las URLs de
// producto vienen de la API de Strapi y no existen como rutas estáticas.
export const prerender = false

/** Escapa los caracteres reservados en XML dentro de una <loc>. */
function xmlEscape(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Construye la ruta de un producto EXACTAMENTE como la arma el catálogo
 * (src/pages/catalogo/index.astro), para que la URL del sitemap coincida con
 * los enlaces internos y con la canonical, evitando contenido duplicado.
 *
 *   /catalogo/{categoria-slug}/{nombre}
 */
function productPath(product: any): string | null {
  const category = product?.categories?.[0]?.name
  const name = product?.name
  if (!category || !name) return null

  const tipo = category.toLowerCase().replace(' ', '-')
  // encodeURI conserva "/" y codifica espacios/acentos igual que hace el navegador
  // al seguir el <a href> del catálogo, manteniendo la coherencia de URL.
  return encodeURI(`/catalogo/${tipo}/${name}`)
}

export const GET: APIRoute = async (context) => {
  const site = context.site?.toString().replace(/\/$/, '') ?? 'https://firetecom.com.ec'

  // Páginas estáticas del sitio. Cada entrada: [ruta, prioridad, frecuencia].
  const staticEntries: Array<[string, string, string]> = [
    ['/', '1.0', 'weekly'],
    ['/productos', '0.8', 'monthly'],
    ['/catalogo', '0.9', 'weekly'],
    ['/contacto', '0.6', 'yearly'],
  ]

  const urls: string[] = []

  for (const [path, priority, changefreq] of staticEntries) {
    urls.push(
      `<url><loc>${xmlEscape(site + path)}</loc>` +
        `<changefreq>${changefreq}</changefreq>` +
        `<priority>${priority}</priority></url>`,
    )
  }

  // Productos desde la API. Si el fetch falla, degradamos con gracia: el sitemap
  // sigue siendo válido con las páginas estáticas en lugar de devolver un 500.
  try {
    const { data: products } = await getProducts({ context })
    for (const product of products) {
      const path = productPath(product)
      if (!path) continue
      urls.push(
        `<url><loc>${xmlEscape(site + path)}</loc>` +
          `<changefreq>weekly</changefreq>` +
          `<priority>0.7</priority></url>`,
      )
    }
  } catch (err) {
    console.error('[sitemap] No se pudieron cargar los productos:', err)
  }

  const body =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.join('\n') +
    '\n</urlset>\n'

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      // Cache en el edge de Cloudflare: sirve rápido y refresca cada hora.
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
    },
  })
}
