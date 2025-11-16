/**
 * Shopping Cart Server Actions
 * Zero hardcoding - all from database
 */

'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { ROUTES, TOAST_MESSAGES } from '@/lib/constants'
import type { CartItemWithProduct } from '@/types'

/**
 * Get user's cart items with product details
 */
export async function getCartItems(): Promise<{
  items: CartItemWithProduct[]
  error: string | null
}> {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { items: [], error: TOAST_MESSAGES.en.ERROR.UNAUTHORIZED }
    }

    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products(*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching cart items:', error)
      return { items: [], error: error.message }
    }

    return { items: data as CartItemWithProduct[] || [], error: null }
  } catch (error) {
    console.error('Unexpected error fetching cart:', error)
    return { items: [], error: TOAST_MESSAGES.en.ERROR.GENERIC }
  }
}

/**
 * Add product to cart
 */
export async function addToCart(
  productId: string,
  quantity: number = 1
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: TOAST_MESSAGES.en.ERROR.UNAUTHORIZED }
    }

    // Check if product exists and is active
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, status')
      .eq('id', productId)
      .single()

    if (productError || !product) {
      return { success: false, error: TOAST_MESSAGES.en.ERROR.NOT_FOUND }
    }

    if (product.status !== 'active') {
      return { success: false, error: 'This product is no longer available' }
    }

    // Check if item already in cart
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .single()

    if (existingItem) {
      // Update quantity
      const { error: updateError } = await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + quantity })
        .eq('id', existingItem.id)

      if (updateError) {
        console.error('Error updating cart item:', updateError)
        return { success: false, error: updateError.message }
      }
    } else {
      // Insert new item
      const { error: insertError } = await supabase
        .from('cart_items')
        .insert({
          user_id: user.id,
          product_id: productId,
          quantity,
        })

      if (insertError) {
        console.error('Error adding to cart:', insertError)
        return { success: false, error: insertError.message }
      }
    }

    revalidatePath(ROUTES.CART)
    revalidatePath(ROUTES.STORE)

    return { success: true, error: null }
  } catch (error) {
    console.error('Unexpected error adding to cart:', error)
    return { success: false, error: TOAST_MESSAGES.en.ERROR.GENERIC }
  }
}

/**
 * Update cart item quantity
 */
export async function updateCartItemQuantity(
  cartItemId: string,
  quantity: number
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: TOAST_MESSAGES.en.ERROR.UNAUTHORIZED }
    }

    if (quantity <= 0) {
      return removeFromCart(cartItemId)
    }

    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', cartItemId)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error updating cart item:', error)
      return { success: false, error: error.message }
    }

    revalidatePath(ROUTES.CART)

    return { success: true, error: null }
  } catch (error) {
    console.error('Unexpected error updating cart:', error)
    return { success: false, error: TOAST_MESSAGES.en.ERROR.GENERIC }
  }
}

/**
 * Remove item from cart
 */
export async function removeFromCart(
  cartItemId: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: TOAST_MESSAGES.en.ERROR.UNAUTHORIZED }
    }

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error removing from cart:', error)
      return { success: false, error: error.message }
    }

    revalidatePath(ROUTES.CART)

    return { success: true, error: null }
  } catch (error) {
    console.error('Unexpected error removing from cart:', error)
    return { success: false, error: TOAST_MESSAGES.en.ERROR.GENERIC }
  }
}

/**
 * Clear entire cart
 */
export async function clearCart(): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: TOAST_MESSAGES.en.ERROR.UNAUTHORIZED }
    }

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id)

    if (error) {
      console.error('Error clearing cart:', error)
      return { success: false, error: error.message }
    }

    revalidatePath(ROUTES.CART)

    return { success: true, error: null }
  } catch (error) {
    console.error('Unexpected error clearing cart:', error)
    return { success: false, error: TOAST_MESSAGES.en.ERROR.GENERIC }
  }
}

/**
 * Get cart item count
 */
export async function getCartCount(): Promise<{ count: number; error: string | null }> {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { count: 0, error: null }
    }

    const { count, error } = await supabase
      .from('cart_items')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (error) {
      console.error('Error fetching cart count:', error)
      return { count: 0, error: error.message }
    }

    return { count: count || 0, error: null }
  } catch (error) {
    console.error('Unexpected error fetching cart count:', error)
    return { count: 0, error: null }
  }
}
