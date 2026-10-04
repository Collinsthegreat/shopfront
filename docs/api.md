# BuildMart API Reference (`/api`)

> **Production Base URL:** `https://shopfront-green.vercel.app`  
> **Authentication:** Supports Cookie Sessions (`@supabase/ssr`) and Bearer JWTs (`Authorization: Bearer <token>`).  
> **CORS:** Enabled across all endpoints (`Access-Control-Allow-Origin: *`, `OPTIONS` preflight handled).

---

## 1. Catalog Endpoints (Public)

### `GET /api/products`
Retrieves products from the authoritative catalog.

* **Auth:** None (Public)
* **Query Parameters:**
  * `category` *(string, optional)*: Filter by category slug (e.g. `cement-binders`).
  * `brand` *(string, optional)*: Filter by brand slug (e.g. `dangote`).
  * `search` *(string, optional)*: Search in name and description.
  * `sort` *(string, optional)*: `price-asc`, `price-desc`, `newest`, `featured` (default).
* **Response (200 OK):**
  ```json
  {
    "data": [
      {
        "id": "bm-cmt-001",
        "slug": "dangote-3x-cement-50kg",
        "name": "Dangote 3X Portland Cement 50kg (Grade 42.5R)",
        "description": "Premium Grade 42.5R high-yield Portland Limestone Cement.",
        "price_kobo": 950000,
        "currency": "NGN",
        "category": "cement-binders",
        "image_url": "/products/dangote-3x-cement-50kg.webp",
        "stock": 240,
        "featured": true,
        "brand_id": "dangote",
        "unit": "bag",
        "specs": {
          "Standard": "NIS 444-1:2014",
          "Strength Class": "42.5R",
          "Weight": "50 kg"
        },
        "created_at": "2026-10-04T00:07:16.099448Z"
      }
    ],
    "count": 1
  }
  ```

---

### `GET /api/products/[slug]`
Retrieves full details for a single material by slug or ID.

* **Auth:** None (Public)
* **Path Parameters:** `slug` *(string)*: Product slug (e.g. `dangote-3x-cement-50kg`) or product ID (e.g. `bm-cmt-001`).
* **Response (200 OK):**
  ```json
  {
    "data": {
      "id": "bm-cmt-001",
      "slug": "dangote-3x-cement-50kg",
      "name": "Dangote 3X Portland Cement 50kg (Grade 42.5R)",
      "price_kobo": 950000,
      "unit": "bag",
      "stock": 240
    }
  }
  ```
* **Errors:**
  * `404 Not Found`: `{ "error": "Product not found" }`

---

### `GET /api/categories`
Returns all 11 active building material categories.

* **Auth:** None (Public)
* **Response (200 OK):**
  ```json
  {
    "data": [
      {
        "id": "cement-binders",
        "name": "Cement & Binders",
        "slug": "cement-binders",
        "description": "Portland cement, tile adhesives, white cement, and plaster."
      }
    ]
  }
  ```

---

### `GET /api/brands`
Returns all 24 verified OEM manufacturers and quarry suppliers.

* **Auth:** None (Public)
* **Response (200 OK):**
  ```json
  {
    "data": [
      {
        "id": "dangote",
        "name": "Dangote Cement",
        "slug": "dangote",
        "origin": "Nigeria"
      }
    ]
  }
  ```

---

## 2. Cart Endpoints (Authenticated)

> **Authentication Required:** Either browser cookie or header `Authorization: Bearer <supabase_access_token>`. Unauthenticated requests return `401 Unauthorized`.

### `GET /api/cart`
Returns the signed-in user's server cart joined with live product data. Prices and subtotals are always computed dynamically from the `products` table.

* **Response (200 OK):**
  ```json
  {
    "data": {
      "cartId": "a1b2c3d4-...",
      "userId": "u1v2w3x4-...",
      "items": [
        {
          "id": "item-uuid-...",
          "cartId": "a1b2c3d4-...",
          "userId": "u1v2w3x4-...",
          "productId": "bm-cmt-001",
          "quantity": 50,
          "lineTotalKobo": 47500000,
          "product": {
            "id": "bm-cmt-001",
            "name": "Dangote 3X Portland Cement 50kg (Grade 42.5R)",
            "price_kobo": 950000,
            "unit": "bag",
            "stock": 240,
            "image_url": "/products/dangote-3x-cement-50kg.webp"
          }
        }
      ],
      "totalItemsCount": 50,
      "subtotalKobo": 47500000,
      "deliveryFeeKobo": 3500000,
      "totalKobo": 51000000,
      "updatedAt": "2026-10-04T12:00:00.000Z"
    }
  }
  ```

---

### `POST /api/cart/items`
Adds a product to the cart or increments its quantity.

* **Request Body:**
  ```json
  {
    "productId": "bm-cmt-001",
    "quantity": 10
  }
  ```
* **Validation:**
  * `productId`: Non-empty string.
  * `quantity`: Positive integer, 1 to 10,000.
* **Response (200 OK):** Returns full updated cart object.
* **Errors:**
  * `404 Not Found`: `{ "error": "Material not found in catalog" }`
  * `409 Conflict`: `{ "error": "Dangote 3X Portland Cement 50kg is currently out of stock" }`
  * `422 Unprocessable Entity`: `{ "error": "Validation failed", "details": ... }`

---

### `PATCH /api/cart/items/[productId]`
Updates the exact quantity of a cart item. Clamps to available product stock. If `quantity <= 0`, removes the item.

* **Path Parameters:** `productId` *(string)*
* **Request Body:**
  ```json
  {
    "quantity": 25
  }
  ```
* **Response (200 OK):** Returns full updated cart object.

---

### `DELETE /api/cart/items/[productId]`
Removes a specific item from the user's cart.

* **Path Parameters:** `productId` *(string)*
* **Response (200 OK):** Returns full updated cart object.

---

### `DELETE /api/cart`
Clears all items from the user's cart.

* **Response (200 OK):** Returns empty cart object `{ "data": { ... "items": [], "subtotalKobo": 0 } }`.

---

### `POST /api/cart/merge`
Merges guest local storage items into the server cart upon user sign-in.

* **Request Body:**
  ```json
  {
    "items": [
      { "productId": "bm-cmt-001", "quantity": 5 },
      { "productId": "bm-stl-001", "quantity": 10 }
    ]
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "data": { ... "items": [...] },
    "message": "Cart merged successfully"
  }
  ```

---

## 3. Order Endpoints (Authenticated)

### `GET /api/orders`
Retrieves order history for the authenticated user, sorted by newest first.

* **Auth:** Cookie or Bearer token.
* **Response (200 OK):**
  ```json
  {
    "data": [
      {
        "id": "order-uuid-...",
        "order_number": "BM-20261004-9842",
        "user_id": "user-uuid-...",
        "subtotal_kobo": 9500000,
        "delivery_fee_kobo": 3500000,
        "total_kobo": 13000000,
        "currency": "NGN",
        "payment_method": "pay_on_delivery",
        "status": "pending",
        "created_at": "2026-10-04T12:00:00.000Z",
        "items": [
          {
            "id": "item-uuid-...",
            "product_id": "bm-cmt-001",
            "product_name": "Dangote 3X Cement 50kg",
            "quantity": 10,
            "unit_snapshot": "bag",
            "unit_price_kobo": 950000,
            "subtotal_kobo": 9500000
          }
        ]
      }
    ]
  }
  ```

---

### `POST /api/orders`
Creates an order atomically via PostgreSQL RPC. Verifies stock with row-level locks, decrements inventory, snapshots unit prices and units, and dispatches a Mailgun confirmation email.

* **Auth:** Cookie or Bearer token.
* **Request Body:**
  ```json
  {
    "items": [
      { "productId": "bm-cmt-001", "quantity": 10 }
    ],
    "delivery": {
      "fullName": "Chinedu Okafor",
      "phone": "+2348031234567",
      "address": "Plot 12, Lekki Phase 1 Expressway",
      "city": "Lekki",
      "state": "Lagos",
      "note": "Deliver to site gate"
    },
    "idempotencyKey": "uuid-v4-client-generated"
  }
  ```
* **Response (201 Created):**
  ```json
  {
    "data": {
      "id": "uuid-...",
      "order_number": "BM-20261004-9842",
      "total_kobo": 13000000,
      "items": [...]
    },
    "emailSent": true,
    "isIdempotent": false
  }
  ```
* **Errors:**
  * `401 Unauthorized`: Not logged in.
  * `409 Conflict`: One or more items are out of stock.
  * `422 Unprocessable Entity`: Zod validation failed.

---

### `GET /api/orders/[id]`
Retrieves a single order by ID. Enforces strict user isolation.

* **Response (200 OK):** Order details with item list.
* **Errors:** `404 Not Found` if order does not exist or belongs to another user.

---

### `POST /api/orders/[id]/resend-email`
Resends the Mailgun order confirmation email.

* **Response (200 OK):** `{ "status": "ok", "message": "Confirmation email sent successfully" }`
