"use client";

import { ReactLenis, useLenis, type LenisRef } from "lenis/react";
import { useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

function ScrollTriggerSync() {
  useLenis(() => ScrollTrigger.update());
  return null;
}

/** Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync. */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    const raf = (time: number) => lenisRef.current?.lenis?.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(raf);
  }, []);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{ autoRaf: false, lerp: 0.1, anchors: { offset: 0, duration: 1.4 }, stopInertiaOnNavigate: true }}
    >
      <ScrollTriggerSync />
      {children}
    </ReactLenis>
  );
}
