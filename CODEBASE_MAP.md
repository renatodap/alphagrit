# Alpha Grit E-Commerce Platform - Complete Codebase Map

**Generated:** November 16, 2025  
**Current Branch:** claude/user-flows-mapping-01FvAKPwSE7MGZCDQY4YrCQM  
**Framework:** Next.js 14.2+ | Backend: Supabase | Styling: Tailwind CSS

---

## 1. PROJECT STRUCTURE OVERVIEW

### Directory Tree
```
alphagrit/
├── app/                           # Next.js 14 App Router
│   ├── page.tsx                   # Root redirect to /store
│   ├── layout.tsx                 # Root layout with theme provider
│   ├── globals.css                # Global styles
│   ├── (store)/                   # Public store routes (layout group)
│   │   ├── layout.tsx             # Store layout with header/footer
│   │   └── store/
│   │       └── page.tsx           # Store homepage (hero + products section)
│   ├── account/                   # Protected user routes
│   │   ├── page.tsx               # Account dashboard
│   │   ├── orders/                # (Placeholder - needs implementation)
│   │   ├── ebooks/                # (Placeholder - needs implementation)
│   │   └── settings/              # (Placeholder - needs implementation)
│   ├── auth/                      # Authentication routes
│   │   ├── signin/
│   │   │   └── page.tsx           # Sign in form
│   │   ├── signup/
│   │   │   └── page.tsx           # Sign up form
│   │   └── callback/
│   │       └── route.ts           # OAuth callback handler
│   └── admin/                     # (Placeholder - needs implementation)
│
├── components/                    # React components
│   ├── ui/                        # Design system components (atomized)
│   │   ├── button.tsx             # Button component with variants
│   │   ├── card.tsx               # Card component
│   │   ├── input.tsx              # Input component
│   │   ├── label.tsx              # Label component
│   │   ├── layout.tsx             # Layout primitives (Container, Stack, Grid, etc.)
│   │   ├── typography.tsx         # Typography (Heading, Text, Display)
│   │   ├── responsive.tsx         # Responsive helpers (DesktopOnly, MobileOnly)
│   │   └── spacing.tsx            # Spacing utilities
│   ├── store/                     # Store-specific components
│   │   ├── header.tsx             # Navigation header with logo
│   │   └── footer.tsx             # Footer with links
│   └── providers/
│       └── theme-provider.tsx     # Dark mode theme provider
│
├── lib/                           # Utilities and business logic
│   ├── supabase/
│   │   ├── client.ts              # Client-side Supabase client
│   │   ├── server.ts              # Server-side Supabase client
│   │   └── middleware.ts          # Middleware for auth/routing
│   ├── actions/
│   │   └── auth.ts                # Server actions for authentication
│   ├── hooks/
│   │   └── use-breakpoint.ts      # Responsive breakpoint hook
│   ├── constants.ts               # App constants & routes
│   ├── design-tokens.ts           # Design tokens (colors, spacing, etc.)
│   └── utils.ts                   # Utility functions
│
├── config/                        # Configuration files
│   ├── site.ts                    # Site-wide configuration
│   ├── navigation.ts              # Navigation structure
│   └── features.ts                # Feature flags
│
├── types/                         # TypeScript types
│   ├── index.ts                   # Domain types & interfaces
│   └── supabase.ts                # Database schema types
│
├── public/                        # Static assets
├── supabase/
│   └── migrations/
│       └── 20240101000000_initial_schema.sql  # Database schema
│
├── middleware.ts                  # Next.js middleware
├── tsconfig.json                  # TypeScript configuration
├── tailwind.config.ts             # Tailwind CSS configuration
├── next.config.js                 # Next.js configuration
├── package.json                   # Dependencies
└── README.md                      # Project documentation
```

### Key Technologies
- **Framework:** Next.js 14.2+ (App Router, Server Actions)
- **Language:** TypeScript 5+
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth (Email/Password + Google OAuth)
- **Styling:** Tailwind CSS 3.4+ + shadcn/ui components
- **Payments:** Stripe (primary), Mercado Pago (prepared but disabled)
- **Email:** Resend + React Email
- **State Management:** None (using Server Components + Context where needed)
- **Additional Libraries:**
  - React Hot Toast (notifications)
  - Recharts (charts)
  - React Dropzone (file uploads)
  - TipTap (rich text editor)
  - Next Themes (dark mode)
  - Lucide React (icons)

---

## 2. ALL PAGES & ROUTES

### Frontend Pages (User-Facing)

#### Store Routes (Public)
| Route | File | Status | Purpose |
|-------|------|--------|---------|
| `/` | `app/page.tsx` | DONE | Root redirect to store |
| `/store` | `app/(store)/store/page.tsx` | DONE | Store homepage with hero and CTA |
| `/products` | `app/products/[slug]/page.tsx` | STUB | Product detail pages (not implemented) |
| `/cart` | `app/cart/page.tsx` | STUB | Shopping cart view (not implemented) |
| `/checkout` | `app/checkout/page.tsx` | STUB | Checkout flow (not implemented) |
| `/checkout/success` | `app/checkout/success/page.tsx` | STUB | Order confirmation (not implemented) |

#### Authentication Routes (Public)
| Route | File | Status | Purpose |
|-------|------|--------|---------|
| `/auth/signin` | `app/auth/signin/page.tsx` | DONE | Sign in form with email/password & Google OAuth |
| `/auth/signup` | `app/auth/signup/page.tsx` | DONE | Sign up form with email/password & Google OAuth |
| `/auth/callback` | `app/auth/callback/route.ts` | DONE | OAuth callback handler |
| `/auth/forgot-password` | TBD | STUB | Password reset (not implemented) |

#### Account Routes (Protected - Requires Login)
| Route | File | Status | Purpose |
|-------|------|--------|---------|
| `/account` | `app/account/page.tsx` | PARTIAL | User dashboard with links to orders/ebooks/settings |
| `/account/orders` | `app/account/orders/page.tsx` | STUB | Order history view (not implemented) |
| `/account/ebooks` | `app/account/ebooks/page.tsx` | STUB | Downloaded e-books library (not implemented) |
| `/account/settings` | `app/account/settings/page.tsx` | STUB | Account settings/profile (not implemented) |

#### Admin Routes (Protected - Requires Admin Role)
| Route | File | Status | Purpose |
|-------|------|--------|---------|
| `/admin` | `app/admin/page.tsx` | STUB | Admin dashboard (not implemented) |
| `/admin/products` | `app/admin/products/page.tsx` | STUB | Products CRUD (not implemented) |
| `/admin/orders` | `app/admin/orders/page.tsx` | STUB | Orders management (not implemented) |
| `/admin/customers` | `app/admin/customers/page.tsx` | STUB | Customer management (not implemented) |
| `/admin/blog` | `app/admin/blog/page.tsx` | STUB | Blog CMS (not implemented) |
| `/admin/settings` | `app/admin/settings/[section]/page.tsx` | STUB | Site settings editor (not implemented) |

#### Blog & Content Routes (Public)
| Route | File | Status | Purpose |
|-------|------|--------|---------|
| `/blog` | `app/blog/page.tsx` | STUB | Blog listing (not implemented) |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx` | STUB | Blog post detail (not implemented) |
| `/about` | `app/about/page.tsx` | STUB | About page (not implemented) |
| `/contact` | `app/contact/page.tsx` | STUB | Contact page (not implemented) |

#### Legal Pages (Public)
| Route | File | Status | Purpose |
|-------|------|--------|---------|
| `/legal/terms` | `app/legal/terms/page.tsx` | STUB | Terms of Service (not implemented) |
| `/legal/privacy` | `app/legal/privacy/page.tsx` | STUB | Privacy Policy (not implemented) |
| `/legal/refund` | `app/legal/refund/page.tsx` | STUB | Refund Policy (not implemented) |

### API Routes

#### OAuth & Auth Endpoints
| Endpoint | File | Status | Method | Purpose |
|----------|------|--------|--------|---------|
| `GET /auth/callback` | `app/auth/callback/route.ts` | DONE | GET | Handle OAuth provider callback |

#### To Be Implemented
- `POST /api/webhooks/stripe` - Stripe webhook handler
- `POST /api/orders` - Create order
- `POST /api/checkout/session` - Create Stripe checkout session
- `GET /api/downloads/[id]` - Secure download endpoint
- `POST /api/refunds` - Request refund
- `GET /api/products` - Product listing
- `POST /api/cart` - Cart management

---

## 3. ALL COMPONENTS & THEIR PURPOSES

### Design System Components (`/components/ui`)

#### Layout Primitives (Atomized, Zero-Hardcoding)

| Component | File | Purpose | Props |
|-----------|------|---------|-------|
| `Container` | `layout.tsx` | Max-width wrapper with responsive padding | `size: 'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` |
| `Stack` | `layout.tsx` | Vertical spacing container | `gap`, `align`, `justify` |
| `Inline` | `layout.tsx` | Horizontal spacing container | `gap`, `align`, `justify` |
| `Grid` | `layout.tsx` | Responsive grid | `cols: 1\|2\|3\|4\|6\|12`, `gap` |
| `Flex` | `layout.tsx` | Flexible layout | `direction`, `wrap`, `align`, `justify`, `gap` |
| `Section` | `layout.tsx` | Page section with spacing | `spacing: 'none' \| 'sm' \| 'md' \| 'lg' \| 'xl'` |

#### Typography Components

| Component | File | Purpose | Props |
|-----------|------|---------|-------|
| `Heading` | `typography.tsx` | Semantic heading elements | `level: 'h1'-'h6'`, `weight`, `align`, `gradient` |
| `Text` | `typography.tsx` | Semantic text element | `size`, `weight`, `align`, `color`, `truncate` |
| `Display` | `typography.tsx` | Large hero text | `size: 'sm' \| 'md' \| 'lg'`, `gradient` |

#### Spacing Components

| Component | File | Purpose |
|-----------|------|---------|
| `Spacer` | `spacing.tsx` | Vertical spacing utility |
| `Divider` | `spacing.tsx` | Visual separator line |

#### Responsive Components

| Component | File | Purpose |
|-----------|------|---------|
| `DesktopOnly` | `responsive.tsx` | Show only on desktop |
| `MobileOnly` | `responsive.tsx` | Show only on mobile |

#### Base Components (shadcn/ui)

| Component | File | Purpose |
|-----------|------|---------|
| `Button` | `button.tsx` | Clickable button with variants |
| `Card` | `card.tsx` | Card container with header/content/footer |
| `Input` | `input.tsx` | Text input field |
| `Label` | `label.tsx` | Form label |

### Store Components (`/components/store`)

| Component | File | Purpose |
|-----------|------|---------|
| `Header` | `header.tsx` | Navigation header with logo, nav items, cart, account buttons |
| `Footer` | `footer.tsx` | Footer with links (products, company, legal, support) |

### Provider Components (`/components/providers`)

| Component | File | Purpose |
|-----------|------|---------|
| `ThemeProvider` | `theme-provider.tsx` | Dark/light mode theme provider (next-themes) |

---

## 4. DATABASE SCHEMA & MODELS

### Database Tables

#### Core Tables

##### `profiles`
```sql
- id (UUID, FK to auth.users, PK)
- email (TEXT, UNIQUE)
- full_name (TEXT)
- role (TEXT: 'customer' | 'admin', DEFAULT 'customer')
- avatar_url (TEXT)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
```
**Purpose:** User profiles extending Supabase auth  
**RLS:** User-managed + public read

##### `products`
```sql
- id (UUID, PK)
- name (TEXT, NOT NULL)
- slug (TEXT, UNIQUE)
- description (TEXT)
- short_description (TEXT)
- price_brl (DECIMAL(10,2))
- price_usd (DECIMAL(10,2))
- type (TEXT: 'ebook' | 'physical' | 'consultation' | 'subscription', DEFAULT 'ebook')
- category (TEXT)
- cover_image_url (TEXT)
- file_url (TEXT, for downloadable products)
- file_size_bytes (BIGINT)
- status (TEXT: 'draft' | 'active' | 'archived', DEFAULT 'draft')
- stripe_product_id (TEXT)
- stripe_price_id_brl (TEXT)
- stripe_price_id_usd (TEXT)
- metadata (JSONB, flexible type-specific data)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
```
**Purpose:** Unified product catalog  
**RLS:** Public read active, admin write

##### `orders`
```sql
- id (UUID, PK)
- user_id (UUID, FK profiles, NULLABLE for guest checkouts)
- order_number (TEXT, UNIQUE)
- email (TEXT, for guest orders)
- status (TEXT: 'pending' | 'paid' | 'refunded' | 'failed', DEFAULT 'pending')
- currency (TEXT: 'BRL' | 'USD')
- subtotal (DECIMAL(10,2))
- total (DECIMAL(10,2))
- payment_provider (TEXT: 'stripe' | 'mercadopago')
- payment_intent_id (TEXT)
- payment_status (TEXT)
- refund_status (TEXT: NULL | 'requested' | 'approved' | 'processed')
- refund_reason (TEXT)
- refunded_at (TIMESTAMPTZ)
- metadata (JSONB)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
```
**Purpose:** Customer orders with payment tracking  
**RLS:** User sees own orders, admin sees all

##### `order_items`
```sql
- id (UUID, PK)
- order_id (UUID, FK orders, CASCADE delete)
- product_id (UUID, FK products)
- product_name (TEXT)
- product_type (TEXT)
- quantity (INTEGER, DEFAULT 1)
- price (DECIMAL(10,2))
- metadata (JSONB)
- created_at (TIMESTAMPTZ)
```
**Purpose:** Line items for each order  
**RLS:** User sees own items, admin sees all

##### `download_links`
```sql
- id (UUID, PK)
- order_id (UUID, FK orders, CASCADE delete)
- product_id (UUID, FK products)
- user_id (UUID, FK profiles)
- signed_url (TEXT)
- download_count (INTEGER, DEFAULT 0)
- download_limit (INTEGER, DEFAULT 5)
- expires_at (TIMESTAMPTZ, 7 days from creation)
- ip_addresses (TEXT[], tracks download IPs)
- created_at (TIMESTAMPTZ)
```
**Purpose:** Temporary, expiring download links (7 days, 5 downloads max)  
**RLS:** User sees own, admin sees all

##### `cart_items`
```sql
- id (UUID, PK)
- user_id (UUID, FK profiles, CASCADE delete)
- product_id (UUID, FK products, CASCADE delete)
- quantity (INTEGER, DEFAULT 1)
- created_at (TIMESTAMPTZ)
- UNIQUE(user_id, product_id)
```
**Purpose:** Shopping cart for logged-in users  
**RLS:** User manages own cart

#### Content Tables

##### `reviews`
```sql
- id (UUID, PK)
- product_id (UUID, FK products, CASCADE delete)
- author_name (TEXT)
- author_title (TEXT, e.g., "Entrepreneur")
- rating (INTEGER, CHECK 1-5)
- content (TEXT)
- featured (BOOLEAN, DEFAULT FALSE)
- status (TEXT: 'active' | 'hidden', DEFAULT 'active')
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
```
**Purpose:** Product reviews (admin-managed for MVP)  
**RLS:** Public read active, admin manage all

##### `blog_posts`
```sql
- id (UUID, PK)
- title (TEXT)
- slug (TEXT, UNIQUE)
- excerpt (TEXT)
- content (TEXT, rich text JSON or Markdown)
- cover_image_url (TEXT)
- author_id (UUID, FK profiles)
- status (TEXT: 'draft' | 'published', DEFAULT 'draft')
- published_at (TIMESTAMPTZ)
- metadata (JSONB)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
```
**Purpose:** Blog content management  
**RLS:** Public read published, admin manage all

##### `faqs`
```sql
- id (UUID, PK)
- question (TEXT)
- answer (TEXT)
- category (TEXT)
- order_index (INTEGER, DEFAULT 0)
- status (TEXT: 'active' | 'hidden', DEFAULT 'active')
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
```
**Purpose:** Frequently asked questions  
**RLS:** Public read active, admin manage all

#### Configuration Tables

##### `site_config`
```sql
- id (UUID, PK)
- key (TEXT, UNIQUE)
- value (JSONB)
- description (TEXT)
- updated_at (TIMESTAMPTZ)
```
**Purpose:** Dynamic site configuration (key-value store)  
**Sample Data:**
- `site_name`: "Alpha Grit"
- `site_description`: "Transform your life..."
- `primary_color`: "#f97316"
- `secondary_color`: "#ef4444"
- `hero_title`, `hero_subtitle`
- `contact_whatsapp`: "+1 (956) 308-2357"
- Social links, legal dates

##### `feature_flags`
```sql
- id (UUID, PK)
- name (TEXT, UNIQUE)
- enabled (BOOLEAN, DEFAULT FALSE)
- description (TEXT)
- updated_at (TIMESTAMPTZ)
```
**Purpose:** Feature toggles for enabling/disabling features  
**Sample Flags:**
- `mercadopago_enabled` (FALSE)
- `affiliates_enabled` (FALSE)
- `subscriptions_enabled` (FALSE)
- `blog_enabled` (TRUE)
- `reviews_enabled` (TRUE)
- `newsletter_enabled` (FALSE)
- `dark_mode_enabled` (TRUE)
- `pwa_enabled` (TRUE)

#### Analytics Table

##### `page_views`
```sql
- id (UUID, PK)
- page_path (TEXT)
- referrer (TEXT)
- user_id (UUID, FK profiles)
- session_id (TEXT)
- created_at (TIMESTAMPTZ)
```
**Purpose:** Simple page view analytics  
**RLS:** Anyone can insert, admin read

### Database Indexes
```sql
idx_products_slug, idx_products_status, idx_products_type
idx_orders_user_id, idx_orders_email, idx_orders_status, idx_orders_order_number
idx_order_items_order_id
idx_download_links_user_id, idx_download_links_order_id, idx_download_links_expires_at
idx_reviews_product_id, idx_reviews_featured
idx_blog_posts_slug, idx_blog_posts_status, idx_blog_posts_published_at
idx_faqs_order_index
idx_cart_items_user_id
```

### Database Functions
- `create_download_link()` - Creates download link after purchase
- `update_updated_at_column()` - Trigger for timestamp updates

---

## 5. AUTHENTICATION & AUTHORIZATION SETUP

### Authentication System

#### Providers
- **Email/Password:** Supabase Auth
- **OAuth:** Google (configured)

#### Session Management
- Supabase SSR (Server-Side Rendering) compatible
- Cookie-based sessions
- Middleware refresh on each request

### Authentication Flow

#### Sign Up Flow
1. User fills sign up form (email, password, full name)
2. `signUp()` server action called
3. Supabase Auth creates user in `auth.users`
4. Profile created in `profiles` table with `role: 'customer'`
5. Redirect to `/account`

#### Sign In Flow
1. User fills sign in form (email, password)
2. `signIn()` server action called
3. Supabase validates credentials
4. Session cookie set
5. Redirect to `/account` or provided `redirect` param

#### Google OAuth Flow
1. User clicks "Continue with Google"
2. `signInWithGoogle()` server action redirects to Google
3. Google callback to `/auth/callback`
4. Session established
5. Profile created if not exists
6. Redirect to `/account`

### Authorization System

#### Role-Based Access Control (RBAC)
- **customer:** Default user role, access to store + account
- **admin:** Full access to admin panel + all management features

#### Protected Routes (Middleware)
```typescript
/account/*       → Requires auth (customer or admin)
/admin/*         → Requires auth + admin role
/store/*         → Public
/auth/*          → Public
```

### Row Level Security (RLS) Policies

#### profiles
- `Public profiles are viewable by everyone` → SELECT
- `Users can update own profile` → UPDATE
- `Users can insert own profile` → INSERT

#### products
- `Active products viewable by everyone` → SELECT (status='active' OR auth.uid() is admin)
- `Admins can insert/update/delete` → ALL

#### orders
- `Users see own orders` → SELECT (user_id = auth.uid() OR user is admin)
- `System can insert orders` → INSERT
- `Admins can update orders` → UPDATE

#### cart_items
- `Users manage own cart` → ALL (user_id = auth.uid())

#### download_links
- `Users see own links` → SELECT
- `Admins see all` → SELECT
- `Users update own links` → UPDATE

---

## 6. STATE MANAGEMENT APPROACH

### Strategy: Server Components + React Context (Minimal)

The codebase uses a **Server-First** approach with minimal client-side state:

#### Server-Side State
- User session (via Supabase middleware)
- Database queries (fetched in Server Components)
- Auth state (passed to layouts via `getUser()`)

#### Client-Side State
- **Theme:** `next-themes` context (dark/light mode)
- **Notifications:** `react-hot-toast` (toast state)
- **Responsive:** `useBreakpoint()` custom hook

#### State Management Libraries
- **None** - Next.js 14 Server Components + Server Actions handle most state
- **CSS-in-JS:** None (Tailwind CSS only)
- **Global state:** Not implemented (use context if needed)

### Server Actions
Located in `/lib/actions/auth.ts`:
- `signIn(formData)` - Authenticate user
- `signUp(formData)` - Register new user
- `signOut()` - Logout
- `signInWithGoogle()` - OAuth flow

---

## 7. DESIGN SYSTEM & THEMING SETUP

### Design Tokens (`lib/design-tokens.ts`)

#### Colors
**Primary (Orange):**
```
50: #fff7ed    100: #ffedd5   200: #fed7aa   300: #fdba74   400: #fb923c
500: #f97316   600: #ea580c   700: #c2410c   800: #9a3412   900: #7c2d12
950: #431407
```

**Accent (Red):**
```
500: #ef4444   600: #dc2626   700: #b91c1c
```

**Neutral (Gray scale):**
```
50: #fafafa    100: #f5f5f5   200: #e5e5e5   300: #d4d4d4   400: #a3a3a3
500: #737373   600: #525252   700: #404040   800: #262626   900: #171717
950: #0a0a0a (Black)
```

#### Typography
```
Base: 1rem (16px)
Sizes: xs-7xl (12px to 72px in 12 increments)
Weights: 400, 500, 600, 700, 800, 900
Line Heights: tight (1.25), normal (1.5), relaxed (1.75)
```

#### Spacing
```
xs: 0.25rem (4px)      md: 1rem (16px)       xl: 2rem (32px)       3xl: 4rem (64px)
sm: 0.5rem (8px)       lg: 1.5rem (24px)     2xl: 3rem (48px)       4xl: 6rem (96px)
                                                                       5xl: 8rem (128px)
```

#### Border Radius
```
sm: 4px    md: 8px    lg: 16px   xl: 24px   2xl: 32px   full: 9999px
```

#### Shadows
```
sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
md: 0 4px 6px -1px rgb(0 0 0 / 0.1)
lg: 0 10px 15px -3px rgb(0 0 0 / 0.1)
xl: 0 20px 25px -5px rgb(0 0 0 / 0.1)
2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25)
inner: inset 0 2px 4px 0 rgb(0 0 0 / 0.05)
```

#### Z-Index Scale
```
dropdown: 1000       sticky: 1020        fixed: 1030
modalBackdrop: 1040  modal: 1050         popover: 1060
tooltip: 1070
```

### Theme Implementation

#### CSS Variables (Light Mode - Root)
```css
--background: 0 0% 100%
--foreground: 0 0% 3.9%
--primary: 24 95% 53%
--accent: 0 84% 60%
--border: 0 0% 89.8%
--input: 0 0% 89.8%
--ring: 24 95% 53%
--radius: 0.5rem
```

#### Dark Mode Override
```css
.dark {
  --background: 0 0% 3.9%
  --foreground: 0 0% 98%
  --primary: 24 95% 53%
  --accent: 0 84% 60%
  --muted: 0 0% 14.9%
  --border: 0 0% 14.9%
}
```

### Tailwind Configuration
- **Color Scale:** Primary (orange) 50-950, Accent (red) 500-700, Neutral (gray) 50-950
- **Responsive Breakpoints:** sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)
- **Dark Mode:** Class-based
- **Typography Plugin:** `@tailwindcss/typography`

### Component Variants (via CVA - Class Variance Authority)

All components use **CVA for variants**, e.g.:
```typescript
const buttonVariants = cva('...base', {
  variants: {
    size: { sm: '...', md: '...', lg: '...' },
    variant: { primary: '...', secondary: '...', outline: '...' }
  }
})
```

### Responsive Design
- **Mobile-first approach:** Base styles on mobile, breakpoints add larger sizes
- **Responsive Components:** `Container`, `Stack`, `Grid` with built-in responsive variants
- **Breakpoint Hook:** `useBreakpoint()` provides `isMobile`, `isDesktop`, etc.
- **Responsive Helpers:** `<DesktopOnly>`, `<MobileOnly>` components

---

## 8. EXISTING USER FLOWS & DOCUMENTATION

### Documented Flows (README.md)

#### 1. **User Authentication Flow**
- Email/Password signup and signin
- Google OAuth integration
- Session management via Supabase SSR

#### 2. **Planned Store Flow** (Not Implemented)
- Browse products
- Add to cart
- Checkout with currency selection
- Payment via Stripe
- Order confirmation

#### 3. **Planned Download Flow** (Not Implemented)
- Purchase triggers download link creation
- Download link valid 7 days, 5 downloads max
- Secure download endpoint with signed URLs
- Download tracking via IP addresses

#### 4. **Planned Refund Flow** (Not Implemented)
- Auto-approve refunds < 7 days
- Manual approval for refunds > 7 days (within 30-day guarantee)
- Refund status tracking in database

### Configuration Files

#### `lib/constants.ts`
- **ROUTES:** All app routes defined as constants
- **PRODUCT_TYPES:** ebook, physical, consultation, subscription
- **PRODUCT_STATUS:** draft, active, archived
- **ORDER_STATUS:** pending, paid, refunded, failed
- **REFUND_STATUS:** requested, approved, processed, rejected
- **CURRENCIES:** BRL, USD
- **USER_ROLES:** customer, admin
- **DOWNLOAD_LIMITS:** MAX_DOWNLOADS (5), EXPIRY_DAYS (7)
- **FEATURE_FLAGS:** All feature toggles listed
- **STORAGE_BUCKETS:** products (private), site-assets (public)
- **TOAST_MESSAGES:** EN/PT localized messages

#### `config/navigation.ts`
- **storeNav:** Products, Blog
- **accountNav:** Dashboard, Orders, E-books, Settings
- **adminNav:** Dashboard, Products, Orders, Customers, Blog, Site Settings, Feature Flags
- **footerNav:** Links organized by section

#### `config/features.ts`
- **defaultFeatureFlags:** Default values for all feature flags
- `isFeatureEnabled()` function (currently returns defaults, should query DB)

#### `config/site.ts`
- **siteConfig:** Site name, description, URLs, contact info

### Environment Variables (`env.example`)
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
RESEND_API_KEY
NEXT_PUBLIC_APP_URL
```

### TypeScript Types (`types/index.ts`)
```typescript
// Database Models
Profile, Product, Order, OrderItem, DownloadLink, Review, BlogPost, FAQ

// Extended Types
ProductWithReviews, OrderWithItems, OrderWithItemsAndProducts, CartItemWithProduct

// Domains
CheckoutFormData, ApiResponse, FormState, PaginationParams, ProductFilters

// Domain Enums
UserRole ('customer' | 'admin')
PaymentProvider ('stripe' | 'mercadopago')
OrderStatus ('pending' | 'paid' | 'refunded' | 'failed')
ProductStatus ('draft' | 'active' | 'archived')
ProductType ('ebook' | 'physical' | 'consultation' | 'subscription')
Currency ('BRL' | 'USD')
Language ('en' | 'pt')
```

---

## 9. HARDCODED VALUES IDENTIFIED (To Be Eliminated)

### In `/app/layout.tsx` (Toaster Configuration)
```typescript
toastOptions={{
  style: {
    background: '#333',        // HARDCODED - use design tokens
    color: '#fff',             // HARDCODED - use design tokens
  },
  success: {
    iconTheme: {
      primary: '#f97316',      // HARDCODED - use design token (primary-500)
      secondary: '#fff',       // HARDCODED
    },
  },
  error: {
    iconTheme: {
      primary: '#ef4444',      // HARDCODED - use design token (accent-500)
      secondary: '#fff',       // HARDCODED
    },
  },
}}
```
**Fix:** Extract to `config/toast-config.ts` using design tokens

### In `/components/ui/typography.tsx` (Gradient Classes)
```typescript
gradient: {
  primary: 'bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 ...',
  accent: 'bg-gradient-to-r from-accent-500 via-accent-600 to-primary-500 ...',
  brand: 'bg-gradient-to-r from-primary-500 via-accent-500 to-primary-600 ...',
}
```
**Fix:** Extract to Tailwind theme config or design tokens

### In `/app/globals.css` (Hard-coded Colors in Custom Styles)
```css
.btn-ripple::after {
  background: rgba(255, 255, 255, 0.3);  // HARDCODED white
}
```
**Fix:** Use CSS variables or Tailwind utilities

### In `/components/store/header.tsx` (Navigation Items)
```typescript
const NAV_ITEMS = [
  { label: 'Products', href: ROUTES.STORE },
  { label: 'Blog', href: ROUTES.BLOG },
]
```
**Current:** Uses constants (good), but consider moving to `config/navigation.ts` for consistency

### In `/components/store/footer.tsx` (Footer Structure)
```typescript
const FOOTER_SECTIONS = { /* ... */ }
```
**Current:** Defined locally, should be in `config/navigation.ts` for consistency

### In `/lib/constants.ts` (Contact Info)
```typescript
CONTACT: {
  WHATSAPP: '+1 (956) 308-2357',
  EMAIL: 'support@alphagrit.com',
}
```
**Status:** Uses constants (good), but should be moved to `site_config` table for admin control

### In Database Seed Data
```sql
INSERT INTO public.site_config (key, value, description) VALUES
  ('contact_whatsapp', '"+1 (956) 308-2357"', ...),  -- Hardcoded phone
  ('hero_title', '"Dominate Every Area of Your Life"', ...),
  ('hero_subtitle', '"Science-based transformation..."', ...),
```
**Status:** In database (good for admin control), but duplicated in constants

### In `/lib/hooks/use-breakpoint.ts` (Breakpoint Values)
```typescript
const BREAKPOINTS = {
  sm: 640,      // Hardcoded
  md: 768,      // Hardcoded
  lg: 1024,     // Hardcoded
  xl: 1280,     // Hardcoded
  '2xl': 1536,  // Hardcoded
}
```
**Fix:** Import from `lib/design-tokens.ts`

---

## 10. TESTING & DEVELOPMENT CHECKLIST

### User Flows to Test

#### Authentication
- [ ] Sign up with email/password
- [ ] Sign up with Google OAuth
- [ ] Sign in with email/password
- [ ] Sign in with Google OAuth
- [ ] Password reset flow (not implemented)
- [ ] Session persistence across page reloads
- [ ] Logout functionality

#### Store Pages
- [ ] Homepage loads correctly
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Dark/light mode toggle
- [ ] Navigation works
- [ ] Footer links work

#### Account Pages (Protected)
- [ ] Redirect to signin if not authenticated
- [ ] Dashboard displays user info
- [ ] Orders link accessible
- [ ] E-books link accessible
- [ ] Settings link accessible
- [ ] Sign out button works

#### Admin Pages (Protected)
- [ ] Non-admin users cannot access
- [ ] Admin users can access
- [ ] Navigation structure correct

#### Design System
- [ ] All spacing tokens used (xs-5xl)
- [ ] All color tokens used
- [ ] Typography responsive
- [ ] Buttons have all variants working
- [ ] Cards display properly
- [ ] Layout components align correctly

### Hardcoded Values to Fix
- [ ] Extract toaster config to config file
- [ ] Consolidate navigation to config/navigation.ts
- [ ] Move hero content to DB or config
- [ ] Import breakpoints from design tokens
- [ ] Use design tokens in all custom styles

---

## 11. ARCHITECTURE DECISIONS & PATTERNS

### Server Components (Default)
- All pages are Server Components by default
- Use `'use client'` only where necessary (hooks, interactive features)

### File Organization
- **App Router** → Routes grouped by feature
- **Components** → Organized by type (ui, store, providers)
- **Lib** → Business logic organized by concern (supabase, actions, hooks)
- **Config** → Application configuration

### Type Safety
- Full TypeScript
- Database types generated from Supabase schema
- Type-safe Server Actions

### Styling
- **Tailwind CSS** with design tokens
- **CVA** for component variants
- **CSS Variables** for theme
- **Next Themes** for dark mode

### Data Fetching
- **Server Components** for data queries
- **Server Actions** for mutations
- **Middleware** for auth state

---

## Quick Stats

| Metric | Count |
|--------|-------|
| **Pages Implemented** | 7 |
| **Pages Planned** | 18+ |
| **API Endpoints Implemented** | 1 |
| **API Endpoints Planned** | 8+ |
| **Database Tables** | 12 |
| **Database Functions** | 2 |
| **Database Indexes** | 23 |
| **UI Components** | 15+ |
| **Design Tokens** | 100+ |
| **Environment Variables** | 10 |
| **Configuration Files** | 3 |

