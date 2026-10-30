"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import avatar from "@/assets/images/haya-avatar.webp";
import { gsap } from "@/lib/gsap";
import { profile } from "@/content/profile";
import { Barcode } from "@/components/ui/Barcode";

/** A press pass for the diary's one and only correspondent. Tilts toward the pointer. */
export function PressPass() {
  const card = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = card.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rx = gsap.quickTo(el, "rotationX", { duration: 0.8, ease: "power3" });
    const ry = gsap.quickTo(el, "rotationY", { duration: 0.8, ease: "power3" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      ry(((e.clientX - r.left) / r.width - 0.5) * 16);
      rx(-((e.clientY - r.top) / r.height - 0.5) * 12);
    };
    const leave = () => {
      rx(0);
      ry(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div className="[perspective:900px]">
      <div
        ref={card}
        className="relative mx-auto w-full max-w-[340px] rounded-[22px] bg-ink p-6 pt-8 text-paper shadow-[0_40px_70px_-30px_rgb(20_17_15/0.6)] [transform-style:preserve-3d]"
      >
        {/* lanyard slot */}
        <span className="absolute left-1/2 top-3 h-2.5 w-14 -translate-x-1/2 rounded-full bg-paper/90" aria-hidden />
        <div className="kicker mt-2 flex items-center justify-between text-mist">
          <span className="text-gold">Press</span>
          <span>Hayaz Diaries · Vol. 01</span>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full ring-2 ring-gold/70 ring-offset-4 ring-offset-ink">
            <Image src={avatar} alt="Haya’s profile picture" fill sizes="96px" className="object-cover" />
          </div>
          <div>
            <p className="display text-[2.1rem] leading-[0.9]">{profile.name}</p>
            <p className="hand mt-1 text-[1.65rem] text-gold">a.k.a. {profile.alias}</p>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-paper/15 pt-5 text-[0.86rem]">
          <div>
            <dt className="kicker !text-[0.62rem] text-mist">Role</dt>
            <dd className="mt-1">Content Writer</dd>
          </div>
          <div>
            <dt className="kicker !text-[0.62rem] text-mist">Desk</dt>
            <dd className="mt-1">SEO Analyst</dd>
          </div>
          <div>
            <dt className="kicker !text-[0.62rem] text-mist">Base</dt>
            <dd className="mt-1">
              {profile.hometown} ↔ Chennai
            </dd>
          </div>
          <div>
            <dt className="kicker !text-[0.62rem] text-mist">Writes in</dt>
            <dd className="mt-1">English · Tanglish</dd>
          </div>
        </dl>

        <div className="mt-6 flex items-end justify-between gap-4">
          <Barcode value="HAYA-PRESS" className="h-10 w-36 text-paper" />
          <span className="kicker !text-[0.6rem] text-mist">{profile.tagline}</span>
        </div>
      </div>
    </div>
  );
}
