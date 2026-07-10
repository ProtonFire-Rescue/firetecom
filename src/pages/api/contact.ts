import type { APIRoute } from 'astro'
import { Resend } from 'resend'
import { z } from 'zod'
import { render } from 'react-email'
import ContactEmail from '../../emails/ContactEmail'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
})

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json()
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return new Response(JSON.stringify({ error: 'Invalid data' }), { status: 400 })
  }

  const { name, email, message } = parsed.data
  const resend = new Resend(import.meta.env.RESEND_API_KEY)

  const html = await render(ContactEmail({ name, email, message }))

  const { error } = await resend.emails.send({
    from: 'Contact Form <onboarding@resend.dev>',
    to: import.meta.env.CONTACT_EMAIL,
    subject: `New message from ${name}`,
    html,
  })

  if (error) {
    return new Response(JSON.stringify({ error: 'Failed to send email' }), { status: 500 })
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 })
}
