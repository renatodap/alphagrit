/**
 * Cart Items List Component
 * Displays all items in cart with quantity controls
 */

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Stack } from '@/components/ui/layout'
import { Inline } from '@/components/ui/layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/typography'
import { Heading } from '@/components/ui/typography'
import { X, Plus, Minus } from 'lucide-react'
import { removeFromCart, updateCartItemQuantity } from '@/lib/actions/cart'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { tokens } from '@/lib/design-tokens'
import type { CartItemWithProduct } from '@/types'

interface CartItemsListProps {
  items: CartItemWithProduct[]
}

export function CartItemsList({ items }: CartItemsListProps) {
  const router = useRouter()
  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set())

  const handleRemove = async (itemId: string, productName: string) => {
    setLoadingItems((prev) => new Set(prev).add(itemId))

    const { success, error } = await removeFromCart(itemId)

    if (success) {
      toast.success(`${productName} removed from cart`)
      router.refresh()
    } else {
      toast.error(error || 'Failed to remove item')
      setLoadingItems((prev) => {
        const next = new Set(prev)
        next.delete(itemId)
        return next
      })
    }
  }

  const handleUpdateQuantity = async (
    itemId: string,
    newQuantity: number,
    productName: string
  ) => {
    if (newQuantity < 1) {
      return handleRemove(itemId, productName)
    }

    setLoadingItems((prev) => new Set(prev).add(itemId))

    const { success, error } = await updateCartItemQuantity(itemId, newQuantity)

    setLoadingItems((prev) => {
      const next = new Set(prev)
      next.delete(itemId)
      return next
    })

    if (success) {
      router.refresh()
    } else {
      toast.error(error || 'Failed to update quantity')
    }
  }

  return (
    <Stack gap="md">
      {items.map((item) => {
        const product = item.product
        const price = product.price_usd || 0
        const total = price * item.quantity
        const isLoading = loadingItems.has(item.id)

        return (
          <Card key={item.id} className="p-4">
            <Inline gap="md" align="start">
              {/* Product Image */}
              <Link
                href={`/products/${product.slug}`}
                className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-md"
              >
                {product.cover_image_url ? (
                  <Image
                    src={product.cover_image_url}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: tokens.colors.neutral[100] }}
                  >
                    <Text size="xs" color="muted">
                      No image
                    </Text>
                  </div>
                )}
              </Link>

              {/* Product Info */}
              <Stack gap="sm" className="flex-1">
                <Link href={`/products/${product.slug}`}>
                  <Heading level="h4" className="hover:text-primary-500 transition-colors">
                    {product.name}
                  </Heading>
                </Link>

                {product.category && (
                  <Text size="sm" className="text-primary-500 uppercase tracking-wide">
                    {product.category}
                  </Text>
                )}

                <Text size="lg" weight="semibold">
                  ${price.toFixed(2)}
                </Text>

                {/* Quantity Controls */}
                <Inline gap="sm" align="center">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleUpdateQuantity(item.id, item.quantity - 1, product.name)
                    }
                    disabled={isLoading}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>

                  <Text weight="semibold" className="min-w-[2rem] text-center">
                    {item.quantity}
                  </Text>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleUpdateQuantity(item.id, item.quantity + 1, product.name)
                    }
                    disabled={isLoading}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </Inline>
              </Stack>

              {/* Item Total & Remove */}
              <Stack gap="md" align="end">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRemove(item.id, product.name)}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>

                <Text size="xl" weight="bold" className="text-primary-500">
                  ${total.toFixed(2)}
                </Text>
              </Stack>
            </Inline>
          </Card>
        )
      })}
    </Stack>
  )
}
