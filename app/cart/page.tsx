/**
 * Shopping Cart Page
 * Displays cart items and checkout button
 */

import { redirect } from 'next/navigation'
import { Container } from '@/components/ui/layout'
import { Section } from '@/components/ui/layout'
import { Stack } from '@/components/ui/layout'
import { Heading } from '@/components/ui/typography'
import { Text } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'
import { CartItemsList } from '@/components/cart/cart-items-list'
import { CartSummary } from '@/components/cart/cart-summary'
import { getCartItems } from '@/lib/actions/cart'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/lib/constants'
import Link from 'next/link'

export default async function CartPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(ROUTES.SIGNIN + '?redirect=' + ROUTES.CART)
  }

  const { items, error } = await getCartItems()

  if (error) {
    return (
      <Container>
        <Section spacing="xl">
          <Stack gap="lg" align="center">
            <Heading level="h1">Shopping Cart</Heading>
            <Text color="muted">Unable to load cart. Please try again.</Text>
          </Stack>
        </Section>
      </Container>
    )
  }

  const isEmpty = items.length === 0

  return (
    <Container>
      <Section spacing="xl">
        <Stack gap="xl">
          <Heading level="h1">Shopping Cart</Heading>

          {isEmpty ? (
            <Stack gap="lg" align="center" className="py-12">
              <Text size="xl" color="muted">
                Your cart is empty
              </Text>
              <Button asChild>
                <Link href={ROUTES.STORE}>Continue Shopping</Link>
              </Button>
            </Stack>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
              <div className="lg:col-span-2">
                <CartItemsList items={items} />
              </div>
              <div>
                <CartSummary items={items} />
              </div>
            </div>
          )}
        </Stack>
      </Section>
    </Container>
  )
}
