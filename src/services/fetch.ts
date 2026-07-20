/**
 * Strapi data layer
 *
 * Wrapper sobre fetch con caché en memoria + deduplicación de requests
 * concurrentes. Optimizado para SSG (build time) y dev server.
 *
 * Beneficios:
 * - Cache TTL: el mismo dato no se refetchea dentro del intervalo
 * - Single-flight: si N páginas piden el mismo dato a la vez, solo 1 fetch real ocurre
 * - SSR/Dev/Build friendly: funciona en todos los modos de Astro
 */

import { workerEnv } from './runtime-env';

/** Marca cuyos datos consume este sitio (filtro `personal_brands[nombre]`) */
const PERSONAL_BRAND = 'Telcom';

/**
 * Resuelve la URL del backend de Strapi.
 *
 * Orden de precedencia:
 *  1. `opts.baseUrl` explícito.
 *  2. Runtime env de Workers (si se define VITE_STRAPI_URL como var de wrangler).
 *  3. `import.meta.env.VITE_STRAPI_URL` — inlineado en build desde `.env` (dev/prod).
 *  4. localhost por defecto.
 *
 * Los parámetros `astro`/`context` se mantienen por compatibilidad con las
 * llamadas existentes, pero ya no se usan para resolver el env (el acceso a
 * `Astro.locals.runtime.env` fue removido en Astro v6).
 */
export function resolveBackendUrl(opts?: { baseUrl?: string; astro?: any; context?: any }) {
  return (opts?.baseUrl ??
    workerEnv('VITE_STRAPI_URL') ??
    import.meta.env.VITE_STRAPI_URL ??
    'http://localhost:1337') as string;
}


// ─── Cache infrastructure ────────────────────────────────────────────────────

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry<unknown>>();
const inFlight = new Map<string, Promise<unknown>>();

/** TTL en ms: ajusta según qué tan dinámicos son tus datos */
const TTL = {
  /** 5 minutos — productos (pueden cambiar más seguido) */
  products: 5 * 60_000,
  /** 1 hora — categorías, tipos, marcas (cambian poco) */
  taxonomy: 60 * 60_000,
} as const;

/**
 * Wrapper genérico: hace fetch solo si no hay caché válido y deduplica
 * llamadas concurrentes con la misma key.
 */
async function cachedFetch<T>(key: string, ttl: number, fetcher: () => Promise<T>): Promise<T> {
  // 1. ¿Hay caché vigente?
  const entry = cache.get(key) as CacheEntry<T> | undefined;
  if (entry && entry.expiresAt > Date.now()) {
    return entry.data;
  }

  // 2. ¿Ya hay un fetch en vuelo para esta key? Espera a ese (single-flight).
  const pending = inFlight.get(key) as Promise<T> | undefined;
  if (pending) return pending;

  // 3. Lanza nuevo fetch y registra como in-flight.
  const promise = fetcher()
    .then((data) => {
      cache.set(key, { data, expiresAt: Date.now() + ttl });
      return data;
    })
    .finally(() => {
      inFlight.delete(key);
    });

  inFlight.set(key, promise);
  return promise;
}

/**
 * Fetch tipado contra Strapi con manejo de errores básico.
 */
async function strapiFetch<T = any>(endpoint: string, url: string): Promise<T> {
  const fullUrl = `${url}${endpoint}`;
  const res = await fetch(fullUrl);
  if (!res.ok) {
    throw new Error(`Strapi ${res.status} ${res.statusText} — ${fullUrl}`);
  }
  return res.json();
}

interface StrapiPaginatedResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

/**
 * Auto-paginate: recorre todas las páginas de un endpoint Strapi y devuelve
 * la unión de `data`. Útil cuando el dataset puede exceder `pageSize` (default 100).
 *
 * El `endpoint` debe NO incluir parámetros `pagination[...]` — los agrega esta función.
 */
async function strapiFetchAll<T = any>(
  endpoint: string,
  url: string,
  pageSize = 100,
): Promise<StrapiPaginatedResponse<T>> {
  const sep = endpoint.includes('?') ? '&' : '?';
  const first = await strapiFetch<StrapiPaginatedResponse<T>>(
    `${endpoint}${sep}pagination[page]=1&pagination[pageSize]=${pageSize}`,
    url,
  );

  const pageCount = first.meta?.pagination?.pageCount ?? 1;
  if (pageCount <= 1) return first;

  const remaining = await Promise.all(
    Array.from({ length: pageCount - 1 }, (_, i) =>
      strapiFetch<StrapiPaginatedResponse<T>>(
        `${endpoint}${sep}pagination[page]=${i + 2}&pagination[pageSize]=${pageSize}`,
        url,
      ),
    ),
  );

  return {
    data: [first.data, ...remaining.map((r) => r.data)].flat(),
    meta: {
      pagination: {
        ...first.meta.pagination,
        page: 1,
        pageCount,
      },
    },
  };
}

/** Invalida el caché manualmente (útil tras mutaciones o en tests) */
export function invalidateCache(key?: string): void {
  if (key) cache.delete(key);
  else cache.clear();
}

// ─── Public API ──────────────────────────────────────────────────────────────

type FetchOpts = Parameters<typeof resolveBackendUrl>[0];

export async function getProducts(opts?: FetchOpts) {
  const url = resolveBackendUrl(opts);
  const endpoint =
    '/api/productos?fields[0]=name&fields[1]=description&fields[2]=slug&fields[3]=Genero' +
    '&populate[images][fields][0]=url&populate[images][fields][1]=alternativeText' +
    '&populate[brand][fields][0]=name&populate[categories][fields][0]=name' +
    '&populate[model][fields][0]=name&populate[type][fields][0]=name' +
    '&populate[certifications][fields][0]=name&populate[certifications][fields][1]=description' +
    `&filters[personal_brands][nombre]=${PERSONAL_BRAND}`;
  return cachedFetch(`products:${endpoint}`, TTL.products, () => strapiFetchAll(endpoint, url));
}

export async function getCategories(opts?: FetchOpts) {
  const url = resolveBackendUrl(opts);
  const endpoint =
    `/api/categories?filters[personal_brands][nombre]=${PERSONAL_BRAND}` +
    '&populate[mediaCategory][fields][0]=name&populate[mediaCategory][fields][1]=url';
  return cachedFetch(`categories:${endpoint}`, TTL.taxonomy, () => strapiFetchAll(endpoint, url));
}

export async function getTypes(opts?: FetchOpts) {
  const url = resolveBackendUrl(opts);
  const endpoint =
    `/api/types?filters[personal_brands][nombre]=${PERSONAL_BRAND}&fields[0]=name` +
    '&populate[reference_image][fields][0]=url';
  return cachedFetch(`types:${endpoint}`, TTL.taxonomy, () => strapiFetchAll(endpoint, url));
}

export async function getBrands(opts?: FetchOpts) {
  const url = resolveBackendUrl(opts);
  const endpoint = '/api/brands?fields[0]=name&populate[image][fields][0]=url';
  return cachedFetch(`brands:${endpoint}`, TTL.taxonomy, () => strapiFetchAll(endpoint, url));
}
