import { NextResponse, type NextRequest } from "next/server";
import { getUserFromRequest } from "@/lib/supabase/get-user";
import { createAdminClient } from "@/lib/supabase/admin";
import { getServerCart } from "@/lib/cart/server";
import { corsHeaders, handleOptions } from "@/lib/cors";

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request: NextRequest) {
  const { user, error: authError } = await getUserFromRequest(request);

  if (authError || !user) {
    return NextResponse.json(
      { error: "Unauthorized. Please sign in to access your cart." },
      { status: 401, headers: corsHeaders }
    );
  }

  try {
    const cart = await getServerCart(user.id);
    return NextResponse.json({ data: cart }, { headers: corsHeaders });
  } catch (err) {
    console.error("[Cart API GET] Error:", err);
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500, headers: corsHeaders });
  }
}

export async function DELETE(request: NextRequest) {
  const { user, error: authError } = await getUserFromRequest(request);

  if (authError || !user) {
    return NextResponse.json(
      { error: "Unauthorized. Please sign in to clear your cart." },
      { status: 401, headers: corsHeaders }
    );
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json(
        { error: "Failed to clear cart", details: error.message },
        { status: 500, headers: corsHeaders }
      );
    }

    const updatedCart = await getServerCart(user.id);
    return NextResponse.json(
      {
        data: updatedCart,
        message: "Cart cleared successfully",
      },
      { headers: corsHeaders }
    );
  } catch (err) {
    console.error("[Cart API DELETE] Error:", err);
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500, headers: corsHeaders });
  }
}
