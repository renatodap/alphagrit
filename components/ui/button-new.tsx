/**
 * BUTTON COMPONENT
 *
 * Versatile button component with multiple variants, sizes, and states.
 * Fully accessible, keyboard-navigable, and responsive.
 *
 * DESIGN PRINCIPLES:
 * - Uses only theme values from config/theme.config.ts
 * - No hardcoded colors, spacing, or styling
 * - Fully type-safe with TypeScript
 * - Supports loading, disabled, and icon states
 * - Works as a button or renders as a child component (polymorphic)
 *
 * USAGE:
 * ```tsx
 * // Primary button
 * <Button>Click Me</Button>
 *
 * // Secondary variant with icon
 * <Button variant="secondary" size="lg">
 *   <Icon /> Large Secondary Button
 * </Button>
 *
 * // Loading state
 * <Button loading>Submitting...</Button>
 *
 * // As a link (polymorphic)
 * <Button asChild>
 *   <Link href="/shop">Go to Shop</Link>
 * </Button>
 * ```
 *
 * @module components/ui/button
 */

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

/**
 * BUTTON VARIANTS
 *
 * Defines all visual variants and sizes using CVA (Class Variance Authority).
 * All styles use Tailwind classes that reference our theme configuration.
 *
 * VARIANTS:
 * - default: Primary orange button for main CTAs
 * - secondary: Subtle gray button for secondary actions
 * - destructive: Red button for dangerous actions (delete, etc.)
 * - outline: Bordered button with transparent background
 * - ghost: Text-only button with hover effect
 * - link: Underlined link-style button
 *
 * SIZES:
 * - sm: Small button for tight spaces
 * - default: Standard button size
 * - lg: Large button for emphasis
 * - icon: Square button for icon-only use
 */
const buttonVariants = cva(
  // Base styles applied to all buttons
  [
    'inline-flex items-center justify-center gap-2',
    'whitespace-nowrap rounded-md',
    'text-sm font-medium',
    'transition-all duration-base',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'relative overflow-hidden', // For ripple effect
  ].join(' '),
  {
    variants: {
      /**
       * Visual variants
       */
      variant: {
        /** Primary orange button - main CTAs */
        default: [
          'bg-primary-500 text-white',
          'hover:bg-primary-600 hover:shadow-md hover:scale-[1.02]',
          'active:bg-primary-700 active:scale-[0.98]',
        ].join(' '),

        /** Destructive red button - dangerous actions */
        destructive: [
          'bg-accent-500 text-white',
          'hover:bg-accent-600 hover:shadow-md hover:scale-[1.02]',
          'active:bg-accent-700 active:scale-[0.98]',
        ].join(' '),

        /** Outline button - bordered with transparent background */
        outline: [
          'border-2 border-primary-500 text-primary-500 bg-transparent',
          'hover:bg-primary-50 hover:shadow-sm',
          'dark:hover:bg-primary-950',
          'active:bg-primary-100 dark:active:bg-primary-900',
        ].join(' '),

        /** Secondary button - subtle gray */
        secondary: [
          'bg-neutral-200 text-neutral-900',
          'hover:bg-neutral-300 hover:shadow-sm',
          'dark:bg-neutral-800 dark:text-neutral-100',
          'dark:hover:bg-neutral-700',
          'active:bg-neutral-400 dark:active:bg-neutral-600',
        ].join(' '),

        /** Ghost button - transparent with hover effect */
        ghost: [
          'bg-transparent',
          'hover:bg-neutral-100 hover:text-neutral-900',
          'dark:hover:bg-neutral-800 dark:hover:text-neutral-100',
          'active:bg-neutral-200 dark:active:bg-neutral-700',
        ].join(' '),

        /** Link button - styled like a link */
        link: [
          'text-primary-500 underline-offset-4',
          'hover:underline',
          'active:text-primary-600',
        ].join(' '),

        /** Success button - green for positive actions */
        success: [
          'bg-success-DEFAULT text-white',
          'hover:bg-success-dark hover:shadow-md hover:scale-[1.02]',
          'active:scale-[0.98]',
        ].join(' '),
      },

      /**
       * Size variants
       */
      size: {
        /** Default size - standard button */
        default: 'h-10 px-4 py-2',
        /** Small size - compact button */
        sm: 'h-9 rounded-md px-3 text-xs',
        /** Large size - prominent button */
        lg: 'h-11 rounded-md px-8 text-base',
        /** Icon size - square button for icons */
        icon: 'h-10 w-10 p-0',
        /** Icon small - small square button */
        'icon-sm': 'h-8 w-8 p-0',
        /** Icon large - large square button */
        'icon-lg': 'h-12 w-12 p-0',
      },

      /**
       * Full width option
       */
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      fullWidth: false,
    },
  }
)

/**
 * BUTTON PROPS
 *
 * Extends native button attributes with our custom variants.
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render as child component (polymorphic) */
  asChild?: boolean
  /** Show loading spinner */
  loading?: boolean
  /** Icon to show before text */
  leftIcon?: React.ReactNode
  /** Icon to show after text */
  rightIcon?: React.ReactNode
}

/**
 * BUTTON COMPONENT
 *
 * Main button component with all variants and features.
 *
 * @param props - Button props
 * @returns Button element
 *
 * @example
 * ```tsx
 * // Primary button
 * <Button>Submit</Button>
 *
 * // Loading state
 * <Button loading disabled>Processing...</Button>
 *
 * // With icons
 * <Button leftIcon={<Icon />}>Click Me</Button>
 *
 * // As a link
 * <Button asChild>
 *   <Link href="/shop">Shop Now</Link>
 * </Button>
 * ```
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // Use Slot for polymorphic rendering (asChild), otherwise use button
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {/* Show loading spinner if loading */}
        {loading && (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        )}

        {/* Left icon (if provided and not loading) */}
        {!loading && leftIcon && (
          <span className="inline-flex shrink-0" aria-hidden="true">
            {leftIcon}
          </span>
        )}

        {/* Button content */}
        {children}

        {/* Right icon (if provided and not loading) */}
        {!loading && rightIcon && (
          <span className="inline-flex shrink-0" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </Comp>
    )
  }
)

Button.displayName = 'Button'

/**
 * BUTTON GROUP COMPONENT
 *
 * Groups buttons together visually.
 * Useful for toolbars or related actions.
 *
 * @param props - Button group props
 * @returns Button group container
 *
 * @example
 * ```tsx
 * <ButtonGroup>
 *   <Button>First</Button>
 *   <Button>Second</Button>
 *   <Button>Third</Button>
 * </ButtonGroup>
 * ```
 */
export function ButtonGroup({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'inline-flex rounded-md shadow-sm',
        '[&>button]:rounded-none',
        '[&>button:first-child]:rounded-l-md',
        '[&>button:last-child]:rounded-r-md',
        '[&>button:not(:last-child)]:border-r-0',
        className
      )}
      role="group"
    >
      {children}
    </div>
  )
}

/**
 * ICON BUTTON COMPONENT
 *
 * Specialized button for icon-only use.
 * Ensures proper accessibility with required aria-label.
 *
 * @param props - Icon button props
 * @returns Icon button element
 *
 * @example
 * ```tsx
 * <IconButton aria-label="Delete" onClick={handleDelete}>
 *   <TrashIcon />
 * </IconButton>
 * ```
 */
export const IconButton = React.forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, 'size'> & {
    size?: 'icon' | 'icon-sm' | 'icon-lg'
    'aria-label': string // Required for accessibility
  }
>(({ size = 'icon', ...props }, ref) => {
  return <Button ref={ref} size={size} {...props} />
})

IconButton.displayName = 'IconButton'

/**
 * Export button variants for external use
 */
export { Button, buttonVariants }
