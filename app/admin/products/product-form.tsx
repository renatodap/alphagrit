/**
 * Product Form Component (Client)
 * Shared form for creating and editing products
 * Zero hardcoding - all from design tokens
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createProduct, updateProduct } from '@/lib/actions/admin'
import { ROUTES, PRODUCT_STATUS, PRODUCT_TYPES } from '@/lib/constants'
import { tokens } from '@/lib/design-tokens'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Product } from '@/types'

interface ProductFormProps {
  product?: Product | null
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    short_description: product?.short_description || '',
    price_brl: product?.price_brl?.toString() || '',
    price_usd: product?.price_usd?.toString() || '',
    type: product?.type || PRODUCT_TYPES.EBOOK,
    category: product?.category || '',
    cover_image_url: product?.cover_image_url || '',
    file_url: product?.file_url || '',
    status: product?.status || PRODUCT_STATUS.DRAFT,
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Auto-generate slug from name
    if (name === 'name' && !product) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setFormData((prev) => ({ ...prev, slug }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)

    try {
      const data = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        short_description: formData.short_description,
        price_brl: parseFloat(formData.price_brl),
        price_usd: parseFloat(formData.price_usd),
        type: formData.type,
        category: formData.category || null,
        cover_image_url: formData.cover_image_url || null,
        file_url: formData.file_url || null,
        status: formData.status,
      }

      let result
      if (product) {
        result = await updateProduct(product.id, data)
      } else {
        result = await createProduct(data)
      }

      if (result.error) {
        setError(result.error)
        setIsSaving(false)
        return
      }

      // Redirect to products list
      router.push(ROUTES.ADMIN_PRODUCTS)
      router.refresh()
    } catch (err) {
      console.error('Error saving product:', err)
      setError('Failed to save product')
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    router.push(ROUTES.ADMIN_PRODUCTS)
  }

  const inputStyle = {
    width: '100%',
    padding: tokens.spacing.sm,
    border: `1px solid ${tokens.colors.neutral[300]}`,
    borderRadius: tokens.borderRadius.md,
    fontSize: tokens.fontSize.base,
    fontFamily: 'inherit',
  }

  const labelStyle = {
    display: 'block',
    fontSize: tokens.fontSize.sm,
    fontWeight: tokens.fontWeight.medium,
    color: tokens.colors.neutral[700],
    marginBottom: tokens.spacing.xs,
  }

  const fieldStyle = {
    marginBottom: tokens.spacing.lg,
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent style={{ padding: tokens.spacing.xl }}>
          {error && (
            <div
              style={{
                padding: tokens.spacing.md,
                backgroundColor: tokens.colors.neutral[50],
                color: tokens.colors.accent[700],
                borderRadius: tokens.borderRadius.md,
                marginBottom: tokens.spacing.lg,
              }}
            >
              Error: {error}
            </div>
          )}

          {/* Product Name */}
          <div style={fieldStyle}>
            <label htmlFor="name" style={labelStyle}>
              Product Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="Enter product name"
            />
          </div>

          {/* Slug */}
          <div style={fieldStyle}>
            <label htmlFor="slug" style={labelStyle}>
              Slug (URL) *
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="product-url-slug"
            />
            <p
              style={{
                fontSize: tokens.fontSize.xs,
                color: tokens.colors.neutral[500],
                marginTop: tokens.spacing.xs,
              }}
            >
              Auto-generated from name, but you can customize it
            </p>
          </div>

          {/* Short Description */}
          <div style={fieldStyle}>
            <label htmlFor="short_description" style={labelStyle}>
              Short Description
            </label>
            <input
              type="text"
              id="short_description"
              name="short_description"
              value={formData.short_description}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Brief product description"
            />
          </div>

          {/* Description */}
          <div style={fieldStyle}>
            <label htmlFor="description" style={labelStyle}>
              Full Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              style={inputStyle}
              placeholder="Detailed product description"
            />
          </div>

          {/* Prices */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: tokens.spacing.md,
              marginBottom: tokens.spacing.lg,
            }}
          >
            <div>
              <label htmlFor="price_brl" style={labelStyle}>
                Price (BRL) *
              </label>
              <input
                type="number"
                id="price_brl"
                name="price_brl"
                value={formData.price_brl}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                style={inputStyle}
                placeholder="0.00"
              />
            </div>
            <div>
              <label htmlFor="price_usd" style={labelStyle}>
                Price (USD) *
              </label>
              <input
                type="number"
                id="price_usd"
                name="price_usd"
                value={formData.price_usd}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                style={inputStyle}
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Type and Status */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: tokens.spacing.md,
              marginBottom: tokens.spacing.lg,
            }}
          >
            <div>
              <label htmlFor="type" style={labelStyle}>
                Product Type *
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                style={inputStyle}
              >
                <option value={PRODUCT_TYPES.EBOOK}>E-book</option>
                <option value={PRODUCT_TYPES.PHYSICAL}>Physical</option>
                <option value={PRODUCT_TYPES.CONSULTATION}>Consultation</option>
                <option value={PRODUCT_TYPES.SUBSCRIPTION}>Subscription</option>
              </select>
            </div>
            <div>
              <label htmlFor="status" style={labelStyle}>
                Status *
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                style={inputStyle}
              >
                <option value={PRODUCT_STATUS.DRAFT}>Draft</option>
                <option value={PRODUCT_STATUS.ACTIVE}>Active</option>
                <option value={PRODUCT_STATUS.ARCHIVED}>Archived</option>
              </select>
            </div>
          </div>

          {/* Category */}
          <div style={fieldStyle}>
            <label htmlFor="category" style={labelStyle}>
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              style={inputStyle}
              placeholder="e.g., Fitness, Mindset, Business"
            />
          </div>

          {/* Cover Image URL */}
          <div style={fieldStyle}>
            <label htmlFor="cover_image_url" style={labelStyle}>
              Cover Image URL
            </label>
            <input
              type="url"
              id="cover_image_url"
              name="cover_image_url"
              value={formData.cover_image_url}
              onChange={handleChange}
              style={inputStyle}
              placeholder="https://example.com/image.jpg"
            />
            {formData.cover_image_url && (
              <div
                style={{
                  marginTop: tokens.spacing.md,
                  width: '200px',
                  height: '200px',
                  position: 'relative',
                  borderRadius: tokens.borderRadius.md,
                  overflow: 'hidden',
                  border: `1px solid ${tokens.colors.neutral[200]}`,
                }}
              >
                <Image
                  src={formData.cover_image_url}
                  alt="Cover preview"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            )}
          </div>

          {/* File URL (for downloadable products) */}
          <div style={fieldStyle}>
            <label htmlFor="file_url" style={labelStyle}>
              File URL (for downloadable products)
            </label>
            <input
              type="url"
              id="file_url"
              name="file_url"
              value={formData.file_url}
              onChange={handleChange}
              style={inputStyle}
              placeholder="https://example.com/product.pdf"
            />
            <p
              style={{
                fontSize: tokens.fontSize.xs,
                color: tokens.colors.neutral[500],
                marginTop: tokens.spacing.xs,
              }}
            >
              For e-books and digital products
            </p>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: 'flex',
              gap: tokens.spacing.md,
              marginTop: tokens.spacing.xl,
              paddingTop: tokens.spacing.xl,
              borderTop: `1px solid ${tokens.colors.neutral[200]}`,
            }}
          >
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
            </Button>
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isSaving}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
