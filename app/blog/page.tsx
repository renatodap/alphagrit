import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Container, Section, Stack } from '@/components/ui/layout'
import { Display, Text, Heading } from '@/components/ui/typography'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Spacer } from '@/components/ui/spacing'
import { getBlogPosts } from '@/lib/actions/blog'
import { SEO } from '@/lib/constants'
import { tokens } from '@/lib/design-tokens'

export const metadata: Metadata = {
  title: `Blog - ${SEO.DEFAULT_TITLE}`,
  description: 'Read our latest articles on fitness, mindset, and personal transformation.',
}

export default async function BlogPage() {
  const { posts, total, error } = await getBlogPosts(undefined, {
    page: 1,
    perPage: 12,
  })

  return (
    <Container>
      {/* Hero Section */}
      <Section spacing="xl">
        <Stack gap="lg" align="center">
          <Display size="lg" gradient="brand" className="text-center">
            Alpha Grit Blog
          </Display>

          <Text
            size="xl"
            color="muted"
            align="center"
            className="max-w-3xl"
          >
            Insights on discipline, transformation, and becoming the best version of yourself.
          </Text>
        </Stack>
      </Section>

      {/* Blog Posts Grid */}
      <Section spacing="xl">
        {error ? (
          <Stack gap="lg" align="center">
            <Text size="lg" color="muted" align="center">
              Unable to load blog posts. Please try again later.
            </Text>
          </Stack>
        ) : posts.length === 0 ? (
          <Stack gap="lg" align="center">
            <div
              style={{
                fontSize: tokens.fontSize['6xl'],
                opacity: 0.5,
              }}
            >
              📝
            </div>
            <Heading level="h3" align="center">
              No blog posts yet
            </Heading>
            <Text size="lg" color="muted" align="center">
              Check back soon for our latest articles on transformation and growth.
            </Text>
          </Stack>
        ) : (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: tokens.spacing.xl,
              }}
            >
              {posts.map((post: any) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  style={{ textDecoration: 'none' }}
                >
                  <Card
                    className="h-full transition-all hover:shadow-lg"
                    style={{
                      cursor: 'pointer',
                      borderColor: 'transparent',
                      transition: `all ${tokens.transitions.base}`,
                    }}
                  >
                    {post.cover_image_url && (
                      <div
                        style={{
                          position: 'relative',
                          width: '100%',
                          height: '240px',
                          overflow: 'hidden',
                          borderTopLeftRadius: tokens.borderRadius.lg,
                          borderTopRightRadius: tokens.borderRadius.lg,
                        }}
                      >
                        <Image
                          src={post.cover_image_url}
                          alt={post.title}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    )}

                    <CardHeader>
                      <Heading level="h3" className="line-clamp-2">
                        {post.title}
                      </Heading>
                    </CardHeader>

                    <CardContent>
                      <Stack gap="md">
                        {post.excerpt && (
                          <Text color="muted" className="line-clamp-3">
                            {post.excerpt}
                          </Text>
                        )}

                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: tokens.spacing.sm,
                            fontSize: tokens.fontSize.sm,
                            color: tokens.colors.neutral[500],
                          }}
                        >
                          {post.author?.full_name && (
                            <span>{post.author.full_name}</span>
                          )}
                          {post.published_at && (
                            <>
                              <span>•</span>
                              <time dateTime={post.published_at}>
                                {new Date(post.published_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </time>
                            </>
                          )}
                        </div>
                      </Stack>
                    </CardContent>

                    <CardFooter>
                      <Text
                        size="sm"
                        style={{
                          color: tokens.colors.primary[500],
                          fontWeight: tokens.fontWeight.medium,
                        }}
                      >
                        Read More →
                      </Text>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Pagination placeholder - can be enhanced later */}
            {total > 12 && (
              <>
                <Spacer size="2xl" />
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: tokens.spacing.md,
                  }}
                >
                  <Text color="muted">
                    Showing {posts.length} of {total} posts
                  </Text>
                </div>
              </>
            )}
          </>
        )}
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
              Ready to Start Your Transformation?
            </Heading>

            <Text
              size="lg"
              color="muted"
              align="center"
              className="max-w-2xl"
            >
              Explore our products and take the first step toward becoming the man you were meant to be.
            </Text>

            <Spacer size="sm" />

            <Button size="lg" asChild>
              <Link href="/store">Browse Products</Link>
            </Button>
          </Stack>
        </div>
      </Section>
    </Container>
  )
}
