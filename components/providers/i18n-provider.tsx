/**
 * INTERNATIONALIZATION (i18n) PROVIDER
 *
 * Manages application language state and provides translations throughout the app.
 * Supports English and Portuguese with easy switching and localStorage persistence.
 *
 * USAGE:
 * Wrap your app with this provider, then use the useTranslation hook:
 *
 * ```tsx
 * const { t, locale, setLocale } = useTranslation()
 * return <h1>{t.home.hero.title}</h1>
 * ```
 *
 * @module i18n-provider
 */

'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { translations, DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale, type TranslationKeys } from '@/config/i18n.config'

/**
 * i18n Context shape
 */
interface I18nContextType {
  /** Current active locale */
  locale: Locale
  /** Function to change the locale */
  setLocale: (locale: Locale) => void
  /** Translations object for current locale */
  t: TranslationKeys
  /** Check if a locale is supported */
  isLocaleSupported: (locale: string) => locale is Locale
}

/**
 * Create the i18n context
 */
const I18nContext = createContext<I18nContextType | undefined>(undefined)

/**
 * Local storage key for persisting language preference
 */
const LOCALE_STORAGE_KEY = 'alphagrit_locale'

/**
 * i18n Provider Props
 */
interface I18nProviderProps {
  /** Child components */
  children: ReactNode
  /** Optional initial locale (defaults to browser locale or DEFAULT_LOCALE) */
  initialLocale?: Locale
}

/**
 * i18n PROVIDER COMPONENT
 *
 * Provides internationalization context to the entire application.
 * Handles locale detection, persistence, and translation access.
 *
 * Features:
 * - Automatic browser language detection
 * - localStorage persistence of language preference
 * - Type-safe translation access
 * - Easy locale switching
 *
 * @param props - Provider props
 * @returns i18n context provider
 */
export function I18nProvider({ children, initialLocale }: I18nProviderProps) {
  /**
   * Initialize locale state with the following priority:
   * 1. initialLocale prop (if provided)
   * 2. localStorage value (if exists)
   * 3. Browser language (if supported)
   * 4. DEFAULT_LOCALE as fallback
   */
  const [locale, setLocaleState] = useState<Locale>(() => {
    // During SSR, return default locale
    if (typeof window === 'undefined') {
      return initialLocale || DEFAULT_LOCALE
    }

    // Check localStorage first
    const storedLocale = localStorage.getItem(LOCALE_STORAGE_KEY)
    if (storedLocale && isLocaleSupported(storedLocale)) {
      return storedLocale as Locale
    }

    // Detect browser language
    const browserLang = navigator.language.split('-')[0]
    if (isLocaleSupported(browserLang)) {
      return browserLang as Locale
    }

    // Fallback to default
    return initialLocale || DEFAULT_LOCALE
  })

  /**
   * Check if a locale string is supported
   */
  function isLocaleSupported(locale: string): locale is Locale {
    return Object.values(SUPPORTED_LOCALES).includes(locale as Locale)
  }

  /**
   * Change the locale and persist to localStorage
   */
  const setLocale = (newLocale: Locale) => {
    if (!isLocaleSupported(newLocale)) {
      console.warn(`[i18n] Unsupported locale: ${newLocale}. Falling back to ${DEFAULT_LOCALE}`)
      return
    }

    setLocaleState(newLocale)

    // Persist to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCALE_STORAGE_KEY, newLocale)
    }

    // Update HTML lang attribute for accessibility
    if (typeof document !== 'undefined') {
      document.documentElement.lang = newLocale
    }
  }

  /**
   * Set HTML lang attribute on mount and when locale changes
   */
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale
    }
  }, [locale])

  /**
   * Get translations for current locale
   */
  const t = translations[locale] as TranslationKeys

  /**
   * Context value
   */
  const value: I18nContextType = {
    locale,
    setLocale,
    t,
    isLocaleSupported,
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

/**
 * CUSTOM HOOK: useTranslation
 *
 * Access translations and locale management anywhere in the app.
 *
 * @returns i18n context
 * @throws Error if used outside I18nProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { t, locale, setLocale } = useTranslation()
 *
 *   return (
 *     <div>
 *       <h1>{t.home.hero.title}</h1>
 *       <button onClick={() => setLocale('pt')}>
 *         Switch to Portuguese
 *       </button>
 *     </div>
 *   )
 * }
 * ```
 */
export function useTranslation() {
  const context = useContext(I18nContext)

  if (context === undefined) {
    throw new Error('useTranslation must be used within an I18nProvider')
  }

  return context
}

/**
 * UTILITY: Get translation without hook
 *
 * Useful for getting translations outside of React components.
 *
 * @param locale - The locale to get translations for
 * @returns Translation object for the specified locale
 *
 * @example
 * ```tsx
 * const t = getTranslations('pt')
 * console.log(t.common.loading)
 * ```
 */
export function getTranslations(locale: Locale): TranslationKeys {
  return translations[locale] as TranslationKeys
}

/**
 * UTILITY: Format currency
 *
 * Format a number as currency based on locale.
 *
 * @param amount - The amount to format
 * @param locale - The locale to use for formatting
 * @param currency - The currency code (default: USD for EN, BRL for PT)
 * @returns Formatted currency string
 *
 * @example
 * ```tsx
 * formatCurrency(99.99, 'en') // "$99.99"
 * formatCurrency(99.99, 'pt') // "R$ 99,99"
 * ```
 */
export function formatCurrency(amount: number, locale: Locale, currency?: string): string {
  const currencyCode = currency || (locale === 'pt' ? 'BRL' : 'USD')
  const localeCode = locale === 'pt' ? 'pt-BR' : 'en-US'

  return new Intl.NumberFormat(localeCode, {
    style: 'currency',
    currency: currencyCode,
  }).format(amount)
}

/**
 * UTILITY: Format date
 *
 * Format a date based on locale.
 *
 * @param date - The date to format
 * @param locale - The locale to use for formatting
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string
 *
 * @example
 * ```tsx
 * formatDate(new Date(), 'en') // "January 1, 2024"
 * formatDate(new Date(), 'pt') // "1 de janeiro de 2024"
 * ```
 */
export function formatDate(
  date: Date,
  locale: Locale,
  options?: Intl.DateTimeFormatOptions
): string {
  const localeCode = locale === 'pt' ? 'pt-BR' : 'en-US'
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }

  return new Intl.DateTimeFormat(localeCode, options || defaultOptions).format(date)
}

/**
 * Export types for external use
 */
export type { I18nContextType, Locale, TranslationKeys }
