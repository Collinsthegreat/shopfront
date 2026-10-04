import { createAdminClient } from "@/lib/supabase/admin";
import { FLAT_DELIVERY_FEE_KOBO } from "@/lib/constants";
import { Product } from "@/types";

export interface ServerCartItem {
  id: string;
  cartId: string;
  userId: string;
  productId: string;
  quantity: number;
  product: Product;
  lineTotalKobo: number;
  createdAt: string;
  updatedAt: string;
}

export interface ServerCartResponse {
  cartId: string;
  userId: string;
  items: ServerCartItem[];
  totalItemsCount: number;
  subtotalKobo: number;
  deliveryFeeKobo: number;
  totalKobo: number;
  updatedAt: string;
}

/**
 * Returns or creates the user's cart record.
 */
export async function getOrCreateCartId(userId: string): Promise<string> {
  const supabase = createAdminClient();

  const { data: existingCart } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (existingCart?.id) {
    return existingCart.id;
  }

  const { data: newCart, error } = await supabase
    .from("carts")
    .insert({ user_id: userId })
    .select("id")
    .single();

  if (error || !newCart) {
    throw new Error(`Failed to initialize cart: ${error?.message || "Unknown error"}`);
  }

  return newCart.id;
}

/**
 * Retrieves the full server cart joined with live product data.
 * Prices and subtotals are ALWAYS calculated dynamically from the products table.
 */
export async function getServerCart(userId: string): Promise<ServerCartResponse> {
  const supabase = createAdminClient();
  const cartId = await getOrCreateCartId(userId);

  // Fetch items joined with products
  const { data: rawItems, error } = await supabase
    .from("cart_items")
    .select(`
      id,
      cart_id,
      user_id,
      product_id,
      quantity,
      created_at,
      updated_at,
      product:products (
        id,
        slug,
        name,
        description,
        price_kobo,
        currency,
        category,
        image_url,
        stock,
        featured,
        brand_id,
        unit,
        specs,
        created_at
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to retrieve cart items: ${error.message}`);
  }

  const items: ServerCartItem[] = [];
  let subtotalKobo = 0;
  let totalItemsCount = 0;

  for (const row of rawItems || []) {
    // Supabase join returns object or null
    const product = row.product as unknown as Product | null;
    if (!product) continue;

    // Clamp quantity to product stock
    const effectiveQty = Math.max(1, Math.min(row.quantity, product.stock));
    const lineTotal = effectiveQty * product.price_kobo;

    items.push({
      id: row.id,
      cartId: row.cart_id,
      userId: row.user_id,
      productId: row.product_id,
      quantity: effectiveQty,
      product,
      lineTotalKobo: lineTotal,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });

    subtotalKobo += lineTotal;
    totalItemsCount += effectiveQty;
  }

  const deliveryFeeKobo = items.length > 0 ? FLAT_DELIVERY_FEE_KOBO : 0;
  const totalKobo = subtotalKobo + deliveryFeeKobo;

  return {
    cartId,
    userId,
    items,
    totalItemsCount,
    subtotalKobo,
    deliveryFeeKobo,
    totalKobo,
    updatedAt: new Date().toISOString(),
  };
}
