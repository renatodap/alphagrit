/**
 * LAYOUT COMPONENTS
 *
 * Foundational layout components for consistent page structure.
 * These components handle responsive spacing, max-widths, and grid layouts.
 *
 * DESIGN PRINCIPLES:
 * - Uses only theme values from config/theme.config.ts
 * - No hardcoded spacing, widths, or breakpoints
 * - Mobile-first responsive design
 * - Composable and reusable
 *
 * COMPONENTS:
 * - Container: Max-width wrapper with responsive padding
 * - Section: Full-width section with configurable spacing
 * - Grid: Responsive grid layout
 * - Stack: Vertical spacing stack
 * - Flex: Flexbox utility component
 *
 * @module components/ui/layout
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * CONTAINER VARIANTS
 *
 * Max-width container with responsive padding.
 *
 * SIZES:
 * - sm: 640px max-width
 * - md: 768px max-width
 * - lg: 1024px max-width
 * - xl: 1280px max-width
 * - 2xl: 1536px max-width
 * - full: No max-width constraint
 */
const containerVariants = cva(
  // Base styles
  ['mx-auto px-4 sm:px-6 lg:px-8'].join(' '),
  {
    variants: {
      /**
       * Max-width sizes
       */
      size: {
        sm: 'max-w-screen-sm',
        md: 'max-w-screen-md',
        lg: 'max-w-screen-lg',
        xl: 'max-w-screen-xl',
        '2xl': 'max-w-screen-2xl',
        full: 'max-w-full',
      },
    },
    defaultVariants: {
      size: 'xl',
    },
  }
)

/**
 * CONTAINER PROPS
 */
export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  /** Render as a different element */
  as?: React.ElementType
}

/**
 * CONTAINER COMPONENT
 *
 * Max-width wrapper for page content with responsive padding.
 * Keeps content from getting too wide on large screens.
 *
 * @param props - Container props
 * @returns Container element
 *
 * @example
 * ```tsx
 * // Standard container
 * <Container>
 *   <h1>Page Content</h1>
 * </Container>
 *
 * // Narrow container for forms
 * <Container size="md">
 *   <form>...</form>
 * </Container>
 *
 * // Full width container
 * <Container size="full">
 *   <div>Full width content</div>
 * </Container>
 * ```
 */
export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, as: Component = 'div', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(containerVariants({ size }), className)}
        {...props}
      />
    )
  }
)

Container.displayName = 'Container'

/**
 * SECTION VARIANTS
 *
 * Full-width section with configurable spacing.
 *
 * SPACING:
 * - none: No padding
 * - sm: Small vertical padding
 * - default: Standard vertical padding
 * - lg: Large vertical padding
 * - xl: Extra large vertical padding
 */
const sectionVariants = cva(
  // Base styles
  ['w-full'].join(' '),
  {
    variants: {
      /**
       * Vertical spacing
       */
      spacing: {
        none: 'py-0',
        sm: 'py-8',
        default: 'py-12 md:py-16',
        lg: 'py-16 md:py-24',
        xl: 'py-24 md:py-32',
      },

      /**
       * Background variant
       */
      variant: {
        default: 'bg-background',
        muted: 'bg-muted',
        primary: 'bg-primary-50 dark:bg-primary-950',
        accent: 'bg-accent-50 dark:bg-accent-950',
      },
    },
    defaultVariants: {
      spacing: 'default',
      variant: 'default',
    },
  }
)

/**
 * SECTION PROPS
 */
export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  /** Render as a different element */
  as?: React.ElementType
  /** Include a container inside the section */
  container?: boolean
  /** Container size when container is true */
  containerSize?: ContainerProps['size']
}

/**
 * SECTION COMPONENT
 *
 * Full-width section with configurable spacing and background.
 * Can automatically wrap content in a Container.
 *
 * @param props - Section props
 * @returns Section element
 *
 * @example
 * ```tsx
 * // Basic section
 * <Section>
 *   <Container>
 *     <h2>Section Content</h2>
 *   </Container>
 * </Section>
 *
 * // Section with automatic container
 * <Section container>
 *   <h2>Auto-contained content</h2>
 * </Section>
 *
 * // Section with custom spacing and background
 * <Section spacing="lg" variant="muted">
 *   <Container>
 *     <h2>Large spaced section</h2>
 *   </Container>
 * </Section>
 * ```
 */
export const Section = React.forwardRef<HTMLElement, SectionProps>(
  (
    {
      className,
      spacing,
      variant,
      as: Component = 'section',
      container = false,
      containerSize = 'xl',
      children,
      ...props
    },
    ref
  ) => {
    const content = container ? (
      <Container size={containerSize}>{children}</Container>
    ) : (
      children
    )

    return (
      <Component
        ref={ref}
        className={cn(sectionVariants({ spacing, variant }), className)}
        {...props}
      >
        {content}
      </Component>
    )
  }
)

Section.displayName = 'Section'

/**
 * GRID VARIANTS
 *
 * Responsive grid layout system.
 *
 * COLUMNS:
 * - 1, 2, 3, 4, 5, 6: Number of columns (responsive)
 */
const gridVariants = cva(
  // Base styles
  ['grid'].join(' '),
  {
    variants: {
      /**
       * Number of columns (responsive)
       */
      cols: {
        1: 'grid-cols-1',
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
        5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
        6: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
      },

      /**
       * Gap between grid items
       */
      gap: {
        none: 'gap-0',
        sm: 'gap-2',
        default: 'gap-4',
        md: 'gap-6',
        lg: 'gap-8',
        xl: 'gap-12',
      },
    },
    defaultVariants: {
      cols: 3,
      gap: 'default',
    },
  }
)

/**
 * GRID PROPS
 */
export interface GridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridVariants> {
  /** Render as a different element */
  as?: React.ElementType
}

/**
 * GRID COMPONENT
 *
 * Responsive grid layout with configurable columns and gaps.
 *
 * @param props - Grid props
 * @returns Grid element
 *
 * @example
 * ```tsx
 * // 3-column grid (responsive)
 * <Grid cols={3}>
 *   <Card>Item 1</Card>
 *   <Card>Item 2</Card>
 *   <Card>Item 3</Card>
 * </Grid>
 *
 * // 4-column grid with large gaps
 * <Grid cols={4} gap="lg">
 *   <ProductCard {...product1} />
 *   <ProductCard {...product2} />
 * </Grid>
 * ```
 */
export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols, gap, as: Component = 'div', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(gridVariants({ cols, gap }), className)}
        {...props}
      />
    )
  }
)

Grid.displayName = 'Grid'

/**
 * STACK VARIANTS
 *
 * Vertical stack with configurable spacing.
 */
const stackVariants = cva(
  // Base styles
  ['flex flex-col'].join(' '),
  {
    variants: {
      /**
       * Vertical spacing between items
       */
      spacing: {
        none: 'gap-0',
        xs: 'gap-1',
        sm: 'gap-2',
        default: 'gap-4',
        md: 'gap-6',
        lg: 'gap-8',
        xl: 'gap-12',
      },

      /**
       * Alignment
       */
      align: {
        start: 'items-start',
        center: 'items-center',
        end: 'items-end',
        stretch: 'items-stretch',
      },
    },
    defaultVariants: {
      spacing: 'default',
      align: 'stretch',
    },
  }
)

/**
 * STACK PROPS
 */
export interface StackProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stackVariants> {
  /** Render as a different element */
  as?: React.ElementType
}

/**
 * STACK COMPONENT
 *
 * Vertical stack for consistent spacing between elements.
 *
 * @param props - Stack props
 * @returns Stack element
 *
 * @example
 * ```tsx
 * // Basic vertical stack
 * <Stack>
 *   <h1>Title</h1>
 *   <p>Paragraph</p>
 *   <Button>Action</Button>
 * </Stack>
 *
 * // Centered stack with custom spacing
 * <Stack spacing="lg" align="center">
 *   <Icon />
 *   <h2>Empty State</h2>
 *   <Button>Get Started</Button>
 * </Stack>
 * ```
 */
export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ className, spacing, align, as: Component = 'div', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(stackVariants({ spacing, align }), className)}
        {...props}
      />
    )
  }
)

Stack.displayName = 'Stack'

/**
 * FLEX VARIANTS
 *
 * Flexbox utility component.
 */
const flexVariants = cva(
  // Base styles
  ['flex'].join(' '),
  {
    variants: {
      /**
       * Flex direction
       */
      direction: {
        row: 'flex-row',
        column: 'flex-col',
        'row-reverse': 'flex-row-reverse',
        'column-reverse': 'flex-col-reverse',
      },

      /**
       * Justify content
       */
      justify: {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
        between: 'justify-between',
        around: 'justify-around',
        evenly: 'justify-evenly',
      },

      /**
       * Align items
       */
      align: {
        start: 'items-start',
        center: 'items-center',
        end: 'items-end',
        stretch: 'items-stretch',
        baseline: 'items-baseline',
      },

      /**
       * Gap between items
       */
      gap: {
        none: 'gap-0',
        xs: 'gap-1',
        sm: 'gap-2',
        default: 'gap-4',
        md: 'gap-6',
        lg: 'gap-8',
        xl: 'gap-12',
      },

      /**
       * Wrap behavior
       */
      wrap: {
        nowrap: 'flex-nowrap',
        wrap: 'flex-wrap',
        'wrap-reverse': 'flex-wrap-reverse',
      },
    },
    defaultVariants: {
      direction: 'row',
      justify: 'start',
      align: 'stretch',
      gap: 'default',
      wrap: 'nowrap',
    },
  }
)

/**
 * FLEX PROPS
 */
export interface FlexProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof flexVariants> {
  /** Render as a different element */
  as?: React.ElementType
}

/**
 * FLEX COMPONENT
 *
 * Flexbox utility component for flexible layouts.
 *
 * @param props - Flex props
 * @returns Flex element
 *
 * @example
 * ```tsx
 * // Horizontal flex with space between
 * <Flex justify="between" align="center">
 *   <Logo />
 *   <Button>Login</Button>
 * </Flex>
 *
 * // Centered content
 * <Flex justify="center" align="center" direction="column" gap="lg">
 *   <Icon />
 *   <h2>Welcome</h2>
 *   <Button>Get Started</Button>
 * </Flex>
 * ```
 */
export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      className,
      direction,
      justify,
      align,
      gap,
      wrap,
      as: Component = 'div',
      ...props
    },
    ref
  ) => {
    return (
      <Component
        ref={ref}
        className={cn(
          flexVariants({ direction, justify, align, gap, wrap }),
          className
        )}
        {...props}
      />
    )
  }
)

Flex.displayName = 'Flex'

/**
 * SPACER COMPONENT
 *
 * Adds vertical or horizontal space between elements.
 *
 * @param props - Spacer props
 * @returns Spacer element
 *
 * @example
 * ```tsx
 * <div>
 *   <h1>Title</h1>
 *   <Spacer size="lg" />
 *   <p>Content after space</p>
 * </div>
 * ```
 */
export interface SpacerProps {
  /** Size of space */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  /** Direction (vertical or horizontal) */
  direction?: 'vertical' | 'horizontal'
  /** Custom className */
  className?: string
}

export const Spacer: React.FC<SpacerProps> = ({
  size = 'md',
  direction = 'vertical',
  className,
}) => {
  const sizeMap = {
    xs: direction === 'vertical' ? 'h-2' : 'w-2',
    sm: direction === 'vertical' ? 'h-4' : 'w-4',
    md: direction === 'vertical' ? 'h-6' : 'w-6',
    lg: direction === 'vertical' ? 'h-8' : 'w-8',
    xl: direction === 'vertical' ? 'h-12' : 'w-12',
    '2xl': direction === 'vertical' ? 'h-16' : 'w-16',
    '3xl': direction === 'vertical' ? 'h-24' : 'w-24',
  }

  return <div className={cn(sizeMap[size], className)} aria-hidden="true" />
}

Spacer.displayName = 'Spacer'

/**
 * DIVIDER COMPONENT
 *
 * Visual separator between sections.
 *
 * @param props - Divider props
 * @returns Divider element
 *
 * @example
 * ```tsx
 * <div>
 *   <Section>Content 1</Section>
 *   <Divider />
 *   <Section>Content 2</Section>
 * </div>
 * ```
 */
export interface DividerProps {
  /** Orientation */
  orientation?: 'horizontal' | 'vertical'
  /** Custom className */
  className?: string
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  className,
}) => {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        'bg-border',
        orientation === 'horizontal'
          ? 'h-px w-full my-6'
          : 'w-px h-full mx-6',
        className
      )}
    />
  )
}

Divider.displayName = 'Divider'

/**
 * Export all layout variants
 */
export {
  containerVariants,
  sectionVariants,
  gridVariants,
  stackVariants,
  flexVariants,
}
