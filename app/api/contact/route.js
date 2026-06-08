import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

/* Must run on the Node.js runtime (nodemailer uses Node sockets, not Edge) and
   must never be statically optimized — it sends mail per request. */
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

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, CONTACT_TO } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    // Don't leak which var is missing to the client.
    console.error("[contact] SMTP environment variables are not configured.");
    return NextResponse.json({ error: "Email service is not configured yet." }, { status: 500 });
  }

  const port = Number(SMTP_PORT);
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465, // 465 = implicit TLS; 587/25 = STARTTLS
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  const to = CONTACT_TO || SMTP_USER;
  const from = SMTP_FROM || SMTP_USER;

  const lines = [
    `Name:    ${name}`,
    `Email:   ${email}`,
    `Phone:   ${phone || "—"}`,
    `Service: ${service}`,
    "",
    "Message:",
    message || "—",
  ];

  try {
    await transporter.sendMail({
      from: `"LogixaLab Website" <${from}>`,
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
  } catch (err) {
    console.error("[contact] sendMail failed:", err);
    return NextResponse.json(
      { error: "Couldn't send your message. Please email us directly at info@logixalab.com." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
