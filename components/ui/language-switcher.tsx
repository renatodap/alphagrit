/**
 * LANGUAGE SWITCHER COMPONENT
 *
 * Toggle between English and Portuguese languages.
 * Persists selection to localStorage and updates entire app.
 *
 * USAGE:
 * ```tsx
 * // In header or settings
 * <LanguageSwitcher />
 * ```
 *
 * @module components/ui/language-switcher
 */

'use client'

import * as React from 'react'
import { useTranslation } from '@/components/providers/i18n-provider'
import { LOCALE_NAMES, SUPPORTED_LOCALES, type Locale } from '@/config/i18n.config'
import { Globe } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Language Switcher Props
 */
interface LanguageSwitcherProps {
  /** Custom className for styling */
  className?: string
  /** Display variant */
  variant?: 'dropdown' | 'toggle' | 'inline'
  /** Show label text */
  showLabel?: boolean
}

/**
 * LANGUAGE SWITCHER COMPONENT
 *
 * Allows users to switch between supported languages (EN/PT).
 * Automatically updates the entire app via i18n context.
 *
 * @param props - Language switcher props
 * @returns Language switcher UI
 *
 * @example
 * ```tsx
 * // Simple toggle in header
 * <LanguageSwitcher variant="toggle" />
 *
 * // Dropdown with label
 * <LanguageSwitcher variant="dropdown" showLabel />
 * ```
 */
export function LanguageSwitcher({
  className,
  variant = 'toggle',
  showLabel = false,
}: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useTranslation()

  /**
   * Handle language change
   */
  const handleLanguageChange = (newLocale: Locale) => {
    setLocale(newLocale)
  }

  /**
   * Toggle variant - simple button to switch languages
   */
  if (variant === 'toggle') {
    const nextLocale = locale === SUPPORTED_LOCALES.EN ? SUPPORTED_LOCALES.PT : SUPPORTED_LOCALES.EN

    return (
      <button
        onClick={() => handleLanguageChange(nextLocale)}
        className={cn(
          'inline-flex items-center gap-2 px-3 py-2 rounded-md',
          'text-sm font-medium',
          'bg-neutral-100 hover:bg-neutral-200',
          'dark:bg-neutral-800 dark:hover:bg-neutral-700',
          'transition-colors duration-base',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          className
        )}
        aria-label={`Switch to ${LOCALE_NAMES[nextLocale]}`}
        title={`Switch to ${LOCALE_NAMES[nextLocale]}`}
      >
        <Globe className="h-4 w-4" aria-hidden="true" />
        {showLabel && (
          <span>{locale.toUpperCase()}</span>
        )}
      </button>
    )
  }

  /**
   * Inline variant - side-by-side language options
   */
  if (variant === 'inline') {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-1 p-1 rounded-md',
          'bg-neutral-100 dark:bg-neutral-800',
          className
        )}
        role="group"
        aria-label="Language selection"
      >
        {Object.entries(LOCALE_NAMES).map(([code, name]) => {
          const localeCode = code as Locale
          const isActive = locale === localeCode

          return (
            <button
              key={code}
              onClick={() => handleLanguageChange(localeCode)}
              className={cn(
                'px-3 py-1.5 rounded text-sm font-medium',
                'transition-all duration-base',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                isActive
                  ? 'bg-white text-primary-500 shadow-sm dark:bg-neutral-700 dark:text-primary-400'
                  : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
              )}
              aria-label={`Switch to ${name}`}
              aria-pressed={isActive}
            >
              {showLabel ? name : code.toUpperCase()}
            </button>
          )
        })}
      </div>
    )
  }

  /**
   * Dropdown variant - select dropdown
   */
  return (
    <div className={cn('relative inline-block', className)}>
      <label htmlFor="language-select" className="sr-only">
        Select Language
      </label>
      <div className="relative">
        <Globe
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500 pointer-events-none"
          aria-hidden="true"
        />
        <select
          id="language-select"
          value={locale}
          onChange={(e) => handleLanguageChange(e.target.value as Locale)}
          className={cn(
            'appearance-none pl-10 pr-8 py-2 rounded-md',
            'bg-neutral-100 hover:bg-neutral-200',
            'dark:bg-neutral-800 dark:hover:bg-neutral-700',
            'text-sm font-medium',
            'border border-transparent',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
            'transition-colors duration-base',
            'cursor-pointer'
          )}
          aria-label="Select language"
        >
          {Object.entries(LOCALE_NAMES).map(([code, name]) => (
            <option key={code} value={code}>
              {showLabel ? name : code.toUpperCase()}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className="h-4 w-4 text-neutral-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}

/**
 * COMPACT LANGUAGE SWITCHER
 *
 * Minimal language switcher showing only language codes.
 * Perfect for headers where space is limited.
 *
 * @param props - Component props
 * @returns Compact language switcher
 *
 * @example
 * ```tsx
 * <CompactLanguageSwitcher />
 * ```
 */
export function CompactLanguageSwitcher({ className }: { className?: string }) {
  return <LanguageSwitcher variant="inline" showLabel={false} className={className} />
}

/**
 * LANGUAGE SELECTOR WITH LABEL
 *
 * Full language selector with descriptive labels.
 * Best for settings pages or forms.
 *
 * @param props - Component props
 * @returns Language selector with labels
 *
 * @example
 * ```tsx
 * <LanguageSelectorWithLabel />
 * ```
 */
export function LanguageSelectorWithLabel({ className }: { className?: string }) {
  return <LanguageSwitcher variant="dropdown" showLabel className={className} />
}
