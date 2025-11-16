/**
 * Download Management Server Actions
 * Zero hardcoding - all from database and constants
 */

'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { ROUTES, ORDER_STATUS, DOWNLOAD_LIMITS, TOAST_MESSAGES, PRODUCT_TYPES } from '@/lib/constants'
import { isDownloadExpired, isDownloadLimitReached, getDownloadsRemaining, getDaysUntilExpiry } from '@/lib/utils/downloads'
import type { DownloadLink, Product } from '@/types'

/**
 * Get user's download links
 */
export async function getDownloadLinks(
  userId: string
): Promise<{
  links: (DownloadLink & { product: Product })[]
  error: string | null
}> {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user || user.id !== userId) {
      return { links: [], error: TOAST_MESSAGES.en.ERROR.UNAUTHORIZED }
    }

    const { data: links, error } = await supabase
      .from('download_links')
      .select(`
        *,
        product:products(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching download links:', error)
      return { links: [], error: error.message }
    }

    return { links: (links as any) || [], error: null }
  } catch (error) {
    console.error('Unexpected error fetching download links:', error)
    return { links: [], error: TOAST_MESSAGES.en.ERROR.GENERIC }
  }
}

/**
 * Create download link for a product in an order
 */
export async function createDownloadLink(
  orderId: string,
  productId: string
): Promise<{
  link: DownloadLink | null
  error: string | null
}> {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { link: null, error: TOAST_MESSAGES.en.ERROR.UNAUTHORIZED }
    }

    // Verify order belongs to user and is paid
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, status, user_id')
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single()

    if (orderError || !order) {
      return { link: null, error: 'Order not found' }
    }

    if (order.status !== ORDER_STATUS.PAID) {
      return { link: null, error: 'Order is not paid' }
    }

    // Verify product exists and is an ebook
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single()

    if (productError || !product) {
      return { link: null, error: 'Product not found' }
    }

    if (product.type !== PRODUCT_TYPES.EBOOK) {
      return { link: null, error: 'Product is not downloadable' }
    }

    if (!product.file_url) {
      return { link: null, error: 'Product has no file attached' }
    }

    // Check if download link already exists
    const { data: existingLink } = await supabase
      .from('download_links')
      .select('*')
      .eq('order_id', orderId)
      .eq('product_id', productId)
      .eq('user_id', user.id)
      .single()

    if (existingLink) {
      return { link: existingLink, error: null }
    }

    // Create signed URL for the file
    const filePath = product.file_url.replace(/^.*\/storage\/v1\/object\/public\/[^/]+\//, '')
    const bucket = product.file_url.includes('/products/') ? 'products' : 'site-assets'

    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from(bucket)
      .createSignedUrl(filePath, DOWNLOAD_LIMITS.EXPIRY_DAYS * 24 * 60 * 60) // Convert days to seconds

    if (signedUrlError) {
      console.error('Error creating signed URL:', signedUrlError)
      // Fallback to public URL if signed URL fails
      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filePath)

      const { data: link, error: linkError } = await supabase
        .from('download_links')
        .insert({
          order_id: orderId,
          product_id: productId,
          user_id: user.id,
          signed_url: publicUrl,
          download_limit: DOWNLOAD_LIMITS.MAX_DOWNLOADS,
          expires_at: new Date(Date.now() + DOWNLOAD_LIMITS.EXPIRY_DAYS * 24 * 60 * 60 * 1000).toISOString(),
        })
        .select()
        .single()

      if (linkError) {
        console.error('Error creating download link:', linkError)
        return { link: null, error: linkError.message }
      }

      return { link, error: null }
    }

    // Create download link
    const { data: link, error: linkError } = await supabase
      .from('download_links')
      .insert({
        order_id: orderId,
        product_id: productId,
        user_id: user.id,
        signed_url: signedUrlData.signedUrl,
        download_limit: DOWNLOAD_LIMITS.MAX_DOWNLOADS,
        expires_at: new Date(Date.now() + DOWNLOAD_LIMITS.EXPIRY_DAYS * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select()
      .single()

    if (linkError) {
      console.error('Error creating download link:', linkError)
      return { link: null, error: linkError.message }
    }

    revalidatePath(ROUTES.ACCOUNT_EBOOKS)

    return { link, error: null }
  } catch (error) {
    console.error('Unexpected error creating download link:', error)
    return { link: null, error: TOAST_MESSAGES.en.ERROR.GENERIC }
  }
}

/**
 * Track download and increment count
 */
export async function trackDownload(
  linkId: string,
  ipAddress?: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: TOAST_MESSAGES.en.ERROR.UNAUTHORIZED }
    }

    // Get current link data
    const { data: link, error: linkError } = await supabase
      .from('download_links')
      .select('*')
      .eq('id', linkId)
      .eq('user_id', user.id)
      .single()

    if (linkError || !link) {
      return { success: false, error: 'Download link not found' }
    }

    // Check if expired
    if (new Date(link.expires_at) < new Date()) {
      return { success: false, error: 'Download link has expired' }
    }

    // Check if download limit reached
    if (link.download_count >= link.download_limit) {
      return { success: false, error: 'Download limit reached' }
    }

    // Increment download count and track IP
    const ipAddresses = link.ip_addresses || []
    if (ipAddress && !ipAddresses.includes(ipAddress)) {
      ipAddresses.push(ipAddress)
    }

    const { error: updateError } = await supabase
      .from('download_links')
      .update({
        download_count: link.download_count + 1,
        ip_addresses: ipAddresses,
      })
      .eq('id', linkId)

    if (updateError) {
      console.error('Error tracking download:', updateError)
      return { success: false, error: updateError.message }
    }

    revalidatePath(ROUTES.ACCOUNT_EBOOKS)

    return { success: true, error: null }
  } catch (error) {
    console.error('Unexpected error tracking download:', error)
    return { success: false, error: TOAST_MESSAGES.en.ERROR.GENERIC }
  }
}
