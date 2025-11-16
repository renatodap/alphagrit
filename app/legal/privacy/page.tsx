import { Metadata } from 'next'
import { Container, Section, Stack } from '@/components/ui/layout'
import { Display, Heading, Text } from '@/components/ui/typography'
import { Card, CardContent } from '@/components/ui/card'
import { SEO, APP_NAME, CONTACT } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'
import { tokens } from '@/lib/design-tokens'

export const metadata: Metadata = {
  title: `Privacy Policy - ${SEO.DEFAULT_TITLE}`,
  description: 'How Alpha Grit collects, uses, and protects your personal information.',
}

async function getLastUpdated() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('site_config')
    .select('value')
    .eq('key', 'legal_privacy_updated')
    .single()

  if (data?.value) {
    try {
      const dateValue = typeof data.value === 'string' ? JSON.parse(data.value) : data.value
      return new Date(dateValue).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch {
      return new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    }
  }

  return new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function PrivacyPage() {
  const lastUpdated = await getLastUpdated()

  return (
    <Container>
      {/* Hero Section */}
      <Section spacing="xl">
        <Stack gap="lg" align="center">
          <Display size="lg" className="text-center">
            Privacy Policy
          </Display>

          <Text color="muted" align="center">
            Last Updated: {lastUpdated}
          </Text>
        </Stack>
      </Section>

      {/* Content */}
      <Section spacing="xl">
        <article
          style={{
            maxWidth: '800px',
            margin: '0 auto',
          }}
        >
          <Stack gap="2xl">
            <Card>
              <CardContent>
                <Stack gap="lg">
                  <Heading level="h2">1. Introduction</Heading>
                  <Text>
                    At {APP_NAME}, we take your privacy seriously. This Privacy Policy explains how we collect,
                    use, disclose, and safeguard your information when you visit our website and use our services.
                  </Text>
                  <Text>
                    By using our website, you agree to the collection and use of information in accordance with
                    this policy.
                  </Text>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Stack gap="lg">
                  <Heading level="h2">2. Information We Collect</Heading>
                  <Heading level="h3">Personal Information</Heading>
                  <Text>
                    We collect information that you provide directly to us, including:
                  </Text>
                  <ul
                    style={{
                      marginLeft: tokens.spacing.lg,
                      color: tokens.colors.neutral[700],
                    }}
                  >
                    <li>Name and email address (when creating an account)</li>
                    <li>Payment information (processed securely through Stripe or Mercado Pago)</li>
                    <li>Profile information (optional avatar, preferences)</li>
                    <li>Order history and download records</li>
                    <li>Communication preferences</li>
                  </ul>

                  <Heading level="h3">Usage Information</Heading>
                  <Text>
                    We automatically collect certain information about your device and how you interact with our website:
                  </Text>
                  <ul
                    style={{
                      marginLeft: tokens.spacing.lg,
                      color: tokens.colors.neutral[700],
                    }}
                  >
                    <li>Browser type and version</li>
                    <li>Device information</li>
                    <li>IP address</li>
                    <li>Pages visited and time spent on pages</li>
                    <li>Referral sources</li>
                  </ul>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Stack gap="lg">
                  <Heading level="h2">3. How We Use Your Information</Heading>
                  <Text>
                    We use the information we collect to:
                  </Text>
                  <ul
                    style={{
                      marginLeft: tokens.spacing.lg,
                      color: tokens.colors.neutral[700],
                    }}
                  >
                    <li>Process your orders and deliver products</li>
                    <li>Manage your account and provide customer support</li>
                    <li>Send you order confirmations and download links</li>
                    <li>Communicate with you about products, services, and updates</li>
                    <li>Improve our website and services</li>
                    <li>Prevent fraud and enhance security</li>
                    <li>Comply with legal obligations</li>
                    <li>Analyze usage patterns and optimize user experience</li>
                  </ul>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Stack gap="lg">
                  <Heading level="h2">4. Information Sharing and Disclosure</Heading>
                  <Text>
                    We do not sell your personal information. We may share your information with:
                  </Text>

                  <Heading level="h3">Service Providers</Heading>
                  <ul
                    style={{
                      marginLeft: tokens.spacing.lg,
                      color: tokens.colors.neutral[700],
                    }}
                  >
                    <li><strong>Supabase:</strong> Database and authentication services</li>
                    <li><strong>Stripe:</strong> Payment processing</li>
                    <li><strong>Mercado Pago:</strong> Payment processing (if enabled)</li>
                    <li><strong>Email service providers:</strong> For transactional emails</li>
                  </ul>

                  <Heading level="h3">Legal Requirements</Heading>
                  <Text>
                    We may disclose your information if required by law or in response to valid requests by
                    public authorities.
                  </Text>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Stack gap="lg">
                  <Heading level="h2">5. Data Security</Heading>
                  <Text>
                    We implement industry-standard security measures to protect your personal information:
                  </Text>
                  <ul
                    style={{
                      marginLeft: tokens.spacing.lg,
                      color: tokens.colors.neutral[700],
                    }}
                  >
                    <li>SSL/TLS encryption for all data transmission</li>
                    <li>Secure authentication with Supabase</li>
                    <li>Payment information handled exclusively by PCI-compliant processors</li>
                    <li>Regular security audits and updates</li>
                    <li>Access controls and monitoring</li>
                  </ul>
                  <Text>
                    However, no method of transmission over the Internet is 100% secure. While we strive to
                    protect your information, we cannot guarantee absolute security.
                  </Text>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Stack gap="lg">
                  <Heading level="h2">6. Your Rights and Choices</Heading>
                  <Text>
                    You have the right to:
                  </Text>
                  <ul
                    style={{
                      marginLeft: tokens.spacing.lg,
                      color: tokens.colors.neutral[700],
                    }}
                  >
                    <li><strong>Access:</strong> Request a copy of your personal information</li>
                    <li><strong>Update:</strong> Correct inaccurate or incomplete information</li>
                    <li><strong>Delete:</strong> Request deletion of your account and data</li>
                    <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                    <li><strong>Data portability:</strong> Receive your data in a portable format</li>
                  </ul>
                  <Text>
                    To exercise these rights, contact us at {CONTACT.EMAIL}.
                  </Text>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Stack gap="lg">
                  <Heading level="h2">7. Cookies and Tracking Technologies</Heading>
                  <Text>
                    We use cookies and similar technologies to:
                  </Text>
                  <ul
                    style={{
                      marginLeft: tokens.spacing.lg,
                      color: tokens.colors.neutral[700],
                    }}
                  >
                    <li>Keep you logged in</li>
                    <li>Remember your preferences</li>
                    <li>Understand how you use our website</li>
                    <li>Improve website performance</li>
                  </ul>
                  <Text>
                    You can control cookies through your browser settings. Note that disabling cookies may
                    affect website functionality.
                  </Text>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Stack gap="lg">
                  <Heading level="h2">8. Data Retention</Heading>
                  <Text>
                    We retain your information for as long as necessary to:
                  </Text>
                  <ul
                    style={{
                      marginLeft: tokens.spacing.lg,
                      color: tokens.colors.neutral[700],
                    }}
                  >
                    <li>Provide our services</li>
                    <li>Comply with legal obligations</li>
                    <li>Resolve disputes</li>
                    <li>Enforce our agreements</li>
                  </ul>
                  <Text>
                    When you request account deletion, we will remove your personal information within 30 days,
                    except where retention is required by law.
                  </Text>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Stack gap="lg">
                  <Heading level="h2">9. Children&apos;s Privacy</Heading>
                  <Text>
                    Our services are not directed to individuals under 18 years of age. We do not knowingly
                    collect personal information from children.
                  </Text>
                  <Text>
                    If you are a parent or guardian and believe your child has provided us with personal
                    information, please contact us immediately.
                  </Text>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Stack gap="lg">
                  <Heading level="h2">10. International Data Transfers</Heading>
                  <Text>
                    Your information may be transferred to and processed in countries other than your country
                    of residence. These countries may have different data protection laws.
                  </Text>
                  <Text>
                    We ensure appropriate safeguards are in place to protect your information in accordance
                    with this Privacy Policy.
                  </Text>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Stack gap="lg">
                  <Heading level="h2">11. Changes to This Privacy Policy</Heading>
                  <Text>
                    We may update this Privacy Policy from time to time. We will notify you of any changes by
                    posting the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date.
                  </Text>
                  <Text>
                    We encourage you to review this Privacy Policy periodically for any changes.
                  </Text>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Stack gap="lg">
                  <Heading level="h2">12. Contact Us</Heading>
                  <Text>
                    If you have questions about this Privacy Policy or our privacy practices, please contact us:
                  </Text>
                  <div
                    style={{
                      padding: tokens.spacing.md,
                      backgroundColor: tokens.colors.neutral[100],
                      borderRadius: tokens.borderRadius.md,
                    }}
                  >
                    <Text>Email: {CONTACT.EMAIL}</Text>
                    <Text>WhatsApp: {CONTACT.WHATSAPP}</Text>
                  </div>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </article>
      </Section>
    </Container>
  )
}
