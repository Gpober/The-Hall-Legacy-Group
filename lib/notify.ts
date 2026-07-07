import nodemailer from "nodemailer";

export type LeadNotice = {
  firstName: string;
  lastName?: string;
  phone?: string;
  email?: string;
  damageType?: string;
  carrier?: string;
  message?: string;
};

/**
 * Emails staff when a new website lead arrives, via Gmail SMTP.
 * No-ops silently if the Gmail env vars aren't configured, so lead capture
 * never depends on email being set up.
 *
 * Required env vars (set in Vercel):
 *   GMAIL_USER          – the Gmail/Workspace address that sends the alert
 *   GMAIL_APP_PASSWORD  – a 16-char Google App Password (not the login password)
 *   LEAD_NOTIFY_TO      – where alerts go (comma-separated; defaults to GMAIL_USER)
 */
export async function sendLeadNotification(lead: LeadNotice): Promise<void> {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  const to = process.env.LEAD_NOTIFY_TO || user;
  if (!user || !pass || !to) return;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });

  const name = [lead.firstName, lead.lastName].filter(Boolean).join(" ") || "Unknown";
  const body = [
    "New inspection request from the Hall Legacy Group website:",
    "",
    `Name:     ${name}`,
    `Phone:    ${lead.phone || "—"}`,
    `Email:    ${lead.email || "—"}`,
    `Damage:   ${lead.damageType || "—"}`,
    `Carrier:  ${lead.carrier || "—"}`,
    "",
    "Their situation:",
    lead.message || "—",
    "",
    "View in CRM: https://admin.thehalllegacygrp.com/leads",
  ].join("\n");

  await transporter.sendMail({
    from: `"Hall Legacy Website" <${user}>`,
    to,
    replyTo: lead.email || undefined,
    subject: `New Lead: ${name}${lead.damageType ? ` — ${lead.damageType}` : ""}`,
    text: body,
  });
}
