/**
 * Admin Customers Management Page
 * Production-ready customers table with stats
 * Zero hardcoding - all from database and design tokens
 */

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAllCustomers } from '@/lib/actions/admin'
import { ROUTES, USER_ROLES } from '@/lib/constants'
import { tokens } from '@/lib/design-tokens'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata = {
  title: 'Customers Management - Admin',
  description: 'View and manage customers',
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
function formatDate(date: string | null): string {
  if (!date) return 'Never'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

/**
 * Role badge component
 */
function RoleBadge({ role }: { role: string }) {
  const isAdmin = role === USER_ROLES.ADMIN

  return (
    <span
      style={{
        backgroundColor: isAdmin ? tokens.colors.primary[50] : tokens.colors.neutral[100],
        color: isAdmin ? tokens.colors.primary[700] : tokens.colors.neutral[700],
        padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
        borderRadius: tokens.borderRadius.sm,
        fontSize: tokens.fontSize.xs,
        fontWeight: tokens.fontWeight.medium,
        textTransform: 'capitalize',
      }}
    >
      {role}
    </span>
  )
}

export default async function CustomersManagementPage({
  searchParams,
}: {
  searchParams: { search?: string }
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

  // Get customers
  const { customers, error } = await getAllCustomers()

  // Filter by search if provided
  let filteredCustomers = customers
  if (searchParams.search) {
    const search = searchParams.search.toLowerCase()
    filteredCustomers = customers.filter(
      (customer) =>
        customer.email?.toLowerCase().includes(search) ||
        customer.full_name?.toLowerCase().includes(search)
    )
  }

  // Calculate totals
  const totalCustomers = filteredCustomers.length
  const totalRevenue = filteredCustomers.reduce((sum, c) => sum + c.totalRevenue, 0)
  const totalOrders = filteredCustomers.reduce((sum, c) => sum + c.totalOrders, 0)

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
          Customers Management
        </h1>
        <p
          style={{
            fontSize: tokens.fontSize.lg,
            color: tokens.colors.neutral[600],
          }}
        >
          View customer information and statistics
        </p>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: tokens.spacing.lg,
          marginBottom: tokens.spacing.xl,
        }}
      >
        <Card>
          <CardContent style={{ padding: tokens.spacing.lg }}>
            <div
              style={{
                fontSize: tokens.fontSize.sm,
                color: tokens.colors.neutral[600],
                marginBottom: tokens.spacing.xs,
              }}
            >
              Total Customers
            </div>
            <div
              style={{
                fontSize: tokens.fontSize['3xl'],
                fontWeight: tokens.fontWeight.bold,
              }}
            >
              {totalCustomers}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent style={{ padding: tokens.spacing.lg }}>
            <div
              style={{
                fontSize: tokens.fontSize.sm,
                color: tokens.colors.neutral[600],
                marginBottom: tokens.spacing.xs,
              }}
            >
              Total Orders
            </div>
            <div
              style={{
                fontSize: tokens.fontSize['3xl'],
                fontWeight: tokens.fontWeight.bold,
              }}
            >
              {totalOrders}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent style={{ padding: tokens.spacing.lg }}>
            <div
              style={{
                fontSize: tokens.fontSize.sm,
                color: tokens.colors.neutral[600],
                marginBottom: tokens.spacing.xs,
              }}
            >
              Total Revenue
            </div>
            <div
              style={{
                fontSize: tokens.fontSize['3xl'],
                fontWeight: tokens.fontWeight.bold,
              }}
            >
              {formatCurrency(totalRevenue)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card style={{ marginBottom: tokens.spacing.xl }}>
        <CardContent style={{ padding: tokens.spacing.lg }}>
          <form method="get" style={{ display: 'flex', gap: tokens.spacing.md }}>
            <input
              type="text"
              name="search"
              placeholder="Search by email or name..."
              defaultValue={searchParams.search}
              style={{
                flex: 1,
                padding: tokens.spacing.sm,
                border: `1px solid ${tokens.colors.neutral[300]}`,
                borderRadius: tokens.borderRadius.md,
                fontSize: tokens.fontSize.base,
              }}
            />
            <button
              type="submit"
              style={{
                padding: `${tokens.spacing.sm} ${tokens.spacing.lg}`,
                backgroundColor: tokens.colors.primary[500],
                color: 'white',
                border: 'none',
                borderRadius: tokens.borderRadius.md,
                fontSize: tokens.fontSize.base,
                fontWeight: tokens.fontWeight.medium,
                cursor: 'pointer',
              }}
            >
              Search
            </button>
            {searchParams.search && (
              <a href={ROUTES.ADMIN_CUSTOMERS}>
                <button
                  type="button"
                  style={{
                    padding: `${tokens.spacing.sm} ${tokens.spacing.lg}`,
                    backgroundColor: 'transparent',
                    color: tokens.colors.neutral[700],
                    border: `1px solid ${tokens.colors.neutral[300]}`,
                    borderRadius: tokens.borderRadius.md,
                    fontSize: tokens.fontSize.base,
                    fontWeight: tokens.fontWeight.medium,
                    cursor: 'pointer',
                  }}
                >
                  Clear
                </button>
              </a>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filteredCustomers.length} Customer{filteredCustomers.length !== 1 ? 's' : ''}
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
                    Name
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
                    Email
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
                    Role
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
                    Total Orders
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
                    Total Revenue
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
                    Last Order
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
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
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
                      {customer.full_name || '-'}
                    </td>
                    <td
                      style={{
                        padding: tokens.spacing.md,
                        fontSize: tokens.fontSize.sm,
                      }}
                    >
                      {customer.email}
                    </td>
                    <td style={{ padding: tokens.spacing.md }}>
                      <RoleBadge role={customer.role} />
                    </td>
                    <td
                      style={{
                        padding: tokens.spacing.md,
                        fontSize: tokens.fontSize.sm,
                        textAlign: 'right',
                        fontWeight: tokens.fontWeight.medium,
                      }}
                    >
                      {customer.totalOrders}
                    </td>
                    <td
                      style={{
                        padding: tokens.spacing.md,
                        fontSize: tokens.fontSize.sm,
                        textAlign: 'right',
                        fontWeight: tokens.fontWeight.semibold,
                      }}
                    >
                      {formatCurrency(customer.totalRevenue)}
                    </td>
                    <td
                      style={{
                        padding: tokens.spacing.md,
                        fontSize: tokens.fontSize.sm,
                        textAlign: 'right',
                        color: tokens.colors.neutral[600],
                      }}
                    >
                      {formatDate(customer.lastOrderDate)}
                    </td>
                    <td
                      style={{
                        padding: tokens.spacing.md,
                        fontSize: tokens.fontSize.sm,
                        textAlign: 'right',
                        color: tokens.colors.neutral[600],
                      }}
                    >
                      {formatDate(customer.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredCustomers.length === 0 && (
              <div
                style={{
                  padding: tokens.spacing['2xl'],
                  textAlign: 'center',
                  color: tokens.colors.neutral[500],
                }}
              >
                No customers found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
