/**
 * Order Status Updater (Client Component)
 * Allows inline status updates for orders
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateOrderStatusAdmin } from '@/lib/actions/admin'
import { ORDER_STATUS } from '@/lib/constants'
import { tokens } from '@/lib/design-tokens'

export function OrderStatusUpdater({
  orderId,
  currentStatus,
}: {
  orderId: string
  currentStatus: string
}) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value
    setIsUpdating(true)

    try {
      const { success, error } = await updateOrderStatusAdmin(orderId, newStatus)

      if (error) {
        alert(`Error updating status: ${error}`)
        // Reset to current status
        e.target.value = currentStatus
      } else if (success) {
        router.refresh()
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Failed to update order status')
      e.target.value = currentStatus
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusStyles = (status: string) => {
    switch (status) {
      case ORDER_STATUS.PAID:
        return {
          bg: tokens.colors.primary[50],
          text: tokens.colors.primary[700],
          border: tokens.colors.primary[200],
        }
      case ORDER_STATUS.PENDING:
        return {
          bg: tokens.colors.neutral[100],
          text: tokens.colors.neutral[700],
          border: tokens.colors.neutral[300],
        }
      case ORDER_STATUS.REFUNDED:
        return {
          bg: tokens.colors.neutral[50],
          text: tokens.colors.accent[700],
          border: tokens.colors.neutral[200],
        }
      case ORDER_STATUS.FAILED:
        return {
          bg: tokens.colors.neutral[100],
          text: tokens.colors.accent[700],
          border: tokens.colors.neutral[300],
        }
      default:
        return {
          bg: tokens.colors.neutral[100],
          text: tokens.colors.neutral[700],
          border: tokens.colors.neutral[300],
        }
    }
  }

  const styles = getStatusStyles(currentStatus)

  return (
    <select
      value={currentStatus}
      onChange={handleStatusChange}
      disabled={isUpdating}
      style={{
        backgroundColor: styles.bg,
        color: styles.text,
        border: `1px solid ${styles.border}`,
        padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
        borderRadius: tokens.borderRadius.sm,
        fontSize: tokens.fontSize.xs,
        fontWeight: tokens.fontWeight.medium,
        textTransform: 'capitalize',
        cursor: isUpdating ? 'not-allowed' : 'pointer',
        opacity: isUpdating ? 0.6 : 1,
      }}
    >
      <option value={ORDER_STATUS.PENDING}>Pending</option>
      <option value={ORDER_STATUS.PAID}>Paid</option>
      <option value={ORDER_STATUS.REFUNDED}>Refunded</option>
      <option value={ORDER_STATUS.FAILED}>Failed</option>
    </select>
  )
}
