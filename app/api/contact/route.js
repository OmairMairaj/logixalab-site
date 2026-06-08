import { NextResponse } from "next/server";
import { Resend } from "resend";

/* Must run on the Node.js runtime and must never be statically optimized —
   it sends mail per request via Resend's HTTP API. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Escape user input before interpolating into the HTML email body. */
function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request) {
  let data;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = String(data?.name ?? "").trim();
  const email = String(data?.email ?? "").trim();
  const phone = String(data?.phone ?? "").trim();
  const service = String(data?.service ?? "").trim();
  const message = String(data?.message ?? "").trim();

  // Validation — name, email, service are required (matches the form).
  if (!name || !email || !service) {
    return NextResponse.json(
      { error: "Name, email, and service are required." },
      { status: 400 },
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (name.length > 200 || email.length > 320 || phone.length > 60 || message.length > 5000) {
    return NextResponse.json({ error: "One of the fields is too long." }, { status: 400 });
  }

  const { RESEND_API_KEY, CONTACT_TO, CONTACT_FROM } = process.env;
  if (!RESEND_API_KEY) {
    console.error("[contact] RESEND_API_KEY is not configured.");
    return NextResponse.json({ error: "Email service is not configured yet." }, { status: 500 });
  }

  // Where inquiries land (the info@ Google Group). "From" must be an address
  // on a domain verified in Resend — it is a label only, not a real mailbox.
  const to = CONTACT_TO || "info@logixalab.com";
  const fromAddr = CONTACT_FROM || "noreply@logixalab.com";

  const lines = [
    `Name:    ${name}`,
    `Email:   ${email}`,
    `Phone:   ${phone || "—"}`,
    `Service: ${service}`,
    "",
    "Message:",
    message || "—",
  ];

  const resend = new Resend(RESEND_API_KEY);

  try {
    const { error } = await resend.emails.send({
      from: `LogixaLab Website <${fromAddr}>`,
      to,
      replyTo: email,
      subject: `New inquiry — ${name} (${service})`,
      text: lines.join("\n"),
      html: `
        <div style="font-family:system-ui,Arial,sans-serif;line-height:1.6;color:#111">
          <h2 style="margin:0 0 12px">New website inquiry</h2>
          <p><strong>Name:</strong> ${esc(name)}</p>
          <p><strong>Email:</strong> ${esc(email)}</p>
          <p><strong>Phone:</strong> ${esc(phone) || "—"}</p>
          <p><strong>Service:</strong> ${esc(service)}</p>
          <p><strong>Message:</strong><br>${esc(message).replace(/\n/g, "<br>") || "—"}</p>
        </div>`,
    });

    if (error) {
      console.error("[contact] Resend returned an error:", error);
      return NextResponse.json(
        { error: "Couldn't send your message. Please email us directly at info@logixalab.com." },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("[contact] send failed:", err);
    return NextResponse.json(
      { error: "Couldn't send your message. Please email us directly at info@logixalab.com." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
