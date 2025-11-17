/**
 * Product Server Actions
 * Zero hardcoding - all from database
 */

'use server'

import { createClient } from '@/lib/supabase/server'
import { PRODUCT_STATUS, PRODUCT_TYPES } from '@/lib/constants'
import type { Product, ProductWithReviews, ProductFilters, PaginationParams } from '@/types'

/**
 * Get all active products with optional filtering and pagination
 */
export async function getProducts(
  filters?: ProductFilters,
  pagination?: PaginationParams
): Promise<{ products: Product[]; total: number; error: string | null }> {
  try {
    const supabase = await createClient()

    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .eq('status', PRODUCT_STATUS.ACTIVE)

    // Apply filters
    if (filters?.type) {
      query = query.eq('type', filters.type)
    }

    if (filters?.category) {
      query = query.eq('category', filters.category)
    }

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    // Apply sorting
    if (filters?.sortBy) {
      const order = filters.sortOrder || 'asc'
      query = query.order(filters.sortBy, { ascending: order === 'asc' })
    } else {
      query = query.order('created_at', { ascending: false })
    }

    // Apply pagination
    if (pagination) {
      const from = (pagination.page - 1) * pagination.perPage
      const to = from + pagination.perPage - 1
      query = query.range(from, to)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching products:', error)
      return { products: [], total: 0, error: error.message }
    }

    return { products: data || [], total: count || 0, error: null }
  } catch (error) {
    console.error('Unexpected error fetching products:', error)
    return { products: [], total: 0, error: 'Failed to fetch products' }
  }
}

/**
 * Get a single product by slug with reviews
 */
export async function getProductBySlug(
  slug: string
): Promise<{ product: ProductWithReviews | null; error: string | null }> {
  try {
    const supabase = await createClient()

    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .eq('status', PRODUCT_STATUS.ACTIVE)
      .single()

    if (productError) {
      console.error('Error fetching product:', productError)
      return { product: null, error: productError.message }
    }

    if (!product) {
      return { product: null, error: 'Product not found' }
    }

    // Fetch reviews
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', product.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (reviewsError) {
      console.error('Error fetching reviews:', reviewsError)
    }

    const productWithReviews: ProductWithReviews = {
      ...product,
      reviews: reviews || [],
    }

    return { product: productWithReviews, error: null }
  } catch (error) {
    console.error('Unexpected error fetching product:', error)
    return { product: null, error: 'Failed to fetch product' }
  }
}

/**
 * Get featured products for homepage
 */
export async function getFeaturedProducts(
  limit: number = 6
): Promise<{ products: Product[]; error: string | null }> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('status', PRODUCT_STATUS.ACTIVE)
      .eq('type', PRODUCT_TYPES.EBOOK) // Featured ebooks
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching featured products:', error)
      return { products: [], error: error.message }
    }

    return { products: data || [], error: null }
  } catch (error) {
    console.error('Unexpected error fetching featured products:', error)
    return { products: [], error: 'Failed to fetch featured products' }
  }
}

/**
 * Get all unique categories from products
 */
export async function getProductCategories(): Promise<{ categories: string[]; error: string | null }> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('products')
      .select('category')
      .eq('status', PRODUCT_STATUS.ACTIVE)
      .not('category', 'is', null)

    if (error) {
      console.error('Error fetching categories:', error)
      return { categories: [], error: error.message }
    }

    const categories = Array.from(new Set(data.map((item) => item.category).filter(Boolean))) as string[]

    return { categories, error: null }
  } catch (error) {
    console.error('Unexpected error fetching categories:', error)
    return { categories: [], error: 'Failed to fetch categories' }
  }
}

/**
 * Search products (admin only - includes all statuses)
 */
export async function searchAllProducts(
  query: string
): Promise<{ products: Product[]; error: string | null }> {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { products: [], error: 'Unauthorized' }
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return { products: [], error: 'Forbidden' }
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error searching products:', error)
      return { products: [], error: error.message }
    }

    return { products: data || [], error: null }
  } catch (error) {
    console.error('Unexpected error searching products:', error)
    return { products: [], error: 'Failed to search products' }
  }
}
