import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,
      headers: CORS_HEADERS,
    });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: CORS_HEADERS,
      }
    );
  }

  try {
    const body = await req.json();
    const fullName = typeof body?.full_name === "string" ? body.full_name.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const subject = typeof body?.subject === "string" ? body.subject.trim() : "";
    const message = typeof body?.message === "string" ? body.message.trim() : "";
    const submittedAt = typeof body?.submitted_at === "string" && body.submitted_at ? body.submitted_at : new Date().toISOString();

    if (!fullName || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required contact fields" }),
        {
          status: 400,
          headers: CORS_HEADERS,
        }
      );
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const adminEmail = Deno.env.get("ADMIN_EMAIL");

    if (!resendApiKey || !adminEmail) {
      console.error("Contact email configuration missing", {
        hasResendApiKey: Boolean(resendApiKey),
        hasAdminEmail: Boolean(adminEmail),
      });

      return new Response(
        JSON.stringify({ error: "Email service is not configured" }),
        {
          status: 500,
          headers: CORS_HEADERS,
        }
      );
    }

    const emailHtml = `
      <div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.6; color: #111827; background-color: #f8fafc; padding: 32px;">
        <div style="max-width: 640px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 32px;">
          <h2 style="margin: 0 0 20px; font-size: 28px; color: #111827;">New Contact Message</h2>

          <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #374151;">
            <tr>
              <td style="padding: 10px 0; font-weight: 600; width: 140px;">Sender name</td>
              <td style="padding: 10px 0;">${fullName}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: 600;">Sender email</td>
              <td style="padding: 10px 0;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: 600;">Subject</td>
              <td style="padding: 10px 0;">${subject}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: 600; vertical-align: top;">Message</td>
              <td style="padding: 10px 0; white-space: pre-wrap;">${message}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: 600;">Submission date</td>
              <td style="padding: 10px 0;">${new Date(submittedAt).toLocaleString()}</td>
            </tr>
          </table>
        </div>
      </div>
    `;

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `InternGuide <no-reply@resend.dev>`,
        to: [adminEmail],
        subject: `New Contact Message - ${subject}`,
        html: emailHtml,
        reply_to: email,
      }),
    });

    if (!resendResponse.ok) {
      const resendErrorText = await resendResponse.text();
      console.error("Resend send failed", {
        status: resendResponse.status,
        ok: false,
        messagePreview: resendErrorText?.slice(0, 300) || "unknown_error",
      });

      return new Response(
        JSON.stringify({
          error: "Email delivery failed",
          success: false,
        }),
        {
          status: 502,
          headers: CORS_HEADERS,
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Email sent successfully",
      }),
      {
        status: 200,
        headers: CORS_HEADERS,
      }
    );
  } catch (error) {
    console.error("Contact email handler failed", {
      ok: false,
      message: error instanceof Error ? error.message : "Unknown error",
    });

    return new Response(
      JSON.stringify({ error: "Unable to process contact email request" }),
      {
        status: 500,
        headers: CORS_HEADERS,
      }
    );
  }
});
