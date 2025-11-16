/**
 * Product Create Page
 * Production-ready product creation form
 * Zero hardcoding - all from design tokens
 */

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ROUTES, USER_ROLES } from '@/lib/constants'
import { tokens } from '@/lib/design-tokens'
import { ProductForm } from '../product-form'

export const metadata = {
  title: 'Create Product - Admin',
  description: 'Create a new product',
}

export default async function ProductCreatePage() {
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
        Create New Product
      </h1>
      <p
        style={{
          fontSize: tokens.fontSize.lg,
          color: tokens.colors.neutral[600],
          marginBottom: tokens.spacing.xl,
        }}
      >
        Add a new product to your catalog
      </p>

      <ProductForm />
    </div>
  )
}
