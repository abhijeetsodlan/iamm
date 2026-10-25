"use client";

import { useEffect, useRef, useState } from "react";

type Sound = "open" | "send" | "receive";

export function useChatSounds() {
  const [enabled, setEnabled] = useState(true);
  const preference = useRef(true);
  const context = useRef<AudioContext | null>(null);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      try {
        const saved = localStorage.getItem("iamm-chat-sounds") !== "off";
        preference.current = saved;
        setEnabled(saved);
      } catch { /* Sound preference remains available for this visit. */ }
    });
    return () => { active = false; void context.current?.close().catch(() => {}); context.current = null; };
  }, []);

  function play(kind: Sound) {
    if (!preference.current || document.hidden) return;
    try {
      // Created only after interaction, so browser autoplay rules are respected.
      const audio = context.current || new AudioContext();
      context.current = audio;
      const ring = () => {
        if (!preference.current || audio.state !== "running" || document.hidden) return;
        const notes = kind === "receive" ? [660, 880] : kind === "send" ? [520] : [440];
        notes.forEach((frequency, index) => {
          const oscillator = audio.createOscillator();
          const gain = audio.createGain();
          const start = audio.currentTime + index * 0.075;
          const duration = kind === "open" ? 0.07 : 0.13;
          oscillator.type = "sine";
          oscillator.frequency.setValueAtTime(frequency, start);
          if (kind === "send") oscillator.frequency.exponentialRampToValueAtTime(720, start + duration);
          gain.gain.setValueAtTime(0, start);
          gain.gain.linearRampToValueAtTime(0.035, start + 0.008);
          gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
          oscillator.connect(gain);
          gain.connect(audio.destination);
          oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
          oscillator.start(start);
          oscillator.stop(start + duration + 0.02);
        });
      };
      if (audio.state === "suspended") void audio.resume().then(ring).catch(() => {});
      else ring();
    } catch { /* Chat remains usable if audio is unsupported or blocked. */ }
  }

  function toggle() {
    const next = !preference.current;
    preference.current = next;
    setEnabled(next);
    try { localStorage.setItem("iamm-chat-sounds", next ? "on" : "off"); } catch { /* Optional preference storage. */ }
    if (next) play("open");
  }

  return { enabled, play, toggle };
}
