import { NextResponse, type NextRequest } from "next/server";
import { sendMailgunEmail } from "@/lib/email/mailgun";

export async function POST(request: NextRequest) {
  // Disabled in production unless protected secret matches
  const devSecret = process.env.DEV_SECRET;
  const authHeader = request.headers.get("x-dev-secret");

  if (process.env.NODE_ENV === "production" && (!devSecret || authHeader !== devSecret)) {
    return NextResponse.json(
      { error: "Diagnostic test-email route is disabled in production" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { to } = body;

    if (!to || typeof to !== "string" || !to.includes("@")) {
      return NextResponse.json(
        { error: "Valid 'to' email address is required in request body" },
        { status: 400 }
      );
    }

    const response = await sendMailgunEmail({
      to,
      subject: "Shopfront — Test Email Verification",
      text: "This is a test email from Shopfront verifying your Mailgun API integration.",
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e5e5e5; border-radius: 8px;">
          <h2 style="margin-top: 0;">Shopfront Mailgun Diagnostic</h2>
          <p>Your Mailgun configuration is working properly.</p>
          <p style="color: #737373; font-size: 12px;">Sent at: ${new Date().toISOString()}</p>
        </div>
      `,
    });

    return NextResponse.json({
      status: "ok",
      result: response,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to send test email";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
