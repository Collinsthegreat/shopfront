import { NextResponse, type NextRequest } from "next/server";
import { getUserFromRequest } from "@/lib/supabase/get-user";
import { createAdminClient } from "@/lib/supabase/admin";
import { corsHeaders, handleOptions } from "@/lib/cors";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: "Order ID is required" },
      { status: 400, headers: corsHeaders }
    );
  }

  const { user, error: authError } = await getUserFromRequest(request);

  if (authError || !user) {
    return NextResponse.json(
      { error: "Unauthorized. Please sign in to view this order." },
      { status: 401, headers: corsHeaders }
    );
  }

  const adminSupabase = createAdminClient();
  // Enforce own-order access only. If not found or belongs to another user, return 404
  const { data: order, error: orderError } = await adminSupabase
    .from("orders")
    .select(`
      *,
      items:order_items(*)
    `)
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (orderError || !order) {
    return NextResponse.json(
      { error: "Order not found" },
      { status: 404, headers: corsHeaders }
    );
  }

  return NextResponse.json({ data: order }, { headers: corsHeaders });
}
