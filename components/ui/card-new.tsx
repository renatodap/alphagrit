/**
 * CARD COMPONENT
 *
 * Versatile card component for displaying content with elevation and borders.
 * Perfect for product cards, blog posts, dashboards, and content sections.
 *
 * DESIGN PRINCIPLES:
 * - Uses only theme values from config/theme.config.ts
 * - No hardcoded colors, spacing, or styling
 * - Fully composable with Header, Body, Footer sections
 * - Supports interactive states (hover, click)
 * - Responsive and accessible
 *
 * USAGE:
 * ```tsx
 * // Basic card
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Product Name</CardTitle>
 *     <CardDescription>Product description</CardDescription>
 *   </CardHeader>
 *   <CardBody>
 *     Content goes here
 *   </CardBody>
 *   <CardFooter>
 *     <Button>Add to Cart</Button>
 *   </CardFooter>
 * </Card>
 *
 * // Interactive card with hover
 * <Card variant="elevated" hoverable onClick={handleClick}>
 *   Content
 * </Card>
 * ```
 *
 * @module components/ui/card
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * CARD VARIANTS
 *
 * Defines visual variants for cards.
 *
 * VARIANTS:
 * - default: Standard card with border
 * - elevated: Card with shadow elevation
 * - outline: Card with thick border, no shadow
 * - ghost: Minimal card with hover effect
 */
const cardVariants = cva(
  // Base styles for all cards
  [
    'rounded-lg overflow-hidden',
    'bg-card text-card-foreground',
    'transition-all duration-normal',
  ].join(' '),
  {
    variants: {
      /**
       * Visual variants
       */
      variant: {
        /** Standard card with subtle border */
        default: 'border border-border shadow-sm',

        /** Elevated card with shadow */
        elevated: 'border border-border shadow-md',

        /** Outlined card with thick border */
        outline: 'border-2 border-primary-500',

        /** Minimal card */
        ghost: 'border border-transparent hover:border-border',
      },

      /**
       * Padding variants
       */
      padding: {
        /** No padding */
        none: 'p-0',
        /** Small padding */
        sm: 'p-4',
        /** Default padding */
        default: 'p-6',
        /** Large padding */
        lg: 'p-8',
      },

      /**
       * Hover effect
       */
      hoverable: {
        true: 'cursor-pointer hover:shadow-lg hover:-translate-y-1',
      },

      /**
       * Full width
       */
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'default',
      hoverable: false,
      fullWidth: true,
    },
  }
)

/**
 * CARD PROPS
 */
export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  /** Render as a different element */
  as?: React.ElementType
}

/**
 * CARD COMPONENT
 *
 * Main card container component.
 *
 * @param props - Card props
 * @returns Card element
 *
 * @example
 * ```tsx
 * <Card variant="elevated" hoverable>
 *   <CardHeader>
 *     <CardTitle>Featured Product</CardTitle>
 *   </CardHeader>
 *   <CardBody>
 *     <img src="..." alt="Product" />
 *     <p>Description</p>
 *   </CardBody>
 *   <CardFooter>
 *     <Button>Buy Now</Button>
 *   </CardFooter>
 * </Card>
 * ```
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant,
      padding,
      hoverable,
      fullWidth,
      as: Component = 'div',
      ...props
    },
    ref
  ) => {
    return (
      <Component
        ref={ref}
        className={cn(
          cardVariants({ variant, padding, hoverable, fullWidth }),
          className
        )}
        {...props}
      />
    )
  }
)

Card.displayName = 'Card'

/**
 * CARD HEADER COMPONENT
 *
 * Header section of a card (top section).
 *
 * @param props - Card header props
 * @returns Card header element
 *
 * @example
 * ```tsx
 * <CardHeader>
 *   <CardTitle>Title</CardTitle>
 *   <CardDescription>Subtitle</CardDescription>
 * </CardHeader>
 * ```
 */
export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex flex-col gap-1.5 p-6', className)}
      {...props}
    />
  )
})

CardHeader.displayName = 'CardHeader'

/**
 * CARD TITLE COMPONENT
 *
 * Title text for card header.
 *
 * @param props - Card title props
 * @returns Card title element
 *
 * @example
 * ```tsx
 * <CardTitle>Product Name</CardTitle>
 * ```
 */
export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => {
  return (
    <h3
      ref={ref}
      className={cn(
        'text-xl font-semibold leading-tight tracking-tight',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  )
})

CardTitle.displayName = 'CardTitle'

/**
 * CARD DESCRIPTION COMPONENT
 *
 * Description text for card header (subtitle).
 *
 * @param props - Card description props
 * @returns Card description element
 *
 * @example
 * ```tsx
 * <CardDescription>A brief description of the card content</CardDescription>
 * ```
 */
export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
})

CardDescription.displayName = 'CardDescription'

/**
 * CARD BODY COMPONENT
 *
 * Main content section of a card.
 *
 * @param props - Card body props
 * @returns Card body element
 *
 * @example
 * ```tsx
 * <CardBody>
 *   <img src="product.jpg" alt="Product" />
 *   <p>Product details and information.</p>
 * </CardBody>
 * ```
 */
export const CardBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
})

CardBody.displayName = 'CardBody'

/**
 * CARD FOOTER COMPONENT
 *
 * Footer section of a card (bottom section).
 * Typically used for actions (buttons).
 *
 * @param props - Card footer props
 * @returns Card footer element
 *
 * @example
 * ```tsx
 * <CardFooter>
 *   <Button variant="outline">Cancel</Button>
 *   <Button>Confirm</Button>
 * </CardFooter>
 * ```
 */
export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex items-center gap-2 p-6 pt-0', className)}
      {...props}
    />
  )
})

CardFooter.displayName = 'CardFooter'

/**
 * CARD IMAGE COMPONENT
 *
 * Image section for cards with proper aspect ratio.
 *
 * @param props - Card image props
 * @returns Card image element
 *
 * @example
 * ```tsx
 * <Card>
 *   <CardImage src="product.jpg" alt="Product" />
 *   <CardHeader>
 *     <CardTitle>Product</CardTitle>
 *   </CardHeader>
 * </Card>
 * ```
 */
export interface CardImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Image aspect ratio */
  aspectRatio?: 'square' | 'video' | 'portrait' | 'wide'
  /** Cover or contain */
  objectFit?: 'cover' | 'contain'
}

export const CardImage = React.forwardRef<HTMLImageElement, CardImageProps>(
  (
    {
      className,
      alt,
      aspectRatio = 'video',
      objectFit = 'cover',
      ...props
    },
    ref
  ) => {
    const aspectRatioClasses = {
      square: 'aspect-square',
      video: 'aspect-video',
      portrait: 'aspect-[3/4]',
      wide: 'aspect-[21/9]',
    }

    const objectFitClasses = {
      cover: 'object-cover',
      contain: 'object-contain',
    }

    return (
      <div className={cn('overflow-hidden', aspectRatioClasses[aspectRatio])}>
        <img
          ref={ref}
          alt={alt}
          className={cn(
            'w-full h-full',
            objectFitClasses[objectFit],
            'transition-transform duration-normal',
            className
          )}
          {...props}
        />
      </div>
    )
  }
)

CardImage.displayName = 'CardImage'

/**
 * PRODUCT CARD COMPONENT
 *
 * Pre-composed card specifically for product displays.
 * Includes image, title, price, and CTA.
 *
 * @param props - Product card props
 * @returns Product card element
 *
 * @example
 * ```tsx
 * <ProductCard
 *   image="/product.jpg"
 *   title="Alpha Mindset eBook"
 *   price={29.99}
 *   description="Transform your mindset"
 *   onAddToCart={handleAddToCart}
 * />
 * ```
 */
export interface ProductCardProps {
  /** Product image URL */
  image: string
  /** Product image alt text */
  imageAlt?: string
  /** Product title */
  title: string
  /** Product description */
  description?: string
  /** Product price */
  price: number
  /** Sale price (optional) */
  salePrice?: number
  /** Currency symbol */
  currency?: string
  /** Add to cart handler */
  onAddToCart?: () => void
  /** View product handler */
  onClick?: () => void
  /** Custom className */
  className?: string
  /** Badge text (e.g., "Sale", "New") */
  badge?: string
}

export const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  (
    {
      image,
      imageAlt,
      title,
      description,
      price,
      salePrice,
      currency = '$',
      onAddToCart,
      onClick,
      className,
      badge,
    },
    ref
  ) => {
    const displayPrice = salePrice || price
    const hasDiscount = !!salePrice

    return (
      <Card
        ref={ref}
        variant="elevated"
        hoverable
        padding="none"
        className={className}
        onClick={onClick}
      >
        {/* Product Image with Badge */}
        <div className="relative">
          <CardImage src={image} alt={imageAlt || title} aspectRatio="square" />
          {badge && (
            <span className="absolute top-2 right-2 bg-accent-500 text-white text-xs font-semibold px-2 py-1 rounded">
              {badge}
            </span>
          )}
        </div>

        {/* Product Info */}
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>

        {/* Price and CTA */}
        <CardFooter className="flex-col items-stretch gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">
              {currency}
              {displayPrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                {currency}
                {price.toFixed(2)}
              </span>
            )}
          </div>
          {onAddToCart && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onAddToCart()
              }}
              className={cn(
                'w-full px-4 py-2 rounded-md',
                'bg-primary-500 text-white font-medium',
                'hover:bg-primary-600',
                'transition-colors duration-base',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
              )}
            >
              Add to Cart
            </button>
          )}
        </CardFooter>
      </Card>
    )
  }
)

ProductCard.displayName = 'ProductCard'

/**
 * Export card variants for external use
 */
export { cardVariants }
