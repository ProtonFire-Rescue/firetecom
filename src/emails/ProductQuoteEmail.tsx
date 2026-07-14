import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Row,
  Column,
  Heading,
  Text,
  Hr,
  Link,
  Preview,
} from 'react-email'

interface Props {
  name: string
  email: string
  phone: string
  productName: string
  productModel?: string
  productUrl?: string
}

// ─── Design tokens ────────────────────────────────────────────────────────────
const color = {
  bg: '#f7f7f7',
  card: '#ffffff',
  brand: '#c9202a',
  brandLight: '#fdf1f1',
  text: '#1a1a1a',
  muted: '#6b7280',
  border: '#e5e7eb',
  divider: '#f0f0f0',
  productBg: '#1a1a1a',
}

const font = {
  base: "'Quicksand', 'Segoe UI', Helvetica, Arial, sans-serif",
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <Row>
      <Column style={{ width: '90px', verticalAlign: 'top', paddingTop: '12px' }}>
        <Text
          style={{
            margin: 0,
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase' as const,
            color: color.muted,
            fontFamily: font.base,
          }}
        >
          {label}
        </Text>
      </Column>
      <Column style={{ verticalAlign: 'top', paddingTop: '12px' }}>
        <Text
          style={{
            margin: 0,
            fontSize: '14px',
            fontWeight: 600,
            color: color.text,
            fontFamily: font.base,
          }}
        >
          {value}
        </Text>
      </Column>
    </Row>
  )
}

// ─── Template ─────────────────────────────────────────────────────────────────
export default function ProductQuoteEmail({
  name,
  email,
  phone,
  productName,
  productModel,
  productUrl,
}: Props) {
  const previewText = `${name} solicita una cotización para ${productName}${productModel ? ` (${productModel})` : ''}.`

  return (
    <Html lang="es" dir="ltr">
      <Head>
        {/* Quicksand es una fuente variable: un solo archivo cubre los pesos 300–700.
            El subconjunto "latin" ya incluye acentos y ñ. */}
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

      <Body style={{ backgroundColor: color.bg, margin: 0, padding: '40px 16px', fontFamily: font.base }}>
        <Container style={{ maxWidth: '520px', margin: '0 auto' }}>

          {/* ── Header ── */}
          <Section
            style={{
              backgroundColor: color.brand,
              borderRadius: '16px 16px 0 0',
              padding: '28px 32px',
            }}
          >
            <Text
              style={{
                margin: 0,
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase' as const,
                color: 'rgba(255,255,255,0.65)',
                fontFamily: font.base,
              }}
            >
              Fire Tecom
            </Text>
            <Heading
              as="h1"
              style={{
                margin: '6px 0 0',
                fontSize: '22px',
                fontWeight: 700,
                color: '#ffffff',
                lineHeight: '1.25',
                fontFamily: font.base,
              }}
            >
              Solicitud de cotización
            </Heading>
          </Section>

          {/* ── Card ── */}
          <Section
            style={{
              backgroundColor: color.card,
              borderRadius: '0 0 16px 16px',
              padding: '32px 32px 28px',
              borderLeft: `1px solid ${color.border}`,
              borderRight: `1px solid ${color.border}`,
              borderBottom: `1px solid ${color.border}`,
            }}
          >
            {/* ── Product block ── */}
            <Section
              style={{
                backgroundColor: color.productBg,
                borderRadius: '12px',
                padding: '20px 22px',
                marginBottom: '24px',
              }}
            >
              <Text
                style={{
                  margin: '0 0 2px',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase' as const,
                  color: 'rgba(255,255,255,0.45)',
                  fontFamily: font.base,
                }}
              >
                Producto solicitado
              </Text>
              <Text
                style={{
                  margin: '0',
                  fontSize: '17px',
                  fontWeight: 700,
                  color: '#ffffff',
                  lineHeight: '1.3',
                  fontFamily: font.base,
                }}
              >
                {productName}
              </Text>
              {productModel && (
                <Text
                  style={{
                    margin: '3px 0 0',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: 'rgba(255,255,255,0.55)',
                    fontFamily: font.base,
                  }}
                >
                  Modelo: {productModel}
                </Text>
              )}
              {productUrl && (
                <Text style={{ margin: '12px 0 0', fontFamily: font.base }}>
                  <Link
                    href={productUrl}
                    style={{
                      display: 'inline-block',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: color.brand,
                      textDecoration: 'none',
                      backgroundColor: 'rgba(201,32,42,0.12)',
                      borderRadius: '6px',
                      padding: '5px 12px',
                      fontFamily: font.base,
                    }}
                  >
                    Ver producto →
                  </Link>
                </Text>
              )}
            </Section>

            {/* ── Contact info ── */}
            <Text
              style={{
                margin: '0 0 4px',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase' as const,
                color: color.muted,
                fontFamily: font.base,
              }}
            >
              Datos del solicitante
            </Text>

            <MetaRow label="Nombre" value={name} />
            <Hr style={{ borderColor: color.divider, margin: '4px 0' }} />
            <MetaRow label="Correo" value={email} />
            <Hr style={{ borderColor: color.divider, margin: '4px 0' }} />
            <MetaRow label="Teléfono" value={phone} />
          </Section>

          {/* ── Footer ── */}
          <Text
            style={{
              textAlign: 'center' as const,
              fontSize: '11px',
              color: color.muted,
              margin: '24px 0 0',
              fontFamily: font.base,
            }}
          >
            Este correo fue generado automáticamente por{' '}
            <span style={{ color: color.brand, fontWeight: 600 }}>firetecom.com</span>
          </Text>

        </Container>
      </Body>
    </Html>
  )
}
