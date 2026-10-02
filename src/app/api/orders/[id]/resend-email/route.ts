import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendOrderConfirmation } from "@/lib/email";
import { OrderWithItems } from "@/types";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function POST(
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

  if (authError || !user || !user.email) {
    return NextResponse.json(
      { error: "Unauthorized. Please sign in to resend the confirmation email." },
      { status: 401 }
    );
  }

  // Retrieve own order
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

  const orderWithItems = order as OrderWithItems;

  const result = await sendOrderConfirmation(orderWithItems, user.email);

  if (!result.success) {
    return NextResponse.json(
      {
        error:
          result.error ||
          "Could not send email at this moment. If using a Mailgun sandbox domain, ensure your recipient address is authorized.",
      },
      { status: 502 }
    );
  }

  return NextResponse.json({
    status: "ok",
    message: "Confirmation email sent successfully",
    messageId: result.messageId,
  });
}
