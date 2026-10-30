"use client";

import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap";
import { cn } from "@/lib/cn";

type Props = {
  children: ReactNode;
  /** Seconds for one full loop at rest. */
  duration?: number;
  reverse?: boolean;
  className?: string;
  label?: string;
};

/**
 * Infinite ticker that follows the scroll: it speeds up with scroll velocity,
 * flips direction when you scroll back up, and pauses on hover or focus.
 */
export function Marquee({ children, duration = 40, reverse = false, className, label }: Props) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const el = root.current!;
        const track = el.querySelector<HTMLElement>("[data-track]")!;
        const sign = reverse ? -1 : 1;
        const tween = gsap.fromTo(track, { xPercent: 0 }, { xPercent: -50, duration, ease: "none", repeat: -1 });
        // Start deep into the repeat so it can also run backwards.
        tween.totalTime(duration * 200);
        tween.timeScale(sign);

        let base = sign;
        const st = ScrollTrigger.create({
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          onUpdate(self) {
            base = sign * self.direction;
            const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 450, 5);
            gsap.to(tween, {
              timeScale: base * boost,
              duration: 0.18,
              overwrite: true,
              onComplete: () => {
                gsap.to(tween, { timeScale: base, duration: 1, ease: "power2.out" });
              },
            });
          },
        });

        const pause = () => gsap.to(tween, { timeScale: 0, duration: 0.6, overwrite: true });
        const resume = () => gsap.to(tween, { timeScale: base, duration: 0.8, overwrite: true });
        el.addEventListener("pointerenter", pause);
        el.addEventListener("pointerleave", resume);
        el.addEventListener("focusin", pause);
        el.addEventListener("focusout", resume);

        return () => {
          st.kill();
          el.removeEventListener("pointerenter", pause);
          el.removeEventListener("pointerleave", resume);
          el.removeEventListener("focusin", pause);
          el.removeEventListener("focusout", resume);
        };
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className={cn("marquee", className)} aria-label={label}>
      <div data-track className="marquee__track">
        <div className="marquee__group">{children}</div>
        <div className="marquee__group" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
