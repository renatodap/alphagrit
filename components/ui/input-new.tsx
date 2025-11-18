/**
 * INPUT COMPONENT
 *
 * Versatile input component for forms with multiple variants and states.
 * Fully accessible, type-safe, and responsive.
 *
 * DESIGN PRINCIPLES:
 * - Uses only theme values from config/theme.config.ts
 * - No hardcoded colors, spacing, or styling
 * - Fully type-safe with TypeScript
 * - Supports error states, disabled, icons, and more
 * - Works with React Hook Form and native forms
 *
 * USAGE:
 * ```tsx
 * // Basic input
 * <Input placeholder="Enter your email" />
 *
 * // With label and error
 * <Input
 *   label="Email"
 *   error="Invalid email address"
 *   type="email"
 * />
 *
 * // With icons
 * <Input
 *   leftIcon={<SearchIcon />}
 *   placeholder="Search..."
 * />
 *
 * // Textarea variant
 * <Input
 *   multiline
 *   rows={4}
 *   placeholder="Enter your message"
 * />
 * ```
 *
 * @module components/ui/input
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { AlertCircle } from 'lucide-react'

/**
 * INPUT VARIANTS
 *
 * Defines visual variants and sizes for inputs.
 *
 * VARIANTS:
 * - default: Standard input with border
 * - filled: Filled background input
 * - ghost: Borderless input
 *
 * SIZES:
 * - sm: Small input for compact forms
 * - default: Standard input size
 * - lg: Large input for emphasis
 */
const inputVariants = cva(
  // Base styles applied to all inputs
  [
    'w-full rounded-md',
    'font-sans text-base',
    'transition-all duration-base',
    'placeholder:text-neutral-400 dark:placeholder:text-neutral-500',
    'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0',
    'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-100 dark:disabled:bg-neutral-900',
  ].join(' '),
  {
    variants: {
      /**
       * Visual variants
       */
      variant: {
        /** Default bordered input */
        default: [
          'border border-input bg-background',
          'hover:border-neutral-400 dark:hover:border-neutral-600',
        ].join(' '),

        /** Filled background input */
        filled: [
          'border-0 bg-neutral-100 dark:bg-neutral-800',
          'hover:bg-neutral-200 dark:hover:bg-neutral-700',
        ].join(' '),

        /** Borderless ghost input */
        ghost: [
          'border-0 bg-transparent',
          'hover:bg-neutral-50 dark:hover:bg-neutral-900',
        ].join(' '),
      },

      /**
       * Size variants
       */
      size: {
        /** Small input */
        sm: 'h-9 px-3 py-1 text-sm',
        /** Default input size */
        default: 'h-10 px-4 py-2',
        /** Large input */
        lg: 'h-11 px-4 py-3 text-lg',
      },

      /**
       * Error state
       */
      hasError: {
        true: [
          'border-error-DEFAULT dark:border-error-DEFAULT',
          'focus:ring-error-DEFAULT',
        ].join(' '),
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      hasError: false,
    },
  }
)

/**
 * INPUT PROPS
 *
 * Extends native input attributes with custom variants.
 */
export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  /** Input label */
  label?: string
  /** Error message to display */
  error?: string
  /** Helper text to display below input */
  helperText?: string
  /** Icon to show before input */
  leftIcon?: React.ReactNode
  /** Icon to show after input */
  rightIcon?: React.ReactNode
  /** Make input full width */
  fullWidth?: boolean
  /** Required field indicator */
  required?: boolean
  /** Render as textarea */
  multiline?: boolean
  /** Number of rows for textarea */
  rows?: number
  /** Container className */
  containerClassName?: string
  /** Label className */
  labelClassName?: string
}

/**
 * INPUT COMPONENT
 *
 * Main input component with all variants and features.
 *
 * @param props - Input props
 * @returns Input element with optional label, icons, and error states
 *
 * @example
 * ```tsx
 * // Basic input with label
 * <Input
 *   label="Email"
 *   type="email"
 *   placeholder="you@example.com"
 *   required
 * />
 *
 * // Input with error state
 * <Input
 *   label="Password"
 *   type="password"
 *   error="Password must be at least 8 characters"
 * />
 *
 * // Input with icons
 * <Input
 *   leftIcon={<SearchIcon />}
 *   placeholder="Search products..."
 * />
 *
 * // Textarea variant
 * <Input
 *   multiline
 *   rows={4}
 *   label="Message"
 *   placeholder="Enter your message here..."
 * />
 * ```
 */
export const Input = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  InputProps
>(
  (
    {
      className,
      variant,
      size,
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = true,
      required,
      multiline = false,
      rows = 3,
      containerClassName,
      labelClassName,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    // Generate unique ID - must be called unconditionally
    const generatedId = React.useId()
    const inputId = id || generatedId
    const hasError = !!error

    /**
     * Wrapper div for the entire input component
     */
    const containerClasses = cn(
      fullWidth ? 'w-full' : 'w-auto',
      'flex flex-col gap-1',
      containerClassName
    )

    /**
     * Label styling
     */
    const labelClasses = cn(
      'text-sm font-medium text-neutral-700 dark:text-neutral-300',
      disabled && 'opacity-50 cursor-not-allowed',
      labelClassName
    )

    /**
     * Input wrapper for icons
     */
    const inputWrapperClasses = cn(
      'relative flex items-center',
      fullWidth && 'w-full'
    )

    /**
     * Icon styling
     */
    const iconClasses = 'absolute h-4 w-4 text-neutral-500 dark:text-neutral-400'
    const leftIconClasses = cn(iconClasses, 'left-3')
    const rightIconClasses = cn(iconClasses, 'right-3')

    /**
     * Adjust padding when icons are present
     */
    const paddingClasses = cn(
      leftIcon && 'pl-10',
      rightIcon && 'pr-10',
      hasError && rightIcon === undefined && 'pr-10' // Make room for error icon
    )

    /**
     * Input classes
     */
    const inputClasses = cn(
      inputVariants({ variant, size, hasError }),
      paddingClasses,
      className
    )

    /**
     * Helper/Error text styling
     */
    const helperTextClasses = cn(
      'text-xs',
      hasError
        ? 'text-error-DEFAULT dark:text-error-light'
        : 'text-neutral-500 dark:text-neutral-400'
    )

    /**
     * Render textarea if multiline
     */
    if (multiline) {
      return (
        <div className={containerClasses}>
          {/* Label */}
          {label && (
            <label htmlFor={inputId} className={labelClasses}>
              {label}
              {required && <span className="text-error-DEFAULT ml-1">*</span>}
            </label>
          )}

          {/* Textarea */}
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            id={inputId}
            rows={rows}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={
              hasError
                ? `${inputId}-error`
                : helperText
                ? `${inputId}-helper`
                : undefined
            }
            className={inputClasses}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />

          {/* Error or Helper Text */}
          {(error || helperText) && (
            <span
              id={hasError ? `${inputId}-error` : `${inputId}-helper`}
              className={helperTextClasses}
            >
              {error || helperText}
            </span>
          )}
        </div>
      )
    }

    /**
     * Render standard input
     */
    return (
      <div className={containerClasses}>
        {/* Label */}
        {label && (
          <label htmlFor={inputId} className={labelClasses}>
            {label}
            {required && <span className="text-error-DEFAULT ml-1">*</span>}
          </label>
        )}

        {/* Input with icons */}
        <div className={inputWrapperClasses}>
          {/* Left Icon */}
          {leftIcon && (
            <span className={leftIconClasses} aria-hidden="true">
              {leftIcon}
            </span>
          )}

          {/* Input */}
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            id={inputId}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={
              hasError
                ? `${inputId}-error`
                : helperText
                ? `${inputId}-helper`
                : undefined
            }
            className={inputClasses}
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          />

          {/* Right Icon or Error Icon */}
          {hasError && !rightIcon ? (
            <AlertCircle className={rightIconClasses} aria-hidden="true" />
          ) : (
            rightIcon && (
              <span className={rightIconClasses} aria-hidden="true">
                {rightIcon}
              </span>
            )
          )}
        </div>

        {/* Error or Helper Text */}
        {(error || helperText) && (
          <span
            id={hasError ? `${inputId}-error` : `${inputId}-helper`}
            className={helperTextClasses}
          >
            {error || helperText}
          </span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

/**
 * FORM GROUP COMPONENT
 *
 * Groups multiple form fields together with consistent spacing.
 *
 * @param props - Form group props
 * @returns Form group container
 *
 * @example
 * ```tsx
 * <FormGroup>
 *   <Input label="First Name" />
 *   <Input label="Last Name" />
 *   <Input label="Email" type="email" />
 * </FormGroup>
 * ```
 */
export function FormGroup({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-4', className)} role="group">
      {children}
    </div>
  )
}

/**
 * FORM ROW COMPONENT
 *
 * Creates a horizontal row of form fields (responsive grid).
 *
 * @param props - Form row props
 * @returns Form row with responsive grid
 *
 * @example
 * ```tsx
 * <FormRow>
 *   <Input label="First Name" />
 *   <Input label="Last Name" />
 * </FormRow>
 * ```
 */
export function FormRow({
  children,
  className,
  columns = 2,
}: {
  children: React.ReactNode
  className?: string
  columns?: 1 | 2 | 3 | 4
}) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div className={cn('grid gap-4', gridCols[columns], className)}>
      {children}
    </div>
  )
}

/**
 * Export input variants for external use
 */
export { inputVariants }
