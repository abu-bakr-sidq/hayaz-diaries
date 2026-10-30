"use client";

import { useLenis } from "lenis/react";
import { ArrowUpRight } from "@/components/ui/Icons";

export function BackToTop() {
  const lenis = useLenis();
  return (
    <button
      type="button"
      onClick={() => (lenis ? lenis.scrollTo(0, { duration: 2.2 }) : window.scrollTo({ top: 0, behavior: "smooth" }))}
      className="group flex items-center gap-2 uppercase hover:text-paper"
    >
      Back to cover
      <ArrowUpRight size={14} className="-rotate-45 transition-transform duration-500 ease-expo group-hover:-translate-y-0.5" />
    </button>
  );
}
