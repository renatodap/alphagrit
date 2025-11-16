/**
 * Product Grid Component
 * Responsive grid layout using design system
 */

import { Grid } from '@/components/ui/layout'
import { ProductCard } from './product-card'
import type { Product } from '@/types'

interface ProductGridProps {
  products: Product[]
  currency?: 'USD' | 'BRL'
  onAddToCart?: (productId: string) => void
}

export function ProductGrid({ products, currency, onAddToCart }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No products found</p>
      </div>
    )
  }

  return (
    <Grid cols={3} gap="lg" className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          currency={currency}
          onAddToCart={onAddToCart}
        />
      ))}
    </Grid>
  )
}
