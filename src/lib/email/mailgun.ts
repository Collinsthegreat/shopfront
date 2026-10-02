export interface SendEmailPayload {
  to: string;
  subject: string;
  text: string;
  html: string;
  from?: string;
}

export interface MailgunResponse {
  id: string;
  message: string;
}

export async function sendMailgunEmail(
  payload: SendEmailPayload
): Promise<MailgunResponse> {
  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;
  const baseUrl = (
    process.env.MAILGUN_BASE_URL || "https://api.mailgun.net"
  ).replace(/\/+$/, "");
  const defaultFrom =
    process.env.MAILGUN_FROM || `Shopfront <orders@${domain || "shopfront.com"}>`;

  if (!apiKey || !domain) {
    throw new Error(
      "Missing Mailgun credentials: MAILGUN_API_KEY and MAILGUN_DOMAIN must be set."
    );
  }

  const endpoint = `${baseUrl}/v3/${domain}/messages`;

  const formData = new URLSearchParams();
  formData.append("from", payload.from || defaultFrom);
  formData.append("to", payload.to);
  formData.append("subject", payload.subject);
  formData.append("text", payload.text);
  formData.append("html", payload.html);

  // Mailgun HTTP API Basic Auth: 'api' : apiKey
  const authHeader = `Basic ${Buffer.from(`api:${apiKey}`).toString("base64")}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });

  const responseText = await response.text();

  if (!response.ok) {
    let errorDetail = responseText;
    try {
      const parsed = JSON.parse(responseText);
      errorDetail = parsed.message || responseText;
    } catch {
      // Use raw text if not JSON
    }

    throw new Error(
      `Mailgun API error (${response.status} ${response.statusText}): ${errorDetail}`
    );
  }

  try {
    return JSON.parse(responseText) as MailgunResponse;
  } catch {
    return {
      id: "unknown",
      message: responseText,
    };
  }
}
