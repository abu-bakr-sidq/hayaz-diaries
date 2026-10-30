"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/cn";

/** Pulls its child toward the pointer on fine-pointer devices. */
export function Magnetic({ children, strength = 0.3, className }: { children: ReactNode; strength?: number; className?: string }) {
  const outer = useRef<HTMLSpanElement>(null);
  const inner = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const zone = outer.current;
    const el = inner.current;
    if (!zone || !el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.8, ease: "elastic.out(1, 0.45)" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.8, ease: "elastic.out(1, 0.45)" });

    const move = (e: PointerEvent) => {
      const r = zone.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => {
      xTo(0);
      yTo(0);
    };

    zone.addEventListener("pointermove", move);
    zone.addEventListener("pointerleave", leave);
    return () => {
      zone.removeEventListener("pointermove", move);
      zone.removeEventListener("pointerleave", leave);
    };
  }, [strength]);

  return (
    <span ref={outer} className={cn("inline-block", className)}>
      <span ref={inner} className="inline-block">
        {children}
      </span>
    </span>
  );
}
