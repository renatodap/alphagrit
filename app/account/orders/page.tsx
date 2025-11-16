import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserOrders } from '@/lib/actions/orders'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { tokens } from '@/lib/design-tokens'
import { ROUTES, ORDER_STATUS } from '@/lib/constants'
import Link from 'next/link'

/**
 * Format currency
 */
function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

/**
 * Format date
 */
function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

/**
 * Get status badge styles
 */
function getStatusBadgeStyles(status: string) {
  switch (status) {
    case ORDER_STATUS.PAID:
      return {
        backgroundColor: tokens.colors.primary[50],
        color: tokens.colors.primary[700],
        borderColor: tokens.colors.primary[200],
      }
    case ORDER_STATUS.PENDING:
      return {
        backgroundColor: tokens.colors.neutral[100],
        color: tokens.colors.neutral[700],
        borderColor: tokens.colors.neutral[300],
      }
    case ORDER_STATUS.REFUNDED:
      return {
        backgroundColor: tokens.colors.neutral[50],
        color: tokens.colors.accent[700],
        borderColor: tokens.colors.neutral[200],
      }
    case ORDER_STATUS.FAILED:
      return {
        backgroundColor: tokens.colors.neutral[50],
        color: tokens.colors.accent[700],
        borderColor: tokens.colors.neutral[200],
      }
    default:
      return {
        backgroundColor: tokens.colors.neutral[100],
        color: tokens.colors.neutral[700],
        borderColor: tokens.colors.neutral[300],
      }
  }
}

/**
 * Order status badge component
 */
function StatusBadge({ status }: { status: string }) {
  const styles = getStatusBadgeStyles(status)

  return (
    <span
      style={{
        display: 'inline-block',
        padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
        borderRadius: tokens.borderRadius.sm,
        fontSize: tokens.fontSize.xs,
        fontWeight: tokens.fontWeight.medium,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        border: `1px solid ${styles.borderColor}`,
      }}
    >
      {status}
    </span>
  )
}

/**
 * Empty state component
 */
function EmptyState() {
  return (
    <Card>
      <CardContent
        style={{
          padding: tokens.spacing['3xl'],
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: tokens.spacing.lg,
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: tokens.borderRadius.full,
              backgroundColor: tokens.colors.neutral[100],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke={tokens.colors.neutral[400]}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 2v6h6V2" />
              <rect x="3" y="8" width="18" height="12" rx="2" />
              <path d="M9 22v-6h6v6" />
            </svg>
          </div>
          <div>
            <h3
              style={{
                fontSize: tokens.fontSize.lg,
                fontWeight: tokens.fontWeight.semibold,
                marginBottom: tokens.spacing.xs,
              }}
            >
              No orders yet
            </h3>
            <p
              style={{
                color: tokens.colors.neutral[600],
                marginBottom: tokens.spacing.lg,
              }}
            >
              You haven&apos;t placed any orders yet. Start shopping to see your order history here.
            </p>
          </div>
          <Button asChild>
            <Link href={ROUTES.STORE}>Browse Products</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Order card component
 */
function OrderCard({ order }: { order: any }) {
  return (
    <Card>
      <CardHeader>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: tokens.spacing.md,
          }}
        >
          <div>
            <CardTitle
              style={{
                fontSize: tokens.fontSize.lg,
                marginBottom: tokens.spacing.xs,
              }}
            >
              Order #{order.order_number}
            </CardTitle>
            <CardDescription>
              Placed on {formatDate(order.created_at)}
            </CardDescription>
          </div>
          <StatusBadge status={order.status} />
        </div>
      </CardHeader>
      <CardContent>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: tokens.spacing.lg,
          }}
        >
          {/* Order items */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: tokens.spacing.md,
            }}
          >
            {order.items?.map((item: any) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  gap: tokens.spacing.md,
                  alignItems: 'center',
                }}
              >
                {item.product?.cover_image_url && (
                  <div
                    style={{
                      width: '60px',
                      height: '80px',
                      flexShrink: 0,
                      borderRadius: tokens.borderRadius.sm,
                      overflow: 'hidden',
                      backgroundColor: tokens.colors.neutral[100],
                    }}
                  >
                    <img
                      src={item.product.cover_image_url}
                      alt={item.product_name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <h4
                    style={{
                      fontSize: tokens.fontSize.sm,
                      fontWeight: tokens.fontWeight.medium,
                      marginBottom: tokens.spacing.xs,
                    }}
                  >
                    {item.product_name}
                  </h4>
                  <p
                    style={{
                      fontSize: tokens.fontSize.sm,
                      color: tokens.colors.neutral[600],
                    }}
                  >
                    Quantity: {item.quantity}
                  </p>
                </div>
                <div
                  style={{
                    fontSize: tokens.fontSize.sm,
                    fontWeight: tokens.fontWeight.medium,
                  }}
                >
                  {formatCurrency(item.price * item.quantity, order.currency)}
                </div>
              </div>
            ))}
          </div>

          {/* Order total */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: tokens.spacing.md,
              borderTop: `1px solid ${tokens.colors.neutral[200]}`,
            }}
          >
            <span
              style={{
                fontSize: tokens.fontSize.base,
                fontWeight: tokens.fontWeight.semibold,
              }}
            >
              Total
            </span>
            <span
              style={{
                fontSize: tokens.fontSize.xl,
                fontWeight: tokens.fontWeight.bold,
                color: tokens.colors.primary[600],
              }}
            >
              {formatCurrency(order.total, order.currency)}
            </span>
          </div>

          {/* Actions */}
          {order.status === ORDER_STATUS.PAID && (
            <div
              style={{
                display: 'flex',
                gap: tokens.spacing.sm,
                flexWrap: 'wrap',
              }}
            >
              <Button asChild variant="outline" size="sm">
                <Link href={ROUTES.ACCOUNT_EBOOKS}>View Downloads</Link>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Orders page
 */
export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(ROUTES.SIGNIN)
  }

  const { orders, error } = await getUserOrders()

  return (
    <div
      style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: `${tokens.spacing['2xl']} ${tokens.spacing.lg}`,
      }}
    >
      <div
        style={{
          marginBottom: tokens.spacing['2xl'],
        }}
      >
        <h1
          style={{
            fontSize: tokens.fontSize['4xl'],
            fontWeight: tokens.fontWeight.bold,
            marginBottom: tokens.spacing.sm,
          }}
        >
          Order History
        </h1>
        <p
          style={{
            fontSize: tokens.fontSize.lg,
            color: tokens.colors.neutral[600],
          }}
        >
          View and manage your orders
        </p>
      </div>

      {error && (
        <Card
          style={{
            marginBottom: tokens.spacing.lg,
            backgroundColor: tokens.colors.neutral[50],
            borderColor: tokens.colors.neutral[200],
          }}
        >
          <CardContent
            style={{
              padding: tokens.spacing.lg,
            }}
          >
            <p style={{ color: tokens.colors.accent[700] }}>
              {error}
            </p>
          </CardContent>
        </Card>
      )}

      {!error && orders.length === 0 ? (
        <EmptyState />
      ) : (
        <div
          style={{
            display: 'grid',
            gap: tokens.spacing.lg,
          }}
        >
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}
