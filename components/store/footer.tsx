import Link from 'next/link'
import { Container } from '@/components/ui/layout'
import { Grid } from '@/components/ui/layout'
import { Stack } from '@/components/ui/layout'
import { Section } from '@/components/ui/layout'
import { Heading } from '@/components/ui/typography'
import { Text } from '@/components/ui/typography'
import { Divider } from '@/components/ui/spacing'
import { footerNav } from '@/config/navigation'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-background">
      <Section spacing="lg">
        <Container>
          <Grid cols={4} gap="lg">
            {/* Brand */}
            <Stack gap="md">
              <Heading level="h6" weight="black" className="text-primary-500">
                ALPHA GRIT
              </Heading>
              <Text size="sm" color="muted">
                Transform your life through discipline, strength, and relentless action.
              </Text>
            </Stack>

            {/* Footer Links */}
            {Object.entries(footerNav).map(([key, links]) => (
              <Stack key={key} gap="md">
                <Heading level="h6" weight="semibold" className="capitalize">
                  {key}
                </Heading>
                <Stack gap="sm">
                  {links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary-500 transition-colors"
                      {...('external' in link && link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {link.title}
                    </Link>
                  ))}
                </Stack>
              </Stack>
            ))}
          </Grid>

          <Divider spacing="lg" />

          <Text size="sm" color="muted" align="center">
            &copy; {currentYear} Alpha Grit. All rights reserved.
          </Text>
        </Container>
      </Section>
    </footer>
  )
}
