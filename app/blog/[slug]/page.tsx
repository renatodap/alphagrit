import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Container, Section, Stack, Inline } from '@/components/ui/layout'
import { Display, Text, Heading } from '@/components/ui/typography'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Spacer } from '@/components/ui/spacing'
import { getBlogPostBySlug, getRelatedPosts } from '@/lib/actions/blog'
import { SEO } from '@/lib/constants'
import { tokens } from '@/lib/design-tokens'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { post } = await getBlogPostBySlug(params.slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: `${post.title} - ${SEO.DEFAULT_TITLE}`,
    description: post.excerpt || SEO.DEFAULT_DESCRIPTION,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      images: post.cover_image_url ? [post.cover_image_url] : undefined,
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { post, error } = await getBlogPostBySlug(params.slug)

  if (error || !post) {
    notFound()
  }

  const { posts: relatedPosts } = await getRelatedPosts(params.slug, 3)

  return (
    <Container>
      {/* Back to Blog */}
      <Section spacing="md">
        <Button variant="outline" asChild>
          <Link href="/blog">← Back to Blog</Link>
        </Button>
      </Section>

      {/* Article Header */}
      <Section spacing="xl">
        <Stack gap="xl" align="center">
          <Display size="lg" className="text-center max-w-4xl">
            {post.title}
          </Display>

          {post.excerpt && (
            <Text
              size="xl"
              color="muted"
              align="center"
              className="max-w-3xl"
            >
              {post.excerpt}
            </Text>
          )}

          {/* Author and Date */}
          <Inline gap="md" justify="center">
            {post.author?.full_name && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: tokens.spacing.sm,
                }}
              >
                <Text color="muted">By {post.author.full_name}</Text>
              </div>
            )}
            {post.published_at && (
              <>
                <span
                  style={{
                    color: tokens.colors.neutral[400],
                  }}
                >
                  •
                </span>
                <time
                  dateTime={post.published_at}
                  style={{
                    color: tokens.colors.neutral[500],
                  }}
                >
                  {new Date(post.published_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </>
            )}
          </Inline>
        </Stack>
      </Section>

      {/* Cover Image */}
      {post.cover_image_url && (
        <Section spacing="xl">
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '500px',
              maxWidth: '1200px',
              margin: '0 auto',
              borderRadius: tokens.borderRadius.xl,
              overflow: 'hidden',
            }}
          >
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
        </Section>
      )}

      {/* Article Content */}
      <Section spacing="xl">
        <article
          style={{
            maxWidth: '800px',
            margin: '0 auto',
          }}
        >
          <div
            style={{
              fontSize: tokens.fontSize.lg,
              lineHeight: tokens.lineHeight.relaxed,
              color: tokens.colors.neutral[700],
            }}
            className="prose prose-lg max-w-none dark:prose-invert"
          >
            {/* Content - assuming it's markdown or HTML */}
            <div
              dangerouslySetInnerHTML={{ __html: post.content }}
              style={{
                whiteSpace: 'pre-wrap',
              }}
            />
          </div>
        </article>
      </Section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <Section spacing="xl">
          <Stack gap="2xl">
            <Heading level="h2" align="center">
              Related Articles
            </Heading>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: tokens.spacing.xl,
              }}
            >
              {relatedPosts.map((relatedPost: any) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  style={{ textDecoration: 'none' }}
                >
                  <Card
                    className="h-full transition-all hover:shadow-lg"
                    style={{
                      cursor: 'pointer',
                      transition: `all ${tokens.transitions.base}`,
                    }}
                  >
                    {relatedPost.cover_image_url && (
                      <div
                        style={{
                          position: 'relative',
                          width: '100%',
                          height: '200px',
                          overflow: 'hidden',
                          borderTopLeftRadius: tokens.borderRadius.lg,
                          borderTopRightRadius: tokens.borderRadius.lg,
                        }}
                      >
                        <Image
                          src={relatedPost.cover_image_url}
                          alt={relatedPost.title}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    )}

                    <CardHeader>
                      <Heading level="h4" className="line-clamp-2">
                        {relatedPost.title}
                      </Heading>
                    </CardHeader>

                    <CardContent>
                      {relatedPost.excerpt && (
                        <Text color="muted" className="line-clamp-2">
                          {relatedPost.excerpt}
                        </Text>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </Stack>
        </Section>
      )}

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
              Explore our transformation programs and start your journey today.
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
