/**
 * Product Card Component
 * Zero hardcoding - fully design system
 */

import Link from 'next/link'
import Image from 'next/image'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/typography'
import { Text } from '@/components/ui/typography'
import { Stack } from '@/components/ui/layout'
import { Inline } from '@/components/ui/layout'
import { ShoppingCart } from 'lucide-react'
import { tokens } from '@/lib/design-tokens'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  currency?: 'USD' | 'BRL'
  onAddToCart?: (productId: string) => void
}

export function ProductCard({ product, currency = 'USD', onAddToCart }: ProductCardProps) {
  const price = currency === 'USD' ? product.price_usd : product.price_brl
  const currencySymbol = currency === 'USD' ? '$' : 'R$'

  const formattedPrice = price
    ? `${currencySymbol}${price.toFixed(2)}`
    : 'Free'

  const productUrl = `/products/${product.slug}`

  return (
    <Card className="h-full flex flex-col card-hover">
      <CardHeader className="p-0">
        <Link href={productUrl} className="block relative aspect-[4/3] overflow-hidden rounded-t-lg">
          {product.cover_image_url ? (
            <Image
              src={product.cover_image_url}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-muted-foreground"
              style={{ backgroundColor: tokens.colors.neutral[100] }}
            >
              <Text size="sm">No image</Text>
            </div>
          )}
        </Link>
      </CardHeader>

      <CardContent className="flex-1 p-4">
        <Stack gap="sm">
          <Link href={productUrl}>
            <Heading level="h4" className="hover:text-primary-500 transition-colors line-clamp-2">
              {product.name}
            </Heading>
          </Link>

          {product.short_description && (
            <Text size="sm" color="muted" className="line-clamp-2">
              {product.short_description}
            </Text>
          )}

          {product.category && (
            <Text size="xs" className="text-primary-500 uppercase tracking-wide font-medium">
              {product.category}
            </Text>
          )}
        </Stack>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Inline gap="md" align="center" justify="between" className="w-full">
          <Text size="2xl" weight="bold" className="text-primary-500">
            {formattedPrice}
          </Text>

          {onAddToCart && (
            <Button
              size="sm"
              onClick={() => onAddToCart(product.id)}
              className="gap-2"
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </Button>
          )}
        </Inline>
      </CardFooter>
    </Card>
  )
}
