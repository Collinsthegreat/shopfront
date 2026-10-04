import { NextResponse, type NextRequest } from "next/server";
import { getUserFromRequest } from "@/lib/supabase/get-user";
import { createAdminClient } from "@/lib/supabase/admin";
import { mergeCartSchema } from "@/lib/validations";
import { getOrCreateCartId, getServerCart } from "@/lib/cart/server";
import { corsHeaders, handleOptions } from "@/lib/cors";

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(request: NextRequest) {
  const { user, error: authError } = await getUserFromRequest(request);

  if (authError || !user) {
    return NextResponse.json(
      { error: "Unauthorized. Please sign in to merge your cart." },
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

  const parsed = mergeCartSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422, headers: corsHeaders }
    );
  }

  const { items: guestItems } = parsed.data;
  const supabase = createAdminClient();

  try {
    const cartId = await getOrCreateCartId(user.id);

    // Merge each guest item sensibly
    for (const guestItem of guestItems) {
      if (guestItem.quantity <= 0) continue;

      // Check product stock
      const { data: product } = await supabase
        .from("products")
        .select("id, stock")
        .eq("id", guestItem.productId)
        .maybeSingle();

      if (!product || product.stock <= 0) continue;

      const { data: existing } = await supabase
        .from("cart_items")
        .select("id, quantity")
        .eq("user_id", user.id)
        .eq("product_id", guestItem.productId)
        .maybeSingle();

      if (existing) {
        // Take max or sum sensibly, clamped to available stock
        const mergedQty = Math.min(
          Math.max(existing.quantity, guestItem.quantity),
          product.stock
        );
        await supabase
          .from("cart_items")
          .update({
            quantity: mergedQty,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id);
      } else {
        const initialQty = Math.min(guestItem.quantity, product.stock);
        await supabase
          .from("cart_items")
          .insert({
            cart_id: cartId,
            user_id: user.id,
            product_id: guestItem.productId,
            quantity: initialQty,
          });
      }
    }

    const mergedCart = await getServerCart(user.id);
    return NextResponse.json(
      {
        data: mergedCart,
        message: "Cart merged successfully",
      },
      { headers: corsHeaders }
    );
  } catch (err) {
    console.error("[Cart Merge API] Error:", err);
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500, headers: corsHeaders });
  }
}
