import { env } from 'cloudflare:workers'

/**
 * Lee una variable del runtime de Cloudflare Workers (secrets definidos con
 * `wrangler secret put` y `vars` de wrangler.jsonc).
 *
 * En Workers, `import.meta.env` NO contiene los secrets en runtime — solo tiene
 * los valores inlineados en build. Los secrets viven en el `env` que expone
 * `cloudflare:workers` (reemplaza al removido `Astro.locals.runtime.env`).
 *
 * Devuelve `undefined` fuera de un contexto de request o si la variable no está
 * definida. Combínala con un fallback a `import.meta.env.<KEY>` (acceso ESTÁTICO,
 * para que Vite lo inyecte en desarrollo local desde `.env`):
 *
 *   const key = workerEnv('RESEND_API_KEY') ?? import.meta.env.RESEND_API_KEY
 */
export function workerEnv(key: string): string | undefined {
  try {
    const value = (env as Record<string, unknown>)[key]
    return typeof value === 'string' && value.length > 0 ? value : undefined
  } catch {
    // Fuera de un request (p. ej. evaluación de módulo) el proxy puede lanzar.
    return undefined
  }
}
