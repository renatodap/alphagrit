/**
 * Product Delete Button (Client Component)
 * Handles product deletion with confirmation
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteProduct } from '@/lib/actions/admin'
import { Button } from '@/components/ui/button'
import { tokens } from '@/lib/design-tokens'

export function ProductDeleteButton({ productId }: { productId: string }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const { success, error } = await deleteProduct(productId)

      if (error) {
        alert(`Error deleting product: ${error}`)
        setIsDeleting(false)
        setShowConfirm(false)
        return
      }

      if (success) {
        router.refresh()
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Failed to delete product')
      setIsDeleting(false)
      setShowConfirm(false)
    }
  }

  if (showConfirm) {
    return (
      <div
        style={{
          display: 'flex',
          gap: tokens.spacing.xs,
        }}
      >
        <Button
          size="sm"
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Confirm'}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowConfirm(false)}
          disabled={isDeleting}
        >
          Cancel
        </Button>
      </div>
    )
  }

  return (
    <Button
      size="sm"
      variant="destructive"
      onClick={() => setShowConfirm(true)}
    >
      Delete
    </Button>
  )
}
