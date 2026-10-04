import { NextResponse, type NextRequest } from "next/server";
import { getUserFromRequest } from "@/lib/supabase/get-user";
import { createAdminClient } from "@/lib/supabase/admin";
import { createOrderApiSchema } from "@/lib/validations";
import { FLAT_DELIVERY_FEE_KOBO } from "@/lib/constants";
import { sendOrderConfirmation } from "@/lib/email";
import { OrderWithItems } from "@/types";
import { corsHeaders, handleOptions } from "@/lib/cors";

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request: NextRequest) {
  const { user, error: authError } = await getUserFromRequest(request);

  if (authError || !user) {
    return NextResponse.json(
      { error: "Unauthorized. Please sign in to view your orders." },
      { status: 401, headers: corsHeaders }
    );
  }

  const adminSupabase = createAdminClient();
  const { data: orders, error: ordersError } = await adminSupabase
    .from("orders")
    .select(`
      *,
      items:order_items(*)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (ordersError) {
    return NextResponse.json(
      { error: "Failed to retrieve orders", details: ordersError.message },
      { status: 500, headers: corsHeaders }
    );
  }

  return NextResponse.json({ data: orders }, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  // 1. Authenticate user
  const { user, error: authError } = await getUserFromRequest(request);

  if (authError || !user) {
    return NextResponse.json(
      { error: "Unauthorized. Please sign in with Google to place an order." },
      { status: 401, headers: corsHeaders }
    );
  }

  // 2. Parse request JSON body safely
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload in request body" },
      { status: 400, headers: corsHeaders }
    );
  }

  // 3. Validate body with Zod
  const validationResult = createOrderApiSchema.safeParse(rawBody);
  if (!validationResult.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: validationResult.error.flatten(),
      },
      { status: 422, headers: corsHeaders }
    );
  }

  const { items, delivery, idempotencyKey } = validationResult.data;

  // 4. Call authoritative create_order RPC
  try {
    const adminSupabase = createAdminClient();

    const { data: rpcResult, error: rpcError } = await adminSupabase.rpc(
      "create_order",
      {
        p_user_id: user.id,
        p_items: items,
        p_delivery: delivery,
        p_idempotency_key: idempotencyKey || null,
        p_delivery_fee: FLAT_DELIVERY_FEE_KOBO,
      }
    );

    if (rpcError) {
      const errorMsg = rpcError.message || "";

      // Out of stock conflict
      if (errorMsg.includes("OUT_OF_STOCK")) {
        const friendlyMessage = errorMsg.replace(/.*OUT_OF_STOCK:\s*/, "");
        return NextResponse.json(
          { error: friendlyMessage || "One or more items are out of stock" },
          { status: 409, headers: corsHeaders }
        );
      }

      // Validation error in RPC
      if (errorMsg.includes("VALIDATION_ERROR")) {
        const friendlyMessage = errorMsg.replace(/.*VALIDATION_ERROR:\s*/, "");
        return NextResponse.json(
          { error: friendlyMessage },
          { status: 422, headers: corsHeaders }
        );
      }

      // Product not found
      if (errorMsg.includes("PRODUCT_NOT_FOUND")) {
        return NextResponse.json(
          { error: "One or more selected products are no longer available" },
          { status: 404, headers: corsHeaders }
        );
      }

      console.error("[Orders API] RPC error:", rpcError);
      return NextResponse.json(
        { error: "Unable to process order. Please try again." },
        { status: 500, headers: corsHeaders }
      );
    }

    const orderData = rpcResult?.order;
    const itemsData = rpcResult?.items;

    if (!orderData) {
      return NextResponse.json(
        { error: "Order creation returned invalid data" },
        { status: 500, headers: corsHeaders }
      );
    }

    const orderWithItems: OrderWithItems = {
      ...orderData,
      items: itemsData || [],
    };

    // 5. Send order confirmation email asynchronously (never block or roll back order)
    const customerEmail = user.email || "";
    let emailSent = false;
    let emailError: string | undefined;

    if (customerEmail) {
      const emailResult = await sendOrderConfirmation(orderWithItems, customerEmail);
      emailSent = emailResult.success;
      emailError = emailResult.error;
    }

    return NextResponse.json(
      {
        data: orderWithItems,
        emailSent,
        emailError: emailSent ? undefined : emailError,
        isIdempotent: rpcResult?.is_idempotent || false,
      },
      { status: 201, headers: corsHeaders }
    );
  } catch (err: unknown) {
    console.error("[Orders API] Unexpected error:", err);
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500, headers: corsHeaders });
  }
}
