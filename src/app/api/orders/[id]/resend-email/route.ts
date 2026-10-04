import { NextResponse, type NextRequest } from "next/server";
import { getUserFromRequest } from "@/lib/supabase/get-user";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendOrderConfirmation } from "@/lib/email";
import { OrderWithItems } from "@/types";
import { corsHeaders, handleOptions } from "@/lib/cors";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(
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

  if (authError || !user || !user.email) {
    return NextResponse.json(
      { error: "Unauthorized. Please sign in to resend the confirmation email." },
      { status: 401, headers: corsHeaders }
    );
  }

  const adminSupabase = createAdminClient();
  // Retrieve own order
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

  const orderWithItems = order as OrderWithItems;

  const result = await sendOrderConfirmation(orderWithItems, user.email);

  if (!result.success) {
    return NextResponse.json(
      {
        error:
          result.error ||
          "Could not send email at this moment. If using a Mailgun sandbox domain, ensure your recipient address is authorized.",
      },
      { status: 502, headers: corsHeaders }
    );
  }

  return NextResponse.json(
    {
      status: "ok",
      message: "Confirmation email sent successfully",
      messageId: result.messageId,
    },
    { headers: corsHeaders }
  );
}
