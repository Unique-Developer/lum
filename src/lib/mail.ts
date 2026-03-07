import { Resend } from "resend";

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export type ContactFormData = {
  name: string;
  firmName: string;
  email: string;
  phone: string;
  projectType: string;
  message: string;
};

export async function sendCollaborationEmail(data: ContactFormData): Promise<boolean> {
  const resend = getResend();
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
  const toEmail = process.env.CONTACT_EMAIL;

  if (!resend || !toEmail) {
    console.warn("Mail not configured: set RESEND_API_KEY, CONTACT_EMAIL (and optionally RESEND_FROM_EMAIL)");
    return false;
  }

  const html = `
    <h2>Architect Collaboration Request</h2>
    <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>Firm:</strong> ${escapeHtml(data.firmName)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>
    <p><strong>Project Type:</strong> ${escapeHtml(data.projectType)}</p>
    <p><strong>Message:</strong></p>
    <pre>${escapeHtml(data.message)}</pre>
  `;

  const { error } = await resend.emails.send({
    from: `Lumin Art <${fromEmail}>`,
    to: toEmail,
    replyTo: data.email,
    subject: `Collaboration: ${escapeHtml(data.name)} — ${escapeHtml(data.firmName)}`,
    html,
  });

  if (error) {
    console.error("Resend error:", error);
    return false;
  }
  return true;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
