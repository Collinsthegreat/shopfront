-- ====================================================================
-- Migration: 20261003000000_buildmart_schema.sql
-- Description: BuildMart schema update — categories, brands, updated products,
--              unit snapshots on order_items, and atomic create_order RPC
-- ====================================================================

-- 1. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Brands Table
CREATE TABLE IF NOT EXISTS public.brands (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  origin TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Update Products Table
-- Remove old categories check constraint
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_category_check;

-- Add new columns if not present
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS brand_id TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS unit TEXT NOT NULL DEFAULT 'unit';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS specs JSONB DEFAULT '{}'::jsonb;

-- Drop old foreign key constraint if exists to avoid insertion conflicts
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS fk_products_brand;

-- 4. Update Order Items Table with unit_snapshot
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS unit_snapshot TEXT NOT NULL DEFAULT 'unit';

-- 5. Enable RLS on categories and brands
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Categories are publicly readable" ON public.categories;
CREATE POLICY "Categories are publicly readable"
  ON public.categories
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Brands are publicly readable" ON public.brands;
CREATE POLICY "Brands are publicly readable"
  ON public.brands
  FOR SELECT
  USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_brand_id ON public.products(brand_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_brands_slug ON public.brands(slug);

-- ====================================================================
-- 6. Updated Atomic create_order PostgreSQL RPC Transaction
--    - Uses BM- prefix (e.g. BM-20261003-4921)
--    - Handles unit_snapshot in order_items
--    - Default haulage fee ₦35,000 (3500000 kobo)
-- ====================================================================

CREATE OR REPLACE FUNCTION public.create_order(
  p_user_id UUID,
  p_items JSONB,
  p_delivery JSONB,
  p_idempotency_key TEXT DEFAULT NULL,
  p_delivery_fee BIGINT DEFAULT 3500000
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order_id UUID;
  v_order_number TEXT;
  v_subtotal BIGINT := 0;
  v_total BIGINT := 0;
  v_item JSONB;
  v_product RECORD;
  v_requested_qty INTEGER;
  v_prod_id TEXT;
  v_customer_name TEXT;
  v_phone TEXT;
  v_address TEXT;
  v_city TEXT;
  v_state TEXT;
  v_note TEXT;
  v_existing_order RECORD;
  v_order_json JSONB;
BEGIN
  -- 1. Idempotency Check: if idempotency key was previously processed, return that order
  IF p_idempotency_key IS NOT NULL AND trim(p_idempotency_key) <> '' THEN
    SELECT * INTO v_existing_order FROM public.orders WHERE idempotency_key = p_idempotency_key LIMIT 1;
    IF FOUND THEN
      SELECT jsonb_build_object(
        'order', row_to_json(v_existing_order),
        'items', (SELECT jsonb_agg(row_to_json(oi)) FROM public.order_items oi WHERE oi.order_id = v_existing_order.id),
        'is_idempotent', true
      ) INTO v_order_json;
      RETURN v_order_json;
    END IF;
  END IF;

  -- 2. Extract and validate delivery details
  v_customer_name := trim(p_delivery->>'fullName');
  v_phone := trim(p_delivery->>'phone');
  v_address := trim(p_delivery->>'address');
  v_city := trim(p_delivery->>'city');
  v_state := trim(p_delivery->>'state');
  v_note := p_delivery->>'note';

  IF v_customer_name IS NULL OR length(v_customer_name) < 2 THEN
    RAISE EXCEPTION 'VALIDATION_ERROR: Full name must be at least 2 characters';
  END IF;

  IF v_phone IS NULL OR length(v_phone) < 8 THEN
    RAISE EXCEPTION 'VALIDATION_ERROR: Valid phone number is required';
  END IF;

  IF v_address IS NULL OR length(v_address) < 5 THEN
    RAISE EXCEPTION 'VALIDATION_ERROR: Delivery address is required';
  END IF;

  IF jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'VALIDATION_ERROR: Cart must contain at least one item';
  END IF;

  -- 3. Lock product rows and authoritative stock & price check
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_prod_id := v_item->>'productId';
    v_requested_qty := (v_item->>'quantity')::INTEGER;

    IF v_requested_qty IS NULL OR v_requested_qty <= 0 THEN
      RAISE EXCEPTION 'VALIDATION_ERROR: Invalid item quantity';
    END IF;

    SELECT id, name, price_kobo, stock, unit INTO v_product
    FROM public.products
    WHERE id = v_prod_id
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'PRODUCT_NOT_FOUND: Product "%" does not exist', v_prod_id;
    END IF;

    IF v_product.stock < v_requested_qty THEN
      RAISE EXCEPTION 'OUT_OF_STOCK: "%" has only % units remaining (requested %)', v_product.name, v_product.stock, v_requested_qty;
    END IF;

    -- Authoritative subtotal calculation
    v_subtotal := v_subtotal + (v_product.price_kobo * v_requested_qty);
  END LOOP;

  -- 4. Decrement Stock atomically
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_prod_id := v_item->>'productId';
    v_requested_qty := (v_item->>'quantity')::INTEGER;

    UPDATE public.products
    SET stock = stock - v_requested_qty
    WHERE id = v_prod_id;
  END LOOP;

  -- 5. Calculate total
  v_total := v_subtotal + p_delivery_fee;

  -- 6. Generate Human-Friendly Order Number for BuildMart (e.g. BM-20261003-4921)
  v_order_number := 'BM-' || to_char(timezone('utc', now()), 'YYYYMMDD') || '-' || lpad(floor(random() * 9000 + 1000)::text, 4, '0');

  -- 7. Insert into orders table
  INSERT INTO public.orders (
    order_number,
    user_id,
    status,
    subtotal,
    delivery_fee,
    total,
    customer_name,
    phone,
    address,
    city,
    state,
    note,
    idempotency_key
  ) VALUES (
    v_order_number,
    p_user_id,
    'pending',
    v_subtotal,
    p_delivery_fee,
    v_total,
    v_customer_name,
    v_phone,
    v_address,
    v_city,
    v_state,
    v_note,
    p_idempotency_key
  )
  RETURNING id INTO v_order_id;

  -- 8. Insert into order_items table using authoritative snapshot values (including unit_snapshot)
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_prod_id := v_item->>'productId';
    v_requested_qty := (v_item->>'quantity')::INTEGER;

    SELECT id, name, price_kobo, unit INTO v_product
    FROM public.products
    WHERE id = v_prod_id;

    INSERT INTO public.order_items (
      order_id,
      product_id,
      name_snapshot,
      unit_price_snapshot,
      unit_snapshot,
      quantity
    ) VALUES (
      v_order_id,
      v_prod_id,
      v_product.name,
      v_product.price_kobo,
      COALESCE(v_product.unit, 'unit'),
      v_requested_qty
    );
  END LOOP;

  -- 9. Return structured order and items JSON
  SELECT jsonb_build_object(
    'order', (SELECT row_to_json(o) FROM public.orders o WHERE o.id = v_order_id),
    'items', (SELECT jsonb_agg(row_to_json(oi)) FROM public.order_items oi WHERE oi.order_id = v_order_id),
    'is_idempotent', false
  ) INTO v_order_json;

  RETURN v_order_json;
END;
$$;
