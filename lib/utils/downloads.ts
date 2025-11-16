/**
 * Download utility functions
 * Pure utility functions (not server actions)
 */

import type { DownloadLink } from '@/types'

/**
 * Check if download link is expired
 */
export function isDownloadExpired(link: DownloadLink): boolean {
  return new Date(link.expires_at) < new Date()
}

/**
 * Check if download limit is reached
 */
export function isDownloadLimitReached(link: DownloadLink): boolean {
  return link.download_count >= link.download_limit
}

/**
 * Get downloads remaining for a link
 */
export function getDownloadsRemaining(link: DownloadLink): number {
  return Math.max(0, link.download_limit - link.download_count)
}

/**
 * Get days until expiry
 */
export function getDaysUntilExpiry(link: DownloadLink): number {
  const now = new Date()
  const expiry = new Date(link.expires_at)
  const diff = expiry.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}
