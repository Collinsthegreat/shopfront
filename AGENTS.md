# AGENTS.md — BuildMart (Building Materials Marketplace)

## Project Overview
"BuildMart" is a polished, high-performance building-materials marketplace inspired by modern industrial and construction procurement platforms (such as Cutstruct). It features an authoritative product catalog, an instant cart drawer and cart page, Google sign-in authentication, simulated pay-on-delivery checkout, an atomic PostgreSQL transaction with inventory decrement, and transactional order confirmation emails via Mailgun, deployed to a public URL.

- **Market Niche:** Authentic building and construction materials in Nigeria across 11 core categories (Cement & Binders, Steel & Rods, Blocks & Bricks, Aggregates, Roofing, Tiles & Flooring, Paints & Finishes, Plumbing, Electrical, Doors & Hardware, Tools & Scaffolding).
- **Authoritative Transparent Pricing:** Every product clearly displays its price per unit (per bag, per 12m length, per trip, per ton, per sheet, etc.) in Nigerian Naira (₦). Never "Negotiate" or "-" placeholders.
- **Currency:** Nigerian Naira (₦) formatted via `Intl.NumberFormat("en-NG")`, strictly stored as integers in minor units (kobo). Never floats.
- **Logistics Haulage:** Construction materials include transparent site haulage calculations (flat-rate simulated site delivery fee of ₦35,000 across Lagos & Abuja).
- **Authentication Model:** Browsing, searching, filtering, and cart operations require NO authentication. Only `/checkout` and `/orders` require Google sign-in. If an unauthenticated user hits checkout, they are redirected to Google sign-in and returned with their cart preserved.
- **Database Persistence:** Supabase PostgreSQL with Row Level Security (RLS) on all tables and an atomic `create_order` PostgreSQL RPC transaction.
- **Email:** Mailgun HTTP API (server-side only, supporting US and EU endpoints) delivering responsive HTML and plain-text order confirmations. Email failures never block orders.

## Tech Stack
- **Framework:** Next.js 14+ (App Router) + TypeScript (strict mode, 0 `any`, `noUncheckedIndexedAccess: true`)
- **Styling:** Tailwind CSS with CSS custom properties for dual-theme tokens
- **Images:** Next.js `<Image>` with local compressed WebP images in `/public/products/`, 1:1 aspect ratio on clean white rounded tiles
- **Database & Auth:** Supabase (PostgreSQL + RLS + Supabase Auth via Google OAuth provider, `@supabase/ssr` cookies and edge middleware)
- **Email Service:** Mailgun HTTP API (`api:{MAILGUN_API_KEY}`)
- **State Management:** Zustand with `persist` middleware (`localStorage`) for client cart state
- **Validation:** Zod for all form schemas and API payloads + `react-hook-form`
- **Dates & Utility:** `date-fns`, `clsx`, `tailwind-merge`
- **Testing:** Vitest + React Testing Library + Playwright smoke testing
- **Deployment:** Vercel (Deployment Protection / Authentication turned OFF)

## Folder Structure
```
shopfront/ (BuildMart)
├── docs/
│   └── reference-notes.md          # Reference study of Cutstruct design & structure
├── public/
│   ├── products/                   # Local compressed WebP images (max 900px, <150KB)
│   └── CREDITS.md                  # Image sources, attribution, and license register
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout, ThemeProvider, fonts, metadata
│   │   ├── page.tsx                # Home: Giant hero, categories, featured brands, trust strip
│   │   ├── buy-materials/          # Marketplace
│   │   │   ├── page.tsx            # Marketplace: 4-col grid, search, category chips, sort, filters
│   │   │   └── [slug]/
│   │   │       └── page.tsx        # Product detail: gallery, specs table, bulk stepper, related
│   │   ├── about/
│   │   │   └── page.tsx            # About BuildMart
│   │   ├── cart/
│   │   │   └── page.tsx            # Standalone cart page (complementing slide-over drawer)
│   │   ├── checkout/
│   │   │   └── page.tsx            # Checkout (auth required, Zod form, haulage calculation)
│   │   ├── orders/
│   │   │   ├── page.tsx            # My orders history (auth required)
│   │   │   └── [id]/
│   │   │       └── page.tsx        # Order confirmation with unit breakdown & email resend
│   │   ├── privacy/page.tsx        # Privacy policy (OAuth compliance)
│   │   ├── terms/page.tsx          # Terms of service (OAuth compliance)
│   │   ├── auth/
│   │   │   ├── login/page.tsx      # Google sign-in page
│   │   │   └── callback/route.ts   # Supabase OAuth code exchange handler
│   │   ├── api/
│   │   │   ├── products/route.ts   # GET products (search, category, brand, price, sort, pagination)
│   │   │   ├── orders/route.ts     # GET user orders, POST create order (atomic RPC)
│   │   │   ├── orders/[id]/route.ts # GET single order (own only)
│   │   │   ├── orders/[id]/resend-email/route.ts # POST resend confirmation email
│   │   │   ├── dev/test-email/route.ts # POST test email (diagnostic)
│   │   │   └── health/route.ts     # GET health check
│   │   ├── globals.css             # Dual-theme design tokens & custom properties
│   │   └── not-found.tsx           # Custom 404 page
│   ├── components/
│   │   ├── ui/                     # Button, Input, Modal, Badge, Toast, Skeleton, etc.
│   │   ├── layout/                 # FloatingPillNav, Header, ThemeToggle, CartDrawer, UserMenu, Footer
│   │   ├── product/                # ProductCard, ProductGrid, ProductFilters, ImageGallery, SpecsTable
│   │   ├── cart/                   # CartDrawer, CartItemRow, CartSummary, BulkStepper
│   │   ├── checkout/               # CheckoutForm, OrderSummaryCard, HaulageNotice
│   │   └── orders/                 # OrderItemRow, OrderStatusBadge, ResendEmailButton
│   ├── hooks/                      # useCart, useAuth, useTheme, useToast
│   ├── lib/
│   │   ├── cart/store.ts           # Zustand cart store with localStorage persistence
│   │   ├── email/
│   │   │   ├── mailgun.ts          # Mailgun HTTP client (US/EU endpoints)
│   │   │   ├── templates.ts        # Itemized unit receipt HTML & text email templates
│   │   │   └── index.ts            # Email sender interface & logger
│   │   ├── supabase/
│   │   │   ├── client.ts           # Browser client (@supabase/ssr)
│   │   │   ├── server.ts           # Server client (@supabase/ssr cookies)
│   │   │   ├── admin.ts            # Service role client (server-side only)
│   │   │   └── middleware.ts       # Session refresher middleware
│   │   ├── constants.ts            # Store config, categories, brands, haulage fee, currency
│   │   ├── validations.ts          # Zod schemas for checkout, orders, filters
│   │   ├── formatters.ts           # Currency (Intl.NumberFormat("en-NG")), units, order numbers
│   │   └── data/products.ts        # 40-60 authentic construction products catalog
│   ├── types/index.ts              # TypeScript interfaces (Product, Brand, Category, Order, etc.)
│   └── middleware.ts               # Next.js edge middleware
├── supabase/
│   ├── migrations/
│   │   └── 20261003000000_buildmart_schema.sql # Tables, RLS, create_order RPC with unit_snapshot
│   └── seed.sql                    # 40-60 building products, brands, and categories
├── tests/
│   ├── unit/                       # Cart store, money formatting, order numbers, validations, email
│   ├── api/                        # Orders, products, health, validation, RLS test mocks
│   └── components/                 # Product card prices, Add-to-cart, theme toggle, checkout
└── README.md
```

## Design System & Rules

### Palette & Design Tokens
- **Dark Theme:** Deep navy-black background (`#0B1220`), slightly lighter elevated surfaces (`#131D31`), hairline borders (`#1F2E4A`), high-contrast text (`#F8FAFC`).
- **Light Theme:** Crisp white background (`#FFFFFF`), cool-gray secondary surfaces (`#F8FAFC`), hairline borders (`#E2E8F0`), charcoal text (`#0F172A`).
- **ONE Accent Color:** Construction safety orange (`#F58A2B` / `#EA580C`), tuned per theme to pass WCAG AA contrast standards (minimum 4.5:1 ratio for normal text and buttons). Used for active nav pill, primary CTA buttons, price highlights on hover, and focus rings.
- **Subtle Red:** Reserved strictly for errors, out-of-stock badges, and destructive actions. No rainbow gradients, no extraneous accents.
- **Typography:** Modern geometric sans (Inter / Plus Jakarta Sans), large bold headlines, uppercase product titles on cards, 8px spacing scale, generous whitespace.
- **Card Anatomy:** 1:1 square white image tile (`object-fit: contain`) with 16-24px rounded corners, brand pill, uppercase name, price line with unit (`₦9,500 / bag`), and two buttons (quiet outline `Add to cart` + solid accent `View →`).

### Design Tokens (`globals.css`)
```css
:root {
  --color-bg: #ffffff;
  --color-bg-secondary: #f8fafc;
  --color-surface: #ffffff;
  --color-surface-elevated: #f1f5f9;
  --color-border: #e2e8f0;
  --color-border-subtle: #edf2f7;
  --color-text-primary: #0f172a;
  --color-text-secondary: #475569;
  --color-text-tertiary: #94a3b8;
  --color-accent: #ea580c; /* Construction orange */
  --color-accent-hover: #c2410c;
  --color-accent-contrast: #ffffff;
  --color-danger: #dc2626;
  --color-danger-bg: #fef2f2;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-pill: 9999px;
  --shadow-card: 0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05);
}

.dark {
  --color-bg: #0b1220; /* Deep navy-black */
  --color-bg-secondary: #0f172a;
  --color-surface: #131d31;
  --color-surface-elevated: #1a2742;
  --color-border: #1f2e4a;
  --color-border-subtle: #172338;
  --color-text-primary: #f8fafc;
  --color-text-secondary: #94a3b8;
  --color-text-tertiary: #64748b;
  --color-accent: #f58a2b; /* Vibrant high-contrast orange */
  --color-accent-hover: #fa9c46;
  --color-accent-contrast: #0b1220;
  --color-danger: #ef4444;
  --color-danger-bg: #450a0a;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-pill: 9999px;
  --shadow-card: none;
}
```

## Security & Architectural Rules
1. **Row Level Security (RLS) is enabled** on every database table.
2. `products`, `categories`, `brands`: public read access.
3. `orders`, `order_items`, `email_logs`: users can only read their own rows (`auth.uid() = user_id`).
4. **No client-side inserts into orders**: Orders and order items are inserted strictly through the server-side RPC / API.
5. **The Service-Role Key is server-only** and NEVER prefixed with `NEXT_PUBLIC_` or bundled into client code.
6. **Never trust client prices**: Client submits `{ productId, quantity }` only. The database `create_order` PostgreSQL RPC recomputes all totals, unit prices, and unit snapshots authoritatively.
7. **Input Validation**: All API bodies and route parameters are validated using Zod.
8. **Idempotency**: Checkout requests include a client-generated idempotency key (`crypto.randomUUID()`) to prevent duplicate submits.
9. **Never commit secrets**: All credentials live in `.env.local` and Vercel environment settings.

## Email Confirmation Rules (Mailgun)
- Uses Mailgun HTTP API (`https://api.mailgun.net/v3/{MAILGUN_DOMAIN}/messages` or EU host).
- Sends both responsive HTML (table layout, monochrome with safety orange accents) and plain text.
- Formatted with customer name, order number, delivery details, itemized table displaying unit prices and units (e.g. `100 bags @ ₦9,500 / bag = ₦950,000`), simulated haulage fee, total, and link to `/orders/[id]`.
- **Non-blocking dispatch:** Email failures log to `email_logs` and display a soft warning banner with a "Resend confirmation email" button without failing or rolling back the order.

## Testing & Quality Assurance
- `npm test`: Unit tests for cart store, money formatters, order number generator, Zod schemas, email template rendering, and product data integrity (asserting every product has a valid price, unit, category, and existing image file).
- `npm run lint`: 0 ESLint warnings or errors.
- `npm run typecheck`: 0 TypeScript compiler errors.
- `npm run build`: Production compilation across all static and dynamic routes.

---

## Milestones Checklist
- [x] 0. Research Cutstruct reference site & write `docs/reference-notes.md`
- [x] 1. Update `AGENTS.md` and detailed execution roadmap
- [ ] 2. Source and optimize 40+ building material WebP photos in `/public/products/` & create `CREDITS.md`
- [ ] 3. Build 40-50 product dataset across 11 categories with brands, specs JSONB, prices, and units
- [ ] 4. Implement design tokens, floating pill navigation, hero, and theme toggle in `globals.css` and layout
- [ ] 5. Implement Marketplace page (`/buy-materials`), product card anatomy, live search, faceted filters, and URL sync
- [ ] 6. Implement Product Detail page (`/buy-materials/[slug]`) with bulk stepper and specs table
- [ ] 7. Update Zustand cart drawer and `/cart` page with unit labels, volume inputs, and haulage calculation
- [ ] 8. Supabase migration: `categories`, `brands`, `products`, `orders`, `order_items`, and updated `create_order` RPC
- [ ] 9. Seed Supabase database with all 40+ products, categories, and brands
- [ ] 10. Update Checkout, Auth gate, Order Confirmation with unit breakdown, and My Orders history
- [ ] 11. Update Mailgun email templates with itemized units and haulage
- [ ] 12. Run Vitest test suite, lint, typecheck, and production build
- [ ] 13. Deploy to Vercel production & verify on live domain
- [ ] 14. Push to private GitHub repository with README
- [ ] 15. Live end-to-end browser verification in incognito
