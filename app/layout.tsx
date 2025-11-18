/**
 * ROOT LAYOUT
 *
 * Main application layout with global providers and metadata.
 * All providers wrap the entire app to provide context to all pages.
 *
 * @module layout
 */

import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { I18nProvider } from '@/components/providers/i18n-provider'
import { CartProvider } from '@/components/providers/cart-provider'
import { Toaster } from 'react-hot-toast'
import { theme } from '@/config/theme.config'
import { APP_NAME, APP_DESCRIPTION, SEO } from '@/lib/constants'

/**
 * APPLICATION METADATA
 *
 * SEO and social media metadata for the entire application.
 * Individual pages can override these values.
 */
export const metadata: Metadata = {
  title: SEO.DEFAULT_TITLE,
  description: SEO.DEFAULT_DESCRIPTION,
  keywords: SEO.DEFAULT_KEYWORDS,
  authors: [{ name: APP_NAME }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'pt_BR',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: APP_NAME,
    title: SEO.DEFAULT_TITLE,
    description: SEO.DEFAULT_DESCRIPTION,
    images: [
      {
        url: SEO.OG_IMAGE,
        width: 1200,
        height: 630,
        alt: APP_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SEO.DEFAULT_TITLE,
    description: SEO.DEFAULT_DESCRIPTION,
    images: [SEO.OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

/**
 * ROOT LAYOUT COMPONENT
 *
 * Wraps the entire application with global providers:
 * - ThemeProvider: Dark/light mode theming
 * - I18nProvider: Multi-language support (EN/PT)
 * - CartProvider: Shopping cart state management
 *
 * Also includes the toast notification system.
 *
 * @param props - Layout props
 * @returns Root layout with providers
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider>
            <CartProvider>
              {children}

              {/* Toast notification system - styled with theme colors */}
              <Toaster
                position="top-right"
                toastOptions={{
                  // Base toast styles
                  className: '',
                  style: {
                    background: theme.colors.neutral[900],
                    color: theme.colors.neutral[50],
                    borderRadius: theme.borderRadius.md,
                    padding: theme.spacing.md,
                  },
                  // Success toast styling
                  success: {
                    iconTheme: {
                      primary: theme.colors.primary[500],
                      secondary: theme.colors.neutral[50],
                    },
                  },
                  // Error toast styling
                  error: {
                    iconTheme: {
                      primary: theme.colors.accent[500],
                      secondary: theme.colors.neutral[50],
                    },
                  },
                  // Animation duration
                  duration: parseInt(theme.animation.duration.slow),
                }}
              />
            </CartProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
