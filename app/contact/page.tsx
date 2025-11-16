import { Metadata } from 'next'
import Link from 'next/link'
import { Container, Section, Stack, Inline } from '@/components/ui/layout'
import { Display, Heading, Text } from '@/components/ui/typography'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SEO, CONTACT } from '@/lib/constants'
import { tokens } from '@/lib/design-tokens'
import { createClient } from '@/lib/supabase/server'
import ContactForm from './contact-form'

export const metadata: Metadata = {
  title: `Contact - ${SEO.DEFAULT_TITLE}`,
  description: 'Get in touch with Alpha Grit. We\'re here to help you on your transformation journey.',
}

async function getFAQs() {
  const supabase = await createClient()

  const { data: faqs } = await supabase
    .from('faqs')
    .select('*')
    .eq('status', 'active')
    .order('order_index', { ascending: true })

  return faqs || []
}

export default async function ContactPage() {
  const faqs = await getFAQs()

  return (
    <Container>
      {/* Hero Section */}
      <Section spacing="xl">
        <Stack gap="xl" align="center">
          <Display size="lg" gradient="brand" className="text-center">
            Get In Touch
          </Display>

          <Text
            size="xl"
            color="muted"
            align="center"
            className="max-w-3xl"
          >
            Have questions? We&apos;re here to help you on your transformation journey.
          </Text>
        </Stack>
      </Section>

      {/* Contact Methods */}
      <Section spacing="xl">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: tokens.spacing.xl,
            marginBottom: tokens.spacing['2xl'],
          }}
        >
          {/* WhatsApp */}
          <Card>
            <CardHeader>
              <div
                style={{
                  fontSize: tokens.fontSize['4xl'],
                  marginBottom: tokens.spacing.md,
                }}
              >
                💬
              </div>
              <CardTitle>WhatsApp</CardTitle>
            </CardHeader>
            <CardContent>
              <Stack gap="md">
                <Text color="muted">
                  Fastest way to reach us. We typically respond within a few hours.
                </Text>
                <a
                  href={CONTACT.WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
                    backgroundColor: tokens.colors.primary[500],
                    color: 'white',
                    borderRadius: tokens.borderRadius.md,
                    textDecoration: 'none',
                    fontWeight: tokens.fontWeight.medium,
                    transition: `all ${tokens.transitions.base}`,
                  }}
                >
                  Chat on WhatsApp
                </a>
                <Text size="sm" color="muted">
                  {CONTACT.WHATSAPP}
                </Text>
              </Stack>
            </CardContent>
          </Card>

          {/* Email */}
          <Card>
            <CardHeader>
              <div
                style={{
                  fontSize: tokens.fontSize['4xl'],
                  marginBottom: tokens.spacing.md,
                }}
              >
                ✉️
              </div>
              <CardTitle>Email</CardTitle>
            </CardHeader>
            <CardContent>
              <Stack gap="md">
                <Text color="muted">
                  For detailed inquiries, partnerships, or support requests.
                </Text>
                <a
                  href={`mailto:${CONTACT.EMAIL}`}
                  style={{
                    display: 'inline-block',
                    padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
                    backgroundColor: tokens.colors.neutral[900],
                    color: 'white',
                    borderRadius: tokens.borderRadius.md,
                    textDecoration: 'none',
                    fontWeight: tokens.fontWeight.medium,
                    transition: `all ${tokens.transitions.base}`,
                  }}
                >
                  Send Email
                </a>
                <Text size="sm" color="muted">
                  {CONTACT.EMAIL}
                </Text>
              </Stack>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Contact Form */}
      <Section spacing="xl">
        <Stack gap="lg">
          <Heading level="h2" align="center">
            Send Us a Message
          </Heading>

          <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
            <ContactForm />
          </div>
        </Stack>
      </Section>

      {/* FAQ Section */}
      {faqs.length > 0 && (
        <Section spacing="xl">
          <Stack gap="2xl">
            <Heading level="h2" align="center">
              Frequently Asked Questions
            </Heading>

            <div
              style={{
                maxWidth: '800px',
                margin: '0 auto',
                width: '100%',
              }}
            >
              <Stack gap="lg">
                {faqs.map((faq: any) => (
                  <Card key={faq.id}>
                    <CardHeader>
                      <CardTitle>{faq.question}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Text color="muted">{faq.answer}</Text>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </div>

            <div
              style={{
                textAlign: 'center',
                marginTop: tokens.spacing.xl,
              }}
            >
              <Text color="muted">
                Still have questions?{' '}
                <a
                  href={CONTACT.WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: tokens.colors.primary[500],
                    textDecoration: 'none',
                    fontWeight: tokens.fontWeight.medium,
                  }}
                >
                  Chat with us on WhatsApp
                </a>
              </Text>
            </div>
          </Stack>
        </Section>
      )}

      {/* Business Hours */}
      <Section spacing="xl">
        <Card>
          <CardHeader>
            <CardTitle>Support Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <Stack gap="md">
              <Text>
                We&apos;re available to assist you during the following hours:
              </Text>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  gap: `${tokens.spacing.sm} ${tokens.spacing.lg}`,
                  maxWidth: '400px',
                }}
              >
                <Text style={{ fontWeight: tokens.fontWeight.medium }}>Monday - Friday:</Text>
                <Text color="muted">9:00 AM - 6:00 PM EST</Text>

                <Text style={{ fontWeight: tokens.fontWeight.medium }}>Saturday:</Text>
                <Text color="muted">10:00 AM - 4:00 PM EST</Text>

                <Text style={{ fontWeight: tokens.fontWeight.medium }}>Sunday:</Text>
                <Text color="muted">Closed</Text>
              </div>
              <Text size="sm" color="muted">
                Messages received outside these hours will be answered on the next business day.
              </Text>
            </Stack>
          </CardContent>
        </Card>
      </Section>
    </Container>
  )
}
