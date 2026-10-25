"use client";

import { useEffect, useRef } from "react";

export function AnimatedReply({ text, animate, onProgress }: { text: string; animate: boolean; onProgress: () => void }) {
  const visual = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = visual.current;
    if (!element || !animate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const duration = Math.min(1400, Math.max(240, text.length * 5));
    const started = performance.now();
    let frame = 0;
    let active = true;
    function finish() {
      if (!element || !active) return;
      element.textContent = text;
      onProgress();
      cancelAnimationFrame(frame);
    }
    function tick(now: number) {
      if (!element || !active) return;
      const count = Math.min(text.length, Math.max(1, Math.ceil(((now - started) / duration) * text.length)));
      element.textContent = text.slice(0, count);
      onProgress();
      if (count < text.length) frame = requestAnimationFrame(tick);
    }
    element.textContent = "";
    frame = requestAnimationFrame(tick);
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const changed = () => { if (motion.matches) finish(); };
    motion.addEventListener("change", changed);
    return () => { active = false; cancelAnimationFrame(frame); motion.removeEventListener("change", changed); element.textContent = text; };
  }, [text, animate, onProgress]);

  // Assistive technology receives the complete reply once, not each character.
  return <><span className="sr-only">{text}</span><span ref={visual} aria-hidden="true">{text}</span></>;
}
