/**
 * Admin Products Management Page
 * Production-ready products table with CRUD operations
 * Zero hardcoding - all from database and design tokens
 */

import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { getAllProducts } from '@/lib/actions/admin'
import { ROUTES, USER_ROLES, PRODUCT_STATUS, PRODUCT_TYPES } from '@/lib/constants'
import { tokens } from '@/lib/design-tokens'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ProductDeleteButton } from './product-delete-button'

export const metadata = {
  title: 'Products Management - Admin',
  description: 'Manage your products',
}

/**
 * Format currency
 */
function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

/**
 * Status badge component
 */
function StatusBadge({ status }: { status: string }) {
  const getStatusStyles = () => {
    switch (status) {
      case PRODUCT_STATUS.ACTIVE:
        return {
          bg: tokens.colors.primary[50],
          text: tokens.colors.primary[700],
        }
      case PRODUCT_STATUS.DRAFT:
        return {
          bg: tokens.colors.neutral[100],
          text: tokens.colors.neutral[700],
        }
      case PRODUCT_STATUS.ARCHIVED:
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
 * Type badge component
 */
function TypeBadge({ type }: { type: string }) {
  return (
    <span
      style={{
        backgroundColor: tokens.colors.neutral[100],
        color: tokens.colors.neutral[700],
        padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
        borderRadius: tokens.borderRadius.sm,
        fontSize: tokens.fontSize.xs,
        fontWeight: tokens.fontWeight.medium,
        textTransform: 'capitalize',
      }}
    >
      {type}
    </span>
  )
}

export default async function ProductsManagementPage({
  searchParams,
}: {
  searchParams: { status?: string; type?: string; search?: string }
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

  // Get products with filters
  const { products, error } = await getAllProducts({
    status: searchParams.status,
    type: searchParams.type,
    search: searchParams.search,
  })

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
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: tokens.spacing.xl,
          flexWrap: 'wrap',
          gap: tokens.spacing.md,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: tokens.fontSize['4xl'],
              fontWeight: tokens.fontWeight.bold,
              marginBottom: tokens.spacing.sm,
              color: tokens.colors.neutral[900],
            }}
          >
            Products Management
          </h1>
          <p
            style={{
              fontSize: tokens.fontSize.lg,
              color: tokens.colors.neutral[600],
            }}
          >
            Manage your product catalog
          </p>
        </div>
        <Link href={`${ROUTES.ADMIN_PRODUCTS}/new`}>
          <Button>+ Create Product</Button>
        </Link>
      </div>

      {/* Filters */}
      <Card style={{ marginBottom: tokens.spacing.xl }}>
        <CardContent style={{ padding: tokens.spacing.lg }}>
          <form method="get" style={{ display: 'flex', gap: tokens.spacing.md, flexWrap: 'wrap' }}>
            {/* Search */}
            <input
              type="text"
              name="search"
              placeholder="Search products..."
              defaultValue={searchParams.search}
              style={{
                flex: '1 1 300px',
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
                minWidth: '150px',
              }}
            >
              <option value="">All Statuses</option>
              <option value={PRODUCT_STATUS.ACTIVE}>Active</option>
              <option value={PRODUCT_STATUS.DRAFT}>Draft</option>
              <option value={PRODUCT_STATUS.ARCHIVED}>Archived</option>
            </select>

            {/* Type filter */}
            <select
              name="type"
              defaultValue={searchParams.type || ''}
              style={{
                padding: tokens.spacing.sm,
                border: `1px solid ${tokens.colors.neutral[300]}`,
                borderRadius: tokens.borderRadius.md,
                fontSize: tokens.fontSize.base,
                minWidth: '150px',
              }}
            >
              <option value="">All Types</option>
              <option value={PRODUCT_TYPES.EBOOK}>E-book</option>
              <option value={PRODUCT_TYPES.PHYSICAL}>Physical</option>
              <option value={PRODUCT_TYPES.CONSULTATION}>Consultation</option>
              <option value={PRODUCT_TYPES.SUBSCRIPTION}>Subscription</option>
            </select>

            <Button type="submit">Filter</Button>
            <Link href={ROUTES.ADMIN_PRODUCTS}>
              <Button type="button" variant="outline">
                Clear
              </Button>
            </Link>
          </form>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {products.length} Product{products.length !== 1 ? 's' : ''}
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
                    Image
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
                    Type
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
                    Price (BRL)
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
                    Price (USD)
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
                {products.map((product) => (
                  <tr
                    key={product.id}
                    style={{
                      borderBottom: `1px solid ${tokens.colors.neutral[100]}`,
                    }}
                  >
                    <td style={{ padding: tokens.spacing.md }}>
                      {product.cover_image_url ? (
                        <div
                          style={{
                            width: '60px',
                            height: '60px',
                            position: 'relative',
                            borderRadius: tokens.borderRadius.md,
                            overflow: 'hidden',
                            backgroundColor: tokens.colors.neutral[100],
                          }}
                        >
                          <Image
                            src={product.cover_image_url}
                            alt={product.name}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                      ) : (
                        <div
                          style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: tokens.borderRadius.md,
                            backgroundColor: tokens.colors.neutral[100],
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: tokens.fontSize['2xl'],
                          }}
                        >
                          📚
                        </div>
                      )}
                    </td>
                    <td
                      style={{
                        padding: tokens.spacing.md,
                      }}
                    >
                      <div
                        style={{
                          fontSize: tokens.fontSize.sm,
                          fontWeight: tokens.fontWeight.medium,
                          marginBottom: tokens.spacing.xs,
                        }}
                      >
                        {product.name}
                      </div>
                      <div
                        style={{
                          fontSize: tokens.fontSize.xs,
                          color: tokens.colors.neutral[500],
                        }}
                      >
                        {product.slug}
                      </div>
                    </td>
                    <td style={{ padding: tokens.spacing.md }}>
                      <TypeBadge type={product.type} />
                    </td>
                    <td style={{ padding: tokens.spacing.md }}>
                      <StatusBadge status={product.status} />
                    </td>
                    <td
                      style={{
                        padding: tokens.spacing.md,
                        fontSize: tokens.fontSize.sm,
                        fontWeight: tokens.fontWeight.semibold,
                        textAlign: 'right',
                      }}
                    >
                      {formatCurrency(Number(product.price_brl), 'BRL')}
                    </td>
                    <td
                      style={{
                        padding: tokens.spacing.md,
                        fontSize: tokens.fontSize.sm,
                        fontWeight: tokens.fontWeight.semibold,
                        textAlign: 'right',
                      }}
                    >
                      {formatCurrency(Number(product.price_usd), 'USD')}
                    </td>
                    <td style={{ padding: tokens.spacing.md }}>
                      <div
                        style={{
                          display: 'flex',
                          gap: tokens.spacing.sm,
                          justifyContent: 'flex-end',
                        }}
                      >
                        <Link href={`${ROUTES.ADMIN_PRODUCTS}/${product.id}`}>
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                        </Link>
                        <ProductDeleteButton productId={product.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && (
              <div
                style={{
                  padding: tokens.spacing['2xl'],
                  textAlign: 'center',
                  color: tokens.colors.neutral[500],
                }}
              >
                No products found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
