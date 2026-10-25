import { createHash } from "node:crypto";
import { chatbotInstruction, chatRedirect, parseChatMessages } from "@/lib/chatbot";

export const runtime = "nodejs";
export const maxDuration = 30;

// Best-effort throttling for one warm server instance. Provider quotas and a
// Vercel firewall rule are needed for a deployment-wide cap across instances.
const visitors = new Map<string, { count: number; expires: number }>();
let windowStart = 0;
let windowRequests = 0;

function throttled(request: Request) {
  const now = Date.now();
  if (now - windowStart >= 60_000) { windowStart = now; windowRequests = 0; }
  const ip = request.headers.get("x-vercel-forwarded-for") || request.headers.get("x-forwarded-for") || "local";
  const key = createHash("sha256").update(ip.split(",")[0].trim()).digest("hex");
  for (const [visitor, state] of visitors) if (state.expires <= now) visitors.delete(visitor);
  const state = visitors.get(key) || { count: 0, expires: now + 60_000 };
  if (state.count >= 6 || windowRequests >= 30 || (!visitors.has(key) && visitors.size >= 2000)) return true;
  visitors.set(key, { ...state, count: state.count + 1 });
  windowRequests++;
  return false;
}

function reply(body: object, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", ...(status === 429 ? { "Retry-After": "60" } : {}) } });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return reply({ error: "Please use the chat on the IAMM website." }, 403);
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return reply({ error: "Invalid chat request." }, 415);
  if (throttled(request)) return reply({ error: "Please wait a minute before sending more messages. You can also contact IAMM directly." }, 429);

  let body: unknown;
  try {
    const reader = request.body?.getReader();
    if (!reader) return reply({ error: "Please enter a message." }, 400);
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 32_000) { await reader.cancel(); return reply({ error: "Your message is too long. Please shorten it." }, 413); }
      chunks.push(value);
    }
    body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return reply({ error: "Invalid chat request." }, 400);
  }
  const messages = parseChatMessages(body);
  if (!messages) return reply({ error: "Please send a shorter message or start a new conversation." }, 400);
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) return reply({ error: "Chat is temporarily unavailable. Please use the contact or assessment form and IAMM will help you." }, 503);
  const model = process.env.GEMINI_MODEL?.trim() || "gemini-3.1-flash-lite";
  if (!/^gemini-[a-z0-9.-]+$/.test(model)) return reply({ error: "Chat is temporarily unavailable. Please contact IAMM directly." }, 503);

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: chatbotInstruction }] },
        contents: messages.map((message) => ({ role: message.role, parts: [{ text: message.text }] })),
        generationConfig: {
          temperature: 0.2, maxOutputTokens: 1024, responseMimeType: "application/json",
          responseSchema: { type: "OBJECT", properties: { inScope: { type: "BOOLEAN" }, answer: { type: "STRING" } }, required: ["inScope", "answer"] },
        },
      }),
      signal: AbortSignal.timeout(20_000),
      cache: "no-store",
    });
    if (!response.ok) {
      // Log only status, never provider bodies, credentials or visitor messages.
      console.error("IAMM chat provider returned status", response.status);
      return reply({ error: response.status === 429 ? "Chat is busy right now. Please try again shortly or contact IAMM directly." : "Chat is temporarily unavailable. Please try again or contact IAMM directly." }, response.status === 429 ? 429 : 503);
    }
    const data = await response.json();
    const candidate = data.candidates?.[0];
    if (!candidate || candidate.finishReason !== "STOP") return reply({ answer: chatRedirect });
    const raw = candidate.content?.parts?.filter((part: { text?: string; thought?: boolean }) => !part.thought && typeof part.text === "string").map((part: { text: string }) => part.text).join("");
    const result = JSON.parse(raw || "{}");
    if (typeof result.inScope !== "boolean" || typeof result.answer !== "string") throw new Error("Invalid chat response");
    if (!result.inScope) return reply({ answer: chatRedirect });
    const answer = result.answer.trim();
    if (!answer || answer.length > 3000 || answer.includes(key)) throw new Error("Invalid chat answer");
    return reply({ answer });
  } catch {
    return reply({ error: "Chat couldn't respond just now. Please try again or contact IAMM directly." }, 503);
  }
}
