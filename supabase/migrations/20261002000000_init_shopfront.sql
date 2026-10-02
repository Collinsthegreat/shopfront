-- ====================================================================
-- Migration: 20261002000000_init_shopfront.sql
-- Description: Core schema, tables, RLS policies, and atomic create_order RPC
-- ====================================================================

-- 1. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price_kobo BIGINT NOT NULL CHECK (price_kobo >= 0),
  currency TEXT NOT NULL DEFAULT 'NGN',
  category TEXT NOT NULL CHECK (category IN ('carry', 'stationery', 'desk', 'living')),
  image_url TEXT NOT NULL,
  stock INTEGER NOT NULL CHECK (stock >= 0),
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  subtotal BIGINT NOT NULL CHECK (subtotal >= 0),
  delivery_fee BIGINT NOT NULL CHECK (delivery_fee >= 0),
  total BIGINT NOT NULL CHECK (total >= 0),
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  note TEXT,
  idempotency_key TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES public.products(id),
  name_snapshot TEXT NOT NULL,
  unit_price_snapshot BIGINT NOT NULL CHECK (unit_price_snapshot >= 0),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Email Logs Table
CREATE TABLE IF NOT EXISTS public.email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  to_email TEXT NOT NULL,
  provider_message_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('sent', 'failed')),
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(featured);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_idempotency_key ON public.orders(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_order_id ON public.email_logs(order_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_user_id ON public.email_logs(user_id);

-- ====================================================================
-- Row Level Security (RLS)
-- ====================================================================

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Products: Public can read
DROP POLICY IF EXISTS "Products are publicly readable" ON public.products;
CREATE POLICY "Products are publicly readable"
  ON public.products
  FOR SELECT
  USING (true);

-- Orders: Users can read only their own orders
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders"
  ON public.orders
  FOR SELECT
  USING (auth.uid() = user_id);

-- Order Items: Users can read items belonging to their own orders
DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
CREATE POLICY "Users can view own order items"
  ON public.order_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Email Logs: Users can view their own email logs
DROP POLICY IF EXISTS "Users can view own email logs" ON public.email_logs;
CREATE POLICY "Users can view own email logs"
  ON public.email_logs
  FOR SELECT
  USING (auth.uid() = user_id);

-- ====================================================================
-- Atomic create_order PostgreSQL RPC Transaction
-- ====================================================================

CREATE OR REPLACE FUNCTION public.create_order(
  p_user_id UUID,
  p_items JSONB,
  p_delivery JSONB,
  p_idempotency_key TEXT DEFAULT NULL,
  p_delivery_fee BIGINT DEFAULT 250000
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

    SELECT id, name, price_kobo, stock INTO v_product
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

  -- 6. Generate Human-Friendly Order Number (e.g. SF-20261002-4821)
  v_order_number := 'SF-' || to_char(timezone('utc', now()), 'YYYYMMDD') || '-' || lpad(floor(random() * 9000 + 1000)::text, 4, '0');

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

  -- 8. Insert into order_items table using authoritative snapshot values
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_prod_id := v_item->>'productId';
    v_requested_qty := (v_item->>'quantity')::INTEGER;

    SELECT id, name, price_kobo INTO v_product
    FROM public.products
    WHERE id = v_prod_id;

    INSERT INTO public.order_items (
      order_id,
      product_id,
      name_snapshot,
      unit_price_snapshot,
      quantity
    ) VALUES (
      v_order_id,
      v_prod_id,
      v_product.name,
      v_product.price_kobo,
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
