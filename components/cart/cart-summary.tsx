/**
 * Cart Summary Component
 * Displays cart totals and checkout button
 */

import { Card } from '@/components/ui/card'
import { Stack } from '@/components/ui/layout'
import { Inline } from '@/components/ui/layout'
import { Text } from '@/components/ui/typography'
import { Heading } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'
import { Divider } from '@/components/ui/spacing'
import { ROUTES } from '@/lib/constants'
import Link from 'next/link'
import type { CartItemWithProduct } from '@/types'

interface CartSummaryProps {
  items: CartItemWithProduct[]
}

export function CartSummary({ items }: CartSummaryProps) {
  const subtotal = items.reduce((sum, item) => {
    const price = item.product.price_usd || 0
    return sum + price * item.quantity
  }, 0)

  const tax = 0 // No tax for digital products
  const total = subtotal + tax

  return (
    <Card className="p-6 sticky top-20">
      <Stack gap="lg">
        <Heading level="h3">Order Summary</Heading>

        <Stack gap="md">
          <Inline justify="between">
            <Text color="muted">Subtotal ({items.length} items)</Text>
            <Text weight="semibold">${subtotal.toFixed(2)}</Text>
          </Inline>

          <Inline justify="between">
            <Text color="muted">Tax</Text>
            <Text weight="semibold">${tax.toFixed(2)}</Text>
          </Inline>

          <Divider />

          <Inline justify="between">
            <Text size="lg" weight="bold">
              Total
            </Text>
            <Text size="2xl" weight="bold" className="text-primary-500">
              ${total.toFixed(2)}
            </Text>
          </Inline>
        </Stack>

        <Button size="lg" className="w-full" asChild>
          <Link href={ROUTES.CHECKOUT}>Proceed to Checkout</Link>
        </Button>

        <Button size="md" variant="outline" className="w-full" asChild>
          <Link href={ROUTES.STORE}>Continue Shopping</Link>
        </Button>
      </Stack>
    </Card>
  )
}
