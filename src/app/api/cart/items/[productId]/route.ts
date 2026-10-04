import { NextResponse, type NextRequest } from "next/server";
import { getUserFromRequest } from "@/lib/supabase/get-user";
import { createAdminClient } from "@/lib/supabase/admin";
import { updateCartItemSchema } from "@/lib/validations";
import { getServerCart } from "@/lib/cart/server";
import { corsHeaders, handleOptions } from "@/lib/cors";

interface RouteParams {
  params: {
    productId: string;
  };
}

export async function OPTIONS() {
  return handleOptions();
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  const { productId } = params;
  if (!productId) {
    return NextResponse.json(
      { error: "Product ID is required" },
      { status: 400, headers: corsHeaders }
    );
  }

  const { user, error: authError } = await getUserFromRequest(request);
  if (authError || !user) {
    return NextResponse.json(
      { error: "Unauthorized. Please sign in to update your cart." },
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

  const parsed = updateCartItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422, headers: corsHeaders }
    );
  }

  const { quantity } = parsed.data;
  const supabase = createAdminClient();

  try {
    // If quantity is 0 or less, delete the item
    if (quantity <= 0) {
      await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);

      const updatedCart = await getServerCart(user.id);
      return NextResponse.json({ data: updatedCart }, { headers: corsHeaders });
    }

    // Verify product stock cap
    const { data: product } = await supabase
      .from("products")
      .select("stock")
      .eq("id", productId)
      .maybeSingle();

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    const clampedQty = Math.min(quantity, product.stock);

    const { error: updateError } = await supabase
      .from("cart_items")
      .update({
        quantity: clampedQty,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .eq("product_id", productId);

    if (updateError) {
      throw new Error(`Failed to update item: ${updateError.message}`);
    }

    const updatedCart = await getServerCart(user.id);
    return NextResponse.json({ data: updatedCart }, { headers: corsHeaders });
  } catch (err) {
    console.error("[Cart Item PATCH] Error:", err);
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500, headers: corsHeaders });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  const { productId } = params;
  if (!productId) {
    return NextResponse.json(
      { error: "Product ID is required" },
      { status: 400, headers: corsHeaders }
    );
  }

  const { user, error: authError } = await getUserFromRequest(request);
  if (authError || !user) {
    return NextResponse.json(
      { error: "Unauthorized. Please sign in to remove items from your cart." },
      { status: 401, headers: corsHeaders }
    );
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", user.id)
      .eq("product_id", productId);

    if (error) {
      return NextResponse.json(
        { error: "Failed to delete cart item", details: error.message },
        { status: 500, headers: corsHeaders }
      );
    }

    const updatedCart = await getServerCart(user.id);
    return NextResponse.json({ data: updatedCart }, { headers: corsHeaders });
  } catch (err) {
    console.error("[Cart Item DELETE] Error:", err);
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500, headers: corsHeaders });
  }
}
