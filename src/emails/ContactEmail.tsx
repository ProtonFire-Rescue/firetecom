import { Html, Head, Body, Container, Heading, Text, Hr } from 'react-email'

interface Props {
  name: string
  email: string
  message: string
}

export default function ContactEmail({ name, email, message }: Props) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#f9fafb', fontFamily: 'sans-serif' }}>
        <Container style={{ maxWidth: '480px', margin: '0 auto', padding: '32px 16px' }}>
          <Heading style={{ fontSize: '20px', marginBottom: '8px' }}>New contact message</Heading>
          <Text style={{ margin: '0 0 4px' }}>
            <strong>From:</strong> {name} ({email})
          </Text>
          <Hr style={{ margin: '16px 0' }} />
          <Text style={{ whiteSpace: 'pre-wrap' }}>{message}</Text>
        </Container>
      </Body>
    </Html>
  )
}
