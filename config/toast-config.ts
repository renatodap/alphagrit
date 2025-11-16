/**
 * Toast notification configuration
 * Uses design tokens - zero hardcoding
 */

import { tokens } from '@/lib/design-tokens'
import type { ToasterProps } from 'react-hot-toast'

export const toastConfig: ToasterProps['toastOptions'] = {
  className: '',
  style: {
    background: tokens.colors.neutral[800],
    color: tokens.colors.neutral[50],
  },
  success: {
    iconTheme: {
      primary: tokens.colors.primary[500],
      secondary: tokens.colors.neutral[50],
    },
  },
  error: {
    iconTheme: {
      primary: tokens.colors.accent[500],
      secondary: tokens.colors.neutral[50],
    },
  },
}
