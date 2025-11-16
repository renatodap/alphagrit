/**
 * Order Management Server Actions
 * Zero hardcoding - all from database and constants
 */

'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { ROUTES, ORDER_STATUS, TOAST_MESSAGES } from '@/lib/constants'
import type {
  Order,
  OrderWithItemsAndProducts,
  CartItemWithProduct,
  Currency
} from '@/types'

/**
 * Generate unique order number
 */
function generateOrderNumber(): string {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `AG-${timestamp}-${random}`
}

/**
 * Create order from cart items
 */
export async function createOrder(
  cartItems: CartItemWithProduct[],
  currency: Currency
): Promise<{
  order: Order | null
  error: string | null
}> {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { order: null, error: TOAST_MESSAGES.en.ERROR.UNAUTHORIZED }
    }

    // Get user profile for email
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return { order: null, error: 'User profile not found' }
    }

    // Calculate totals based on currency
    const subtotal = cartItems.reduce((sum, item) => {
      const price = currency === 'BRL'
        ? item.product.price_brl
        : item.product.price_usd
      return sum + (price * item.quantity)
    }, 0)

    const total = subtotal // No tax for digital products

    // Create order
    const orderNumber = generateOrderNumber()

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        order_number: orderNumber,
        email: profile.email,
        status: ORDER_STATUS.PENDING,
        currency,
        subtotal,
        total,
        payment_provider: 'stripe',
        metadata: {
          full_name: profile.full_name,
          created_from: 'checkout',
        },
      })
      .select()
      .single()

    if (orderError || !order) {
      console.error('Error creating order:', orderError)
      return { order: null, error: orderError?.message || 'Failed to create order' }
    }

    // Create order items
    const orderItems = cartItems.map(item => ({
      order_id: order.id,
      product_id: item.product.id,
      product_name: item.product.name,
      product_type: item.product.type,
      quantity: item.quantity,
      price: currency === 'BRL' ? item.product.price_brl : item.product.price_usd,
      metadata: {
        product_slug: item.product.slug,
        cover_image_url: item.product.cover_image_url,
      },
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('Error creating order items:', itemsError)
      // Rollback: delete the order
      await supabase.from('orders').delete().eq('id', order.id)
      return { order: null, error: itemsError.message }
    }

    revalidatePath(ROUTES.ACCOUNT_ORDERS)

    return { order, error: null }
  } catch (error) {
    console.error('Unexpected error creating order:', error)
    return { order: null, error: TOAST_MESSAGES.en.ERROR.GENERIC }
  }
}

/**
 * Get order by ID (with items and products)
 */
export async function getOrderById(
  orderId: string
): Promise<{
  order: OrderWithItemsAndProducts | null
  error: string | null
}> {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { order: null, error: TOAST_MESSAGES.en.ERROR.UNAUTHORIZED }
    }

    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(
          *,
          product:products(*)
        )
      `)
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single()

    if (error) {
      console.error('Error fetching order:', error)
      return { order: null, error: error.message }
    }

    return { order: order as OrderWithItemsAndProducts, error: null }
  } catch (error) {
    console.error('Unexpected error fetching order:', error)
    return { order: null, error: TOAST_MESSAGES.en.ERROR.GENERIC }
  }
}

/**
 * Get user's order history
 */
export async function getUserOrders(): Promise<{
  orders: OrderWithItemsAndProducts[]
  error: string | null
}> {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { orders: [], error: TOAST_MESSAGES.en.ERROR.UNAUTHORIZED }
    }

    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(
          *,
          product:products(*)
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching orders:', error)
      return { orders: [], error: error.message }
    }

    return { orders: (orders as OrderWithItemsAndProducts[]) || [], error: null }
  } catch (error) {
    console.error('Unexpected error fetching orders:', error)
    return { orders: [], error: TOAST_MESSAGES.en.ERROR.GENERIC }
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  orderId: string,
  status: typeof ORDER_STATUS[keyof typeof ORDER_STATUS],
  paymentIntentId?: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient()

    const updateData: any = {
      status,
      payment_status: status === ORDER_STATUS.PAID ? 'succeeded' : null,
    }

    if (paymentIntentId) {
      updateData.payment_intent_id = paymentIntentId
    }

    const { error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId)

    if (error) {
      console.error('Error updating order status:', error)
      return { success: false, error: error.message }
    }

    revalidatePath(ROUTES.ACCOUNT_ORDERS)

    return { success: true, error: null }
  } catch (error) {
    console.error('Unexpected error updating order:', error)
    return { success: false, error: TOAST_MESSAGES.en.ERROR.GENERIC }
  }
}

/**
 * Get download links for an order
 */
export async function getOrderDownloads(
  orderId: string
): Promise<{
  downloads: any[]
  error: string | null
}> {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { downloads: [], error: TOAST_MESSAGES.en.ERROR.UNAUTHORIZED }
    }

    // First verify the order belongs to the user and is paid
    const { data: order } = await supabase
      .from('orders')
      .select('id, status, user_id')
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single()

    if (!order) {
      return { downloads: [], error: 'Order not found' }
    }

    if (order.status !== ORDER_STATUS.PAID) {
      return { downloads: [], error: 'Order not paid' }
    }

    // Get download links
    const { data: downloads, error } = await supabase
      .from('download_links')
      .select(`
        *,
        product:products(*)
      `)
      .eq('order_id', orderId)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error fetching downloads:', error)
      return { downloads: [], error: error.message }
    }

    return { downloads: downloads || [], error: null }
  } catch (error) {
    console.error('Unexpected error fetching downloads:', error)
    return { downloads: [], error: TOAST_MESSAGES.en.ERROR.GENERIC }
  }
}
