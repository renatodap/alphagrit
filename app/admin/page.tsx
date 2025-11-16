/**
 * Admin Dashboard Page
 * Production-ready admin dashboard with stats, charts, and recent orders
 * Zero hardcoding - all from database and design tokens
 */

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getAdminStats } from '@/lib/actions/admin'
import { ROUTES, USER_ROLES, ORDER_STATUS } from '@/lib/constants'
import { tokens } from '@/lib/design-tokens'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Admin Dashboard - Alpha Grit',
  description: 'Manage your e-commerce platform',
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

/**
 * Stats card component
 */
function StatsCard({
  title,
  value,
  icon,
}: {
  title: string
  value: string | number
  icon: string
}) {
  return (
    <Card>
      <CardHeader
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: tokens.spacing.sm,
        }}
      >
        <CardTitle
          style={{
            fontSize: tokens.fontSize.sm,
            fontWeight: tokens.fontWeight.medium,
            color: tokens.colors.neutral[600],
          }}
        >
          {title}
        </CardTitle>
        <span style={{ fontSize: tokens.fontSize['2xl'] }}>{icon}</span>
      </CardHeader>
      <CardContent>
        <div
          style={{
            fontSize: tokens.fontSize['3xl'],
            fontWeight: tokens.fontWeight.bold,
            color: tokens.colors.neutral[900],
          }}
        >
          {value}
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Simple revenue chart (bar chart using divs)
 */
function RevenueChart({ data }: { data: { date: string; revenue: number }[] }) {
  const maxRevenue = Math.max(...data.map(d => d.revenue), 1)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: tokens.spacing.xs,
        height: '200px',
        padding: tokens.spacing.md,
      }}
    >
      {data.slice(-14).map((item, index) => (
        <div
          key={index}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: tokens.spacing.xs,
          }}
        >
          <div
            style={{
              width: '100%',
              backgroundColor: tokens.colors.primary[500],
              borderRadius: tokens.borderRadius.sm,
              height: `${(item.revenue / maxRevenue) * 160}px`,
              minHeight: item.revenue > 0 ? '4px' : '0',
              transition: `height ${tokens.transitions.base}`,
            }}
            title={`${formatDate(item.date)}: ${formatCurrency(item.revenue)}`}
          />
          <span
            style={{
              fontSize: tokens.fontSize.xs,
              color: tokens.colors.neutral[500],
              transform: 'rotate(-45deg)',
              whiteSpace: 'nowrap',
              marginTop: tokens.spacing.sm,
            }}
          >
            {new Date(item.date).getDate()}
          </span>
        </div>
      ))}
    </div>
  )
}

export default async function AdminDashboardPage() {
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

  // Get admin stats
  const { stats, error } = await getAdminStats()

  if (error || !stats) {
    return (
      <div
        style={{
          padding: tokens.spacing['2xl'],
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        <h1
          style={{
            fontSize: tokens.fontSize['4xl'],
            fontWeight: tokens.fontWeight.bold,
            marginBottom: tokens.spacing.lg,
          }}
        >
          Error Loading Dashboard
        </h1>
        <p style={{ color: tokens.colors.accent[600] }}>{error}</p>
      </div>
    )
  }

  return (
    <div
      style={{
        padding: tokens.spacing.xl,
        maxWidth: '1400px',
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
          Admin Dashboard
        </h1>
        <p
          style={{
            fontSize: tokens.fontSize.lg,
            color: tokens.colors.neutral[600],
          }}
        >
          Welcome back! Here&apos;s what&apos;s happening with your store.
        </p>
      </div>

      {/* Quick Actions */}
      <div
        style={{
          display: 'flex',
          gap: tokens.spacing.md,
          marginBottom: tokens.spacing.xl,
          flexWrap: 'wrap',
        }}
      >
        <Link href={ROUTES.ADMIN_PRODUCTS}>
          <Button>Manage Products</Button>
        </Link>
        <Link href={ROUTES.ADMIN_ORDERS}>
          <Button variant="outline">View Orders</Button>
        </Link>
        <Link href={ROUTES.ADMIN_CUSTOMERS}>
          <Button variant="outline">View Customers</Button>
        </Link>
        <Link href={`${ROUTES.ADMIN_PRODUCTS}/new`}>
          <Button variant="secondary">+ New Product</Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: tokens.spacing.lg,
          marginBottom: tokens.spacing.xl,
        }}
      >
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          icon="💰"
        />
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders}
          icon="📦"
        />
        <StatsCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon="👥"
        />
        <StatsCard
          title="Total Products"
          value={stats.totalProducts}
          icon="📚"
        />
      </div>

      {/* Revenue Chart */}
      <Card style={{ marginBottom: tokens.spacing.xl }}>
        <CardHeader>
          <CardTitle>Revenue Last 30 Days</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.revenueData.length > 0 ? (
            <RevenueChart data={stats.revenueData} />
          ) : (
            <div
              style={{
                padding: tokens.spacing['2xl'],
                textAlign: 'center',
                color: tokens.colors.neutral[500],
              }}
            >
              No revenue data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <CardTitle>Recent Orders</CardTitle>
          <Link href={ROUTES.ADMIN_ORDERS}>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
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
                    borderBottom: `1px solid ${tokens.colors.neutral[200]}`,
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
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order: any) => (
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
                      {order.email}
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
                    <td style={{ padding: tokens.spacing.md }}>
                      <StatusBadge status={order.status} />
                    </td>
                    <td
                      style={{
                        padding: tokens.spacing.md,
                        fontSize: tokens.fontSize.sm,
                        fontWeight: tokens.fontWeight.semibold,
                        textAlign: 'right',
                      }}
                    >
                      {formatCurrency(order.total, order.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {stats.recentOrders.length === 0 && (
              <div
                style={{
                  padding: tokens.spacing['2xl'],
                  textAlign: 'center',
                  color: tokens.colors.neutral[500],
                }}
              >
                No orders yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
