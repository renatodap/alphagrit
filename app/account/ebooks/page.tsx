import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getOrderDownloads } from '@/lib/actions/orders'
import { getDownloadLinks, createDownloadLink } from '@/lib/actions/downloads'
import {
  isDownloadExpired,
  isDownloadLimitReached,
  getDownloadsRemaining,
  getDaysUntilExpiry,
} from '@/lib/utils/downloads'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { tokens } from '@/lib/design-tokens'
import { ROUTES, ORDER_STATUS, PRODUCT_TYPES } from '@/lib/constants'
import Link from 'next/link'

/**
 * Format date
 */
function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

/**
 * Download button component (client-side for download action)
 */
function DownloadButton({ link }: { link: any }) {
  const expired = isDownloadExpired(link)
  const limitReached = isDownloadLimitReached(link)
  const downloadsRemaining = getDownloadsRemaining(link)
  const daysUntilExpiry = getDaysUntilExpiry(link)

  const isDisabled = expired || limitReached

  return (
    <div>
      <Button
        asChild={!isDisabled}
        disabled={isDisabled}
        variant={isDisabled ? 'secondary' : 'default'}
        style={{
          width: '100%',
        }}
      >
        {isDisabled ? (
          <span>{expired ? 'Link Expired' : 'Download Limit Reached'}</span>
        ) : (
          <a
            href={link.signed_url}
            download
            target="_blank"
            rel="noopener noreferrer"
          >
            Download E-book
          </a>
        )}
      </Button>
      {!isDisabled && (
        <div
          style={{
            marginTop: tokens.spacing.sm,
            fontSize: tokens.fontSize.xs,
            color: tokens.colors.neutral[600],
            display: 'flex',
            flexDirection: 'column',
            gap: tokens.spacing.xs,
          }}
        >
          <span>
            {downloadsRemaining} download{downloadsRemaining !== 1 ? 's' : ''} remaining
          </span>
          <span
            style={{
              color: daysUntilExpiry <= 2 ? tokens.colors.accent[600] : tokens.colors.neutral[600],
            }}
          >
            {daysUntilExpiry === 0
              ? 'Expires today'
              : `Expires in ${daysUntilExpiry} day${daysUntilExpiry !== 1 ? 's' : ''}`
            }
          </span>
        </div>
      )}
    </div>
  )
}

/**
 * Empty state component
 */
function EmptyState() {
  return (
    <Card>
      <CardContent
        style={{
          padding: tokens.spacing['3xl'],
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: tokens.spacing.lg,
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: tokens.borderRadius.full,
              backgroundColor: tokens.colors.neutral[100],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke={tokens.colors.neutral[400]}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
          <div>
            <h3
              style={{
                fontSize: tokens.fontSize.lg,
                fontWeight: tokens.fontWeight.semibold,
                marginBottom: tokens.spacing.xs,
              }}
            >
              No e-books yet
            </h3>
            <p
              style={{
                color: tokens.colors.neutral[600],
                marginBottom: tokens.spacing.lg,
              }}
            >
              You haven&apos;t purchased any e-books yet. Browse our collection to get started.
            </p>
          </div>
          <Button asChild>
            <Link href={ROUTES.STORE}>Browse E-books</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Ebook card component
 */
function EbookCard({ ebook }: { ebook: any }) {
  const { product, downloadLink, orderDate } = ebook

  return (
    <Card>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: tokens.spacing.lg,
        }}
      >
        {/* E-book cover */}
        {product?.cover_image_url && (
          <div
            style={{
              width: '120px',
              height: '160px',
              flexShrink: 0,
              borderRadius: tokens.borderRadius.md,
              overflow: 'hidden',
              backgroundColor: tokens.colors.neutral[100],
            }}
          >
            <img
              src={product.cover_image_url}
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
        )}

        {/* E-book details */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: tokens.spacing.lg,
          }}
        >
          <div style={{ flex: 1 }}>
            <h3
              style={{
                fontSize: tokens.fontSize.xl,
                fontWeight: tokens.fontWeight.semibold,
                marginBottom: tokens.spacing.sm,
              }}
            >
              {product?.name}
            </h3>
            <p
              style={{
                fontSize: tokens.fontSize.sm,
                color: tokens.colors.neutral[600],
                marginBottom: tokens.spacing.md,
              }}
            >
              {product?.short_description || product?.description}
            </p>
            <p
              style={{
                fontSize: tokens.fontSize.xs,
                color: tokens.colors.neutral[500],
              }}
            >
              Purchased on {formatDate(orderDate)}
            </p>
          </div>

          {/* Download section */}
          <div
            style={{
              marginTop: tokens.spacing.lg,
              paddingTop: tokens.spacing.lg,
              borderTop: `1px solid ${tokens.colors.neutral[200]}`,
            }}
          >
            {downloadLink ? (
              <DownloadButton link={downloadLink} />
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: tokens.spacing.sm,
                }}
              >
                <p
                  style={{
                    fontSize: tokens.fontSize.sm,
                    color: tokens.colors.neutral[600],
                  }}
                >
                  Download link not available. Please contact support.
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link href={`https://wa.me/19563082357`}>Contact Support</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

/**
 * Ebooks page
 */
export default async function EbooksPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(ROUTES.SIGNIN)
  }

  // Get all download links for the user
  const { links, error } = await getDownloadLinks(user.id)

  // Group links by product
  const ebooksByProduct = new Map()

  for (const link of links) {
    if (!ebooksByProduct.has(link.product_id)) {
      ebooksByProduct.set(link.product_id, {
        product: link.product,
        downloadLink: link,
        orderDate: link.created_at,
      })
    }
  }

  const ebooks = Array.from(ebooksByProduct.values())

  return (
    <div
      style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: `${tokens.spacing['2xl']} ${tokens.spacing.lg}`,
      }}
    >
      <div
        style={{
          marginBottom: tokens.spacing['2xl'],
        }}
      >
        <h1
          style={{
            fontSize: tokens.fontSize['4xl'],
            fontWeight: tokens.fontWeight.bold,
            marginBottom: tokens.spacing.sm,
          }}
        >
          My E-books
        </h1>
        <p
          style={{
            fontSize: tokens.fontSize.lg,
            color: tokens.colors.neutral[600],
          }}
        >
          Access your purchased e-books and download links
        </p>
      </div>

      {error && (
        <Card
          style={{
            marginBottom: tokens.spacing.lg,
            backgroundColor: tokens.colors.neutral[50],
            borderColor: tokens.colors.neutral[200],
          }}
        >
          <CardContent
            style={{
              padding: tokens.spacing.lg,
            }}
          >
            <p style={{ color: tokens.colors.accent[700] }}>
              {error}
            </p>
          </CardContent>
        </Card>
      )}

      {!error && ebooks.length === 0 ? (
        <EmptyState />
      ) : (
        <div
          style={{
            display: 'grid',
            gap: tokens.spacing.lg,
            gridTemplateColumns: '1fr',
          }}
        >
          {ebooks.map((ebook) => (
            <EbookCard key={ebook.product.id} ebook={ebook} />
          ))}
        </div>
      )}

      {/* Info card */}
      {ebooks.length > 0 && (
        <Card
          style={{
            marginTop: tokens.spacing.lg,
            backgroundColor: tokens.colors.primary[50],
            borderColor: tokens.colors.primary[200],
          }}
        >
          <CardContent
            style={{
              padding: tokens.spacing.lg,
            }}
          >
            <h4
              style={{
                fontSize: tokens.fontSize.sm,
                fontWeight: tokens.fontWeight.semibold,
                marginBottom: tokens.spacing.sm,
                color: tokens.colors.primary[900],
              }}
            >
              Download Information
            </h4>
            <ul
              style={{
                fontSize: tokens.fontSize.sm,
                color: tokens.colors.primary[800],
                paddingLeft: tokens.spacing.lg,
                display: 'flex',
                flexDirection: 'column',
                gap: tokens.spacing.xs,
              }}
            >
              <li>Each download link is valid for 7 days from purchase</li>
              <li>You can download each e-book up to 5 times</li>
              <li>If your link expires or you need assistance, contact our support team</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
