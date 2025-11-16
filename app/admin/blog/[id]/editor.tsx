'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Stack, Inline } from '@/components/ui/layout'
import { Heading, Text } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createBlogPost, updateBlogPost, deleteBlogPost } from '@/lib/actions/blog'
import { generateSlug } from '@/lib/utils/blog'
import type { BlogPost } from '@/types'
import { tokens } from '@/lib/design-tokens'

interface BlogPostEditorProps {
  post: BlogPost | null
}

export default function BlogPostEditor({ post }: BlogPostEditorProps) {
  const router = useRouter()
  const isNew = !post

  const [formData, setFormData] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    cover_image_url: post?.cover_image_url || '',
    status: post?.status || 'draft',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [autoSlug, setAutoSlug] = useState(isNew)

  // Auto-generate slug from title
  useEffect(() => {
    if (autoSlug && formData.title) {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(formData.title),
      }))
    }
  }, [formData.title, autoSlug])

  const handleSubmit = async (e: React.FormEvent, shouldPublish?: boolean) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const data = {
        ...formData,
        status: shouldPublish ? 'published' as const : formData.status as 'draft' | 'published',
      }

      let result
      if (isNew) {
        result = await createBlogPost(data)
      } else {
        result = await updateBlogPost(post.id, data)
      }

      if (result.error) {
        setError(result.error)
      } else {
        router.push('/admin/blog')
        router.refresh()
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!post) return

    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await deleteBlogPost(post.id)

      if (result.error) {
        setError(result.error)
      } else {
        router.push('/admin/blog')
        router.refresh()
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
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
        <Heading level="h1">{isNew ? 'Create New Post' : 'Edit Post'}</Heading>
        <Button variant="outline" asChild>
          <Link href="/admin/blog">← Back to Blog</Link>
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div
          style={{
            padding: tokens.spacing.md,
            backgroundColor: tokens.colors.accent[500] + '20',
            borderRadius: tokens.borderRadius.md,
            color: tokens.colors.accent[700],
          }}
        >
          <Text>{error}</Text>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Stack gap="xl">
          {/* Main Content */}
          <Card>
            <CardHeader>
              <CardTitle>Post Content</CardTitle>
            </CardHeader>
            <CardContent>
              <Stack gap="lg">
                {/* Title */}
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Enter post title"
                    required
                  />
                </div>

                {/* Slug */}
                <div>
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => {
                      setAutoSlug(false)
                      setFormData({ ...formData, slug: e.target.value })
                    }}
                    placeholder="post-url-slug"
                    required
                  />
                  <Text size="sm" color="muted" style={{ marginTop: tokens.spacing.xs }}>
                    Auto-generated from title. Edit to customize.
                  </Text>
                </div>

                {/* Excerpt */}
                <div>
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) =>
                      setFormData({ ...formData, excerpt: e.target.value })
                    }
                    placeholder="Brief summary of the post (optional)"
                    rows={3}
                    style={{
                      width: '100%',
                      padding: tokens.spacing.sm,
                      borderRadius: tokens.borderRadius.md,
                      border: `1px solid ${tokens.colors.neutral[300]}`,
                      fontSize: tokens.fontSize.base,
                      fontFamily: 'inherit',
                      resize: 'vertical',
                    }}
                  />
                </div>

                {/* Content */}
                <div>
                  <Label htmlFor="content">Content *</Label>
                  <textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    placeholder="Write your post content here (supports HTML/Markdown)"
                    rows={20}
                    required
                    style={{
                      width: '100%',
                      padding: tokens.spacing.sm,
                      borderRadius: tokens.borderRadius.md,
                      border: `1px solid ${tokens.colors.neutral[300]}`,
                      fontSize: tokens.fontSize.base,
                      fontFamily: 'monospace',
                      resize: 'vertical',
                    }}
                  />
                  <Text size="sm" color="muted" style={{ marginTop: tokens.spacing.xs }}>
                    You can use HTML or Markdown formatting.
                  </Text>
                </div>
              </Stack>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Post Metadata</CardTitle>
            </CardHeader>
            <CardContent>
              <Stack gap="lg">
                {/* Cover Image URL */}
                <div>
                  <Label htmlFor="cover_image_url">Cover Image URL</Label>
                  <Input
                    id="cover_image_url"
                    type="url"
                    value={formData.cover_image_url}
                    onChange={(e) =>
                      setFormData({ ...formData, cover_image_url: e.target.value })
                    }
                    placeholder="https://example.com/image.jpg"
                  />
                  <Text size="sm" color="muted" style={{ marginTop: tokens.spacing.xs }}>
                    URL to the cover image (optional)
                  </Text>
                </div>

                {/* Status */}
                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as 'draft' | 'published',
                      })
                    }
                    style={{
                      width: '100%',
                      padding: tokens.spacing.sm,
                      borderRadius: tokens.borderRadius.md,
                      border: `1px solid ${tokens.colors.neutral[300]}`,
                      fontSize: tokens.fontSize.base,
                      fontFamily: 'inherit',
                    }}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </Stack>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: tokens.spacing.md,
                }}
              >
                <Inline gap="md">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : isNew ? 'Create Post' : 'Save Changes'}
                  </Button>

                  {formData.status === 'draft' && (
                    <Button
                      type="button"
                      onClick={(e) => handleSubmit(e, true)}
                      disabled={loading}
                    >
                      {isNew ? 'Create & Publish' : 'Publish Now'}
                    </Button>
                  )}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/admin/blog')}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </Inline>

                {!isNew && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDelete}
                    disabled={loading}
                    style={{
                      color: tokens.colors.accent[600],
                      borderColor: tokens.colors.accent[600],
                    }}
                  >
                    Delete Post
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </Stack>
      </form>
    </Stack>
  )
}
