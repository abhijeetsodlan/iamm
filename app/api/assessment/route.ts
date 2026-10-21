import { createClient } from "@supabase/supabase-js";

import { sendAssessmentEmail } from "@/lib/assessmentEmail";

export const runtime = "nodejs";

const fields = ["name", "company", "email", "phone", "website", "industry", "existing_tools", "challenges", "security_needs", "cloud_spend", "it_support_needs", "automation_areas", "additional_info"] as const;
const requiredFields = ["name", "company", "email", "industry", "challenges"] as const;

export async function POST(request: Request) {
  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 50_000) {
      return Response.json({ error: "Assessment is too long." }, { status: 413 });
    }
    body = JSON.parse(raw);
  } catch {
    return Response.json({ error: "Invalid assessment." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return Response.json({ error: "Invalid assessment." }, { status: 400 });
  }

  const values = body as Record<string, unknown>;
  const payload: Record<string, string | null> = {};
  for (const field of fields) {
    const value = values[field];
    if (value != null && typeof value !== "string") {
      return Response.json({ error: "Invalid assessment field." }, { status: 400 });
    }
    const text = typeof value === "string" ? value.trim() : "";
    if (text.length > (["challenges", "automation_areas", "additional_info", "security_needs", "it_support_needs"].includes(field) ? 5000 : 500)) {
      return Response.json({ error: "An assessment field is too long." }, { status: 400 });
    }
    payload[field] = text || null;
  }

  if (requiredFields.some((field) => !payload[field]) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email!)) {
    return Response.json({ error: "Please fill all required assessment fields correctly." }, { status: 400 });
  }
  if (payload.website) {
    try {
      if (!["https:", "http:"].includes(new URL(payload.website).protocol)) throw new Error();
    } catch {
      return Response.json({ error: "Please enter a valid website URL." }, { status: 400 });
    }
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publicKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !publicKey || !process.env.GMAIL_APP_PASSWORD?.trim()) {
    return Response.json({ error: "Assessment submission is temporarily unavailable. Please email info@iammllc.com." }, { status: 503 });
  }

  try {
    const supabase = createClient(url, publicKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { error } = await supabase.from("assessment_submissions").insert(payload);
    if (error) {
      return Response.json({ error: "Your assessment could not be saved. Please try again." }, { status: 502 });
    }
  } catch {
    return Response.json({ error: "Your assessment could not be saved. Please try again." }, { status: 502 });
  }

  // Saving the lead succeeds independently of email delivery. Do not ask visitors
  // to resubmit a saved assessment if the email provider is unavailable.
  try {
    await sendAssessmentEmail(payload);
    return Response.json({ saved: true, notificationSent: true });
  } catch {
    console.error("Assessment saved, but its Gmail notification failed. Check Gmail configuration and the admin dashboard.");
    return Response.json({ saved: true, notificationSent: false });
  }
}
