/**
 * Admin Server Actions
 * Production-ready admin operations with role verification
 * Zero hardcoding - all from database and design tokens
 */

'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { ROUTES, USER_ROLES, PRODUCT_STATUS, ORDER_STATUS, TOAST_MESSAGES } from '@/lib/constants'
import type {
  Product,
  Order,
  OrderWithItemsAndProducts,
  Profile,
  DashboardStats,
  OrderFilters,
} from '@/types'

/**
 * Verify user is admin - throws error if not
 */
async function verifyAdmin() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(ROUTES.SIGNIN)
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== USER_ROLES.ADMIN) {
    redirect(ROUTES.HOME)
  }

  return { user, supabase }
}

/**
 * Get admin dashboard statistics
 */
export async function getAdminStats(): Promise<{
  stats: DashboardStats | null
  error: string | null
}> {
  try {
    const { supabase } = await verifyAdmin()

    // Get total revenue from paid orders
    const { data: paidOrders } = await supabase
      .from('orders')
      .select('total, currency, created_at')
      .eq('status', ORDER_STATUS.PAID)

    const totalRevenue = paidOrders?.reduce((sum, order) => sum + Number(order.total), 0) || 0

    // Get total orders count
    const { count: totalOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })

    // Get total customers count
    const { count: totalCustomers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', USER_ROLES.CUSTOMER)

    // Get total products count
    const { count: totalProducts } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })

    // Get recent orders (last 10) with items
    const { data: recentOrders } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*)
      `)
      .order('created_at', { ascending: false })
      .limit(10)

    // Get revenue data for last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: revenueOrders } = await supabase
      .from('orders')
      .select('total, created_at')
      .eq('status', ORDER_STATUS.PAID)
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: true })

    // Group revenue by date
    const revenueByDate = new Map<string, number>()
    revenueOrders?.forEach(order => {
      const date = new Date(order.created_at).toISOString().split('T')[0]
      const current = revenueByDate.get(date) || 0
      revenueByDate.set(date, current + Number(order.total))
    })

    const revenueData = Array.from(revenueByDate.entries()).map(([date, revenue]) => ({
      date,
      revenue,
    }))

    // Get top selling products
    const { data: orderItems } = await supabase
      .from('order_items')
      .select(`
        product_id,
        product_name,
        quantity
      `)

    // Count sales per product
    const productSales = new Map<string, { name: string; count: number }>()
    orderItems?.forEach(item => {
      const current = productSales.get(item.product_id) || { name: item.product_name, count: 0 }
      productSales.set(item.product_id, {
        name: item.product_name,
        count: current.count + item.quantity,
      })
    })

    const stats: DashboardStats = {
      totalRevenue,
      totalOrders: totalOrders || 0,
      totalCustomers: totalCustomers || 0,
      totalProducts: totalProducts || 0,
      recentOrders: (recentOrders || []) as any[],
      topProducts: [] as any[], // We'll populate this if needed
      revenueData,
    }

    return { stats, error: null }
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return { stats: null, error: TOAST_MESSAGES.en.ERROR.GENERIC }
  }
}

/**
 * Get all products (including drafts and archived)
 */
export async function getAllProducts(filters?: {
  status?: string
  type?: string
  search?: string
}): Promise<{
  products: Product[]
  error: string | null
}> {
  try {
    const { supabase } = await verifyAdmin()

    let query = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    // Apply filters
    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    if (filters?.type) {
      query = query.eq('type', filters.type)
    }

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching all products:', error)
      return { products: [], error: error.message }
    }

    return { products: data || [], error: null }
  } catch (error) {
    console.error('Unexpected error fetching products:', error)
    return { products: [], error: TOAST_MESSAGES.en.ERROR.GENERIC }
  }
}

/**
 * Get single product by ID (admin only)
 */
export async function getProductById(id: string): Promise<{
  product: Product | null
  error: string | null
}> {
  try {
    const { supabase } = await verifyAdmin()

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching product:', error)
      return { product: null, error: error.message }
    }

    return { product: data, error: null }
  } catch (error) {
    console.error('Unexpected error fetching product:', error)
    return { product: null, error: TOAST_MESSAGES.en.ERROR.GENERIC }
  }
}

/**
 * Create new product
 */
export async function createProduct(
  data: Partial<Product>
): Promise<{
  product: Product | null
  error: string | null
}> {
  try {
    const { supabase } = await verifyAdmin()

    // Generate slug from name if not provided
    const slug = data.slug || data.name?.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const { data: product, error } = await supabase
      .from('products')
      .insert({
        ...data,
        slug,
        status: data.status || PRODUCT_STATUS.DRAFT,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating product:', error)
      return { product: null, error: error.message }
    }

    revalidatePath(ROUTES.ADMIN_PRODUCTS)
    revalidatePath(ROUTES.STORE)

    return { product, error: null }
  } catch (error) {
    console.error('Unexpected error creating product:', error)
    return { product: null, error: TOAST_MESSAGES.en.ERROR.GENERIC }
  }
}

/**
 * Update existing product
 */
export async function updateProduct(
  id: string,
  data: Partial<Product>
): Promise<{
  product: Product | null
  error: string | null
}> {
  try {
    const { supabase } = await verifyAdmin()

    const { data: product, error } = await supabase
      .from('products')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating product:', error)
      return { product: null, error: error.message }
    }

    revalidatePath(ROUTES.ADMIN_PRODUCTS)
    revalidatePath(`${ROUTES.ADMIN_PRODUCTS}/${id}`)
    revalidatePath(ROUTES.STORE)

    return { product, error: null }
  } catch (error) {
    console.error('Unexpected error updating product:', error)
    return { product: null, error: TOAST_MESSAGES.en.ERROR.GENERIC }
  }
}

/**
 * Delete product
 */
export async function deleteProduct(id: string): Promise<{
  success: boolean
  error: string | null
}> {
  try {
    const { supabase } = await verifyAdmin()

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting product:', error)
      return { success: false, error: error.message }
    }

    revalidatePath(ROUTES.ADMIN_PRODUCTS)
    revalidatePath(ROUTES.STORE)

    return { success: true, error: null }
  } catch (error) {
    console.error('Unexpected error deleting product:', error)
    return { success: false, error: TOAST_MESSAGES.en.ERROR.GENERIC }
  }
}

/**
 * Get all orders with optional filters
 */
export async function getAllOrders(filters?: OrderFilters): Promise<{
  orders: OrderWithItemsAndProducts[]
  error: string | null
}> {
  try {
    const { supabase } = await verifyAdmin()

    let query = supabase
      .from('orders')
      .select(`
        *,
        items:order_items(
          *,
          product:products(*)
        )
      `)
      .order('created_at', { ascending: false })

    // Apply filters
    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    if (filters?.search) {
      query = query.or(`order_number.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)
    }

    if (filters?.dateFrom) {
      query = query.gte('created_at', filters.dateFrom)
    }

    if (filters?.dateTo) {
      query = query.lte('created_at', filters.dateTo)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching orders:', error)
      return { orders: [], error: error.message }
    }

    return { orders: (data as OrderWithItemsAndProducts[]) || [], error: null }
  } catch (error) {
    console.error('Unexpected error fetching orders:', error)
    return { orders: [], error: TOAST_MESSAGES.en.ERROR.GENERIC }
  }
}

/**
 * Update order status (admin only)
 */
export async function updateOrderStatusAdmin(
  orderId: string,
  status: string
): Promise<{
  success: boolean
  error: string | null
}> {
  try {
    const { supabase } = await verifyAdmin()

    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)

    if (error) {
      console.error('Error updating order status:', error)
      return { success: false, error: error.message }
    }

    revalidatePath(ROUTES.ADMIN_ORDERS)

    return { success: true, error: null }
  } catch (error) {
    console.error('Unexpected error updating order status:', error)
    return { success: false, error: TOAST_MESSAGES.en.ERROR.GENERIC }
  }
}

/**
 * Get all customers with stats
 */
export async function getAllCustomers(): Promise<{
  customers: (Profile & {
    totalOrders: number
    totalRevenue: number
    lastOrderDate: string | null
  })[]
  error: string | null
}> {
  try {
    const { supabase } = await verifyAdmin()

    // Get all customer profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', USER_ROLES.CUSTOMER)
      .order('created_at', { ascending: false })

    if (profilesError) {
      console.error('Error fetching customers:', profilesError)
      return { customers: [], error: profilesError.message }
    }

    // For each customer, get their order stats
    const customersWithStats = await Promise.all(
      (profiles || []).map(async (profile) => {
        const { data: orders } = await supabase
          .from('orders')
          .select('total, created_at')
          .eq('user_id', profile.id)
          .eq('status', ORDER_STATUS.PAID)

        const totalOrders = orders?.length || 0
        const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total), 0) || 0
        const lastOrderDate = orders?.[0]?.created_at || null

        return {
          ...profile,
          totalOrders,
          totalRevenue,
          lastOrderDate,
        }
      })
    )

    return { customers: customersWithStats, error: null }
  } catch (error) {
    console.error('Unexpected error fetching customers:', error)
    return { customers: [], error: TOAST_MESSAGES.en.ERROR.GENERIC }
  }
}
