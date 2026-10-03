# Cutstruct Reference Analysis & BuildMart Design Architecture

> **Reference Study:** `https://www.cutstruct.com/buy-materials`  
> **Date:** October 2026  
> **Status:** Analyzed and distilled for BuildMart implementation

---

## 1. Reference Site Layout & Navigation Anatomy

### A. Navigation & Header
- **Floating Pill Navigation Bar:** Centered pill container with backdrop blur (`backdrop-blur-md bg-background/80`).
  - Items: `Marketplace` (`/buy-materials`), `About` (`/about`), and a prominent filled accent pill CTA: `"Buy Materials"`.
- **Header Left:** Clean wordmark / logo (`BuildMart`).
- **Header Right Utilities:**
  - **Cart Button:** Outline pill with shopping cart icon + live item badge.
  - **Account Dropdown:** User avatar circle, display name / "My Account", and chevron dropdown (gated to Google sign-in; displays "My Orders", user email, and "Sign out" when authenticated).
  - **Theme Toggle:** Persistent circular sun/moon toggle with zero-flash system detection.
  - **Mobile Menu:** Responsive hamburger toggle expanding into a sleek overlay.

### B. Hero Section
- **Typography:** Giant, high-contrast geometric sans headline:
  - *Cutstruct copy:* "One place for all the construction materials you need"
  - *BuildMart original copy:* **"Your Authoritative Source for Construction & Building Materials in Nigeria"**
- **Sub-headline:** Emphasizing verified authentic materials, direct supplier haulage, guaranteed weight/quantity, and transparent pricing.
- **Hero CTA:** High-contrast orange accent button (`Shop Materials` -> `/buy-materials`) paired with secondary outline button (`View Featured Brands`).
- **Trust Strip:** 3-4 value props:
  1. Guaranteed 100% genuine factory-certified materials (Dangote, BUA, Lafarge, Coleman).
  2. Scheduled site haulage & tipper delivery across Lagos & Abuja.
  3. Authoritative transparent pricing per unit (never "Negotiate" or "-" quotes).
  4. Secure simulated pay-on-delivery checkout with instant order confirmations.

### C. Featured Brands & Suppliers Row
- Horizontal carousel/grid of leading Nigerian manufacturers:
  - Dangote Cement, BUA Group, Lafarge Africa, Coleman Wires & Cables, Nigerite Roofing, CDK Integrated Industries, Meyer Paints, Berger Paints, Tower Aluminium.

---

## 2. Marketplace Page Layout (`/buy-materials`)

### A. Filter & Search Controls
- **Top Bar:** 
  - Dynamic result counter (e.g., "Showing 48 materials").
  - Live, debounced search bar at the top right with rounded-full pill styling (`Search materials, brands, specs...`).
  - Sort dropdown: `Price: Low to High`, `Price: High to Low`, `Name: A-Z`, `Newest First`.
- **Category Filter:** 
  - Horizontal scrollable pill chips (All, Cement & Binders, Steel & Rods, Blocks & Bricks, Aggregates, Roofing, Tiles, Paints, Plumbing, Electrical, Hardware, Tools).
- **Secondary Faceted Filters:**
  - Brand filter pills/checkboxes.
  - In-stock availability toggle.
  - Price range selector.
  - **URL Synchronization:** All active filters seamlessly sync to URL search params (`?category=cement&brand=dangote&sort=price_asc`), allowing direct bookmarking and shareable queries.

### B. Product Card Anatomy (1:1 Aspect Ratio)
- **Container:** Rounded 16-20px card with hairline border (`border-border`).
- **Image Tile:** Clean white background container (`bg-white` even in dark mode for uniform product photo rendering), 1:1 fixed aspect ratio, `object-fit: contain`, zero layout shift.
- **Typography & Details:**
  - Category / Brand badge (e.g. `DANGOTE`).
  - Uppercase bold title: `DANGOTE 3X CEMENT 50KG`.
  - Authoritative price and unit: `₦9,500 / bag` (clearly visible, no hidden rates).
  - Specifications pill: e.g., `Grade 42.5R · 50kg bag`.
- **Action Buttons (Side-by-Side):**
  1. **Quick Add to Cart:** Subtle outline button (`Add to cart`).
  2. **View Detail:** High-contrast solid accent button (`View →` linking to `/buy-materials/[slug]`).
  3. **Out-of-Stock State:** Disables Add to cart, shows subtle red badge (`Out of stock`).

---

## 3. Product Detail Page Anatomy (`/buy-materials/[slug]`)
- **Breadcrumbs:** `Home` > `Buy Materials` > `Category` > `Product Name`.
- **Left Column:** High-resolution product image gallery with thumbnail preview.
- **Right Column:**
  - Brand tag and product title.
  - Price per unit in bold (`₦9,500` per `50kg bag`).
  - Stock availability indicator (e.g., `In stock (240 bags available)`).
  - Bulk Quantity Stepper: Clickable `-` / `+` with direct numeric typing, dynamically computing the total value (`100 bags = ₦950,000`).
  - Full-width primary `"Add to Cart"` button and simulated `"Buy Now"`.
  - Delivery & Haulage Note: Estimated Lagos/Abuja site delivery timeframe & tipper haulage policies.
- **Specifications Table:** Comprehensive JSONB specs (Material Grade, Unit Weight, Dimensions, Manufacturer, Standards compliance).
- **Related Products:** Curated 4-column carousel from the same construction category.

---

## 4. Key Differences: Cutstruct vs. BuildMart

| Feature | Cutstruct (Reference) | BuildMart (Our Implementation) |
|---|---|---|
| **Pricing Model** | Often hides prices or displays "Negotiate / Request Quote" | **Strictly transparent, authoritative prices per unit for 100% of products** |
| **Checkout** | Complex B2B procurement RFP funnel | **Instant cart drawer + authenticated checkout with simulated Pay-on-Delivery** |
| **Backend & DB** | Proprietary backend | **Supabase Postgres + Atomic `create_order` PostgreSQL RPC transaction + RLS** |
| **Email Receipt** | Variable | **Automated Mailgun transactional email with itemized unit receipt table** |
| **Theme System** | Mixed light/dark styling | **Flawless dual-theme with deep navy-black (`#0B1220`) and construction safety orange (`#F58A2B`)** |
| **Image Standard** | External CDN | **Local, optimized WebP images in `/public/products/` with `CREDITS.md`** |
