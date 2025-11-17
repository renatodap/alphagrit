/**
 * Stripe Webhook Handler
 * Handles Stripe events for payment processing
 * Zero hardcoding - all from environment variables and constants
 */

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/server'
import { constructWebhookEvent } from '@/lib/utils/stripe'
import { ORDER_STATUS, DOWNLOAD_LIMITS, PRODUCT_TYPES } from '@/lib/constants'

// Disable body parsing for webhook signature verification
export const runtime = 'nodejs'

/**
 * POST /api/webhooks/stripe
 * Handle Stripe webhook events
 */
export async function POST(request: NextRequest) {
  try {
    // Get the raw body for signature verification
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      console.error('Missing Stripe signature')
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      )
    }

    // Verify webhook signature and construct event
    const event = constructWebhookEvent(body, signature)

    if (!event) {
      console.error('Invalid webhook signature')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    console.log('Received Stripe event:', event.type)

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent)
        break

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent)
        break

      case 'charge.refunded':
        await handleChargeRefunded(event.data.object as Stripe.Charge)
        break

      default:
        console.log('Unhandled event type:', event.type)
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

/**
 * Handle checkout.session.completed event
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    const orderId = session.metadata?.order_id

    if (!orderId) {
      console.error('No order ID in session metadata')
      return
    }

    console.log('Processing checkout session for order:', orderId)

    // Get admin Supabase client (bypasses RLS)
    const supabase = createAdminClient()

    // Update order status to paid
    const { error: updateError } = await (supabase as any)
      .from('orders')
      .update({
        status: ORDER_STATUS.PAID,
        payment_status: 'succeeded',
        payment_intent_id: session.payment_intent as string,
      })
      .eq('id', orderId)

    if (updateError) {
      console.error('Error updating order status:', updateError)
      return
    }

    console.log('Order status updated to paid:', orderId)

    // Get order details with items
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(
          *,
          product:products(*)
        )
      `)
      .eq('id', orderId)
      .single()

    if (orderError || !orderData) {
      console.error('Error fetching order:', orderError)
      return
    }

    // Cast to any to work around admin client type inference
    const order = orderData as any

    // Create download links for ebooks
    const ebookItems = order.items.filter(
      (item: any) => item.product?.type === PRODUCT_TYPES.EBOOK && item.product?.file_url
    )

    if (ebookItems.length > 0) {
      console.log('Creating download links for', ebookItems.length, 'ebooks')

      const downloadLinks = ebookItems.map((item: any) => {
        // Calculate expiry date
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + DOWNLOAD_LIMITS.EXPIRY_DAYS)

        return {
          order_id: orderId,
          product_id: item.product.id,
          user_id: order.user_id,
          signed_url: item.product.file_url, // Use direct file URL (or generate signed URL)
          download_count: 0,
          download_limit: DOWNLOAD_LIMITS.MAX_DOWNLOADS,
          expires_at: expiresAt.toISOString(),
          ip_addresses: [],
        }
      })

      const { error: downloadError } = await supabase
        .from('download_links')
        .insert(downloadLinks)

      if (downloadError) {
        console.error('Error creating download links:', downloadError)
      } else {
        console.log('Download links created successfully')
      }
    }

    // TODO: Send confirmation email
    // This would integrate with your email service (e.g., Resend, SendGrid)
    console.log('TODO: Send confirmation email to', order.email)

    console.log('Checkout session completed successfully for order:', orderId)
  } catch (error) {
    console.error('Error handling checkout session completed:', error)
  }
}

/**
 * Handle payment_intent.succeeded event
 */
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('Payment intent succeeded:', paymentIntent.id)

    // Get admin Supabase client
    const supabase = createAdminClient()

    // Find order by payment intent ID
    const { data: orderData } = await supabase
      .from('orders')
      .select('id, status')
      .eq('payment_intent_id', paymentIntent.id)
      .single()

    // Cast to any to work around admin client type inference
    const order = orderData as any

    if (order && order.status !== ORDER_STATUS.PAID) {
      // Update order status if not already paid
      await (supabase as any)
        .from('orders')
        .update({
          status: ORDER_STATUS.PAID,
          payment_status: 'succeeded',
        })
        .eq('id', order.id)

      console.log('Order marked as paid via payment intent:', order.id)
    }
  } catch (error) {
    console.error('Error handling payment intent succeeded:', error)
  }
}

/**
 * Handle payment_intent.payment_failed event
 */
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('Payment intent failed:', paymentIntent.id)

    // Get admin Supabase client
    const supabase = createAdminClient()

    // Find order by payment intent ID
    const { data: orderData } = await supabase
      .from('orders')
      .select('id, email')
      .eq('payment_intent_id', paymentIntent.id)
      .single()

    // Cast to any to work around admin client type inference
    const order = orderData as any

    if (order) {
      // Update order status to failed
      await (supabase as any)
        .from('orders')
        .update({
          status: ORDER_STATUS.FAILED,
          payment_status: 'failed',
        })
        .eq('id', order.id)

      console.log('Order marked as failed:', order.id)

      // TODO: Send failure notification email
      console.log('TODO: Send payment failed email to', order.email)
    }
  } catch (error) {
    console.error('Error handling payment intent failed:', error)
  }
}

/**
 * Handle charge.refunded event
 */
async function handleChargeRefunded(charge: Stripe.Charge) {
  try {
    console.log('Charge refunded:', charge.id)

    // Get admin Supabase client
    const supabase = createAdminClient()

    // Find order by payment intent ID
    const { data: orderData } = await supabase
      .from('orders')
      .select('id, email')
      .eq('payment_intent_id', charge.payment_intent as string)
      .single()

    // Cast to any to work around admin client type inference
    const order = orderData as any

    if (order) {
      // Update order status to refunded
      const refundedAt = new Date().toISOString()

      await (supabase as any)
        .from('orders')
        .update({
          status: ORDER_STATUS.REFUNDED,
          refund_status: 'processed',
          refunded_at: refundedAt,
        })
        .eq('id', order.id)

      console.log('Order marked as refunded:', order.id)

      // TODO: Revoke download links
      await supabase
        .from('download_links')
        .delete()
        .eq('order_id', order.id)

      console.log('Download links revoked for refunded order:', order.id)

      // TODO: Send refund confirmation email
      console.log('TODO: Send refund confirmation email to', order.email)
    }
  } catch (error) {
    console.error('Error handling charge refunded:', error)
  }
}

/**
 * GET method not allowed
 */
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}
