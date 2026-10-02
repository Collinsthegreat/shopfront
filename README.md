# Shopfront — Minimalist Everyday Carry & Living Goods

Shopfront is a polished, minimal e-commerce store with an authoritative PostgreSQL database, Google OAuth authentication, atomic inventory locking, and transactional confirmation emails via Mailgun.

**Live URL:** [https://shopfront-green.vercel.app](https://shopfront-green.vercel.app)

---

## Architecture Overview

```mermaid
flowchart TD
    subgraph Client ["Browser / Client Layer"]
        A[Next.js App Router] --> B[Zustand Cart Store (localStorage)]
        A --> C[Theme System (Zero-Flash SSR)]
        A --> D[Supabase SSR Client]
    end

    subgraph Auth ["Authentication"]
        D <-->|Google OAuth 2.0| E[Supabase Auth]
        E <-->|OAuth Code Exchange| F[Google Cloud Console]
    end

    subgraph API ["Serverless API (Authoritative)"]
        G["POST /api/orders (Zod Validated)"]
        H["GET /api/products"]
        I["GET /api/orders"]
        J["GET /api/orders/:id"]
        K["POST /api/orders/:id/resend-email"]
        L["GET /api/health"]
    end

    subgraph DB ["Supabase PostgreSQL (RLS Enabled)"]
        M[products table]
        N[orders table]
        O[order_items table]
        P[email_logs table]
        Q["create_order RPC (Atomic Transaction)"]
    end

    subgraph Email ["Email Dispatch"]
        R[Mailgun HTTP API]
    end

    A --> G
    G --> Q
    Q --> M
    Q --> N
    Q --> O
    G -.->|Async Non-Blocking| R
    R -.->|Status Log| P
```

---

## Features

- **Authoritative Server Pricing:** Client sends `{ productId, quantity }` only. The database `create_order` PostgreSQL RPC re-reads authoritative unit prices and sub-totals directly from `public.products`.
- **Atomic Stock Decrement:** PostgreSQL transaction locks product rows (`FOR UPDATE`), checks stock availability, and decrements stock in a single atomic operation. Out-of-stock items return `409 Conflict`.
- **Zero-Friction Browsing:** Browsing, product pages, search, filters, and cart operations require no authentication. Only `/checkout` and `/orders` gate behind Google sign-in.
- **Cart Persistence:** Zustand state persists to `localStorage`. When unauthenticated users navigate to `/checkout`, they are redirected to Google OAuth and returned with their cart intact.
- **Pay on Delivery Simulation:** Payment is simulated ("Pay on Delivery"). No real card data is collected.
- **Mailgun Order Confirmations:** Sends responsive HTML (table layout, monochrome inline CSS) and plain-text receipts asynchronously. Email service failures never block or abort orders.
- **Design System:** Strict monochrome palette with neutral grays, hairline borders, 8px spacing, and zero-flash theme persistence (system preference + manual toggle).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | **Next.js 14+ (App Router)** |
| Language | **TypeScript** (Strict mode, 0 `any`, `noUncheckedIndexedAccess`) |
| Styling | **Tailwind CSS** + CSS custom property design tokens |
| State Management | **Zustand** with `persist` middleware |
| Validation | **Zod** + **React Hook Form** |
| Database & Auth | **Supabase** (PostgreSQL + RLS + Supabase Auth via Google Provider) |
| Email Service | **Mailgun HTTP API** |
| Testing | **Vitest** + **React Testing Library** |
| Deployment | **Vercel** (Edge Middleware + Serverless Functions) |

---

## Database Schema & Row Level Security (RLS)

All tables enforce PostgreSQL Row Level Security:

1. **`products`**: Public read access (`true`). Modifications restricted to service-role.
2. **`orders`**: Gated by `auth.uid() = user_id`. Client cannot directly insert rows.
3. **`order_items`**: Gated by order ownership (`orders.user_id = auth.uid()`).
4. **`email_logs`**: Read-only by order owner (`user_id = auth.uid()`).
5. **`create_order`**: Security definer RPC that executes stock validation, decrement, and record creation inside an isolated atomic transaction.

---

## Environment Variables

Copy `.env.example` to `.env.local` and populate:

| Variable | Description | Exposure |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Client & Server |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public anonymous key | Client & Server |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase admin secret key | **Server only** |
| `NEXT_PUBLIC_SITE_URL` | Base canonical application URL | Client & Server |
| `MAILGUN_API_KEY` | Mailgun sending API key | **Server only** |
| `MAILGUN_DOMAIN` | Mailgun sending domain / sandbox domain | **Server only** |
| `MAILGUN_FROM` | Sender display name and email address | **Server only** |
| `MAILGUN_BASE_URL` | `https://api.mailgun.net` (US) or `https://api.eu.mailgun.net` (EU) | **Server only** |

---

## Getting Started Locally

### 1. Clone & Install

```bash
git clone https://github.com/Collinsthegreat1/shopfront.git
cd shopfront
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
# Edit .env.local with your Supabase and Mailgun credentials
```

### 3. Database Migration & Seed

Run the SQL migration in your Supabase SQL editor:
- Migration: `supabase/migrations/20261002000000_init_shopfront.sql`
- Seed data: `supabase/seed.sql`

Or seed programmatically:
```bash
node scripts/seed-db.js
```

### 4. Run Development Server

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Testing & Quality Assurance

```bash
# Run unit tests
npm test

# Type checking
npm run typecheck

# Code linting
npm run lint

# Production build test
npm run build
```

---

## API Routes

| Endpoint | Method | Auth Required | Description |
|---|---|---|---|
| `/api/health` | `GET` | No | System health and timestamp check |
| `/api/products` | `GET` | No | List products with search, category, sort |
| `/api/orders` | `GET` | Yes | Retrieve signed-in user's order history |
| `/api/orders` | `POST` | Yes | Authoritative order creation via atomic RPC |
| `/api/orders/:id` | `GET` | Yes | Retrieve single order (404 if not owner) |
| `/api/orders/:id/resend-email` | `POST` | Yes | Resend confirmation email for user order |
| `/api/dev/test-email` | `POST` | Dev only | Send diagnostic Mailgun verification |
