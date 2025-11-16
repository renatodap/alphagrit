import { Metadata } from 'next'
import { Container, Section, Stack } from '@/components/ui/layout'
import { Display, Heading, Text } from '@/components/ui/typography'
import { Card, CardContent } from '@/components/ui/card'
import { SEO, APP_NAME, CONTACT } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'
import { tokens } from '@/lib/design-tokens'

export const metadata: Metadata = {
  title: `Terms of Service - ${SEO.DEFAULT_TITLE}`,
  description: 'Terms and conditions for using Alpha Grit products and services.',
}

async function getLastUpdated() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('site_config')
    .select('value')
    .eq('key', 'legal_terms_updated')
    .single()

  if (data?.value) {
    try {
      // The value is stored as JSON, so we need to parse it
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

export default async function TermsPage() {
  const lastUpdated = await getLastUpdated()

  return (
    <Container>
      {/* Hero Section */}
      <Section spacing="xl">
        <Stack gap="lg" align="center">
          <Display size="lg" className="text-center">
            Terms of Service
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
                  <Heading level="h2">1. Agreement to Terms</Heading>
                  <Text>
                    By accessing and using {APP_NAME}&apos;s website and services, you agree to be bound by these
                    Terms of Service and all applicable laws and regulations. If you do not agree with any part
                    of these terms, you may not use our services.
                  </Text>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Stack gap="lg">
                  <Heading level="h2">2. Products and Services</Heading>
                  <Text>
                    {APP_NAME} provides digital products including e-books, guides, and educational content
                    related to personal development, fitness, and lifestyle transformation.
                  </Text>
                  <Text>
                    All products are delivered digitally. Physical products, if offered, will be clearly
                    marked and subject to shipping terms outlined at the time of purchase.
                  </Text>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Stack gap="lg">
                  <Heading level="h2">3. Purchases and Payment</Heading>
                  <Text>
                    All purchases are processed through secure third-party payment processors (Stripe and/or Mercado Pago).
                    We do not store your payment information.
                  </Text>
                  <Text>
                    Prices are listed in USD and BRL. The price you see at checkout is the final price you&apos;ll pay.
                  </Text>
                  <Text>
                    By completing a purchase, you confirm that you are authorized to use the payment method provided.
                  </Text>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Stack gap="lg">
                  <Heading level="h2">4. Refund Policy</Heading>
                  <Text>
                    We offer a 30-day money-back guarantee on all digital products. If you&apos;re not satisfied,
                    you can request a full refund within 30 days of purchase.
                  </Text>
                  <Text>
                    Refund requests within 7 days of purchase are automatically approved. Requests after 7 days
                    may require additional review.
                  </Text>
                  <Text>
                    For full details, please see our <a
                      href="/legal/refund"
                      style={{
                        color: tokens.colors.primary[500],
                        textDecoration: 'none',
                        fontWeight: tokens.fontWeight.medium,
                      }}
                    >
                      Refund Policy
                    </a>.
                  </Text>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Stack gap="lg">
                  <Heading level="h2">5. Digital Product Access</Heading>
                  <Text>
                    Upon successful payment, you will receive download links via email. These links are valid
                    for 7 days and can be used up to 5 times.
                  </Text>
                  <Text>
                    You may also access your purchases through your account dashboard at any time.
                  </Text>
                  <Text>
                    Digital products are for your personal use only. Sharing, distributing, or reselling our
                    products is strictly prohibited.
                  </Text>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Stack gap="lg">
                  <Heading level="h2">6. Intellectual Property</Heading>
                  <Text>
                    All content, including text, graphics, logos, images, and software, is the property of
                    {APP_NAME} and is protected by copyright and intellectual property laws.
                  </Text>
                  <Text>
                    Purchasing a product grants you a non-exclusive, non-transferable license to use the
                    content for personal purposes only.
                  </Text>
                  <Text>
                    You may not reproduce, distribute, modify, or create derivative works from our content
                    without explicit written permission.
                  </Text>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Stack gap="lg">
                  <Heading level="h2">7. User Accounts</Heading>
                  <Text>
                    You are responsible for maintaining the confidentiality of your account credentials and
                    for all activities that occur under your account.
                  </Text>
                  <Text>
                    You must provide accurate and complete information when creating an account.
                  </Text>
                  <Text>
                    We reserve the right to suspend or terminate accounts that violate these terms.
                  </Text>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Stack gap="lg">
                  <Heading level="h2">8. Disclaimer of Warranties</Heading>
                  <Text>
                    Our products and services are provided &quot;as is&quot; without any warranties, express or implied.
                    We do not guarantee specific results from using our products.
                  </Text>
                  <Text>
                    The information in our products is for educational and informational purposes only.
                    Always consult with qualified professionals before making decisions based on our content.
                  </Text>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Stack gap="lg">
                  <Heading level="h2">9. Limitation of Liability</Heading>
                  <Text>
                    {APP_NAME} shall not be liable for any indirect, incidental, special, consequential, or
                    punitive damages resulting from your use of our products or services.
                  </Text>
                  <Text>
                    Our total liability shall not exceed the amount you paid for the product or service in question.
                  </Text>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Stack gap="lg">
                  <Heading level="h2">10. Changes to Terms</Heading>
                  <Text>
                    We reserve the right to modify these terms at any time. Changes will be effective
                    immediately upon posting to the website.
                  </Text>
                  <Text>
                    Your continued use of our services after changes constitutes acceptance of the new terms.
                  </Text>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Stack gap="lg">
                  <Heading level="h2">11. Contact Information</Heading>
                  <Text>
                    If you have questions about these Terms of Service, please contact us:
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
