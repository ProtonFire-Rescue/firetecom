import { Body, Button, Container, Head, Heading, Html, Preview, Section, Text, Hr } from 'react-email'

interface ContactEmailProps {
  name: string
  email: string
  phone?: string
  message: string
}

// ─── Design tokens (alineados con ProductQuoteEmail) ──────────────────────────
const brand = '#c9202a'
const fontFamily = "'Quicksand', 'Segoe UI', Helvetica, Arial, sans-serif"

export default function ContactEmail({
  name = 'Usuario de prueba',
  email = 'test@example.com',
  phone = '',
  message = 'Este es un mensaje de prueba',
}: ContactEmailProps) {
  const previewText = `Nuevo mensaje de ${name} — Fire Tecom`
  const waNumber = phone.replace(/[^0-9]/g, '')

  return (
    <Html lang="es" dir="ltr">
      <Head>
        <style>
          {`
            @font-face {
              font-family: 'Quicksand';
              font-style: normal;
              font-weight: 300 700;
              font-display: swap;
              src: url(https://fonts.gstatic.com/s/quicksand/v37/6xKtdSZaM9iE8KbpRA_hK1QN.woff2) format('woff2');
            }
          `}
        </style>
      </Head>
      <Preview>{previewText}</Preview>
      <Body style={mainBody}>
        <Container style={container}>

          <Section style={headerSection}>
            <Text style={logoText}>
              FIRE<span style={{ color: brand }}>TECOM</span>
            </Text>
          </Section>

          <Heading style={heading}>Notificación de contacto</Heading>

          <Text style={textBase}>
            Hola equipo,<br /><br />
            Tienen una nueva solicitud de información desde el formulario web. A continuación se
            detallan los datos enviados:
          </Text>

          <Section style={detailsSection}>
            <Text style={subtitle}>Información del remitente</Text>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td style={detailLabel}>Nombre</td>
                  <td style={detailValue}>{name}</td>
                </tr>
                <tr>
                  <td style={detailLabel}>Email</td>
                  <td style={detailValue}>{email}</td>
                </tr>
                {phone && (
                  <tr>
                    <td style={detailLabel}>Teléfono</td>
                    <td style={detailValue}>{phone}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </Section>

          <Section style={messageContainer}>
            <Text style={subtitle}>Mensaje</Text>
            <Text style={messageText}>"{message}"</Text>
          </Section>

          {waNumber && (
            <Section style={ctaContainer}>
              <Button style={ctaButton} href={`https://wa.me/${waNumber}`}>
                Responder en WhatsApp
              </Button>
            </Section>
          )}

          <Hr style={hr} />

          <Text style={footerText}>
            Este correo es generado automáticamente por la plataforma web de Fire Tecom.<br />
            Por favor no responda a este email directamente.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const mainBody = {
  backgroundColor: '#f9fafb',
  margin: 'auto',
  fontFamily,
  color: '#111827',
  padding: '60px 20px',
}

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #f3f4f6',
  margin: '0 auto',
  padding: '48px 40px',
  maxWidth: '600px',
  borderRadius: '16px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
}

const headerSection = {
  marginBottom: '32px',
  textAlign: 'center' as const,
}

const logoText = {
  fontSize: '24px',
  fontWeight: 700,
  letterSpacing: '2px',
  margin: '0',
  color: '#111827',
  fontFamily,
}

const heading = {
  fontSize: '20px',
  color: '#111827',
  fontWeight: 600,
  textAlign: 'center' as const,
  padding: '0',
  margin: '0 0 32px 0',
  letterSpacing: '0.5px',
  fontFamily,
}

const textBase = {
  fontSize: '15px',
  color: '#4b5563',
  lineHeight: '26px',
  margin: '0 0 24px 0',
  fontFamily,
}

const detailsSection = {
  marginBottom: '32px',
}

const subtitle = {
  fontSize: '11px',
  fontWeight: 600,
  color: '#9ca3af',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
  margin: '0 0 16px 0',
  fontFamily,
}

const detailLabel = {
  color: '#6b7280',
  width: '100px',
  fontSize: '14px',
  padding: '8px 0',
  borderBottom: '1px solid #f3f4f6',
  fontFamily,
}

const detailValue = {
  color: '#111827',
  fontSize: '14px',
  padding: '8px 0',
  fontWeight: 600,
  borderBottom: '1px solid #f3f4f6',
  fontFamily,
}

const messageContainer = {
  padding: '24px',
  backgroundColor: '#f9fafb',
  borderRadius: '10px',
  borderLeft: `3px solid ${brand}`,
  marginBottom: '32px',
}

const messageText = {
  fontSize: '15px',
  color: '#4b5563',
  fontStyle: 'italic',
  lineHeight: '26px',
  margin: 0,
  fontFamily,
}

const ctaContainer = {
  textAlign: 'center' as const,
  margin: '48px 0 32px 0',
}

const ctaButton = {
  padding: '16px 36px',
  backgroundColor: '#25D366',
  borderRadius: '999px',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: 600,
  textDecoration: 'none',
  textAlign: 'center' as const,
  letterSpacing: '0.5px',
  fontFamily,
}

const hr = {
  border: 'none',
  borderTop: '1px solid #f3f4f6',
  margin: '0 0 24px 0',
}

const footerText = {
  textAlign: 'center' as const,
  fontSize: '12px',
  color: '#9ca3af',
  lineHeight: '18px',
  margin: '0',
  fontFamily,
}
