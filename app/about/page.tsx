import { Metadata } from 'next'
import Link from 'next/link'
import { Container, Section, Stack, Inline } from '@/components/ui/layout'
import { Display, Heading, Text } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Spacer } from '@/components/ui/spacing'
import { SEO, APP_NAME } from '@/lib/constants'
import { tokens } from '@/lib/design-tokens'

export const metadata: Metadata = {
  title: `About - ${SEO.DEFAULT_TITLE}`,
  description: 'Learn about Alpha Grit\'s mission to transform lives through discipline, strength, and relentless action.',
}

export default function AboutPage() {
  return (
    <Container>
      {/* Hero Section */}
      <Section spacing="xl">
        <Stack gap="xl" align="center">
          <Display size="lg" gradient="brand" className="text-center">
            About {APP_NAME}
          </Display>

          <Text
            size="xl"
            color="muted"
            align="center"
            className="max-w-3xl"
          >
            We exist to help you become the strongest, most disciplined version of yourself.
          </Text>
        </Stack>
      </Section>

      {/* Mission Statement */}
      <Section spacing="xl">
        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <Stack gap="lg">
              <Text size="lg">
                At {APP_NAME}, we believe transformation is not about temporary motivation—it&apos;s about total reconstruction.
                We provide science-based systems and actionable strategies that help modern men dominate every area of their lives.
              </Text>

              <Text size="lg">
                Our approach combines physical training, mental fortitude, business strategy, and relationship mastery
                to create comprehensive transformation that lasts.
              </Text>

              <Text size="lg">
                We don&apos;t sell quick fixes or empty promises. We offer proven frameworks that require dedication,
                discipline, and relentless action—because that&apos;s what real change demands.
              </Text>
            </Stack>
          </CardContent>
        </Card>
      </Section>

      {/* Core Values */}
      <Section spacing="xl">
        <Stack gap="2xl">
          <Heading level="h2" align="center">
            Our Core Values
          </Heading>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: tokens.spacing.xl,
            }}
          >
            <Card>
              <CardHeader>
                <div
                  style={{
                    fontSize: tokens.fontSize['4xl'],
                    marginBottom: tokens.spacing.md,
                  }}
                >
                  💪
                </div>
                <CardTitle>Discipline</CardTitle>
              </CardHeader>
              <CardContent>
                <Text color="muted">
                  Success is built on consistent action, not fleeting motivation. We teach sustainable
                  systems that compound over time.
                </Text>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div
                  style={{
                    fontSize: tokens.fontSize['4xl'],
                    marginBottom: tokens.spacing.md,
                  }}
                >
                  🎯
                </div>
                <CardTitle>Action</CardTitle>
              </CardHeader>
              <CardContent>
                <Text color="muted">
                  Knowledge without execution is worthless. We focus on implementation and real-world results,
                  not theory.
                </Text>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div
                  style={{
                    fontSize: tokens.fontSize['4xl'],
                    marginBottom: tokens.spacing.md,
                  }}
                >
                  🔥
                </div>
                <CardTitle>Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <Text color="muted">
                  Mediocrity is not an option. We demand the best from ourselves and inspire the same
                  in those we serve.
                </Text>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div
                  style={{
                    fontSize: tokens.fontSize['4xl'],
                    marginBottom: tokens.spacing.md,
                  }}
                >
                  🧠
                </div>
                <CardTitle>Truth</CardTitle>
              </CardHeader>
              <CardContent>
                <Text color="muted">
                  We provide honest, direct guidance based on evidence and real experience—no sugar-coating,
                  no false hope.
                </Text>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div
                  style={{
                    fontSize: tokens.fontSize['4xl'],
                    marginBottom: tokens.spacing.md,
                  }}
                >
                  ⚡
                </div>
                <CardTitle>Strength</CardTitle>
              </CardHeader>
              <CardContent>
                <Text color="muted">
                  Physical, mental, and emotional resilience are fundamental. We build men who can
                  handle anything life throws at them.
                </Text>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div
                  style={{
                    fontSize: tokens.fontSize['4xl'],
                    marginBottom: tokens.spacing.md,
                  }}
                >
                  🚀
                </div>
                <CardTitle>Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <Text color="muted">
                  Stagnation is death. We encourage continuous improvement and never-ending evolution
                  in all areas of life.
                </Text>
              </CardContent>
            </Card>
          </div>
        </Stack>
      </Section>

      {/* What We Offer */}
      <Section spacing="xl">
        <Stack gap="2xl">
          <Heading level="h2" align="center">
            What We Offer
          </Heading>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: tokens.spacing.lg,
            }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Digital Products</CardTitle>
              </CardHeader>
              <CardContent>
                <Text color="muted">
                  Comprehensive e-books and guides covering fitness, business, mindset, and relationships.
                  Actionable frameworks you can implement immediately.
                </Text>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Educational Content</CardTitle>
              </CardHeader>
              <CardContent>
                <Text color="muted">
                  In-depth articles and resources on our blog covering transformation strategies,
                  personal development, and peak performance.
                </Text>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Community</CardTitle>
              </CardHeader>
              <CardContent>
                <Text color="muted">
                  Join a network of like-minded men committed to excellence and continuous improvement.
                  Support, accountability, and shared growth.
                </Text>
              </CardContent>
            </Card>
          </div>
        </Stack>
      </Section>

      {/* CTA Section */}
      <Section spacing="xl">
        <div
          style={{
            background: `${tokens.colors.primary[500]}10`,
            borderRadius: tokens.borderRadius['2xl'],
            padding: `${tokens.spacing['2xl']} ${tokens.spacing.xl}`,
          }}
        >
          <Stack gap="xl" align="center">
            <Heading level="h2" align="center">
              Ready to Transform Your Life?
            </Heading>

            <Text
              size="lg"
              color="muted"
              align="center"
              className="max-w-2xl"
            >
              Start your journey to becoming the strongest, most capable version of yourself.
            </Text>

            <Spacer size="sm" />

            <Inline gap="md" justify="center">
              <Button size="lg" asChild>
                <Link href="/store">Browse Products</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </Inline>
          </Stack>
        </div>
      </Section>
    </Container>
  )
}
