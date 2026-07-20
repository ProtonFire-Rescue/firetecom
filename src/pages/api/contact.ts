import type { APIRoute } from 'astro'
import { Resend } from 'resend'
import { z } from 'zod'
import { render } from 'react-email'
import ContactEmail from '../../emails/ContactEmail'
import { workerEnv } from '../../services/runtime-env'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7).optional(),
  message: z.string().min(10),
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
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return json({ error: 'Solicitud inválida.' }, 400)
    }

    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return json({ error: 'Datos inválidos. Revisa el formulario e intenta de nuevo.' }, 400)
    }

    // En Workers los secrets viven en el runtime env; import.meta.env es el
    // fallback para desarrollo local (lee de .env / .dev.vars).
    const apiKey = workerEnv('RESEND_API_KEY') ?? import.meta.env.RESEND_API_KEY
    const to = workerEnv('CONTACT_EMAIL') ?? import.meta.env.CONTACT_EMAIL
    if (!apiKey || !to) {
      const missing = [!apiKey && 'RESEND_API_KEY', !to && 'CONTACT_EMAIL'].filter(Boolean).join(', ')
      console.error('[contact] Falta configuración de correo:', missing)
      return json(
        withDetail(
          'El servicio de correo no está disponible en este momento. Intenta más tarde.',
          `Variables de entorno vacías: ${missing}`
        ),
        503
      )
    }

    const { name, email, phone, message } = parsed.data
    const resend = new Resend(apiKey)
    const html = await render(ContactEmail({ name, email, phone, message }))

    const { error } = await resend.emails.send({
      from: 'Contact Form <onboarding@mail.protonfire.com>',
      to,
      replyTo: email,
      subject: `New message from ${name}`,
      html,
    })

    if (error) {
      console.error('[contact] Resend devolvió un error:', error)
      return json(withDetail('No se pudo enviar el mensaje. Intenta de nuevo.', error), 502)
    }

    return json({ success: true }, 200)
  } catch (err) {
    console.error('[contact] Error inesperado:', err)
    return json(withDetail('Ocurrió un error inesperado. Intenta de nuevo más tarde.', err), 500)
  }
}
