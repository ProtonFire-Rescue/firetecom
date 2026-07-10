# Firetecom — sitio web

Sitio construido con [Astro](https://astro.build), React, Tailwind CSS y desplegado en Cloudflare Workers.

## Estructura del proyecto

```text
/
├── public/                  # assets estáticos (favicon, robots.txt, imágenes)
├── src/
│   ├── components/
│   │   ├── ui/               # componentes de UI reutilizables (botones, cards, inputs...)
│   │   └── sections/         # secciones de página (Hero, Servicios, Contacto...)
│   ├── layouts/               # layouts base (Layout.astro)
│   ├── pages/                 # rutas del sitio (file-based routing)
│   │   └── api/                # endpoints de servidor (ej. contact.ts)
│   ├── emails/                 # plantillas de correo (react-email)
│   └── styles/                 # estilos globales / Tailwind
└── package.json
```

Las secciones y componentes de UI se van completando a medida que se traducen los diseños de Figma (vía el MCP de Figma en Cursor) — ver skill `design-system` en `.claude/skills/`.

## Comandos

Todos los comandos se corren desde la raíz del proyecto:

| Comando           | Acción                                           |
| :----------------- | :----------------------------------------------- |
| `pnpm install`      | Instala dependencias                              |
| `pnpm dev`          | Levanta el servidor local en `localhost:4321`     |
| `pnpm build`        | Compila el sitio de producción en `./dist/`       |
| `pnpm preview`      | Previsualiza el build localmente antes de desplegar |
| `pnpm astro ...`    | Corre comandos del CLI de Astro (`astro add`, `astro check`) |

## Skills de proyecto (Claude Code)

Este repo define skills locales en `.claude/skills/` (no versionadas, ver `.gitignore`) para mantener consistencia en:

- **design-system** — traducir diseños de Figma a componentes Astro/React/Tailwind.
- **code-quality** — checklist de calidad específico del stack (Astro + React + TS + Cloudflare).
- **seo-technical** — robots.txt, sitemap, metadatos y datos estructurados.
- **web-security** — seguridad del formulario de contacto, rutas API y secrets en Cloudflare.

## Despliegue

El sitio corre sobre Cloudflare Workers (`@astrojs/cloudflare`). Los secrets (ej. `RESEND_API_KEY`) se configuran con:

```sh
pnpm wrangler secret put RESEND_API_KEY
```
