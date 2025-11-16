import { Metadata } from 'next'
import Link from 'next/link'
import { Container, Section, Stack } from '@/components/ui/layout'
import { Display, Heading, Text } from '@/components/ui/typography'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SEO, APP_NAME, CONTACT, REFUND_POLICY } from '@/lib/constants'
import { tokens } from '@/lib/design-tokens'

export const metadata: Metadata = {
  title: `Refund Policy - ${SEO.DEFAULT_TITLE}`,
  description: 'Alpha Grit refund policy and money-back guarantee details.',
}

export default function RefundPage() {
  return (
    <Container>
      {/* Hero Section */}
      <Section spacing="xl">
        <Stack gap="lg" align="center">
          <Display size="lg" className="text-center">
            Refund Policy
          </Display>

          <Text
            size="xl"
            color="muted"
            align="center"
            className="max-w-3xl"
          >
            We stand behind our products with a {REFUND_POLICY.GUARANTEE_DAYS}-day money-back guarantee.
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
            {/* Money-Back Guarantee */}
            <Card
              style={{
                borderColor: tokens.colors.primary[500],
                borderWidth: '2px',
              }}
            >
              <CardContent>
                <Stack gap="lg">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: tokens.spacing.md,
                    }}
                  >
                    <div
                      style={{
                        fontSize: tokens.fontSize['5xl'],
                      }}
                    >
                      ✅
                    </div>
                    <Heading level="h2">30-Day Money-Back Guarantee</Heading>
                  </div>
                  <Text>
                    We believe in the quality of our products. That&apos;s why we offer a full {REFUND_POLICY.GUARANTEE_DAYS}-day
                    money-back guarantee on all digital products.
                  </Text>
                  <Text>
                    If you&apos;re not completely satisfied with your purchase, you can request a full refund
                    within {REFUND_POLICY.GUARANTEE_DAYS} days of your purchase date—no questions asked.
                  </Text>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Stack gap="lg">
                  <Heading level="h2">1. Eligibility for Refunds</Heading>
                  <Text>
                    Refunds are available for:
                  </Text>
                  <ul
                    style={{
                      marginLeft: tokens.spacing.lg,
                      color: tokens.colors.neutral[700],
                    }}
                  >
                    <li>All digital products (e-books, guides, courses)</li>
                    <li>Purchases made within the last {REFUND_POLICY.GUARANTEE_DAYS} days</li>
                    <li>Both new and existing customers</li>
                  </ul>
                  <Text>
                    Refund eligibility applies even if you&apos;ve downloaded and accessed the product.
                  </Text>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Stack gap="lg">
                  <Heading level="h2">2. Refund Processing Timeline</Heading>

                  <div
                    style={{
                      padding: tokens.spacing.md,
                      backgroundColor: tokens.colors.primary[50],
                      borderRadius: tokens.borderRadius.md,
                      borderLeft: `4px solid ${tokens.colors.primary[500]}`,
                    }}
                  >
                    <Heading level="h3">Automatic Approval (0-{REFUND_POLICY.AUTO_APPROVE_DAYS} days)</Heading>
                    <Text>
                      Refund requests submitted within {REFUND_POLICY.AUTO_APPROVE_DAYS} days of purchase are automatically
                      approved and processed immediately. You&apos;ll receive your refund within 5-10 business days,
                      depending on your payment provider.
                    </Text>
                  </div>

                  <div
                    style={{
                      padding: tokens.spacing.md,
                      backgroundColor: tokens.colors.neutral[100],
                      borderRadius: tokens.borderRadius.md,
                      borderLeft: `4px solid ${tokens.colors.neutral[400]}`,
                    }}
                  >
                    <Heading level="h3">Review Required ({REFUND_POLICY.AUTO_APPROVE_DAYS + 1}-{REFUND_POLICY.GUARANTEE_DAYS} days)</Heading>
                    <Text>
                      Refund requests submitted between {REFUND_POLICY.AUTO_APPROVE_DAYS + 1} and {REFUND_POLICY.GUARANTEE_DAYS} days
                      after purchase require additional review. We typically respond within 24-48 hours.
                    </Text>
                  </div>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Stack gap="lg">
                  <Heading level="h2">3. How to Request a Refund</Heading>

                  <Text>
                    There are two ways to request a refund:
                  </Text>

                  <Heading level="h3">Method 1: Through Your Account</Heading>
                  <ol
                    style={{
                      marginLeft: tokens.spacing.lg,
                      color: tokens.colors.neutral[700],
                    }}
                  >
                    <li>Log in to your account</li>
                    <li>Go to &quot;Orders&quot; in your account dashboard</li>
                    <li>Find the order you want to refund</li>
                    <li>Click &quot;Request Refund&quot;</li>
                    <li>Provide a brief reason (optional but helpful)</li>
                    <li>Submit your request</li>
                  </ol>

                  <Heading level="h3">Method 2: Contact Support</Heading>
                  <Text>
                    Contact us directly via:
                  </Text>
                  <ul
                    style={{
                      marginLeft: tokens.spacing.lg,
                      color: tokens.colors.neutral[700],
                    }}
                  >
                    <li>Email: {CONTACT.EMAIL}</li>
                    <li>WhatsApp: {CONTACT.WHATSAPP}</li>
                  </ul>
                  <Text>
                    Include your order number and the reason for your refund request.
                  </Text>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Stack gap="lg">
                  <Heading level="h2">4. Refund Processing</Heading>
                  <Text>
                    Once your refund is approved:
                  </Text>
                  <ul
                    style={{
                      marginLeft: tokens.spacing.lg,
                      color: tokens.colors.neutral[700],
                    }}
                  >
                    <li>You&apos;ll receive a confirmation email</li>
                    <li>The refund will be processed to your original payment method</li>
                    <li>Credit card refunds typically appear in 5-10 business days</li>
                    <li>PayPal and other payment methods may vary</li>
                    <li>You&apos;ll receive a notification when the refund is processed</li>
                  </ul>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Stack gap="lg">
                  <Heading level="h2">5. After a Refund is Processed</Heading>
                  <Text>
                    Once a refund is processed:
                  </Text>
                  <ul
                    style={{
                      marginLeft: tokens.spacing.lg,
                      color: tokens.colors.neutral[700],
                    }}
                  >
                    <li>You will no longer have access to the product</li>
                    <li>Download links will be deactivated</li>
                    <li>The product will be removed from your account library</li>
                  </ul>
                  <Text>
                    We trust our customers and don&apos;t require you to delete the files you&apos;ve downloaded.
                    However, please respect our intellectual property and do not share or distribute the content.
                  </Text>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Stack gap="lg">
                  <Heading level="h2">6. Exceptions and Special Cases</Heading>

                  <Heading level="h3">Promotional Purchases</Heading>
                  <Text>
                    Products purchased at a discount or during promotional periods are still eligible for
                    full refunds within the {REFUND_POLICY.GUARANTEE_DAYS}-day window.
                  </Text>

                  <Heading level="h3">Bundle Purchases</Heading>
                  <Text>
                    If you purchase a bundle of products, you can request a refund for the entire bundle
                    within {REFUND_POLICY.GUARANTEE_DAYS} days. Partial refunds for individual items in a bundle
                    are not available.
                  </Text>

                  <Heading level="h3">Physical Products</Heading>
                  <Text>
                    For physical products (when available), the item must be returned in its original condition.
                    Shipping costs are non-refundable unless the return is due to our error.
                  </Text>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Stack gap="lg">
                  <Heading level="h2">7. Fraud Prevention</Heading>
                  <Text>
                    While we offer a generous refund policy, we reserve the right to:
                  </Text>
                  <ul
                    style={{
                      marginLeft: tokens.spacing.lg,
                      color: tokens.colors.neutral[700],
                    }}
                  >
                    <li>Deny refunds for suspected fraudulent activity</li>
                    <li>Limit future purchases from accounts with excessive refund requests</li>
                    <li>Block users who abuse our refund policy</li>
                  </ul>
                  <Text>
                    Our goal is to maintain fair policies for all customers while protecting against abuse.
                  </Text>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Stack gap="lg">
                  <Heading level="h2">8. Questions About Refunds?</Heading>
                  <Text>
                    If you have questions about our refund policy or need assistance with a refund request,
                    we&apos;re here to help:
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
                  <Text>
                    We typically respond within 24 hours on business days.
                  </Text>
                </Stack>
              </CardContent>
            </Card>

            {/* CTA */}
            <div
              style={{
                padding: `${tokens.spacing.xl} ${tokens.spacing.lg}`,
                backgroundColor: `${tokens.colors.primary[500]}10`,
                borderRadius: tokens.borderRadius.xl,
                textAlign: 'center',
              }}
            >
              <Stack gap="lg" align="center">
                <Heading level="h3">Need to Request a Refund?</Heading>
                <Text color="muted">
                  Log in to your account to manage your orders and request refunds.
                </Text>
                <Button asChild>
                  <Link href="/account/orders">Go to My Orders</Link>
                </Button>
              </Stack>
            </div>
          </Stack>
        </article>
      </Section>
    </Container>
  )
}
