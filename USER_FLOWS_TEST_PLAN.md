# Alpha Grit - User Flows Testing Plan

**Document:** Complete Testing Checklist for All User Flows  
**Generated:** November 16, 2025  
**Status:** For systematic testing and hardcoding elimination

---

## Quick Stats

| Category | Count | Status |
|----------|-------|--------|
| **Implemented Pages** | 7 | PARTIAL (Auth + Store + Account Dashboard) |
| **Stub Pages** | 18+ | NOT IMPLEMENTED |
| **API Routes** | 1 | MINIMAL (OAuth callback only) |
| **Database Tables** | 12 | READY |
| **Design System Components** | 15+ | COMPLETE |
| **Hardcoded Values Found** | 7 | NEED FIXING |
| **Feature Flags** | 8 | READY IN DB |

---

## What's Working (Tested)

### 1. Authentication System (FUNCTIONAL)
- **Email/Password:** Sign up, Sign in, Sign out ✓
- **Google OAuth:** Sign up, Sign in ✓
- **Session Management:** Cookies + Middleware ✓
- **Protected Routes:** Redirect unauthenticated to /auth/signin ✓
- **Admin Check:** Redirect non-admin from /admin ✓

### 2. Store Pages (PARTIALLY WORKING)
- **Homepage (/store):** Hero section displays, responsive layout ✓
- **Navigation Header:** Logo, links, cart button, account button ✓
- **Footer:** Links organized in sections ✓
- **Dark/Light Mode:** Theme toggle works ✓

### 3. Account Pages (MINIMAL)
- **Dashboard (/account):** Shows user info, links to orders/ebooks/settings ✓
- **Protected Access:** Requires login ✓
- **Sign Out:** Works correctly ✓

### 4. Design System (COMPREHENSIVE)
- **Typography:** Heading, Text, Display with variants ✓
- **Layout:** Container, Stack, Grid, Flex, Section ✓
- **Components:** Button, Card, Input, Label ✓
- **Responsive:** Mobile-first, breakpoints working ✓
- **Colors:** Primary (orange), Accent (red), Neutral (gray) ✓
- **Spacing:** 12 scales (xs-5xl) ✓

---

## What's Missing (Needs Implementation)

### Critical User Flows (Priority 1)

#### 1. Product Management
- [ ] Product listing page with filtering/sorting
- [ ] Product detail page with reviews
- [ ] Add to cart functionality
- [ ] Shopping cart view
- [ ] Checkout flow with currency selection

#### 2. Payment Integration
- [ ] Stripe checkout session creation
- [ ] Stripe webhook handler
- [ ] Payment status tracking
- [ ] Order confirmation email

#### 3. Download System
- [ ] Create download links after purchase
- [ ] Secure download endpoint
- [ ] Download limit enforcement (5 downloads)
- [ ] Link expiry (7 days)
- [ ] Download tracking

#### 4. User Account Pages
- [ ] Order history page
- [ ] E-books library page
- [ ] Account settings page
- [ ] Password change/reset

### Secondary Features (Priority 2)

#### 5. Admin Panel
- [ ] Admin dashboard with metrics
- [ ] Products CRUD
- [ ] Orders management
- [ ] Customers list
- [ ] Blog CMS
- [ ] Site settings editor
- [ ] Feature flags editor

#### 6. Blog System
- [ ] Blog listing page
- [ ] Blog post detail page
- [ ] Blog post creation/editing (admin)

#### 7. Content Pages
- [ ] About page
- [ ] Contact page
- [ ] Legal pages (Terms, Privacy, Refund Policy)

---

## Hardcoded Values to Fix (Priority 3)

### 1. Toast Configuration (App Layout)
**File:** `/app/layout.tsx:70-86`

**Current Hardcoding:**
```typescript
toastOptions={{
  style: {
    background: '#333',      // HARDCODED - should use design token
    color: '#fff',           // HARDCODED
  },
  success: {
    iconTheme: {
      primary: '#f97316',    // HARDCODED - should use primary-500 token
      secondary: '#fff',     // HARDCODED
    },
  },
  error: {
    iconTheme: {
      primary: '#ef4444',    // HARDCODED - should use accent-500 token
      secondary: '#fff',     // HARDCODED
    },
  },
}}
```

**Fix:** Create `config/toast-config.ts`:
```typescript
import { tokens } from '@/lib/design-tokens'

export const toastConfig = {
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
```

### 2. Gradient Text Classes (Typography)
**File:** `/components/ui/typography.tsx:36-41`

**Current:** Uses Tailwind class strings (acceptable but not ideal)

**Better Approach:** Extract to Tailwind theme or use CSS variables

### 3. Button Ripple Effect (Global CSS)
**File:** `/app/globals.css:141`

**Current Hardcoding:**
```css
.btn-ripple::after {
  background: rgba(255, 255, 255, 0.3);  // HARDCODED white
}
```

**Fix:** Use CSS variable:
```css
.btn-ripple::after {
  background: hsl(var(--primary) / 0.3);
}
```

### 4. Breakpoint Values (Hook)
**File:** `/lib/hooks/use-breakpoint.ts:10-16`

**Current Hardcoding:**
```typescript
const BREAKPOINTS = {
  sm: 640,      // HARDCODED
  md: 768,      // HARDCODED
  lg: 1024,     // HARDCODED
  xl: 1280,     // HARDCODED
  '2xl': 1536,  // HARDCODED
}
```

**Fix:** Import from design tokens:
```typescript
import { tokens } from '@/lib/design-tokens'

const BREAKPOINTS = {
  sm: parseInt(tokens.breakpoints.sm),
  md: parseInt(tokens.breakpoints.md),
  lg: parseInt(tokens.breakpoints.lg),
  xl: parseInt(tokens.breakpoints.xl),
  '2xl': parseInt(tokens.breakpoints['2xl']),
}
```

### 5. Navigation Items (Header)
**File:** `/components/store/header.tsx:14-17`

**Current:** Defined locally (acceptable but inconsistent)

**Better:** Move to `config/navigation.ts` for consistency

### 6. Footer Sections (Footer)
**File:** `/components/store/footer.tsx:17-48`

**Current:** Defined locally

**Better:** Consolidate in `config/navigation.ts`

### 7. Contact Information (Constants)
**File:** `/lib/constants.ts:8-12`

**Current Hardcoding:**
```typescript
CONTACT: {
  WHATSAPP: '+1 (956) 308-2357',  // HARDCODED
  EMAIL: 'support@alphagrit.com',  // HARDCODED
}
```

**Status:** Should be fetched from `site_config` table for admin control

---

## Testing Scenarios by User Type

### Anonymous User (Not Logged In)

#### Can Access:
- [ ] `/` → Redirects to `/store`
- [ ] `/store` → Store homepage
- [ ] `/auth/signin` → Sign in form
- [ ] `/auth/signup` → Sign up form
- [ ] `/blog` → Blog listing (when implemented)
- [ ] `/legal/terms`, `/legal/privacy`, `/legal/refund`
- [ ] Footer links

#### Cannot Access (Should Redirect to /auth/signin):
- [ ] `/account/*` → All account pages
- [ ] `/admin/*` → All admin pages
- [ ] `/cart` → Shopping cart (once implemented)
- [ ] `/checkout` → Checkout (once implemented)

### Customer User (Authenticated)

#### Can Access:
- [ ] `/store` → Browse products
- [ ] `/products/[slug]` → Product details
- [ ] `/cart` → Shopping cart
- [ ] `/checkout` → Checkout
- [ ] `/account` → Dashboard
- [ ] `/account/orders` → Order history
- [ ] `/account/ebooks` → E-books library
- [ ] `/account/settings` → Account settings

#### Cannot Access (Should Redirect to /account):
- [ ] `/admin/*` → Admin pages (403/redirect)

### Admin User (Authenticated + Admin Role)

#### Can Access:
- [ ] All customer pages (above)
- [ ] `/admin` → Dashboard
- [ ] `/admin/products` → Product management
- [ ] `/admin/orders` → Order management
- [ ] `/admin/customers` → Customer list
- [ ] `/admin/blog` → Blog CMS
- [ ] `/admin/settings/*` → Site settings & feature flags

---

## Test Cases for Each User Flow

### Flow 1: User Sign Up & Authentication

```
Given: User on /auth/signup
When:  User enters valid email, password, full name
And:   User clicks "Create Account"
Then:  User is redirected to /account
And:   User session is created
And:   Profile is created in DB with role='customer'
And:   User can see their full name on dashboard
```

### Flow 2: User Sign In

```
Given: Existing user on /auth/signin
When:  User enters email and password
And:   User clicks "Sign In"
Then:  User is redirected to /account (or redirect param)
And:   User session is created
And:   User sees their profile info
```

### Flow 3: Google OAuth

```
Given: User on /auth/signin or /auth/signup
When:  User clicks "Continue with Google"
Then:  User is redirected to Google login
When:  User authenticates with Google
Then:  User is redirected to /auth/callback
And:   Session is established
And:   Profile is created if first time
Then:  User is redirected to /account
```

### Flow 4: Session Persistence

```
Given: User is logged in on /account
When:  User reloads page
Then:  User remains logged in
And:   User info is displayed

Given: User is logged in on /store
When:  User closes browser and reopens site
Then:  User remains logged in
```

### Flow 5: Responsive Design

```
Given: Any page in the app
When:  Viewport is 320px (mobile)
Then:  Layout stacks vertically
And:   Text is readable
And:   Buttons are tappable (44px+)

When:  Viewport is 768px (tablet)
Then:  Layout uses 2-column grid
And:   Navigation is visible

When:  Viewport is 1280px+ (desktop)
Then:  Layout uses 3+ column grid
And:   Full navigation is displayed
```

### Flow 6: Dark/Light Mode

```
Given: User on any page
When:  User clicks theme toggle
Then:  UI switches to dark mode
And:   Preference is saved

When:  User reloads page
Then:  Dark mode persists
And:   All colors are readable in dark mode
```

### Flow 7: Sign Out

```
Given: User is logged in on /account
When:  User clicks "Sign Out"
Then:  User is redirected to /
And:   Session cookie is cleared
And:   User cannot access /account
```

---

## Responsive Testing Checklist

### Breakpoints to Test
- [ ] **Mobile (320px - 639px):** sm breakpoint
- [ ] **Tablet (640px - 767px):** md breakpoint
- [ ] **Small Desktop (768px - 1023px):** lg breakpoint
- [ ] **Desktop (1024px - 1279px):** xl breakpoint
- [ ] **Large Desktop (1280px+):** 2xl breakpoint

### Elements to Check at Each Breakpoint
- [ ] Navigation visibility and layout
- [ ] Grid layouts (2-col, 3-col, 4-col)
- [ ] Button sizes and spacing
- [ ] Text sizes and readability
- [ ] Images and media queries
- [ ] Footer layout
- [ ] Form layouts

---

## Design System Verification

### Colors
- [ ] Primary orange (#f97316) used consistently
- [ ] Accent red (#ef4444) for secondary actions
- [ ] Neutral gray scale for text/backgrounds
- [ ] Sufficient contrast for accessibility

### Typography
- [ ] Heading sizes scale properly (h1-h6)
- [ ] Text sizes are readable at all breakpoints
- [ ] Font weights are consistent
- [ ] Line heights are proper

### Spacing
- [ ] Gap utilities work: gap-sm, gap-md, gap-lg
- [ ] Padding is consistent (p-sm, p-md, p-lg)
- [ ] Margin uses spacing scale
- [ ] No hardcoded pixel values in components

### Components
- [ ] Button variants work (primary, outline, ghost)
- [ ] Button sizes work (sm, md, lg)
- [ ] Card layout is correct
- [ ] Input styling matches design
- [ ] Labels are associated with inputs

---

## Performance Checklist

- [ ] No console errors
- [ ] No console warnings
- [ ] Images are optimized
- [ ] CSS is minified
- [ ] JavaScript is code-split
- [ ] Page loads in < 3 seconds
- [ ] Core Web Vitals pass

---

## Accessibility Checklist

- [ ] All images have alt text
- [ ] Links have meaningful text
- [ ] Buttons have aria-labels where needed
- [ ] Form inputs are properly labeled
- [ ] Color contrast meets WCAG AA
- [ ] Keyboard navigation works
- [ ] Focus states are visible
- [ ] No keyboard traps

---

## Priority: Implementation Order

### Phase 1: Core Store Functionality (Week 1-2)
1. [ ] Product listing page
2. [ ] Product detail page
3. [ ] Add to cart
4. [ ] Shopping cart view
5. [ ] Checkout page layout

### Phase 2: Payment Integration (Week 2-3)
1. [ ] Stripe integration
2. [ ] Checkout session creation
3. [ ] Payment webhook handler
4. [ ] Order confirmation

### Phase 3: Download System (Week 3)
1. [ ] Create download links
2. [ ] Secure download endpoint
3. [ ] Download tracking

### Phase 4: Account Pages (Week 4)
1. [ ] Order history
2. [ ] E-books library
3. [ ] Account settings

### Phase 5: Admin Panel (Week 5-6)
1. [ ] Dashboard
2. [ ] Product management
3. [ ] Order management
4. [ ] Settings editor

### Phase 6: Content & Features (Week 6-7)
1. [ ] Blog system
2. [ ] Legal pages
3. [ ] Feature flags in UI

### Phase 7: Polish & Hardcoding Fix (Week 7)
1. [ ] Eliminate hardcoded values
2. [ ] Testing & QA
3. [ ] Performance optimization

