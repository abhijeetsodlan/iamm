"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { AnimatedReply } from "./AnimatedReply";
import { useChatSounds } from "./useChatSounds";

type Message = { id: string; role: "user" | "model"; text: string };
const suggestions = ["Which IT plan fits my business?", "How can IAMM improve our security?", "What does the free assessment cover?"];
const focusClass = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface";

function ChatIcon({ className = "h-6 w-6" }: { className?: string }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" /><path d="M8 10h8M8 14h5" /></svg>;
}

export function Chatbot() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [animatedReply, setAnimatedReply] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [pendingText, setPendingText] = useState("");
  const [pendingId, setPendingId] = useState("");
  const [error, setError] = useState("");
  const input = useRef<HTMLTextAreaElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const transcript = useRef<HTMLDivElement>(null);
  const controller = useRef<AbortController | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openRef = useRef(false);
  const stickToBottom = useRef(true);
  const sounds = useChatSounds();
  const hidden = pathname.startsWith("/admin");
  const pending = Boolean(pendingText);

  useEffect(() => () => { controller.current?.abort(); if (closeTimer.current) clearTimeout(closeTimer.current); }, []);

  const scrollToBottom = useCallback(() => {
    if (stickToBottom.current && transcript.current) transcript.current.scrollTop = transcript.current.scrollHeight;
  }, []);

  const close = useCallback(() => {
    openRef.current = false;
    setOpen(false);
    setClosing(true);
    setAnimatedReply(null);
    launcher.current?.focus();
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setClosing(false), 180);
  }, []);

  useEffect(() => {
    if (!open || hidden) return;
    input.current?.focus();
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [open, hidden, close]);

  useEffect(() => {
    if (open) scrollToBottom();
  }, [messages, pendingText, error, open, scrollToBottom]);

  function show() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setClosing(false);
    stickToBottom.current = true;
    openRef.current = true;
    setOpen(true);
    sounds.play("open");
  }

  async function send(value: string) {
    const text = value.trim();
    if (!text || text.length > 1200 || controller.current) return;
    setError("");
    stickToBottom.current = true;
    const questionId = crypto.randomUUID();
    setPendingId(questionId);
    setDraft(text);
    setPendingText(text);
    sounds.play("send");
    const abort = new AbortController();
    controller.current = abort;
    const timeout = window.setTimeout(() => abort.abort(), 25_000);
    try {
      const response = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages.map(({ role, text }) => ({ role, text })), { role: "user", text }].slice(-9) }),
        signal: abort.signal,
      });
      const result = await response.json();
      if (!response.ok || typeof result.answer !== "string" || !result.answer.trim()) {
        setError(typeof result.error === "string" ? result.error : "Chat is unavailable just now. Please try again or contact IAMM.");
        return;
      }
      const answerId = crypto.randomUUID();
      setAnimatedReply(openRef.current ? answerId : null);
      setMessages((previous) => [...previous, { id: questionId, role: "user" as const, text }, { id: answerId, role: "model" as const, text: result.answer }].slice(-40));
      setDraft("");
      if (openRef.current) sounds.play("receive");
    } catch {
      setError("We couldn't connect to chat. Your message hasn't been sent to the IAMM team. Please try again or use Contact.");
    } finally {
      window.clearTimeout(timeout);
      controller.current = null;
      setPendingText("");
      requestAnimationFrame(() => { if (openRef.current) input.current?.focus(); });
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void send(draft);
  }

  if (hidden) return null;

  return (
    <div className="iamm-chat fixed bottom-5 right-4 z-[60] sm:right-6" data-lenis-prevent>
      {open || closing ? (
        <section id="iamm-chat-panel" role="dialog" aria-labelledby="iamm-chat-title" aria-hidden={!open} inert={!open} className={`iamm-chat-panel ${closing ? "chat-panel-out" : "chat-panel-in"} mb-3 flex h-[min(620px,calc(100dvh-112px))] w-[min(390px,calc(100vw-32px))] origin-bottom-right flex-col overflow-hidden rounded-2xl border border-border bg-surface text-foreground shadow-2xl shadow-black/20`}>
          <header className="flex shrink-0 items-center gap-3 border-b border-border bg-muted px-5 py-4 text-foreground">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><ChatIcon /></span>
            <div className="min-w-0 flex-1"><h2 id="iamm-chat-title" className="text-base font-semibold">Ask IAMM</h2><p className="mt-0.5 text-xs text-muted-foreground">Your AI guide to better business IT</p></div>
            <button type="button" onClick={sounds.toggle} aria-label={sounds.enabled ? "Mute chat sounds" : "Enable chat sounds"} title={sounds.enabled ? "Mute chat sounds" : "Enable chat sounds"} aria-pressed={sounds.enabled} className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-primary/10 hover:text-foreground ${focusClass}`}><svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5 6 9H3v6h3l5 4V5Z" />{sounds.enabled ? <><path d="M15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14" /></> : <path d="m16 9 5 6m0-6-5 6" />}</svg></button>
            <button type="button" onClick={close} aria-label="Close chat" className={`flex h-9 w-9 items-center justify-center rounded-lg hover:bg-primary/10 ${focusClass}`}><svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m6 6 12 12M18 6 6 18" /></svg></button>
          </header>

          <div ref={transcript} onScroll={() => { const element = transcript.current; if (element) stickToBottom.current = element.scrollHeight - element.scrollTop - element.clientHeight < 70; }} role="log" aria-label="Conversation with IAMM AI" aria-live="polite" aria-relevant="additions" className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-5" data-lenis-prevent>
            <div className="max-w-[92%] rounded-2xl rounded-tl-sm border border-border bg-muted p-4 text-sm leading-6">
              <p className="mb-1 text-xs font-semibold text-muted-foreground">IAMM AI</p>
              <p>Hi! I can help you explore our IT services, compare plans, or find the right next step for your business. What would you like to know?</p>
            </div>
            {!messages.length && !pending ? <div className="grid gap-2">{suggestions.map((question) => <button key={question} type="button" onClick={() => void send(question)} className={`rounded-xl border border-primary/25 px-3 py-2.5 text-left text-xs font-medium leading-5 transition hover:border-primary hover:bg-primary/10 ${focusClass}`}>{question}<span aria-hidden="true" className="ml-2">↗</span></button>)}</div> : null}
            {[...messages, ...(pending ? [{ id: pendingId, role: "user" as const, text: pendingText }] : [])].map((message) => <div key={message.id} className={`chat-message-in w-fit max-w-[92%] rounded-2xl p-3.5 text-sm leading-6 ${message.role === "user" ? "ml-auto rounded-tr-sm bg-secondary text-white" : "rounded-tl-sm border border-border bg-muted"}`}><p className={`mb-1 text-xs font-semibold ${message.role === "user" ? "text-white/65" : "text-muted-foreground"}`}>{message.role === "user" ? "You" : "IAMM AI"}</p><p className="whitespace-pre-wrap break-words [overflow-wrap:anywhere]">{message.role === "model" ? <AnimatedReply text={message.text} animate={message.id === animatedReply} onProgress={scrollToBottom} /> : message.text}</p></div>)}
            {pending ? <div role="status" className="chat-message-in flex w-fit items-center gap-3 rounded-2xl rounded-tl-sm border border-border bg-muted px-4 py-3"><span className="sr-only">IAMM is typing</span><span aria-hidden="true" className="text-xs font-medium text-muted-foreground">IAMM</span><span aria-hidden="true" className="chat-typing flex items-center gap-1.5 py-1"><span /><span /><span /></span></div> : null}
          </div>

          <div className="shrink-0 border-t border-border bg-surface px-4 pb-4 pt-3">
            <nav aria-label="Chat quick links" className="mb-3 flex flex-wrap gap-2 text-xs font-semibold">
              {[{ label: "Plans", href: "/plans" }, { label: "Free assessment", href: "/assessment" }, { label: "Contact", href: "/contact" }].map((link) => <Link key={link.href} href={link.href} onClick={close} className={`rounded-full border border-border px-3 py-1.5 hover:bg-muted ${focusClass}`}>{link.label}</Link>)}
            </nav>
            {error ? <p role="alert" className="mb-3 rounded-lg border border-error/25 bg-error/5 p-3 text-xs leading-5 text-foreground">{error}</p> : null}
            <form onSubmit={submit}>
              <label htmlFor="iamm-chat-message" className="sr-only">Your question about IAMM</label>
              <div className="flex items-end gap-2 rounded-xl border border-border bg-background p-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
                <textarea id="iamm-chat-message" ref={input} rows={2} value={draft} maxLength={1200} disabled={pending} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); void send(draft); } }} placeholder="Ask about services or plans..." className="min-w-0 flex-1 resize-none bg-transparent px-2 py-1 text-sm leading-6 outline-none disabled:opacity-60" />
                <button type="submit" disabled={pending || !draft.trim()} aria-label="Send message" className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-secondary transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 ${focusClass}`}><svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4 20-7ZM22 2 11 13" /></svg></button>
              </div>
            </form>
          </div>
        </section>
      ) : null}
      <button ref={launcher} type="button" onClick={() => open ? close() : show()} aria-label={open ? "Close IAMM chat" : "Open IAMM AI chat"} aria-expanded={open} aria-controls="iamm-chat-panel" className={`ml-auto flex h-14 items-center gap-3 rounded-full border border-border bg-surface px-5 text-foreground shadow-xl shadow-black/20 transition duration-200 hover:-translate-y-0.5 hover:bg-muted active:scale-95 motion-reduce:transform-none ${focusClass}`}><ChatIcon className="h-6 w-6 text-primary" /><span className="text-sm font-semibold">Ask IAMM</span></button>
    </div>
  );
}
