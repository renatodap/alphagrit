/**
 * Admin Orders Management Page
 * Production-ready orders table with filters and status updates
 * Zero hardcoding - all from database and design tokens
 */

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAllOrders } from '@/lib/actions/admin'
import { ROUTES, USER_ROLES, ORDER_STATUS } from '@/lib/constants'
import { tokens } from '@/lib/design-tokens'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { OrderStatusUpdater } from './order-status-updater'
import { OrderDetailsModal } from './order-details-modal'

export const metadata = {
  title: 'Orders Management - Admin',
  description: 'Manage customer orders',
}

/**
 * Format currency
 */
function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Format date
 */
function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

/**
 * Status badge component
 */
function StatusBadge({ status }: { status: string }) {
  const getStatusStyles = () => {
    switch (status) {
      case ORDER_STATUS.PAID:
        return {
          bg: tokens.colors.primary[50],
          text: tokens.colors.primary[700],
        }
      case ORDER_STATUS.PENDING:
        return {
          bg: tokens.colors.neutral[100],
          text: tokens.colors.neutral[700],
        }
      case ORDER_STATUS.REFUNDED:
        return {
          bg: tokens.colors.neutral[50],
          text: tokens.colors.accent[700],
        }
      case ORDER_STATUS.FAILED:
        return {
          bg: tokens.colors.neutral[100],
          text: tokens.colors.accent[700],
        }
      default:
        return {
          bg: tokens.colors.neutral[100],
          text: tokens.colors.neutral[700],
        }
    }
  }

  const styles = getStatusStyles()

  return (
    <span
      style={{
        backgroundColor: styles.bg,
        color: styles.text,
        padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
        borderRadius: tokens.borderRadius.sm,
        fontSize: tokens.fontSize.xs,
        fontWeight: tokens.fontWeight.medium,
        textTransform: 'capitalize',
      }}
    >
      {status}
    </span>
  )
}

export default async function OrdersManagementPage({
  searchParams,
}: {
  searchParams: {
    status?: string
    search?: string
    dateFrom?: string
    dateTo?: string
  }
}) {
  const supabase = await createClient()

  // Check authentication and admin role
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

  // Get orders with filters
  const { orders, error } = await getAllOrders({
    status: searchParams.status,
    search: searchParams.search,
    dateFrom: searchParams.dateFrom,
    dateTo: searchParams.dateTo,
  })

  return (
    <div
      style={{
        padding: tokens.spacing.xl,
        maxWidth: '1600px',
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: tokens.spacing.xl,
        }}
      >
        <h1
          style={{
            fontSize: tokens.fontSize['4xl'],
            fontWeight: tokens.fontWeight.bold,
            marginBottom: tokens.spacing.sm,
            color: tokens.colors.neutral[900],
          }}
        >
          Orders Management
        </h1>
        <p
          style={{
            fontSize: tokens.fontSize.lg,
            color: tokens.colors.neutral[600],
          }}
        >
          View and manage customer orders
        </p>
      </div>

      {/* Filters */}
      <Card style={{ marginBottom: tokens.spacing.xl }}>
        <CardContent style={{ padding: tokens.spacing.lg }}>
          <form
            method="get"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: tokens.spacing.md,
            }}
          >
            {/* Search */}
            <input
              type="text"
              name="search"
              placeholder="Search by order # or email..."
              defaultValue={searchParams.search}
              style={{
                padding: tokens.spacing.sm,
                border: `1px solid ${tokens.colors.neutral[300]}`,
                borderRadius: tokens.borderRadius.md,
                fontSize: tokens.fontSize.base,
              }}
            />

            {/* Status filter */}
            <select
              name="status"
              defaultValue={searchParams.status || ''}
              style={{
                padding: tokens.spacing.sm,
                border: `1px solid ${tokens.colors.neutral[300]}`,
                borderRadius: tokens.borderRadius.md,
                fontSize: tokens.fontSize.base,
              }}
            >
              <option value="">All Statuses</option>
              <option value={ORDER_STATUS.PAID}>Paid</option>
              <option value={ORDER_STATUS.PENDING}>Pending</option>
              <option value={ORDER_STATUS.REFUNDED}>Refunded</option>
              <option value={ORDER_STATUS.FAILED}>Failed</option>
            </select>

            {/* Date from */}
            <input
              type="date"
              name="dateFrom"
              defaultValue={searchParams.dateFrom}
              style={{
                padding: tokens.spacing.sm,
                border: `1px solid ${tokens.colors.neutral[300]}`,
                borderRadius: tokens.borderRadius.md,
                fontSize: tokens.fontSize.base,
              }}
            />

            {/* Date to */}
            <input
              type="date"
              name="dateTo"
              defaultValue={searchParams.dateTo}
              style={{
                padding: tokens.spacing.sm,
                border: `1px solid ${tokens.colors.neutral[300]}`,
                borderRadius: tokens.borderRadius.md,
                fontSize: tokens.fontSize.base,
              }}
            />

            <div style={{ display: 'flex', gap: tokens.spacing.sm }}>
              <Button type="submit">Filter</Button>
              <a href={ROUTES.ADMIN_ORDERS}>
                <Button type="button" variant="outline">
                  Clear
                </Button>
              </a>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {orders.length} Order{orders.length !== 1 ? 's' : ''}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div
              style={{
                padding: tokens.spacing.md,
                backgroundColor: tokens.colors.neutral[50],
                color: tokens.colors.accent[700],
                borderRadius: tokens.borderRadius.md,
                marginBottom: tokens.spacing.md,
              }}
            >
              Error: {error}
            </div>
          )}

          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: `2px solid ${tokens.colors.neutral[200]}`,
                  }}
                >
                  <th
                    style={{
                      textAlign: 'left',
                      padding: tokens.spacing.md,
                      fontSize: tokens.fontSize.sm,
                      fontWeight: tokens.fontWeight.semibold,
                      color: tokens.colors.neutral[600],
                    }}
                  >
                    Order #
                  </th>
                  <th
                    style={{
                      textAlign: 'left',
                      padding: tokens.spacing.md,
                      fontSize: tokens.fontSize.sm,
                      fontWeight: tokens.fontWeight.semibold,
                      color: tokens.colors.neutral[600],
                    }}
                  >
                    Customer
                  </th>
                  <th
                    style={{
                      textAlign: 'left',
                      padding: tokens.spacing.md,
                      fontSize: tokens.fontSize.sm,
                      fontWeight: tokens.fontWeight.semibold,
                      color: tokens.colors.neutral[600],
                    }}
                  >
                    Date
                  </th>
                  <th
                    style={{
                      textAlign: 'left',
                      padding: tokens.spacing.md,
                      fontSize: tokens.fontSize.sm,
                      fontWeight: tokens.fontWeight.semibold,
                      color: tokens.colors.neutral[600],
                    }}
                  >
                    Items
                  </th>
                  <th
                    style={{
                      textAlign: 'left',
                      padding: tokens.spacing.md,
                      fontSize: tokens.fontSize.sm,
                      fontWeight: tokens.fontWeight.semibold,
                      color: tokens.colors.neutral[600],
                    }}
                  >
                    Status
                  </th>
                  <th
                    style={{
                      textAlign: 'right',
                      padding: tokens.spacing.md,
                      fontSize: tokens.fontSize.sm,
                      fontWeight: tokens.fontWeight.semibold,
                      color: tokens.colors.neutral[600],
                    }}
                  >
                    Total
                  </th>
                  <th
                    style={{
                      textAlign: 'right',
                      padding: tokens.spacing.md,
                      fontSize: tokens.fontSize.sm,
                      fontWeight: tokens.fontWeight.semibold,
                      color: tokens.colors.neutral[600],
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    style={{
                      borderBottom: `1px solid ${tokens.colors.neutral[100]}`,
                    }}
                  >
                    <td
                      style={{
                        padding: tokens.spacing.md,
                        fontSize: tokens.fontSize.sm,
                        fontWeight: tokens.fontWeight.medium,
                      }}
                    >
                      {order.order_number}
                    </td>
                    <td
                      style={{
                        padding: tokens.spacing.md,
                        fontSize: tokens.fontSize.sm,
                      }}
                    >
                      <div>{order.email}</div>
                      {order.metadata && typeof order.metadata === 'object' && 'full_name' in order.metadata && (
                        <div
                          style={{
                            fontSize: tokens.fontSize.xs,
                            color: tokens.colors.neutral[500],
                          }}
                        >
                          {(order.metadata as any).full_name}
                        </div>
                      )}
                    </td>
                    <td
                      style={{
                        padding: tokens.spacing.md,
                        fontSize: tokens.fontSize.sm,
                        color: tokens.colors.neutral[600],
                      }}
                    >
                      {formatDate(order.created_at)}
                    </td>
                    <td
                      style={{
                        padding: tokens.spacing.md,
                        fontSize: tokens.fontSize.sm,
                      }}
                    >
                      {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                    </td>
                    <td style={{ padding: tokens.spacing.md }}>
                      <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
                    </td>
                    <td
                      style={{
                        padding: tokens.spacing.md,
                        fontSize: tokens.fontSize.sm,
                        fontWeight: tokens.fontWeight.semibold,
                        textAlign: 'right',
                      }}
                    >
                      {formatCurrency(Number(order.total), order.currency)}
                    </td>
                    <td style={{ padding: tokens.spacing.md, textAlign: 'right' }}>
                      <OrderDetailsModal order={order} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && (
              <div
                style={{
                  padding: tokens.spacing['2xl'],
                  textAlign: 'center',
                  color: tokens.colors.neutral[500],
                }}
              >
                No orders found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
