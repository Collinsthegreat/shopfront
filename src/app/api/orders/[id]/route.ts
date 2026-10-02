import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(
  _request: NextRequest,
  { params }: RouteParams
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: "Unauthorized. Please sign in to view this order." },
      { status: 401 }
    );
  }

  // Enforce own-order access only. If not found or belongs to another user, return 404
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select(`
      *,
      items:order_items(*)
    `)
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (orderError || !order) {
    return NextResponse.json(
      { error: "Order not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: order });
}
