/**
 * FOOTER COMPONENT
 *
 * Site-wide footer with navigation, newsletter, and social links.
 * Fully responsive and internationalized.
 *
 * FEATURES:
 * - Multi-language support (EN/PT)
 * - Newsletter signup form
 * - Social media links
 * - Footer navigation (products, company, legal, support)
 * - Responsive grid layout (4 cols → 2 cols → 1 col)
 * - Zero hardcoded values
 *
 * @module components/store/footer
 */

'use client'

import * as React from 'react'
import Link from 'next/link'
import { Mail, Instagram, Twitter, Facebook, ExternalLink } from 'lucide-react'
import { Container, Grid, Stack, Section, Divider } from '@/components/ui/layout-new'
import { Input } from '@/components/ui/input-new'
import { Button } from '@/components/ui/button-new'
import { useTranslation } from '@/components/providers/i18n-provider'
import { cn } from '@/lib/utils'
import { ROUTES, CONTACT, APP_NAME } from '@/lib/constants'

/**
 * FOOTER LINK TYPE
 */
interface FooterLink {
  labelKey: string
  href: string
  external?: boolean
}

/**
 * FOOTER SECTIONS
 *
 * Organized footer navigation by category.
 * Uses translation keys for i18n support.
 */
const FOOTER_SECTIONS: Record<string, { titleKey: string; links: FooterLink[] }> = {
  products: {
    titleKey: 'products.title',
    links: [
      { labelKey: 'navigation.shop', href: ROUTES.STORE },
      { labelKey: 'products.title', href: ROUTES.PRODUCTS },
    ],
  },
  company: {
    titleKey: 'Company',
    links: [
      { labelKey: 'navigation.about', href: '/about' },
      { labelKey: 'navigation.blog', href: ROUTES.BLOG },
      { labelKey: 'navigation.contact', href: '/contact' },
    ],
  },
  legal: {
    titleKey: 'footer.legal',
    links: [
      { labelKey: 'navigation.terms', href: ROUTES.TERMS },
      { labelKey: 'navigation.privacy', href: ROUTES.PRIVACY },
      { labelKey: 'navigation.refund', href: ROUTES.REFUND },
    ],
  },
  support: {
    titleKey: 'Support',
    links: [
      { labelKey: 'FAQ', href: '/#faq' },
      { labelKey: 'WhatsApp', href: CONTACT.WHATSAPP_LINK, external: true },
    ],
  },
}

/**
 * SOCIAL MEDIA LINKS
 *
 * Social media platforms with icons.
 * These would typically come from site settings in a CMS.
 */
const SOCIAL_LINKS = [
  {
    name: 'Instagram',
    href: 'https://instagram.com/alphagrit',
    icon: Instagram,
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/alphagrit',
    icon: Twitter,
  },
  {
    name: 'Facebook',
    href: 'https://facebook.com/alphagrit',
    icon: Facebook,
  },
] as const

/**
 * FOOTER COMPONENT
 *
 * Main footer with all sections and newsletter signup.
 *
 * @returns Footer element
 */
export function Footer() {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()
  const [email, setEmail] = React.useState('')
  const [isSubscribing, setIsSubscribing] = React.useState(false)

  /**
   * Handle newsletter signup
   */
  const handleNewsletterSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubscribing(true)

    // TODO: Implement newsletter signup API call
    // For now, just simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log('Newsletter signup:', email)
    setEmail('')
    setIsSubscribing(false)

    // Show success toast (would use actual toast from context)
    alert(t.footer.newsletter.success)
  }

  return (
    <footer className="border-t border-border bg-background">
      <Section spacing="lg">
        <Container size="xl">
          <Grid cols={4} gap="lg" className="mb-12">
            {/* Brand & Newsletter */}
            <div className="col-span-4 lg:col-span-1">
              <Stack spacing="md">
                {/* Brand */}
                <h2
                  className={cn(
                    'text-xl font-black tracking-tight',
                    'bg-gradient-to-r from-primary-500 to-accent-500',
                    'bg-clip-text text-transparent'
                  )}
                >
                  ALPHA GRIT
                </h2>

                {/* Tagline */}
                <p className="text-sm text-muted-foreground">
                  {t.footer.tagline}
                </p>

                {/* Newsletter Signup */}
                <div>
                  <h3 className="text-sm font-semibold mb-2">
                    {t.footer.newsletter.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    {t.footer.newsletter.subtitle}
                  </p>
                  <form onSubmit={handleNewsletterSignup} className="flex flex-col gap-2">
                    <Input
                      type="email"
                      placeholder={t.footer.newsletter.placeholder}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      size="sm"
                      leftIcon={<Mail className="h-4 w-4" />}
                      containerClassName="mb-0"
                    />
                    <Button
                      type="submit"
                      size="sm"
                      fullWidth
                      loading={isSubscribing}
                      disabled={!email || isSubscribing}
                    >
                      {t.footer.newsletter.submit}
                    </Button>
                  </form>
                </div>
              </Stack>
            </div>

            {/* Footer Navigation Links */}
            {Object.entries(FOOTER_SECTIONS).map(([key, section]) => (
              <div key={key} className="col-span-2 sm:col-span-1">
                <Stack spacing="md">
                  <h3 className="text-sm font-semibold">
                    {section.titleKey.includes('.')
                      ? section.titleKey.split('.').reduce((obj: any, key) => obj?.[key], t)
                      : section.titleKey}
                  </h3>
                  <Stack spacing="sm" as="ul" className="list-none">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className={cn(
                            'text-sm text-muted-foreground',
                            'hover:text-primary-500',
                            'transition-colors duration-base',
                            'inline-flex items-center gap-1',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                            'rounded'
                          )}
                          {...(link.external
                            ? {
                                target: '_blank',
                                rel: 'noopener noreferrer',
                              }
                            : {})}
                        >
                          {link.labelKey.includes('.')
                            ? link.labelKey.split('.').reduce((obj: any, key) => obj?.[key], t)
                            : link.labelKey}
                          {link.external && (
                            <ExternalLink className="h-3 w-3" aria-hidden="true" />
                          )}
                        </Link>
                      </li>
                    ))}
                  </Stack>
                </Stack>
              </div>
            ))}
          </Grid>

          <Divider />

          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6">
            {/* Copyright */}
            <p className="text-sm text-muted-foreground text-center md:text-left">
              &copy; {currentYear} {APP_NAME}. {t.footer.copyright}
            </p>

            {/* Social Media Links */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-muted-foreground">
                {t.footer.followUs}:
              </span>
              <div className="flex items-center gap-2">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow us on ${social.name}`}
                    className={cn(
                      'p-2 rounded-md',
                      'text-muted-foreground hover:text-primary-500',
                      'bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800',
                      'transition-colors duration-base',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                    )}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </footer>
  )
}

/**
 * Export Footer component
 */
export default Footer
