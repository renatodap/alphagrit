/**
 * Stripe Payment Integration
 * Zero hardcoding - all from environment variables and constants
 */

'use server'

import { ROUTES } from '@/lib/constants'
import { stripe, constructWebhookEvent, getStripeInstance } from '@/lib/utils/stripe'
import type { Order, Currency } from '@/types'
import type Stripe from 'stripe'

/**
 * Create Stripe checkout session
 */
export async function createCheckoutSession(
  order: Order,
  currency: Currency
): Promise<{
  sessionId: string | null
  error: string | null
}> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // Create line items from order
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: currency.toLowerCase(),
          product_data: {
            name: `Order ${order.order_number}`,
            description: `Alpha Grit Order - ${order.order_number}`,
            metadata: {
              order_id: order.id,
              order_number: order.order_number,
            },
          },
          unit_amount: Math.round(order.total * 100), // Convert to cents
        },
        quantity: 1,
      },
    ]

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      customer_email: order.email,
      client_reference_id: order.id,
      metadata: {
        order_id: order.id,
        order_number: order.order_number,
        user_id: order.user_id || '',
      },
      success_url: `${baseUrl}${ROUTES.CHECKOUT_SUCCESS}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}${ROUTES.CHECKOUT}?canceled=true`,
      expires_at: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiration
      automatic_tax: {
        enabled: false, // Digital products typically don't require tax collection
      },
      allow_promotion_codes: true, // Enable promo codes if needed in future
    })

    if (!session.id) {
      console.error('Failed to create Stripe session')
      return { sessionId: null, error: 'Failed to create checkout session' }
    }

    return { sessionId: session.id, error: null }
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error)
    return {
      sessionId: null,
      error: error instanceof Error ? error.message : 'Failed to create checkout session',
    }
  }
}

/**
 * Retrieve Stripe checkout session
 */
export async function getCheckoutSession(
  sessionId: string
): Promise<{
  session: Stripe.Checkout.Session | null
  error: string | null
}> {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent', 'customer'],
    })

    return { session, error: null }
  } catch (error) {
    console.error('Error retrieving Stripe session:', error)
    return {
      session: null,
      error: error instanceof Error ? error.message : 'Failed to retrieve session',
    }
  }
}

/**
 * Create refund for an order
 */
export async function createRefund(
  paymentIntentId: string,
  amount?: number,
  reason?: string
): Promise<{
  refund: Stripe.Refund | null
  error: string | null
}> {
  try {
    const refundParams: Stripe.RefundCreateParams = {
      payment_intent: paymentIntentId,
    }

    if (amount) {
      refundParams.amount = Math.round(amount * 100) // Convert to cents
    }

    if (reason) {
      refundParams.reason = 'requested_by_customer'
      refundParams.metadata = {
        reason,
      }
    }

    const refund = await stripe.refunds.create(refundParams)

    return { refund, error: null }
  } catch (error) {
    console.error('Error creating refund:', error)
    return {
      refund: null,
      error: error instanceof Error ? error.message : 'Failed to create refund',
    }
  }
}

/**
 * Get payment intent details
 */
export async function getPaymentIntent(
  paymentIntentId: string
): Promise<{
  paymentIntent: Stripe.PaymentIntent | null
  error: string | null
}> {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    return { paymentIntent, error: null }
  } catch (error) {
    console.error('Error retrieving payment intent:', error)
    return {
      paymentIntent: null,
      error: error instanceof Error ? error.message : 'Failed to retrieve payment intent',
    }
  }
}
