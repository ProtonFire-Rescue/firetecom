import type { APIRoute } from 'astro'
import { Resend } from 'resend'
import { z } from 'zod'
import { render } from 'react-email'
import ProductQuoteEmail from '../../emails/ProductQuoteEmail'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  productName: z.string().min(1),
  productModel: z.string().optional(),
  productUrl: z.string().optional(),
})

const json = (data: unknown, status: number) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

// En desarrollo devolvemos el detalle del error para poder diagnosticar.
// En producción nunca exponemos internals al cliente.
const withDetail = (message: string, detail?: unknown) =>
  import.meta.env.DEV && detail
    ? { error: message, detail: detail instanceof Error ? detail.message : detail }
    : { error: message }

export const POST: APIRoute = async ({ request }) => {
  try {
    // 1) Parseo del body (puede venir malformado)
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return json({ error: 'Solicitud inválida.' }, 400)
    }

    // 2) Validación de datos
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return json({ error: 'Datos inválidos. Revisa el formulario e intenta de nuevo.' }, 400)
    }

    // 3) Configuración del servidor (env vars). Si faltan, es un error nuestro,
    //    no del usuario: respondemos 503 con un mensaje claro y lo dejamos en logs.
    const apiKey = import.meta.env.RESEND_API_KEY
    const to = import.meta.env.CONTACT_EMAIL
    if (!apiKey || !to) {
      const missing = [!apiKey && 'RESEND_API_KEY', !to && 'CONTACT_EMAIL'].filter(Boolean).join(', ')
      console.error('[product-quote] Falta configuración de correo:', missing)
      return json(
        withDetail(
          'El servicio de correo no está disponible en este momento. Intenta más tarde.',
          `Variables de entorno vacías: ${missing}`
        ),
        503
      )
    }

    // 4) Envío
    const { name, email, phone, productName, productModel, productUrl } = parsed.data
    const resend = new Resend(apiKey)
    const html = await render(
      ProductQuoteEmail({ name, email, phone, productName, productModel, productUrl })
    )

    const { error } = await resend.emails.send({
      from: 'Cotizaciones <onboarding@mail.protonfire.com>',
      to,
      replyTo: email,
      subject: `Cotización: ${productName} — ${name}`,
      html,
    })

    if (error) {
      console.error('[product-quote] Resend devolvió un error:', error)
      return json(withDetail('No se pudo enviar la solicitud. Intenta de nuevo.', error), 502)
    }

    return json({ success: true }, 200)
  } catch (err) {
    // Cualquier fallo inesperado: nunca dejamos que reviente en la página del framework.
    console.error('[product-quote] Error inesperado:', err)
    return json(withDetail('Ocurrió un error inesperado. Intenta de nuevo más tarde.', err), 500)
  }
}
