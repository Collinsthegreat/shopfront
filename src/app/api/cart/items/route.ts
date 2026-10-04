import { NextResponse, type NextRequest } from "next/server";
import { getUserFromRequest } from "@/lib/supabase/get-user";
import { createAdminClient } from "@/lib/supabase/admin";
import { addCartItemSchema } from "@/lib/validations";
import { getOrCreateCartId, getServerCart } from "@/lib/cart/server";
import { corsHeaders, handleOptions } from "@/lib/cors";

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(request: NextRequest) {
  const { user, error: authError } = await getUserFromRequest(request);

  if (authError || !user) {
    return NextResponse.json(
      { error: "Unauthorized. Please sign in to add items to your cart." },
      { status: 401, headers: corsHeaders }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload in request body" },
      { status: 400, headers: corsHeaders }
    );
  }

  const parsed = addCartItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422, headers: corsHeaders }
    );
  }

  const { productId, quantity } = parsed.data;
  const supabase = createAdminClient();

  // 1. Verify product exists & check stock
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id, name, stock")
    .eq("id", productId)
    .maybeSingle();

  if (productError || !product) {
    return NextResponse.json(
      { error: "Material not found in catalog" },
      { status: 404, headers: corsHeaders }
    );
  }

  if (product.stock <= 0) {
    return NextResponse.json(
      { error: `${product.name} is currently out of stock` },
      { status: 409, headers: corsHeaders }
    );
  }

  try {
    const cartId = await getOrCreateCartId(user.id);

    // 2. Check if product is already in cart
    const { data: existingItem } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .maybeSingle();

    if (existingItem) {
      const newQty = Math.min(existingItem.quantity + quantity, product.stock);
      const { error: updateError } = await supabase
        .from("cart_items")
        .update({
          quantity: newQty,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingItem.id);

      if (updateError) {
        throw new Error(`Failed to update item quantity: ${updateError.message}`);
      }
    } else {
      const initialQty = Math.min(quantity, product.stock);
      const { error: insertError } = await supabase
        .from("cart_items")
        .insert({
          cart_id: cartId,
          user_id: user.id,
          product_id: productId,
          quantity: initialQty,
        });

      if (insertError) {
        throw new Error(`Failed to add item to cart: ${insertError.message}`);
      }
    }

    const updatedCart = await getServerCart(user.id);
    return NextResponse.json({ data: updatedCart }, { status: 200, headers: corsHeaders });
  } catch (err) {
    console.error("[Cart Items API POST] Error:", err);
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500, headers: corsHeaders });
  }
}
