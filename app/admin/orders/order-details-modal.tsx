/**
 * Order Details Modal (Client Component)
 * Shows detailed order information in a modal
 */

'use client'

import { useState } from 'react'
import { tokens } from '@/lib/design-tokens'
import { Button } from '@/components/ui/button'
import type { OrderWithItemsAndProducts } from '@/types'

interface OrderDetailsModalProps {
  order: OrderWithItemsAndProducts
}

export function OrderDetailsModal({ order }: OrderDetailsModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  const formatCurrency = (amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount)
  }

  const formatDate = (date: string): string => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date))
  }

  if (!isOpen) {
    return (
      <Button size="sm" variant="outline" onClick={() => setIsOpen(true)}>
        View Details
      </Button>
    )
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: tokens.zIndex.modalBackdrop,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: tokens.spacing.xl,
        }}
      >
        {/* Modal */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: 'white',
            borderRadius: tokens.borderRadius.lg,
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: tokens.shadows['2xl'],
            zIndex: tokens.zIndex.modal,
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: tokens.spacing.xl,
              borderBottom: `1px solid ${tokens.colors.neutral[200]}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h2
              style={{
                fontSize: tokens.fontSize['2xl'],
                fontWeight: tokens.fontWeight.bold,
              }}
            >
              Order Details
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                fontSize: tokens.fontSize['2xl'],
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: tokens.colors.neutral[500],
              }}
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div style={{ padding: tokens.spacing.xl }}>
            {/* Order Info */}
            <div
              style={{
                marginBottom: tokens.spacing.xl,
                padding: tokens.spacing.lg,
                backgroundColor: tokens.colors.neutral[50],
                borderRadius: tokens.borderRadius.md,
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: tokens.spacing.md,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: tokens.fontSize.xs,
                      color: tokens.colors.neutral[600],
                      marginBottom: tokens.spacing.xs,
                    }}
                  >
                    Order Number
                  </div>
                  <div
                    style={{
                      fontSize: tokens.fontSize.base,
                      fontWeight: tokens.fontWeight.semibold,
                    }}
                  >
                    {order.order_number}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: tokens.fontSize.xs,
                      color: tokens.colors.neutral[600],
                      marginBottom: tokens.spacing.xs,
                    }}
                  >
                    Customer Email
                  </div>
                  <div
                    style={{
                      fontSize: tokens.fontSize.base,
                      fontWeight: tokens.fontWeight.medium,
                    }}
                  >
                    {order.email}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: tokens.fontSize.xs,
                      color: tokens.colors.neutral[600],
                      marginBottom: tokens.spacing.xs,
                    }}
                  >
                    Date
                  </div>
                  <div style={{ fontSize: tokens.fontSize.base }}>
                    {formatDate(order.created_at)}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: tokens.fontSize.xs,
                      color: tokens.colors.neutral[600],
                      marginBottom: tokens.spacing.xs,
                    }}
                  >
                    Status
                  </div>
                  <div
                    style={{
                      fontSize: tokens.fontSize.base,
                      fontWeight: tokens.fontWeight.medium,
                      textTransform: 'capitalize',
                    }}
                  >
                    {order.status}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div style={{ marginBottom: tokens.spacing.xl }}>
              <h3
                style={{
                  fontSize: tokens.fontSize.lg,
                  fontWeight: tokens.fontWeight.semibold,
                  marginBottom: tokens.spacing.md,
                }}
              >
                Items ({order.items?.length || 0})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.md }}>
                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: tokens.spacing.md,
                      border: `1px solid ${tokens.colors.neutral[200]}`,
                      borderRadius: tokens.borderRadius.md,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: tokens.fontSize.base,
                          fontWeight: tokens.fontWeight.medium,
                          marginBottom: tokens.spacing.xs,
                        }}
                      >
                        {item.product_name}
                      </div>
                      <div
                        style={{
                          fontSize: tokens.fontSize.sm,
                          color: tokens.colors.neutral[600],
                        }}
                      >
                        Quantity: {item.quantity} × {formatCurrency(Number(item.price), order.currency)}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: tokens.fontSize.lg,
                        fontWeight: tokens.fontWeight.semibold,
                      }}
                    >
                      {formatCurrency(Number(item.price) * item.quantity, order.currency)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div
              style={{
                padding: tokens.spacing.lg,
                backgroundColor: tokens.colors.neutral[50],
                borderRadius: tokens.borderRadius.md,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: tokens.spacing.sm,
                }}
              >
                <span style={{ color: tokens.colors.neutral[600] }}>Subtotal</span>
                <span style={{ fontWeight: tokens.fontWeight.medium }}>
                  {formatCurrency(Number(order.subtotal), order.currency)}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: tokens.spacing.sm,
                  borderTop: `1px solid ${tokens.colors.neutral[200]}`,
                }}
              >
                <span
                  style={{
                    fontSize: tokens.fontSize.lg,
                    fontWeight: tokens.fontWeight.semibold,
                  }}
                >
                  Total
                </span>
                <span
                  style={{
                    fontSize: tokens.fontSize.lg,
                    fontWeight: tokens.fontWeight.bold,
                  }}
                >
                  {formatCurrency(Number(order.total), order.currency)}
                </span>
              </div>
            </div>

            {/* Payment Info */}
            {order.payment_intent_id && (
              <div style={{ marginTop: tokens.spacing.lg }}>
                <h3
                  style={{
                    fontSize: tokens.fontSize.sm,
                    fontWeight: tokens.fontWeight.semibold,
                    color: tokens.colors.neutral[600],
                    marginBottom: tokens.spacing.xs,
                  }}
                >
                  Payment Details
                </h3>
                <div
                  style={{
                    fontSize: tokens.fontSize.sm,
                    color: tokens.colors.neutral[600],
                  }}
                >
                  Payment ID: {order.payment_intent_id}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              padding: tokens.spacing.xl,
              borderTop: `1px solid ${tokens.colors.neutral[200]}`,
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <Button onClick={() => setIsOpen(false)}>Close</Button>
          </div>
        </div>
      </div>
    </>
  )
}
