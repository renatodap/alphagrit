/**
 * Checkout Page
 * Production-ready checkout flow with Stripe integration
 * Zero hardcoding - all from design tokens and database
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Container, Section, Stack, Grid, Inline } from '@/components/ui/layout'
import { Heading, Text } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Divider } from '@/components/ui/spacing'
import { ROUTES, CURRENCIES } from '@/lib/constants'
import { getCartItems, clearCart } from '@/lib/actions/cart'
import { createOrder } from '@/lib/actions/orders'
import { createCheckoutSession } from '@/lib/actions/stripe'
import { loadStripe } from '@stripe/stripe-js'
import type { CartItemWithProduct, Currency } from '@/types'
import Link from 'next/link'

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CheckoutPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([])
  const [currency, setCurrency] = useState<Currency>(CURRENCIES.USD)

  // Load cart items on mount
  useEffect(() => {
    async function loadCart() {
      try {
        const { items, error } = await getCartItems()

        if (error) {
          setError(error)
          setIsLoading(false)
          return
        }

        if (items.length === 0) {
          router.push(ROUTES.CART)
          return
        }

        setCartItems(items)
        setIsLoading(false)
      } catch (err) {
        console.error('Error loading cart:', err)
        setError('Failed to load cart')
        setIsLoading(false)
      }
    }

    loadCart()
  }, [router])

  // Calculate totals based on selected currency
  const subtotal = cartItems.reduce((sum, item) => {
    const price = currency === CURRENCIES.BRL
      ? item.product.price_brl
      : item.product.price_usd
    return sum + (price * item.quantity)
  }, 0)

  const tax = 0 // No tax for digital products
  const total = subtotal + tax

  // Format currency
  const formatPrice = (amount: number) => {
    if (currency === CURRENCIES.BRL) {
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

  // Handle checkout
  const handleCheckout = async () => {
    setIsProcessing(true)
    setError(null)

    try {
      // Create order
      const { order, error: orderError } = await createOrder(cartItems, currency)

      if (orderError || !order) {
        setError(orderError || 'Failed to create order')
        setIsProcessing(false)
        return
      }

      // Create Stripe checkout session
      const { sessionId, error: sessionError } = await createCheckoutSession(
        order,
        currency
      )

      if (sessionError || !sessionId) {
        setError(sessionError || 'Failed to create checkout session')
        setIsProcessing(false)
        return
      }

      // Redirect to Stripe Checkout
      const stripe = await stripePromise

      if (!stripe) {
        setError('Failed to load payment processor')
        setIsProcessing(false)
        return
      }

      // Clear cart before redirecting
      await clearCart()

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId,
      })

      if (stripeError) {
        setError(stripeError.message || 'Payment failed')
        setIsProcessing(false)
      }
    } catch (err) {
      console.error('Checkout error:', err)
      setError('An unexpected error occurred')
      setIsProcessing(false)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <Container>
        <Section spacing="xl">
          <Stack gap="lg" align="center">
            <Heading level="h1">Checkout</Heading>
            <Text color="muted">Loading your cart...</Text>
          </Stack>
        </Section>
      </Container>
    )
  }

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <Container>
        <Section spacing="xl">
          <Stack gap="lg" align="center">
            <Heading level="h1">Checkout</Heading>
            <Text color="muted">Your cart is empty</Text>
            <Button asChild>
              <Link href={ROUTES.STORE}>Continue Shopping</Link>
            </Button>
          </Stack>
        </Section>
      </Container>
    )
  }

  return (
    <Container>
      <Section spacing="xl">
        <Stack gap="2xl">
          <Heading level="h1">Checkout</Heading>

          <Grid cols={2} gap="xl" className="items-start">
            {/* Order Summary */}
            <div className="order-2 lg:order-1">
              <Card className="p-6">
                <Stack gap="lg">
                  <Heading level="h3">Order Summary</Heading>

                  <Stack gap="md">
                    {cartItems.map((item) => {
                      const price = currency === CURRENCIES.BRL
                        ? item.product.price_brl
                        : item.product.price_usd

                      return (
                        <div key={item.id}>
                          <Inline justify="between" align="start">
                            <Stack gap="xs" className="flex-1">
                              <Text weight="semibold">{item.product.name}</Text>
                              <Text size="sm" color="muted">
                                Qty: {item.quantity}
                              </Text>
                            </Stack>
                            <Text weight="semibold">
                              {formatPrice(price * item.quantity)}
                            </Text>
                          </Inline>
                        </div>
                      )
                    })}
                  </Stack>

                  <Divider />

                  <Stack gap="sm">
                    <Inline justify="between">
                      <Text color="muted">Subtotal</Text>
                      <Text weight="semibold">{formatPrice(subtotal)}</Text>
                    </Inline>

                    <Inline justify="between">
                      <Text color="muted">Tax</Text>
                      <Text weight="semibold">{formatPrice(tax)}</Text>
                    </Inline>

                    <Divider />

                    <Inline justify="between">
                      <Text size="lg" weight="bold">
                        Total
                      </Text>
                      <Text size="2xl" weight="bold" className="text-primary-500">
                        {formatPrice(total)}
                      </Text>
                    </Inline>
                  </Stack>
                </Stack>
              </Card>
            </div>

            {/* Payment Information */}
            <div className="order-1 lg:order-2">
              <Card className="p-6">
                <Stack gap="lg">
                  <Heading level="h3">Payment Information</Heading>

                  {/* Currency Selection */}
                  <Stack gap="sm">
                    <Label>Select Currency</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setCurrency(CURRENCIES.USD)}
                        disabled={isProcessing}
                        className={`
                          p-4 rounded-lg border-2 transition-all
                          ${
                            currency === CURRENCIES.USD
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
                              : 'border-neutral-200 hover:border-primary-300'
                          }
                          ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                        `}
                      >
                        <Stack gap="xs">
                          <Text weight="bold">USD ($)</Text>
                          <Text size="sm" color="muted">
                            US Dollar
                          </Text>
                        </Stack>
                      </button>

                      <button
                        onClick={() => setCurrency(CURRENCIES.BRL)}
                        disabled={isProcessing}
                        className={`
                          p-4 rounded-lg border-2 transition-all
                          ${
                            currency === CURRENCIES.BRL
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
                              : 'border-neutral-200 hover:border-primary-300'
                          }
                          ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                        `}
                      >
                        <Stack gap="xs">
                          <Text weight="bold">BRL (R$)</Text>
                          <Text size="sm" color="muted">
                            Brazilian Real
                          </Text>
                        </Stack>
                      </button>
                    </div>
                  </Stack>

                  <Divider />

                  {/* Payment Button */}
                  <Stack gap="md">
                    {error && (
                      <div className="p-4 rounded-lg bg-accent-50 dark:bg-accent-950 border border-accent-500">
                        <Text color="error" size="sm">
                          {error}
                        </Text>
                      </div>
                    )}

                    <Button
                      size="lg"
                      className="w-full"
                      onClick={handleCheckout}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Processing...' : 'Proceed to Payment'}
                    </Button>

                    <Text size="sm" color="muted" align="center">
                      You will be redirected to Stripe for secure payment
                    </Text>
                  </Stack>

                  <Divider />

                  {/* Security Notice */}
                  <Stack gap="sm">
                    <Text size="sm" color="muted">
                      <strong>Secure Payment</strong>
                    </Text>
                    <Text size="sm" color="muted">
                      Your payment information is processed securely by Stripe.
                      We do not store your credit card details.
                    </Text>
                  </Stack>

                  {/* Back to Cart */}
                  <Button variant="outline" asChild className="w-full">
                    <Link href={ROUTES.CART}>Back to Cart</Link>
                  </Button>
                </Stack>
              </Card>
            </div>
          </Grid>
        </Stack>
      </Section>
    </Container>
  )
}
