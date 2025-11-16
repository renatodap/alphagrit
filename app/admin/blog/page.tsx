import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Container, Section, Stack, Inline } from '@/components/ui/layout'
import { Heading, Text } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getAllBlogPosts, deleteBlogPost, publishBlogPost, unpublishBlogPost } from '@/lib/actions/blog'
import { createClient } from '@/lib/supabase/server'
import { tokens } from '@/lib/design-tokens'

export const metadata: Metadata = {
  title: 'Blog Management - Admin',
}

async function checkAdminAccess() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/signin')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/')
  }

  return user
}

export default async function AdminBlogPage() {
  await checkAdminAccess()

  const { posts, total, error } = await getAllBlogPosts(undefined, {
    page: 1,
    perPage: 50,
  })

  return (
    <Container>
      <Section spacing="xl">
        <Stack gap="2xl">
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: tokens.spacing.md,
            }}
          >
            <Heading level="h1">Blog Management</Heading>
            <Button asChild>
              <Link href="/admin/blog/new">Create New Post</Link>
            </Button>
          </div>

          {/* Stats */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: tokens.spacing.md,
            }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Total Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <Text size="3xl" style={{ fontWeight: tokens.fontWeight.bold }}>
                  {total}
                </Text>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Published</CardTitle>
              </CardHeader>
              <CardContent>
                <Text size="3xl" style={{ fontWeight: tokens.fontWeight.bold }}>
                  {posts.filter((p) => p.status === 'published').length}
                </Text>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Drafts</CardTitle>
              </CardHeader>
              <CardContent>
                <Text size="3xl" style={{ fontWeight: tokens.fontWeight.bold }}>
                  {posts.filter((p) => p.status === 'draft').length}
                </Text>
              </CardContent>
            </Card>
          </div>

          {/* Posts Table */}
          {error ? (
            <Card>
              <CardContent>
                <Text color="muted" align="center">
                  Error loading posts: {error}
                </Text>
              </CardContent>
            </Card>
          ) : posts.length === 0 ? (
            <Card>
              <CardContent>
                <Stack gap="lg" align="center">
                  <Text size="lg" color="muted" align="center">
                    No blog posts yet
                  </Text>
                  <Button asChild>
                    <Link href="/admin/blog/new">Create Your First Post</Link>
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent>
                <div style={{ overflowX: 'auto' }}>
                  <table
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          borderBottom: `1px solid ${tokens.colors.neutral[200]}`,
                        }}
                      >
                        <th
                          style={{
                            textAlign: 'left',
                            padding: tokens.spacing.md,
                            fontWeight: tokens.fontWeight.semibold,
                          }}
                        >
                          Title
                        </th>
                        <th
                          style={{
                            textAlign: 'left',
                            padding: tokens.spacing.md,
                            fontWeight: tokens.fontWeight.semibold,
                          }}
                        >
                          Status
                        </th>
                        <th
                          style={{
                            textAlign: 'left',
                            padding: tokens.spacing.md,
                            fontWeight: tokens.fontWeight.semibold,
                          }}
                        >
                          Author
                        </th>
                        <th
                          style={{
                            textAlign: 'left',
                            padding: tokens.spacing.md,
                            fontWeight: tokens.fontWeight.semibold,
                          }}
                        >
                          Date
                        </th>
                        <th
                          style={{
                            textAlign: 'right',
                            padding: tokens.spacing.md,
                            fontWeight: tokens.fontWeight.semibold,
                          }}
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {posts.map((post: any) => (
                        <tr
                          key={post.id}
                          style={{
                            borderBottom: `1px solid ${tokens.colors.neutral[200]}`,
                          }}
                        >
                          <td
                            style={{
                              padding: tokens.spacing.md,
                            }}
                          >
                            <Link
                              href={`/admin/blog/${post.id}`}
                              style={{
                                color: tokens.colors.primary[500],
                                textDecoration: 'none',
                                fontWeight: tokens.fontWeight.medium,
                              }}
                            >
                              {post.title}
                            </Link>
                          </td>
                          <td
                            style={{
                              padding: tokens.spacing.md,
                            }}
                          >
                            <span
                              style={{
                                display: 'inline-block',
                                padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
                                borderRadius: tokens.borderRadius.md,
                                fontSize: tokens.fontSize.sm,
                                fontWeight: tokens.fontWeight.medium,
                                backgroundColor:
                                  post.status === 'published'
                                    ? tokens.colors.primary[100]
                                    : tokens.colors.neutral[200],
                                color:
                                  post.status === 'published'
                                    ? tokens.colors.primary[700]
                                    : tokens.colors.neutral[700],
                              }}
                            >
                              {post.status === 'published' ? 'Published' : 'Draft'}
                            </span>
                          </td>
                          <td
                            style={{
                              padding: tokens.spacing.md,
                              color: tokens.colors.neutral[600],
                            }}
                          >
                            {post.author?.full_name || 'Unknown'}
                          </td>
                          <td
                            style={{
                              padding: tokens.spacing.md,
                              color: tokens.colors.neutral[600],
                              fontSize: tokens.fontSize.sm,
                            }}
                          >
                            {post.published_at
                              ? new Date(post.published_at).toLocaleDateString()
                              : new Date(post.created_at).toLocaleDateString()}
                          </td>
                          <td
                            style={{
                              padding: tokens.spacing.md,
                              textAlign: 'right',
                            }}
                          >
                            <Inline gap="sm" justify="end">
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/admin/blog/${post.id}`}>Edit</Link>
                              </Button>
                              {post.status === 'published' && (
                                <Button variant="outline" size="sm" asChild>
                                  <Link href={`/blog/${post.slug}`} target="_blank">
                                    View
                                  </Link>
                                </Button>
                              )}
                            </Inline>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </Stack>
      </Section>
    </Container>
  )
}
