/**
 * Blog Server Actions
 * Zero hardcoding - all from database
 */

'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { generateSlug } from '@/lib/utils/blog'
import type { BlogPost, BlogPostWithAuthor, PaginationParams } from '@/types'

interface BlogPostFilters {
  status?: 'draft' | 'published'
  search?: string
}

/**
 * Get published blog posts (public)
 */
export async function getBlogPosts(
  filters?: BlogPostFilters,
  pagination?: PaginationParams
): Promise<{ posts: BlogPost[]; total: number; error: string | null }> {
  try {
    const supabase = await createClient()

    let query = supabase
      .from('blog_posts')
      .select('*, author:profiles(full_name, avatar_url)', { count: 'exact' })
      .eq('status', 'published')
      .not('published_at', 'is', null)

    // Apply search filter
    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,excerpt.ilike.%${filters.search}%`)
    }

    // Order by published date (newest first)
    query = query.order('published_at', { ascending: false })

    // Apply pagination
    if (pagination) {
      const from = (pagination.page - 1) * pagination.perPage
      const to = from + pagination.perPage - 1
      query = query.range(from, to)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching blog posts:', error)
      return { posts: [], total: 0, error: error.message }
    }

    return { posts: data || [], total: count || 0, error: null }
  } catch (error) {
    console.error('Unexpected error fetching blog posts:', error)
    return { posts: [], total: 0, error: 'Failed to fetch blog posts' }
  }
}

/**
 * Get a single blog post by slug (public)
 */
export async function getBlogPostBySlug(
  slug: string
): Promise<{ post: BlogPostWithAuthor | null; error: string | null }> {
  try {
    const supabase = await createClient()

    const { data: post, error } = await supabase
      .from('blog_posts')
      .select('*, author:profiles(full_name, avatar_url)')
      .eq('slug', slug)
      .eq('status', 'published')
      .not('published_at', 'is', null)
      .single()

    if (error) {
      console.error('Error fetching blog post:', error)
      return { post: null, error: error.message }
    }

    return { post, error: null }
  } catch (error) {
    console.error('Unexpected error fetching blog post:', error)
    return { post: null, error: 'Failed to fetch blog post' }
  }
}

/**
 * Get related blog posts (exclude current post)
 */
export async function getRelatedPosts(
  currentSlug: string,
  limit: number = 3
): Promise<{ posts: BlogPost[]; error: string | null }> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('blog_posts')
      .select('*, author:profiles(full_name, avatar_url)')
      .eq('status', 'published')
      .not('published_at', 'is', null)
      .neq('slug', currentSlug)
      .order('published_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching related posts:', error)
      return { posts: [], error: error.message }
    }

    return { posts: data || [], error: null }
  } catch (error) {
    console.error('Unexpected error fetching related posts:', error)
    return { posts: [], error: 'Failed to fetch related posts' }
  }
}

/**
 * Get all blog posts (admin only - includes all statuses)
 */
export async function getAllBlogPosts(
  filters?: BlogPostFilters,
  pagination?: PaginationParams
): Promise<{ posts: BlogPost[]; total: number; error: string | null }> {
  try {
    const supabase = await createClient()

    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { posts: [], total: 0, error: 'Unauthorized' }
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return { posts: [], total: 0, error: 'Forbidden' }
    }

    let query = supabase
      .from('blog_posts')
      .select('*, author:profiles(full_name, avatar_url)', { count: 'exact' })

    // Apply status filter
    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    // Apply search filter
    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,excerpt.ilike.%${filters.search}%`)
    }

    // Order by created date (newest first)
    query = query.order('created_at', { ascending: false })

    // Apply pagination
    if (pagination) {
      const from = (pagination.page - 1) * pagination.perPage
      const to = from + pagination.perPage - 1
      query = query.range(from, to)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching all blog posts:', error)
      return { posts: [], total: 0, error: error.message }
    }

    return { posts: data || [], total: count || 0, error: null }
  } catch (error) {
    console.error('Unexpected error fetching all blog posts:', error)
    return { posts: [], total: 0, error: 'Failed to fetch blog posts' }
  }
}

/**
 * Get a single blog post by ID (admin only)
 */
export async function getBlogPostById(
  id: string
): Promise<{ post: BlogPost | null; error: string | null }> {
  try {
    const supabase = await createClient()

    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { post: null, error: 'Unauthorized' }
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return { post: null, error: 'Forbidden' }
    }

    const { data: post, error } = await supabase
      .from('blog_posts')
      .select('*, author:profiles(full_name, avatar_url)')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching blog post:', error)
      return { post: null, error: error.message }
    }

    return { post, error: null }
  } catch (error) {
    console.error('Unexpected error fetching blog post:', error)
    return { post: null, error: 'Failed to fetch blog post' }
  }
}

/**
 * Create a new blog post (admin only)
 */
export async function createBlogPost(data: {
  title: string
  slug: string
  excerpt?: string
  content: string
  cover_image_url?: string
  status: 'draft' | 'published'
  published_at?: string
}): Promise<{ post: BlogPost | null; error: string | null }> {
  try {
    const supabase = await createClient()

    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { post: null, error: 'Unauthorized' }
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return { post: null, error: 'Forbidden' }
    }

    // Create post
    const { data: post, error } = await supabase
      .from('blog_posts')
      .insert({
        ...data,
        author_id: user.id,
        published_at: data.status === 'published' ? (data.published_at || new Date().toISOString()) : null,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating blog post:', error)
      return { post: null, error: error.message }
    }

    revalidatePath('/blog')
    revalidatePath('/admin/blog')

    return { post, error: null }
  } catch (error) {
    console.error('Unexpected error creating blog post:', error)
    return { post: null, error: 'Failed to create blog post' }
  }
}

/**
 * Update a blog post (admin only)
 */
export async function updateBlogPost(
  id: string,
  data: {
    title?: string
    slug?: string
    excerpt?: string
    content?: string
    cover_image_url?: string
    status?: 'draft' | 'published'
    published_at?: string
  }
): Promise<{ post: BlogPost | null; error: string | null }> {
  try {
    const supabase = await createClient()

    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { post: null, error: 'Unauthorized' }
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return { post: null, error: 'Forbidden' }
    }

    // If status is changing to published and no published_at, set it
    const updateData = { ...data }
    if (data.status === 'published' && !data.published_at) {
      updateData.published_at = new Date().toISOString()
    }

    // Update post
    const { data: post, error } = await supabase
      .from('blog_posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating blog post:', error)
      return { post: null, error: error.message }
    }

    revalidatePath('/blog')
    revalidatePath(`/blog/${post.slug}`)
    revalidatePath('/admin/blog')

    return { post, error: null }
  } catch (error) {
    console.error('Unexpected error updating blog post:', error)
    return { post: null, error: 'Failed to update blog post' }
  }
}

/**
 * Delete a blog post (admin only)
 */
export async function deleteBlogPost(
  id: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient()

    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return { success: false, error: 'Forbidden' }
    }

    // Delete post
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting blog post:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/blog')
    revalidatePath('/admin/blog')

    return { success: true, error: null }
  } catch (error) {
    console.error('Unexpected error deleting blog post:', error)
    return { success: false, error: 'Failed to delete blog post' }
  }
}

/**
 * Publish a blog post (admin only)
 */
export async function publishBlogPost(
  id: string
): Promise<{ post: BlogPost | null; error: string | null }> {
  return updateBlogPost(id, {
    status: 'published',
    published_at: new Date().toISOString(),
  })
}

/**
 * Unpublish a blog post (admin only)
 */
export async function unpublishBlogPost(
  id: string
): Promise<{ post: BlogPost | null; error: string | null }> {
  return updateBlogPost(id, {
    status: 'draft',
  })
}
