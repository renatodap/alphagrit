/**
 * Product Detail Page
 * Dynamic route for individual products
 */

import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Container } from '@/components/ui/layout'
import { Section } from '@/components/ui/layout'
import { Stack } from '@/components/ui/layout'
import { Grid } from '@/components/ui/layout'
import { Inline } from '@/components/ui/layout'
import { Heading } from '@/components/ui/typography'
import { Text } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AddToCartButton } from '@/components/products/add-to-cart-button'
import { getProductBySlug } from '@/lib/actions/products'
import { Star } from 'lucide-react'
import { tokens } from '@/lib/design-tokens'
import Link from 'next/link'

interface ProductPageProps {
  params: {
    slug: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { product, error } = await getProductBySlug(params.slug)

  if (error || !product) {
    notFound()
  }

  const currency = 'USD'
  const price = currency === 'USD' ? product.price_usd : product.price_brl
  const currencySymbol = currency === 'USD' ? '$' : 'R$'
  const formattedPrice = price ? `${currencySymbol}${price.toFixed(2)}` : 'Free'

  const averageRating =
    product.reviews && product.reviews.length > 0
      ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
      : 0

  return (
    <Container>
      <Section spacing="xl">
        <Grid cols={2} gap="2xl" className="grid-cols-1 lg:grid-cols-2">
          {/* Product Image */}
          <div className="relative aspect-square w-full overflow-hidden rounded-xl">
            {product.cover_image_url ? (
              <Image
                src={product.cover_image_url}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor: tokens.colors.neutral[100] }}
              >
                <Text color="muted">No image available</Text>
              </div>
            )}
          </div>

          {/* Product Info */}
          <Stack gap="xl">
            {product.category && (
              <Text size="sm" className="text-primary-500 uppercase tracking-wide font-medium">
                {product.category}
              </Text>
            )}

            <Heading level="h1">{product.name}</Heading>

            {product.reviews && product.reviews.length > 0 && (
              <Inline gap="sm" align="center">
                <Inline gap="xs">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.round(averageRating)
                          ? 'fill-primary-500 text-primary-500'
                          : 'text-neutral-300'
                      }`}
                    />
                  ))}
                </Inline>
                <Text size="sm" color="muted">
                  {averageRating.toFixed(1)} ({product.reviews.length} reviews)
                </Text>
              </Inline>
            )}

            <Text size="4xl" weight="bold" className="text-primary-500">
              {formattedPrice}
            </Text>

            {product.short_description && (
              <Text size="lg" color="muted">
                {product.short_description}
              </Text>
            )}

            <Inline gap="md">
              <AddToCartButton
                productId={product.id}
                productName={product.name}
                size="lg"
                className="flex-1"
              />
              <Button size="lg" variant="outline" asChild>
                <Link href="/cart">View Cart</Link>
              </Button>
            </Inline>

            {product.file_size_bytes && (
              <Text size="sm" color="muted">
                File size: {(product.file_size_bytes / 1024 / 1024).toFixed(2)} MB
              </Text>
            )}
          </Stack>
        </Grid>

        {/* Product Description */}
        {product.description && (
          <Section spacing="xl">
            <Stack gap="lg">
              <Heading level="h2">Description</Heading>
              <Text className="whitespace-pre-wrap">{product.description}</Text>
            </Stack>
          </Section>
        )}

        {/* Reviews */}
        {product.reviews && product.reviews.length > 0 && (
          <Section spacing="xl">
            <Stack gap="xl">
              <Heading level="h2">Reviews</Heading>
              <Stack gap="lg">
                {product.reviews.map((review) => (
                  <Card key={review.id} className="p-6">
                    <Stack gap="md">
                      <Inline gap="md" align="center" justify="between">
                        <Stack gap="xs">
                          <Text weight="semibold">{review.author_name}</Text>
                          {review.author_title && (
                            <Text size="sm" color="muted">
                              {review.author_title}
                            </Text>
                          )}
                        </Stack>
                        <Inline gap="xs">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? 'fill-primary-500 text-primary-500'
                                  : 'text-neutral-300'
                              }`}
                            />
                          ))}
                        </Inline>
                      </Inline>
                      <Text>{review.content}</Text>
                    </Stack>
                  </Card>
                ))}
              </Stack>
            </Stack>
          </Section>
        )}
      </Section>
    </Container>
  )
}
