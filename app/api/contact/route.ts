import { createClient } from "@supabase/supabase-js";
import { sendAssessmentEmail } from "@/lib/assessmentEmail";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 20_000) return Response.json({ error: "Message is too long." }, { status: 413 });
    body = JSON.parse(raw);
  } catch {
    return Response.json({ error: "Invalid contact request." }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return Response.json({ error: "Invalid contact request." }, { status: 400 });
  }
  const values = body as Record<string, unknown>;
  const payload: Record<string, string | null> = {};
  for (const field of ["name", "email", "company", "subject", "message"]) {
    const value = values[field];
    if (value != null && typeof value !== "string") return Response.json({ error: "Invalid contact field." }, { status: 400 });
    const text = typeof value === "string" ? value.trim() : "";
    if (text.length > (field === "message" ? 5000 : 500)) return Response.json({ error: "A contact field is too long." }, { status: 400 });
    payload[field] = text || null;
  }
  if (["name", "email", "subject", "message"].some((field) => !payload[field]) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email!)) {
    return Response.json({ error: "Please fill all required contact fields correctly." }, { status: 400 });
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key || !process.env.GMAIL_APP_PASSWORD?.trim()) {
    return Response.json({ error: "Contact submission is temporarily unavailable. Please email info@iammllc.com." }, { status: 503 });
  }
  try {
    const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    const { error } = await supabase.from("contact_submissions").insert(payload);
    if (error) throw new Error("Insert failed");
  } catch {
    return Response.json({ error: "Your message could not be saved. Please try again." }, { status: 502 });
  }
  try {
    await sendAssessmentEmail(payload, "contact");
    return Response.json({ saved: true, notificationSent: true });
  } catch {
    console.error("Contact message saved, but its Gmail notification failed. Check Gmail configuration and the admin dashboard.");
    return Response.json({ saved: true, notificationSent: false });
  }
}
