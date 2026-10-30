"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

/**
 * A small burgundy dot (her nail polish) that trails the pointer. It swells
 * into a labelled bubble over anything marked with data-cursor="Label".
 */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    gsap.set(el, { xPercent: -50, yPercent: -50 });
    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });
    let visible = false;
    let current = "";

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      xTo(e.clientX);
      yTo(e.clientY);
      if (!visible) {
        visible = true;
        gsap.set(el, { x: e.clientX, y: e.clientY });
        gsap.to(el, { autoAlpha: 1, duration: 0.3 });
      }
    };

    const over = (e: PointerEvent) => {
      const target = e.target instanceof Element ? e.target : null;
      const labelled = target?.closest<HTMLElement>("[data-cursor]");
      const next = labelled?.dataset.cursor ?? "";
      if (next !== current) {
        current = next;
        setLabel(next);
      }
      const interactive = target?.closest("a, button, [role='button'], input, select, textarea, label");
      el.dataset.state = next ? "label" : interactive ? "link" : "dot";
      const theme = target?.closest<HTMLElement>("[data-theme]")?.dataset.theme;
      el.dataset.tone = theme === "dark" || theme === "wine" ? "dark" : "light";
    };

    const leave = () => {
      visible = false;
      gsap.to(el, { autoAlpha: 0, duration: 0.25 });
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div ref={ref} className="cursor" data-state="dot" aria-hidden>
      <div className="cursor__blob">
        <span className="cursor__label">{label}</span>
      </div>
    </div>
  );
}
