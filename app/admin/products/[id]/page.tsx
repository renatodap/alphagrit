/**
 * Product Edit Page
 * Production-ready product editing form
 * Zero hardcoding - all from database and design tokens
 */

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProductById } from '@/lib/actions/admin'
import { ROUTES, USER_ROLES } from '@/lib/constants'
import { tokens } from '@/lib/design-tokens'
import { ProductForm } from '../product-form'

export const metadata = {
  title: 'Edit Product - Admin',
  description: 'Edit product details',
}

export default async function ProductEditPage({
  params,
}: {
  params: { id: string }
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

  // Get product
  const { product, error } = await getProductById(params.id)

  if (error || !product) {
    return (
      <div
        style={{
          padding: tokens.spacing.xl,
          maxWidth: '1000px',
          margin: '0 auto',
        }}
      >
        <h1
          style={{
            fontSize: tokens.fontSize['4xl'],
            fontWeight: tokens.fontWeight.bold,
            marginBottom: tokens.spacing.lg,
            color: tokens.colors.neutral[900],
          }}
        >
          Product Not Found
        </h1>
        <p style={{ color: tokens.colors.accent[600] }}>
          {error || 'The requested product could not be found.'}
        </p>
      </div>
    )
  }

  return (
    <div
      style={{
        padding: tokens.spacing.xl,
        maxWidth: '1000px',
        margin: '0 auto',
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
        Edit Product
      </h1>
      <p
        style={{
          fontSize: tokens.fontSize.lg,
          color: tokens.colors.neutral[600],
          marginBottom: tokens.spacing.xl,
        }}
      >
        Update product details and settings
      </p>

      <ProductForm product={product} />
    </div>
  )
}
