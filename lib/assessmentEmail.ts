import nodemailer from "nodemailer";

export const assessmentSender = "abhijeet.pushingcode@gmail.com";
export const assessmentRecipient = "info@iammllc.com";

const sections = [
  { title: "Contact & business details", fields: [["name", "Name"], ["company", "Company"], ["email", "Email"], ["phone", "Phone"], ["website", "Website"], ["industry", "Industry"]] },
  { title: "Technology priorities", fields: [["challenges", "Current IT & business challenges"], ["security_needs", "Security concerns"], ["cloud_spend", "Monthly cloud spending"], ["it_support_needs", "IT support requirements"], ["existing_tools", "Existing tools & systems"]] },
  { title: "Automation & additional information", fields: [["automation_areas", "Processes to automate"], ["additional_info", "Additional information"]] },
];

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);
}

export function createAssessmentEmail(payload: Record<string, string | null>, kind: "assessment" | "contact" = "assessment") {
  const title = kind === "contact" ? "New contact enquiry" : "New IT assessment";
  const dashboardPath = kind === "contact" ? "contact" : "assessment";
  const emailSections = kind === "contact" ? [
    { title: "Contact & business details", fields: [["name", "Name"], ["company", "Company"], ["email", "Email"]] },
    { title: "Enquiry details", fields: [["subject", "Subject"], ["message", "Message"]] },
  ] : sections;
  const answer = (field: string) => payload[field] || "Not provided";
  const intro = `A new ${kind === "contact" ? "contact, quote or project enquiry" : "IT assessment"} has been submitted through the IAMM website. Review the details below and follow up with the business about practical next steps.`;
  const text = ["IAMM SOLUTIONS", title, intro,
    ...emailSections.map((section) => `${section.title}\n\n${section.fields.map(([field, label]) => `${label}: ${answer(field)}`).join("\n\n")}`),
    `View submissions: https://iammllc.com/admin/${dashboardPath}`,
    "Saved to the IAMM database. This is an internal notification, not a confirmation email to the submitter.",
  ].join("\n\n");
  const content = emailSections.map((section) => `<h2 style="margin:28px 0 12px;font-size:18px;color:#0f172a">${escapeHtml(section.title)}</h2><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">${section.fields.map(([field, label]) => `<tr><td style="padding:12px 0;border-bottom:1px solid #e2e8f0"><p style="margin:0 0 5px;color:#475569;font-size:12px;font-weight:bold">${escapeHtml(label)}</p><p style="margin:0;color:#0f172a;font-size:14px;line-height:1.6;overflow-wrap:anywhere;word-break:break-word">${escapeHtml(answer(field)).replace(/\r?\n/g, "<br>")}</p></td></tr>`).join("")}</table>`).join("");
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>IAMM: ${title}</title></head><body style="margin:0;padding:24px 12px;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px"><tr><td style="padding:28px;background:#111827;border-radius:12px 12px 0 0"><p style="margin:0;color:#7dd3fc;font-size:12px;font-weight:bold;letter-spacing:2px">IAMM SOLUTIONS</p><h1 style="margin:12px 0 0;color:#ffffff;font-size:28px">${title}</h1><p style="margin:10px 0 0;color:#cbd5e1;font-size:14px">Managed IT · Cybersecurity · Cloud · AI Automation</p></td></tr><tr><td style="padding:24px 28px"><p style="margin:0;color:#475569;font-size:14px;line-height:1.7">${intro}</p>${content}<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:28px"><tr><td style="border-radius:6px;background:#111827"><a href="https://iammllc.com/admin/${dashboardPath}" style="display:inline-block;padding:14px 20px;color:#ffffff;font-size:14px;font-weight:bold;text-decoration:none">View submissions in IAMM</a></td></tr></table><p style="margin:24px 0 0;color:#64748b;font-size:12px;line-height:1.6">Saved to the IAMM database. This is an internal notification, not a confirmation email to the submitter.</p></td></tr></table></td></tr></table></body></html>`;
  return { subject: kind === "contact" ? "New IAMM contact enquiry" : "New IAMM IT assessment", text, html };
}

export async function sendAssessmentEmail(payload: Record<string, string | null>, kind: "assessment" | "contact" = "assessment") {
  const password = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "");
  if (!password) throw new Error("Gmail App Password is not configured.");
  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com", port: 465, secure: true,
    auth: { user: assessmentSender, pass: password },
    connectionTimeout: 10_000, greetingTimeout: 10_000, socketTimeout: 15_000,
  });
  const result = await transport.sendMail({
    from: { name: "IAMM Solutions", address: assessmentSender },
    to: assessmentRecipient,
    replyTo: process.env.ASSESSMENT_REPLY_TO_EMAIL || payload.email || assessmentSender,
    ...createAssessmentEmail(payload, kind),
    disableFileAccess: true, disableUrlAccess: true,
  });
  if (!result.accepted?.includes(assessmentRecipient)) throw new Error("Notification recipient was not accepted.");
}
