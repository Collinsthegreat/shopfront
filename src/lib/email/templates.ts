import { OrderWithItems } from "@/types";
import { formatMoney, formatDate } from "@/lib/formatters";

export interface EmailRenderOutput {
  subject: string;
  html: string;
  text: string;
}

export function renderOrderConfirmationEmail(
  order: OrderWithItems,
  siteUrl: string = "https://shopfront-green.vercel.app"
): EmailRenderOutput {
  const subject = `Your order ${order.order_number} is confirmed — BuildMart`;
  const orderUrl = `${siteUrl}/orders/${order.id}`;

  // Plain-text representation
  const textItems = order.items
    .map(
      (item) =>
        `- ${item.name_snapshot}: ${item.quantity} ${item.unit_snapshot || "unit"}${
          item.quantity > 1 ? "s" : ""
        } @ ${formatMoney(item.unit_price_snapshot)} / ${item.unit_snapshot || "unit"} = ${formatMoney(
          item.unit_price_snapshot * item.quantity
        )}`
    )
    .join("\n");

  const text = `
Hello ${order.customer_name},

Thank you for your construction materials order with BuildMart. Your order has been confirmed and logged for site haulage dispatch with Pay on Site Offloading.

ORDER DETAILS:
Order Number: ${order.order_number}
Date: ${formatDate(order.created_at)}
Status: Confirmed (Pay on Site Offloading)

MATERIALS ORDERED:
${textItems}

COST BREAKDOWN:
Materials Subtotal: ${formatMoney(order.subtotal)}
Site Logistics & Haulage: ${formatMoney(order.delivery_fee)}
Total Due on Offloading: ${formatMoney(order.total)} (Pay on Delivery)

SITE OFFLOADING ADDRESS:
Recipient: ${order.customer_name}
Phone: ${order.phone}
Address: ${order.address}
Location: ${order.city}, ${order.state}
${order.note ? `Site Access Note: ${order.note}` : ""}

Track or view your order online:
${orderUrl}

PAYMENT & OFFLOADING INSTRUCTIONS:
Please ensure your site receiver or engineer is available to inspect offloaded materials. Payment is collected upon site offloading via direct bank transfer or certified draft.

BuildMart — Authentic Building & Construction Materials Marketplace
${siteUrl}
`.trim();

  // Responsive Table-Based HTML with Inline CSS (Monochrome with safety orange accents)
  const itemRowsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5; font-size: 14px; color: #171717; vertical-align: top;">
          <strong style="text-transform: uppercase; font-size: 13px;">${item.name_snapshot}</strong>
          <div style="font-size: 12px; color: #737373; margin-top: 4px;">
            ${formatMoney(item.unit_price_snapshot)} / ${item.unit_snapshot || "unit"} &times; ${item.quantity} ${item.unit_snapshot || "unit"}${item.quantity > 1 ? "s" : ""}
          </div>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5; font-size: 14px; color: #171717; text-align: right; vertical-align: top; font-weight: 600;">
          ${formatMoney(item.unit_price_snapshot * item.quantity)}
        </td>
      </tr>
    `
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #fafafa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #171717;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fafafa; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e5e5e5; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 24px; border-bottom: 1px solid #e5e5e5;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="display: inline-block; width: 12px; height: 12px; background-color: #ea580c; border-radius: 3px; margin-right: 8px; vertical-align: middle;"></span>
                    <span style="font-size: 20px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; vertical-align: middle;">BuildMart</span>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; padding: 4px 10px; background-color: #fff7ed; border: 1px solid #fed7aa; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #ea580c;">
                      Confirmed
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Greeting & Order Intro -->
          <tr>
            <td style="padding: 32px 32px 16px;">
              <h1 style="margin: 0 0 12px; font-size: 22px; font-weight: 700; color: #171717; letter-spacing: -0.5px;">
                Order Confirmation
              </h1>
              <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #52525b;">
                Hello <strong>${order.customer_name}</strong>, we have received and confirmed your materials procurement order <strong>${order.order_number}</strong>. Our logistics haulage team will contact the site receiver prior to dispatch.
              </p>
            </td>
          </tr>

          <!-- Items Table -->
          <tr>
            <td style="padding: 16px 32px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                  <tr>
                    <th align="left" style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #737373; padding-bottom: 8px; border-bottom: 2px solid #e5e5e5;">
                      Material Description
                    </th>
                    <th align="right" style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #737373; padding-bottom: 8px; border-bottom: 2px solid #e5e5e5;">
                      Line Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  ${itemRowsHtml}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Summary Breakdown -->
          <tr>
            <td style="padding: 16px 32px 24px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding: 6px 0; font-size: 13px; color: #737373;">Materials Subtotal</td>
                  <td align="right" style="padding: 6px 0; font-size: 13px; color: #171717; font-weight: 500;">
                    ${formatMoney(order.subtotal)}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 13px; color: #737373;">Site Logistics &amp; Haulage</td>
                  <td align="right" style="padding: 6px 0; font-size: 13px; color: #171717; font-weight: 500;">
                    ${formatMoney(order.delivery_fee)}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0 0; border-top: 1px solid #e5e5e5; font-size: 16px; font-weight: 700; color: #171717;">
                    Total Due on Site Offloading
                  </td>
                  <td align="right" style="padding: 12px 0 0; border-top: 1px solid #e5e5e5; font-size: 18px; font-weight: 800; color: #ea580c;">
                    ${formatMoney(order.total)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Delivery Details Card -->
          <tr>
            <td style="padding: 0 32px 24px;">
              <div style="background-color: #fafafa; border: 1px solid #e5e5e5; border-radius: 6px; padding: 16px;">
                <span style="display: block; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #737373; margin-bottom: 8px;">
                  Site Offloading Address &amp; Instructions
                </span>
                <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #171717;">
                  <strong>${order.customer_name}</strong> (${order.phone})<br/>
                  ${order.address}<br/>
                  ${order.city}, ${order.state}
                  ${order.note ? `<br/><span style="color: #737373; font-style: italic;">Offloading Note: ${order.note}</span>` : ""}
                </p>
              </div>
            </td>
          </tr>

          <!-- Action Button -->
          <tr>
            <td align="center" style="padding: 12px 32px 32px;">
              <a href="${orderUrl}" style="display: inline-block; padding: 12px 28px; background-color: #ea580c; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 700; text-align: center;">
                View Order Status Online &rarr;
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #f4f4f5; border-top: 1px solid #e5e5e5; text-align: center;">
              <p style="margin: 0 0 6px; font-size: 12px; color: #737373;">
                Inspection on site: You are entitled to inspect materials upon offloading before completing payment.
              </p>
              <p style="margin: 0; font-size: 11px; color: #a1a1aa;">
                &copy; ${new Date().getFullYear()} BuildMart. Authentic Construction Procurement in Nigeria.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  return { subject, html, text };
}
