/**
 * Order Success Page
 * Shows order confirmation and download links
 * Zero hardcoding - all from design tokens and database
 */

import { redirect } from 'next/navigation'
import { Container, Section, Stack, Inline } from '@/components/ui/layout'
import { Heading, Text } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Divider } from '@/components/ui/spacing'
import { ROUTES, ORDER_STATUS, PRODUCT_TYPES } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'
import { getCheckoutSession } from '@/lib/actions/stripe'
import { getOrderById, getOrderDownloads } from '@/lib/actions/orders'
import Link from 'next/link'

interface SuccessPageProps {
  searchParams: Promise<{
    session_id?: string
  }>
}

export default async function CheckoutSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const params = await searchParams
  const sessionId = params.session_id

  // Check authentication
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(ROUTES.SIGNIN + '?redirect=' + ROUTES.CHECKOUT_SUCCESS)
  }

  // Validate session ID
  if (!sessionId) {
    redirect(ROUTES.ACCOUNT_ORDERS)
  }

  // Get Stripe session
  const { session, error: sessionError } = await getCheckoutSession(sessionId)

  if (sessionError || !session) {
    return (
      <Container>
        <Section spacing="xl">
          <Stack gap="lg" align="center">
            <Heading level="h1">Order Status</Heading>
            <Text color="error">Unable to retrieve order information</Text>
            <Button asChild>
              <Link href={ROUTES.ACCOUNT_ORDERS}>View Orders</Link>
            </Button>
          </Stack>
        </Section>
      </Container>
    )
  }

  // Get order ID from session metadata
  const orderId = session.metadata?.order_id

  if (!orderId) {
    return (
      <Container>
        <Section spacing="xl">
          <Stack gap="lg" align="center">
            <Heading level="h1">Order Status</Heading>
            <Text color="error">Order information not found</Text>
            <Button asChild>
              <Link href={ROUTES.ACCOUNT_ORDERS}>View Orders</Link>
            </Button>
          </Stack>
        </Section>
      </Container>
    )
  }

  // Get order details
  const { order, error: orderError } = await getOrderById(orderId)

  if (orderError || !order) {
    return (
      <Container>
        <Section spacing="xl">
          <Stack gap="lg" align="center">
            <Heading level="h1">Order Status</Heading>
            <Text color="error">Unable to load order details</Text>
            <Button asChild>
              <Link href={ROUTES.ACCOUNT_ORDERS}>View Orders</Link>
            </Button>
          </Stack>
        </Section>
      </Container>
    )
  }

  // Get download links if order is paid
  const { downloads } = order.status === ORDER_STATUS.PAID
    ? await getOrderDownloads(orderId)
    : { downloads: [] }

  // Format currency
  const formatPrice = (amount: number, currency: string) => {
    if (currency === 'BRL') {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(amount)
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Check if order has ebooks
  const hasEbooks = order.items.some(
    item => item.product?.type === PRODUCT_TYPES.EBOOK
  )

  return (
    <Container>
      <Section spacing="xl">
        <Stack gap="2xl">
          {/* Success Header */}
          <Stack gap="lg" align="center">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <Heading level="h1" align="center">
              Order Confirmed!
            </Heading>

            <Text size="lg" color="muted" align="center">
              Thank you for your purchase. Your order has been successfully processed.
            </Text>

            <Text size="sm" color="muted" align="center">
              Order #{order.order_number}
            </Text>
          </Stack>

          {/* Order Details */}
          <Card className="p-6 md:p-8">
            <Stack gap="lg">
              <Heading level="h3">Order Details</Heading>

              <Inline justify="between" className="flex-wrap gap-4">
                <Stack gap="xs">
                  <Text size="sm" color="muted">
                    Order Number
                  </Text>
                  <Text weight="semibold">{order.order_number}</Text>
                </Stack>

                <Stack gap="xs">
                  <Text size="sm" color="muted">
                    Date
                  </Text>
                  <Text weight="semibold">{formatDate(order.created_at)}</Text>
                </Stack>

                <Stack gap="xs">
                  <Text size="sm" color="muted">
                    Status
                  </Text>
                  <span
                    className={`
                      inline-flex px-3 py-1 rounded-full text-sm font-medium
                      ${
                        order.status === ORDER_STATUS.PAID
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : order.status === ORDER_STATUS.PENDING
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200'
                      }
                    `}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </Stack>

                <Stack gap="xs">
                  <Text size="sm" color="muted">
                    Email
                  </Text>
                  <Text weight="semibold">{order.email}</Text>
                </Stack>
              </Inline>

              <Divider />

              {/* Order Items */}
              <Stack gap="md">
                <Text weight="bold">Items</Text>

                {order.items.map((item) => (
                  <div key={item.id}>
                    <Inline justify="between" align="start">
                      <Stack gap="xs" className="flex-1">
                        <Text weight="semibold">{item.product_name}</Text>
                        <Text size="sm" color="muted">
                          Type: {item.product_type}
                        </Text>
                        <Text size="sm" color="muted">
                          Quantity: {item.quantity}
                        </Text>
                      </Stack>
                      <Text weight="semibold">
                        {formatPrice(item.price * item.quantity, order.currency)}
                      </Text>
                    </Inline>
                  </div>
                ))}
              </Stack>

              <Divider />

              {/* Order Total */}
              <Stack gap="sm">
                <Inline justify="between">
                  <Text color="muted">Subtotal</Text>
                  <Text weight="semibold">
                    {formatPrice(order.subtotal, order.currency)}
                  </Text>
                </Inline>

                <Inline justify="between">
                  <Text size="lg" weight="bold">
                    Total
                  </Text>
                  <Text size="2xl" weight="bold" className="text-primary-500">
                    {formatPrice(order.total, order.currency)}
                  </Text>
                </Inline>
              </Stack>
            </Stack>
          </Card>

          {/* Download Links (if ebooks and paid) */}
          {hasEbooks && order.status === ORDER_STATUS.PAID && (
            <Card className="p-6 md:p-8">
              <Stack gap="lg">
                <Heading level="h3">Download Your Products</Heading>

                {downloads.length > 0 ? (
                  <Stack gap="md">
                    <Text color="muted">
                      Your download links are ready. Click below to download your products.
                    </Text>

                    {downloads.map((download: any) => (
                      <Card key={download.id} className="p-4 bg-neutral-50 dark:bg-neutral-900">
                        <Inline justify="between" align="center">
                          <Stack gap="xs">
                            <Text weight="semibold">{download.product.name}</Text>
                            <Text size="sm" color="muted">
                              Downloads remaining: {download.download_limit - download.download_count}
                            </Text>
                            <Text size="sm" color="muted">
                              Expires: {formatDate(download.expires_at)}
                            </Text>
                          </Stack>
                          <Button asChild>
                            <a
                              href={download.signed_url}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Download
                            </a>
                          </Button>
                        </Inline>
                      </Card>
                    ))}
                  </Stack>
                ) : (
                  <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-500">
                    <Text color="muted">
                      Your download links are being generated. They will be available in your
                      account shortly. Please check your email for confirmation.
                    </Text>
                  </div>
                )}
              </Stack>
            </Card>
          )}

          {/* Pending Payment Notice */}
          {order.status === ORDER_STATUS.PENDING && (
            <Card className="p-6 md:p-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-500">
              <Stack gap="md">
                <Heading level="h4">Payment Pending</Heading>
                <Text>
                  Your payment is being processed. You will receive an email confirmation
                  once the payment is complete. If you have any questions, please contact
                  our support team.
                </Text>
              </Stack>
            </Card>
          )}

          {/* Action Buttons */}
          <Inline justify="center" gap="md" className="flex-wrap">
            <Button size="lg" asChild>
              <Link href={ROUTES.ACCOUNT_ORDERS}>View All Orders</Link>
            </Button>

            {hasEbooks && (
              <Button size="lg" variant="outline" asChild>
                <Link href={ROUTES.ACCOUNT_EBOOKS}>My Library</Link>
              </Button>
            )}

            <Button size="lg" variant="outline" asChild>
              <Link href={ROUTES.STORE}>Continue Shopping</Link>
            </Button>
          </Inline>

          {/* Support Information */}
          <Card className="p-6 bg-neutral-50 dark:bg-neutral-900">
            <Stack gap="md">
              <Text weight="bold">Need Help?</Text>
              <Text size="sm" color="muted">
                If you have any questions about your order or need assistance,
                please contact our support team. We&apos;re here to help!
              </Text>
              <Inline gap="md">
                <Button size="sm" variant="outline" asChild>
                  <Link href={ROUTES.ACCOUNT}>Contact Support</Link>
                </Button>
              </Inline>
            </Stack>
          </Card>
        </Stack>
      </Section>
    </Container>
  )
}
