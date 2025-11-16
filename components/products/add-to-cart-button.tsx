/**
 * Add to Cart Button Component
 * Client-side interactive button with toast notifications
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Loader2 } from 'lucide-react'
import { addToCart } from '@/lib/actions/cart'
import { toast } from 'react-hot-toast'
import { TOAST_MESSAGES } from '@/lib/constants'
import { useRouter } from 'next/navigation'

interface AddToCartButtonProps {
  productId: string
  productName: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outline' | 'ghost'
  className?: string
}

export function AddToCartButton({
  productId,
  productName,
  size = 'md',
  variant = 'default',
  className,
}: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleAddToCart = async () => {
    setIsLoading(true)

    try {
      const { success, error } = await addToCart(productId, 1)

      if (success) {
        toast.success(`${productName} ${TOAST_MESSAGES.en.SUCCESS.PRODUCT_ADDED}`)
        router.refresh()
      } else {
        toast.error(error || TOAST_MESSAGES.en.ERROR.GENERIC)
      }
    } catch (err) {
      console.error('Error adding to cart:', err)
      toast.error(TOAST_MESSAGES.en.ERROR.GENERIC)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      size={size}
      variant={variant}
      onClick={handleAddToCart}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Adding...
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </>
      )}
    </Button>
  )
}
