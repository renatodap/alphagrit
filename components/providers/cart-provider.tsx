/**
 * SHOPPING CART PROVIDER
 *
 * Manages shopping cart state throughout the application.
 * Handles adding/removing items, quantity updates, and cart persistence.
 *
 * USAGE:
 * ```tsx
 * const { cart, addItem, removeItem, clearCart, total } = useCart()
 * ```
 *
 * @module cart-provider
 */

'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { useTranslation } from './i18n-provider'
import toast from 'react-hot-toast'

/**
 * Cart item shape
 */
export interface CartItem {
  /** Product ID */
  id: string
  /** Product name */
  name: string
  /** Product price */
  price: number
  /** Sale price (if applicable) */
  salePrice?: number
  /** Quantity in cart */
  quantity: number
  /** Product image URL */
  image?: string
  /** Product type (ebook, physical, etc.) */
  type?: string
}

/**
 * Cart context shape
 */
interface CartContextType {
  /** Array of items in cart */
  cart: CartItem[]
  /** Add item to cart (or increment quantity if exists) */
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  /** Remove item from cart completely */
  removeItem: (itemId: string) => void
  /** Update item quantity */
  updateQuantity: (itemId: string, quantity: number) => void
  /** Clear entire cart */
  clearCart: () => void
  /** Get specific item from cart */
  getItem: (itemId: string) => CartItem | undefined
  /** Check if item exists in cart */
  isInCart: (itemId: string) => boolean
  /** Total number of items in cart */
  itemCount: number
  /** Subtotal (sum of all items) */
  subtotal: number
  /** Tax amount (if applicable) */
  tax: number
  /** Total (subtotal + tax) */
  total: number
  /** Tax rate (configurable) */
  taxRate: number
}

/**
 * Create cart context
 */
const CartContext = createContext<CartContextType | undefined>(undefined)

/**
 * Local storage key for cart persistence
 */
const CART_STORAGE_KEY = 'alphagrit_cart'

/**
 * Default tax rate (can be made dynamic based on location)
 */
const DEFAULT_TAX_RATE = 0 // 0% tax for digital products by default

/**
 * Cart Provider Props
 */
interface CartProviderProps {
  /** Child components */
  children: ReactNode
  /** Optional tax rate override */
  taxRate?: number
}

/**
 * CART PROVIDER COMPONENT
 *
 * Provides shopping cart functionality throughout the application.
 * Handles cart state, localStorage persistence, and cart operations.
 *
 * Features:
 * - Add/remove items
 * - Quantity management
 * - Automatic price calculation
 * - localStorage persistence
 * - Toast notifications
 *
 * @param props - Provider props
 * @returns Cart context provider
 */
export function CartProvider({ children, taxRate = DEFAULT_TAX_RATE }: CartProviderProps) {
  const { t } = useTranslation()

  /**
   * Initialize cart from localStorage
   */
  const [cart, setCart] = useState<CartItem[]>(() => {
    // During SSR, return empty cart
    if (typeof window === 'undefined') {
      return []
    }

    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY)
      return storedCart ? JSON.parse(storedCart) : []
    } catch (error) {
      console.error('[Cart] Failed to parse stored cart:', error)
      return []
    }
  })

  /**
   * Persist cart to localStorage whenever it changes
   */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    }
  }, [cart])

  /**
   * ADD ITEM TO CART
   *
   * If item exists, increment quantity. Otherwise, add new item.
   *
   * @param item - Item to add (without quantity)
   * @param quantity - Quantity to add (default: 1)
   */
  const addItem = useCallback(
    (item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
      setCart((prevCart) => {
        const existingItemIndex = prevCart.findIndex((cartItem) => cartItem.id === item.id)

        // Item already in cart - increment quantity
        if (existingItemIndex > -1) {
          const updatedCart = [...prevCart]
          updatedCart[existingItemIndex] = {
            ...updatedCart[existingItemIndex],
            quantity: updatedCart[existingItemIndex].quantity + quantity,
          }
          return updatedCart
        }

        // New item - add to cart
        return [...prevCart, { ...item, quantity }]
      })

      // Show success toast
      toast.success(t.toast.success.productAdded)
    },
    [t]
  )

  /**
   * REMOVE ITEM FROM CART
   *
   * Completely removes an item from the cart.
   *
   * @param itemId - ID of item to remove
   */
  const removeItem = useCallback(
    (itemId: string) => {
      setCart((prevCart) => prevCart.filter((item) => item.id !== itemId))

      // Show success toast
      toast.success(t.toast.success.productRemoved)
    },
    [t]
  )

  /**
   * UPDATE ITEM QUANTITY
   *
   * Updates the quantity of an item in the cart.
   * If quantity is 0 or negative, removes the item.
   *
   * @param itemId - ID of item to update
   * @param quantity - New quantity
   */
  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    // Remove item if quantity is 0 or negative
    if (quantity <= 0) {
      setCart((prevCart) => prevCart.filter((item) => item.id !== itemId))
      return
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    )
  }, [])

  /**
   * CLEAR ENTIRE CART
   *
   * Removes all items from the cart.
   */
  const clearCart = useCallback(() => {
    setCart([])
  }, [])

  /**
   * GET SPECIFIC ITEM
   *
   * Retrieves a specific item from the cart.
   *
   * @param itemId - ID of item to retrieve
   * @returns Cart item or undefined
   */
  const getItem = useCallback(
    (itemId: string): CartItem | undefined => {
      return cart.find((item) => item.id === itemId)
    },
    [cart]
  )

  /**
   * CHECK IF ITEM IS IN CART
   *
   * @param itemId - ID of item to check
   * @returns True if item exists in cart
   */
  const isInCart = useCallback(
    (itemId: string): boolean => {
      return cart.some((item) => item.id === itemId)
    },
    [cart]
  )

  /**
   * CALCULATE TOTAL ITEM COUNT
   *
   * Sum of all item quantities in cart.
   */
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0)

  /**
   * CALCULATE SUBTOTAL
   *
   * Sum of all item prices (using sale price if available).
   */
  const subtotal = cart.reduce((total, item) => {
    const price = item.salePrice ?? item.price
    return total + price * item.quantity
  }, 0)

  /**
   * CALCULATE TAX
   *
   * Tax amount based on subtotal and tax rate.
   */
  const tax = subtotal * taxRate

  /**
   * CALCULATE TOTAL
   *
   * Subtotal + tax.
   */
  const total = subtotal + tax

  /**
   * Context value
   */
  const value: CartContextType = {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItem,
    isInCart,
    itemCount,
    subtotal,
    tax,
    total,
    taxRate,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

/**
 * CUSTOM HOOK: useCart
 *
 * Access cart functionality anywhere in the app.
 *
 * @returns Cart context
 * @throws Error if used outside CartProvider
 *
 * @example
 * ```tsx
 * function ProductCard({ product }) {
 *   const { addItem, isInCart } = useCart()
 *
 *   return (
 *     <div>
 *       <h3>{product.name}</h3>
 *       <button
 *         onClick={() => addItem(product)}
 *         disabled={isInCart(product.id)}
 *       >
 *         {isInCart(product.id) ? 'In Cart' : 'Add to Cart'}
 *       </button>
 *     </div>
 *   )
 * }
 * ```
 */
export function useCart() {
  const context = useContext(CartContext)

  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }

  return context
}

/**
 * Export types for external use
 */
export type { CartContextType }
