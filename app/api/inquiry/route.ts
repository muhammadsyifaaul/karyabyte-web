import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/inquiry
 * ─────────────────────────────────────────────────────────────────────────────
 * Receives the scope estimator inquiry form and dispatches a notification email.
 *
 * ── TO WIRE UP EMAIL DELIVERY ────────────────────────────────────────────────
 *
 * Option A — Resend (recommended, zero-config):
 *   1. npm install resend
 *   2. Add RESEND_API_KEY to .env.local
 *   3. Uncomment the Resend block below.
 *
 * Option B — Nodemailer (SMTP):
 *   1. npm install nodemailer @types/nodemailer
 *   2. Add SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS to .env.local
 *   3. Uncomment the Nodemailer block below.
 *
 * ── ENVIRONMENT VARIABLES NEEDED ────────────────────────────────────────────
 *   INQUIRY_TO_EMAIL   — recipient address (e.g. hello@karyabyte.dev)
 *   RESEND_API_KEY     — Resend API key         (Option A)
 *   SMTP_HOST          — SMTP hostname           (Option B)
 *   SMTP_PORT          — SMTP port (587 / 465)   (Option B)
 *   SMTP_USER          — SMTP username            (Option B)
 *   SMTP_PASS          — SMTP password            (Option B)
 */

/* ── Payload shape (mirrors what Estimator.tsx sends) ───────────────────── */
interface InquiryPayload {
  name:         string;
  email:        string;
  company?:     string;
  message?:     string;
  projectType?: string;
  timeline?:    string;
  deliverables?: string[];
  autoContext?: string;
  blueprint?: {
    squad:     string;
    sprints:   string;
    artifacts: string[];
    kickoff:   string;
  };
}

/* ── Server-side validation ─────────────────────────────────────────────── */
function serverValidate(body: Partial<InquiryPayload>): string | null {
  if (!body.name?.trim())                               return "Name is required.";
  if (!body.email?.trim())                              return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) return "Invalid email address.";
  return null;
}

/* ── Email body builder ─────────────────────────────────────────────────── */
function buildEmailHtml(p: InquiryPayload): string {
  const rows: [string, string][] = [
    ["Name",          p.name],
    ["Email",         p.email],
    ...(p.company   ? [["Company",      p.company]  as [string,string]] : []),
    ...(p.projectType ? [["Project Type", p.projectType] as [string,string]] : []),
    ...(p.timeline  ? [["Timeline",     p.timeline] as [string,string]] : []),
    ...(p.deliverables?.length
      ? [["Deliverables", p.deliverables.join(", ")] as [string,string]] : []),
    ...(p.blueprint
      ? [
          ["Est. Squad",   p.blueprint.squad]   as [string,string],
          ["Est. Sprints", p.blueprint.sprints] as [string,string],
          ["Est. Kickoff", p.blueprint.kickoff] as [string,string],
        ] : []),
  ];

  const tableRows = rows
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#a1a1aa;font-size:12px;white-space:nowrap">${k}</td><td style="padding:4px 0;color:#e4e4e7;font-size:13px">${v}</td></tr>`)
    .join("");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="background:#050505;color:#fff;font-family:'Plus Jakarta Sans',sans-serif;padding:32px">
  <h2 style="color:#fff;font-size:20px;margin-bottom:24px">New KaryaByte Inquiry</h2>
  <table style="border-collapse:collapse;width:100%;max-width:560px">${tableRows}</table>
  ${p.message ? `<div style="margin-top:24px;padding:16px;background:#0c0c0e;border-radius:8px;border:1px solid rgba(255,255,255,0.08)"><p style="color:#a1a1aa;font-size:11px;margin:0 0 8px">MESSAGE</p><p style="color:#e4e4e7;font-size:13px;line-height:1.6;margin:0">${p.message.replace(/\n/g, "<br>")}</p></div>` : ""}
  ${p.autoContext ? `<p style="margin-top:20px;color:#636369;font-size:10px;font-family:monospace">${p.autoContext}</p>` : ""}
</body>
</html>`;
}

function buildEmailText(p: InquiryPayload): string {
  const lines = [
    `New KaryaByte Inquiry`,
    `─────────────────────`,
    `Name:         ${p.name}`,
    `Email:        ${p.email}`,
    ...(p.company     ? [`Company:      ${p.company}`]              : []),
    ...(p.projectType ? [`Project Type: ${p.projectType}`]           : []),
    ...(p.timeline    ? [`Timeline:     ${p.timeline}`]              : []),
    ...(p.deliverables?.length ? [`Deliverables: ${p.deliverables.join(", ")}`] : []),
    ...(p.blueprint   ? [
      `Est. Squad:   ${p.blueprint.squad}`,
      `Est. Sprints: ${p.blueprint.sprints}`,
      `Est. Kickoff: ${p.blueprint.kickoff}`,
    ] : []),
    ...(p.message ? [`\nMessage:\n${p.message}`] : []),
    ...(p.autoContext ? [`\nContext: ${p.autoContext}`] : []),
  ];
  return lines.join("\n");
}

/* ── Route handler ──────────────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  let body: Partial<InquiryPayload>;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body." }, { status: 400 });
  }

  /* Server-side validation (mirrors client but can't be bypassed) */
  const validationError = serverValidate(body);
  if (validationError) {
    return NextResponse.json({ message: validationError }, { status: 422 });
  }

  const payload = body as InquiryPayload;
  const toEmail = process.env.INQUIRY_TO_EMAIL ?? "hello@karyabyte.dev";
  const subject = `New inquiry from ${payload.name}${payload.company ? ` · ${payload.company}` : ""}`;

  /* ── TODO: Option A — Resend ─────────────────────────────────────────────
  //
  // import { Resend } from "resend";
  // const resend = new Resend(process.env.RESEND_API_KEY);
  //
  // await resend.emails.send({
  //   from:    "KaryaByte Website <noreply@karyabyte.dev>",
  //   to:      [toEmail],
  //   replyTo: payload.email,
  //   subject,
  //   html:    buildEmailHtml(payload),
  //   text:    buildEmailText(payload),
  // });
  //
  // ────────────────────────────────────────────────────────────────────── */

  /* ── TODO: Option B — Nodemailer (SMTP) ──────────────────────────────────
  //
  // import nodemailer from "nodemailer";
  //
  // const transporter = nodemailer.createTransport({
  //   host:   process.env.SMTP_HOST,
  //   port:   Number(process.env.SMTP_PORT ?? 587),
  //   secure: Number(process.env.SMTP_PORT) === 465,
  //   auth: {
  //     user: process.env.SMTP_USER,
  //     pass: process.env.SMTP_PASS,
  //   },
  // });
  //
  // await transporter.sendMail({
  //   from:    `"KaryaByte Website" <${process.env.SMTP_USER}>`,
  //   to:      toEmail,
  //   replyTo: payload.email,
  //   subject,
  //   html:    buildEmailHtml(payload),
  //   text:    buildEmailText(payload),
  // });
  //
  // ────────────────────────────────────────────────────────────────────── */

  /* ── Development fallback: log to console ─────────────────────────────── */
  if (process.env.NODE_ENV !== "production") {
    console.log("\n[/api/inquiry] Received inquiry:");
    console.log(buildEmailText(payload));
    console.log("To:", toEmail, "| Subject:", subject, "\n");
  }

  return NextResponse.json(
    { message: "Inquiry received. We'll be in touch within one business day." },
    { status: 200 },
  );
}

/* ── Block all other methods ────────────────────────────────────────────── */
export async function GET() {
  return NextResponse.json({ message: "Method not allowed." }, { status: 405 });
}
