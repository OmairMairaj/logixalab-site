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
  const company = String(data?.company ?? "").trim();
  const email = String(data?.email ?? "").trim();
  const phone = String(data?.phone ?? "").trim();
  const message = String(data?.message ?? "").trim();
  const preferredDate = String(data?.preferredDate ?? "").trim();
  const timeZone = String(data?.timeZone ?? "").trim();
  const preferredTimeSlot = String(data?.preferredTimeSlot ?? "").trim();

  // Validation — name, company, email, message, timeZone are required
  // (matches the form; phone, preferred date and time slot are optional).
  if (!name || !company || !email || !message || !timeZone) {
    return NextResponse.json(
      { error: "Name, company, email, time zone, and a message are required." },
      { status: 400 },
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (
    name.length > 200 ||
    company.length > 200 ||
    email.length > 320 ||
    phone.length > 60 ||
    message.length > 5000
  ) {
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
    `Name:        ${name}`,
    `Company:     ${company}`,
    `Email:       ${email}`,
    `Phone:       ${phone || "—"}`,
    `Time zone:   ${timeZone}`,
    `Pref. date:  ${preferredDate || "—"}`,
    `Pref. slot:  ${preferredTimeSlot || "—"}`,
    "",
    "Message:",
    message || "—",
  ];

  /* Branded HTML email — dark canvas + lime accent to mirror the website, built
     with table layout + inline styles so it renders consistently across mail
     clients (Gmail/Outlook strip <style>, flexbox, grid). */
  const DASH = "—";
  const ACCENT = "#ccff00";
  /* Absolute origin for the logo image — emails have no page origin, so the src
     must be a full URL. Override per-env with NEXT_PUBLIC_SITE_URL if needed. */
  const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.logixalab.com").replace(/\/$/, "");
  /* A single label/value block; null renders an empty spacer cell. */
  const cell = (f) =>
    f
      ? `<div style="font:600 11px/1 'Helvetica Neue',Arial,sans-serif;letter-spacing:1.6px;text-transform:uppercase;color:rgba(255,255,255,0.42);">${f.label}</div>
                  <div style="margin-top:6px;font:400 15px/1.5 'Helvetica Neue',Arial,sans-serif;color:#ffffff;word-break:break-word;">${f.value}</div>`
      : "&nbsp;";
  /* Two fields side by side (50/50 with a center gutter). */
  const pair = (l, r) => `
              <tr>
                <td valign="top" width="50%" style="padding:13px 16px 13px 0;border-bottom:1px solid rgba(255,255,255,0.07);">${cell(l)}</td>
                <td valign="top" width="50%" style="padding:13px 0 13px 16px;border-bottom:1px solid rgba(255,255,255,0.07);">${cell(r)}</td>
              </tr>`;
  /* One field spanning the full width. */
  const full = (f) => `
              <tr>
                <td valign="top" colspan="2" style="padding:13px 0;border-bottom:1px solid rgba(255,255,255,0.07);">${cell(f)}</td>
              </tr>`;
  const emailLink = `<a href="mailto:${esc(email)}" style="color:${ACCENT};text-decoration:none;">${esc(email)}</a>`;
  const fieldsHtml =
    pair({ label: "Name", value: esc(name) }, { label: "Company", value: esc(company) }) +
    pair({ label: "Email", value: emailLink }, { label: "Phone", value: esc(phone) || DASH }) +
    pair(
      { label: "Time zone", value: esc(timeZone) },
      { label: "Preferred date", value: esc(preferredDate) || DASH },
    ) +
    full({ label: "Preferred time slot", value: esc(preferredTimeSlot) || DASH });

  const resend = new Resend(RESEND_API_KEY);

  try {
    const { error } = await resend.emails.send({
      from: `LogixaLab Website <${fromAddr}>`,
      to,
      replyTo: email,
      subject: `New inquiry — ${name} (${company})`,
      text: lines.join("\n"),
      html: `
  <div style="margin:0;padding:0;background:#0c0c0c;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;background:#0c0c0c;">
      <tr><td style="height:4px;background:${ACCENT};font-size:0;line-height:0;">&nbsp;</td></tr>
      <tr>
        <td style="padding:36px 44px 12px;">
          <img src="${SITE_URL}/images/logo-white-full.png" alt="Logixa Lab" height="30" style="height:30px;width:auto;display:block;border:0;outline:none;text-decoration:none;font:700 18px/1 'Helvetica Neue',Arial,sans-serif;color:${ACCENT};letter-spacing:2px;text-transform:uppercase;" />
          <div style="margin-top:24px;font:700 30px/1.12 'Helvetica Neue',Arial,sans-serif;color:#ffffff;">New website inquiry</div>
          <div style="margin-top:8px;font:400 14px/1.5 'Helvetica Neue',Arial,sans-serif;color:rgba(255,255,255,0.5);">A new lead just reached out through the contact form.</div>
        </td>
      </tr>
      <tr>
        <td style="padding:14px 44px 4px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${fieldsHtml}
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:18px 44px 6px;">
          <div style="font:600 11px/1 'Helvetica Neue',Arial,sans-serif;letter-spacing:1.6px;text-transform:uppercase;color:rgba(255,255,255,0.42);">Message</div>
          <div style="margin-top:10px;padding:18px 22px;background:#121212;border:1px solid rgba(255,255,255,0.08);border-radius:12px;font:400 15px/1.65 'Helvetica Neue',Arial,sans-serif;color:rgba(255,255,255,0.88);">${esc(message).replace(/\n/g, "<br>") || DASH}</div>
        </td>
      </tr>
      <tr>
        <td style="padding:24px 44px 34px;">
          <a href="mailto:${esc(email)}" style="display:inline-block;background:${ACCENT};color:#0c0c0c;font:700 14px/1 'Helvetica Neue',Arial,sans-serif;text-decoration:none;padding:15px 28px;border-radius:9999px;">Reply to ${esc(name)} &rarr;</a>
        </td>
      </tr>
      <tr>
        <td style="padding:18px 44px 30px;border-top:1px solid rgba(255,255,255,0.08);font:400 12px/1.5 'Helvetica Neue',Arial,sans-serif;color:rgba(255,255,255,0.4);">
          Sent automatically from the <span style="color:rgba(255,255,255,0.7);">logixalab.com</span> contact form. &nbsp;&middot;&nbsp; &copy; LOGIXA LAB
        </td>
      </tr>
    </table>
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
