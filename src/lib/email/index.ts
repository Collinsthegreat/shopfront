import { OrderWithItems } from "@/types";
import { renderOrderConfirmationEmail } from "./templates";
import { sendMailgunEmail } from "./mailgun";
import { createAdminClient } from "@/lib/supabase/admin";

export interface SendOrderResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export async function sendOrderConfirmation(
  order: OrderWithItems,
  toEmail: string
): Promise<SendOrderResult> {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://shopfront-green.vercel.app";
  const { subject, html, text } = renderOrderConfirmationEmail(order, siteUrl);

  let success = false;
  let messageId: string | undefined;
  let errorMessage: string | undefined;

  try {
    const response = await sendMailgunEmail({
      to: toEmail,
      subject,
      html,
      text,
    });

    success = true;
    messageId = response.id;
  } catch (err: unknown) {
    success = false;
    errorMessage =
      err instanceof Error ? err.message : "Failed to deliver email via Mailgun";
    console.error("[EmailSender] Failed to send order confirmation:", errorMessage);
  }

  // Record to email_logs in Supabase (non-blocking)
  try {
    const supabaseAdmin = createAdminClient();
    await supabaseAdmin.from("email_logs").insert({
      order_id: order.id,
      user_id: order.user_id,
      to_email: toEmail,
      provider_message_id: messageId || null,
      status: success ? "sent" : "failed",
      error: errorMessage || null,
    });
  } catch (logErr) {
    console.error("[EmailSender] Failed to record email_log entry:", logErr);
  }

  return {
    success,
    messageId,
    error: errorMessage,
  };
}
