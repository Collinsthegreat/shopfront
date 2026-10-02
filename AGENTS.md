# AGENTS.md — Shopfront (E-Commerce Store)

## Project Overview
"Shopfront" is a polished, minimal online shop with a cart, a checkout page, a database, Google sign-in, and order-confirmation emails, deployed to a public URL.
- **Niche:** Minimalist everyday carry and refined home goods (wallets, mechanical pencils, desk pads, stoneware mugs, canvas carryalls, precision knives, key organizers, etc.).
- **Currency:** Nigerian Naira (₦) by default, formatted with `Intl.NumberFormat`, configurable via `src/lib/constants.ts`. Money is strictly stored as integers in minor units (kobo). Never floats.
- **Auth Model:** Browsing and cart require NO authentication. Only `/checkout` and `/orders` require Google sign-in. If an unauthenticated user navigates to checkout, they are redirected to Google sign-in and returned to checkout with their cart intact.
- **Backend Persistence:** Supabase Postgres with Row Level Security (RLS) and atomic `create_order` PostgreSQL RPC transaction.
- **Email:** Mailgun HTTP API (server-side only, supporting US and EU endpoints) sending both responsive HTML and plain-text order confirmations. Email failures never block or rollback orders.

## Tech Stack
- **Framework:** Next.js 14+ (App Router) + TypeScript (strict mode, no `any`)
- **Styling:** Tailwind CSS with CSS custom properties for design tokens
- **Database & Auth:** Supabase (Postgres + Auth with Google Provider, `@supabase/ssr` cookie sessions and middleware)
- **Email:** Mailgun HTTP API (`api:{MAILGUN_API_KEY}`)
- **State Management:** Zustand with `persist` middleware (localStorage) for client cart state
- **Validation:** Zod for all inputs and schemas + `react-hook-form`
- **Dates:** `date-fns`
- **Testing:** Vitest + React Testing Library + Playwright smoke test
- **Deployment:** Vercel (Deployment Protection / Authentication turned OFF)

## Folder Structure
```
shopfront/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout, ThemeProvider, fonts, metadata
│   │   ├── page.tsx                # Home: Hero, featured products, category quick-links
│   │   ├── shop/
│   │   │   └── page.tsx            # Shop: grid, category filter, live search, sort, empty state
│   │   ├── product/
│   │   │   └── [slug]/
│   │   │       └── page.tsx        # Product detail: gallery, stock, description, add to cart
│   │   ├── cart/
│   │   │   └── page.tsx            # Standalone cart page (complementing slide-over drawer)
│   │   ├── checkout/
│   │   │   └── page.tsx            # Checkout (auth required, Zod form, pay on delivery)
│   │   ├── orders/
│   │   │   ├── page.tsx            # My orders history (auth required)
│   │   │   └── [id]/
│   │   │       └── page.tsx        # Order confirmation / detail & resend email button
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── page.tsx        # Dedicated sign-in page with "Continue with Google"
│   │   │   └── callback/
│   │   │       └── route.ts        # Supabase OAuth code exchange handler
│   │   ├── api/
│   │   │   ├── products/
│   │   │   │   └── route.ts        # GET products (category, search, sort)
│   │   │   ├── orders/
│   │   │   │   ├── route.ts        # GET user orders, POST create order (atomic RPC)
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts    # GET single order (own only)
│   │   │   │       └── resend-email/
│   │   │   │           └── route.ts # POST resend confirmation email
│   │   │   ├── dev/
│   │   │   │   └── test-email/
│   │   │   │       └── route.ts    # POST test email (disabled in prod unless secret provided)
│   │   │   └── health/
│   │   │       └── route.ts        # GET health check
│   │   ├── globals.css             # Design tokens & CSS custom properties
│   │   └── not-found.tsx           # Custom 404 page
│   ├── components/
│   │   ├── ui/                     # Button, Input, Modal, Badge, Toast, Skeleton, etc.
│   │   ├── layout/                 # Header, Nav, ThemeToggle, CartDrawer, UserMenu, Footer
│   │   ├── product/                # ProductCard, ProductGrid, ProductFilters, ImageGallery
│   │   ├── cart/                   # CartDrawer, CartItemRow, CartSummary
│   │   ├── checkout/               # CheckoutForm, OrderSummaryCard, DeliveryFields
│   │   └── orders/                 # OrderItemRow, OrderStatusBadge, ResendEmailButton
│   ├── hooks/                      # useCart, useAuth, useTheme, useToast
│   ├── lib/
│   │   ├── cart/
│   │   │   └── store.ts            # Zustand cart store with localStorage persistence
│   │   ├── email/
│   │   │   ├── mailgun.ts          # Mailgun HTTP client (US/EU endpoints)
│   │   │   ├── templates.ts        # Table-based inline CSS HTML & text email templates
│   │   │   └── index.ts            # Email sender interface & error logger
│   │   ├── supabase/
│   │   │   ├── client.ts           # Browser client (@supabase/ssr)
│   │   │   ├── server.ts           # Server client (@supabase/ssr cookies)
│   │   │   ├── admin.ts            # Service role client (server-side only)
│   │   │   └── middleware.ts       # Session refresher middleware
│   │   ├── constants.ts            # Currency, store name, category lists, delivery fee
│   │   ├── validations.ts          # Zod schemas for checkout, order, products
│   │   ├── formatters.ts           # Currency (Intl.NumberFormat) & date helpers
│   │   └── utils.ts                # cn helper, error parser
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces (Product, Order, OrderItem, etc.)
│   └── middleware.ts               # Next.js edge middleware for Supabase session refresh
├── supabase/
│   ├── migrations/
│   │   └── 20261002000000_init_shopfront.sql # Tables, RLS, create_order RPC, order_number gen
│   └── seed.sql                    # Initial 12-16 products across 4 categories
├── tests/
│   ├── unit/                       # Cart store, money formatting, order number, email templates
│   ├── api/                        # Orders, products, health, validation, RLS test mocks
│   └── components/                 # Add to cart, checkout form validation, theme toggle
└── README.md
```

## Coding Conventions
- Strict TypeScript (`strict: true`, `noUncheckedIndexedAccess: true`).
- **Never use `any`** — use `unknown` with type guards or define explicit types.
- Small, focused components (< 150 lines). Break down complex UIs.
- Named exports for all components and utilities. (Default exports only for Next.js route pages).
- Descriptive variable and function names; no cryptic abbreviations.
- Prefer `const` over `let`. No `var`.
- Early returns over nested condition trees.

## Design Rules

### Palette & Design Tokens
- **Strictly neutral grays, white, near-black** + **ONE accent color** (refined amber/indigo/slate accent used sparingly for primary buttons, focus ring, active filters, and cart count).
- **Subtle red** reserved strictly for errors, out-of-stock badges, and destructive actions.
- No gradients, no rainbow accent colors, no emoji clutter.
- All colors defined as CSS custom properties in `globals.css` with dark mode support.
- Both themes pass WCAG AA contrast standards.
- 0-flash theme script with system preference detection and sun/moon toggle.

### Design Tokens
```css
:root {
  --color-bg: #fafafa;
  --color-bg-secondary: #ffffff;
  --color-border: #e5e5e5;
  --color-border-subtle: #f0f0f0;
  --color-text-primary: #171717;
  --color-text-secondary: #737373;
  --color-text-tertiary: #a3a3a3;
  --color-accent: #0f172a; /* Sophisticated minimal dark accent in light mode */
  --color-accent-hover: #1e293b;
  --color-accent-contrast: #ffffff;
  --color-danger: #dc2626;
  --color-danger-bg: #fef2f2;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --shadow-card: 0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05);
}

.dark {
  --color-bg: #09090b;
  --color-bg-secondary: #141417;
  --color-border: #27272a;
  --color-border-subtle: #1f1f23;
  --color-text-primary: #f4f4f5;
  --color-text-secondary: #a1a1aa;
  --color-text-tertiary: #52525b;
  --color-accent: #f4f4f5; /* Clean light accent in dark mode */
  --color-accent-hover: #e4e4e7;
  --color-accent-contrast: #09090b;
  --color-danger: #ef4444;
  --color-danger-bg: #450a0a;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --shadow-card: none;
}
```

### Layout, Spacing & Typography
- Typography: Inter with clean system font fallback.
- Spacing: 8px base scale (4, 8, 12, 16, 20, 24, 32, 40, 48, 64).
- 12px card border radius, hairline borders (`1px solid var(--color-border)`).
- Sticky header with logo, navigation, search, theme toggle, and cart drawer trigger with real-time badge.
- Mobile-first, minimum 44px touch targets on buttons and inputs.
- Skeletons for loading states, graceful empty states for shop search and cart.

## Security Rules
1. **Row Level Security (RLS) is enabled** on every database table.
2. `products`: public read access.
3. `orders`, `order_items`, `email_logs`: users can only read their own rows (`auth.uid() = user_id`).
4. **No client-side inserts into orders**: Orders and order items are inserted strictly through the server-side RPC / API.
5. **The Service-Role Key is server-only** and NEVER prefixed with `NEXT_PUBLIC_` or bundled into client code.
6. **Never trust client prices**: Client submits `{ productId, quantity }` only. The database and server recompute all totals and unit prices authoritatively.
7. **Input Validation**: All API bodies and route parameters are validated using Zod.
8. **Idempotency**: Checkout requests include an idempotency key to prevent double submits.
9. **Never commit secrets**: All credentials live in `.env.local` and Vercel environment settings.

## API Conventions
- `GET /api/products`: Public, returns `{ data: Product[] }` with optional search, category, sort params.
- `GET /api/orders`: Authenticated (401 if unauthenticated), returns `{ data: Order[] }` for the current user.
- `GET /api/orders/[id]`: Authenticated, returns `{ data: OrderWithItems }`. If not the owner's order, returns 404 (not 403, preventing ID scanning).
- `POST /api/orders`: Authenticated. Zod validation of items and address. Executes atomic `create_order` RPC. Returns 201 on success, 400 on bad JSON, 401 on unauthenticated, 409 on out of stock, 422 on validation failure. Sends confirmation email asynchronously.
- `POST /api/orders/[id]/resend-email`: Authenticated. Resends confirmation email for own order.
- `GET /api/health`: Public, returns `{ status: "ok", timestamp: string }`.

## Email Rules
- Mailgun HTTP API is used (`https://api.mailgun.net/v3/{MAILGUN_DOMAIN}/messages` or EU host).
- Sends both HTML (table layout, inline CSS, monochrome style) and plain-text version.
- **Never block or fail an order on email error**: If Mailgun fails (e.g. unverified sandbox recipient), the order is still committed, the error is logged to `email_logs`, and the user is shown a soft warning on the order page with a "Resend confirmation email" button.
- Sandbox domain instruction: Users must verify their recipient email in Mailgun sandbox settings or connect a domain.

## Definition of Done
- [ ] Feature works end-to-end on live site
- [ ] Types are strict (0 `any`)
- [ ] API endpoints validated with Zod
- [ ] Row Level Security enabled and verified
- [ ] Server computes prices authoritatively
- [ ] Order creation is atomic with stock decrement
- [ ] Mailgun email sent without blocking order completion
- [ ] Light & dark themes look clean and pass WCAG AA
- [ ] Accessible (keyboard navigable, visible focus, ARIA tags)
- [ ] Mobile responsive (touch targets >= 44px)
- [ ] `npm test` passes
- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes
- [ ] `npm run build` passes
- [ ] Verified in browser (including incognito) on public Vercel URL

## Workflow Rules
- Commit in small, atomic steps with conventional commit prefixes: `feat:`, `fix:`, `test:`, `docs:`, `chore:`.
- Ship a working deployment early (Phase 1) and iterate.
- Never add username/password auth; only Supabase Auth with Google OAuth.

---

## Milestones
- [ ] 1. Write AGENTS.md and detailed execution plan
- [ ] 2. Scaffold Next.js project with Tailwind CSS, design tokens, theme system, and static product catalog
- [ ] 3. Implement Shop, Product Detail, and Zustand Cart drawer + page (works standalone)
- [ ] 4. Deploy initial preview to Vercel with Deployment Protection disabled
- [ ] 5. Database: Supabase migrations, RLS policies, atomic `create_order` RPC, and seed script
- [ ] 6. Supabase Auth with Google OAuth setup and instructions
- [ ] 7. Authoritative Checkout API, Order Confirmation page, and My Orders history
- [ ] 8. Mailgun integration, HTML/text templates, sandbox instructions, resend email endpoint
- [ ] 9. Automated unit, API, and component tests with Vitest + React Testing Library
- [ ] 10. Design polish, accessibility pass, dark mode contrast verification
- [ ] 11. Push to private GitHub repository and redeploy to Vercel
- [ ] 12. End-to-end live testing in browser and final delivery report
