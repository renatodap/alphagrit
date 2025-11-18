/**
 * HEADER COMPONENT
 *
 * Main site header with navigation, cart, account, and language switcher.
 * Fully responsive with mobile hamburger menu.
 *
 * FEATURES:
 * - Multi-language support (EN/PT) with language switcher
 * - Shopping cart with item count badge
 * - User account access
 * - Responsive navigation (desktop horizontal, mobile hamburger)
 * - Sticky header with backdrop blur
 * - Active link highlighting
 * - Zero hardcoded values
 *
 * @module components/store/header
 */

'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, User, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button-new'
import { Container, Flex } from '@/components/ui/layout-new'
import { CompactLanguageSwitcher } from '@/components/ui/language-switcher'
import { useTranslation } from '@/components/providers/i18n-provider'
import { useCart } from '@/components/providers/cart-provider'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/lib/constants'
import { theme } from '@/config/theme.config'

/**
 * NAVIGATION ITEMS
 *
 * Main navigation links for the site.
 * Keys match translation keys in i18n config.
 */
const NAV_ITEMS = [
  { key: 'shop', href: ROUTES.STORE },
  { key: 'blog', href: ROUTES.BLOG },
] as const

/**
 * HEADER COMPONENT
 *
 * Site-wide header with navigation and utilities.
 *
 * @returns Header element
 */
export function Header() {
  const pathname = usePathname()
  const { t } = useTranslation()
  const { itemCount } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  /**
   * Close mobile menu when route changes
   */
  React.useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  /**
   * Prevent scroll when mobile menu is open
   */
  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  return (
    <header
      className={cn(
        'sticky top-0 w-full border-b border-border',
        'bg-background/95 backdrop-blur-sm',
        'supports-[backdrop-filter]:bg-background/60',
        'transition-all duration-base'
      )}
      style={{ zIndex: theme.zIndex.sticky }}
    >
      <Container size="xl">
        <Flex justify="between" align="center" className="h-16">
          {/* Logo */}
          <Link
            href={ROUTES.HOME}
            className={cn(
              'flex items-center gap-2',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'rounded-md'
            )}
          >
            <span
              className={cn(
                'text-2xl font-black tracking-tight',
                'bg-gradient-to-r from-primary-500 to-accent-500',
                'bg-clip-text text-transparent'
              )}
            >
              ALPHA GRIT
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:block" aria-label="Main navigation">
            <Flex gap="lg" as="ul" className="list-none">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'text-sm font-medium px-3 py-2 rounded-md',
                        'transition-colors duration-base',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                        isActive
                          ? 'text-primary-500 bg-primary-50 dark:bg-primary-950'
                          : 'text-muted-foreground hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800'
                      )}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {t.navigation[item.key as keyof typeof t.navigation]}
                    </Link>
                  </li>
                )
              })}
            </Flex>
          </nav>

          {/* Actions */}
          <Flex gap="sm" align="center">
            {/* Language Switcher */}
            <div className="hidden sm:block">
              <CompactLanguageSwitcher />
            </div>

            {/* Shopping Cart with Badge */}
            <Link href={ROUTES.CART} className="relative">
              <Button
                variant="ghost"
                size="icon"
                aria-label={`${t.navigation.cart}${itemCount > 0 ? ` (${itemCount} ${itemCount === 1 ? 'item' : 'items'})` : ''}`}
              >
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span
                    className={cn(
                      'absolute -top-1 -right-1',
                      'flex items-center justify-center',
                      'min-w-[1.25rem] h-5 px-1',
                      'text-xs font-bold text-white',
                      'bg-accent-500 rounded-full',
                      'border-2 border-background'
                    )}
                    aria-hidden="true"
                  >
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* User Account */}
            <Link href={ROUTES.ACCOUNT} className="hidden sm:block">
              <Button
                variant="ghost"
                size="icon"
                aria-label={t.navigation.account}
              >
                <User className="h-5 w-5" />
              </Button>
            </Link>

            {/* Sign In (Desktop) */}
            <Link href={ROUTES.SIGNIN} className="hidden md:block">
              <Button variant="default">{t.navigation.signIn}</Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </Flex>
        </Flex>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav
            id="mobile-menu"
            className={cn(
              'md:hidden',
              'pb-4 pt-2 border-t border-border',
              'animate-slide-down'
            )}
            aria-label="Mobile navigation"
          >
            {/* Navigation Links */}
            <Flex direction="column" gap="xs" as="ul" className="list-none mb-4">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'block px-4 py-3 rounded-md',
                        'text-sm font-medium',
                        'transition-colors duration-base',
                        isActive
                          ? 'text-primary-500 bg-primary-50 dark:bg-primary-950'
                          : 'text-muted-foreground hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800'
                      )}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {t.navigation[item.key as keyof typeof t.navigation]}
                    </Link>
                  </li>
                )
              })}
            </Flex>

            {/* Mobile Actions */}
            <Flex direction="column" gap="sm" className="px-4">
              {/* Language Switcher */}
              <div className="sm:hidden">
                <CompactLanguageSwitcher className="w-full justify-center" />
              </div>

              {/* Account Link */}
              <Link href={ROUTES.ACCOUNT} className="sm:hidden">
                <Button variant="outline" fullWidth leftIcon={<User className="h-4 w-4" />}>
                  {t.navigation.account}
                </Button>
              </Link>

              {/* Sign In */}
              <Link href={ROUTES.SIGNIN}>
                <Button variant="default" fullWidth>
                  {t.navigation.signIn}
                </Button>
              </Link>
            </Flex>
          </nav>
        )}
      </Container>
    </header>
  )
}

/**
 * Export Header component
 */
export default Header
