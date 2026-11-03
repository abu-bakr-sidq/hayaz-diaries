"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type SVGProps } from "react";
import { useLenis } from "lenis/react";
import cert from "@/assets/images/certificate-cadcw.webp";
import { certificate } from "@/content/journey";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { SectionHead } from "@/components/ui/SectionHead";
import { ArrowUpRight, Close } from "@/components/ui/Icons";

const alt = `${certificate.issuer} certificate: Thasneem — ${certificate.title} (${certificate.short}), ${certificate.issued}`;

// Edge of the seal: 32 shallow points around a circle.
const edge = (() => {
  const n = 64;
  let d = "";
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 ? 46.5 : 51;
    d += `${i ? "L" : "M"}${(60 + r * Math.cos(a)).toFixed(2)} ${(60 + r * Math.sin(a)).toFixed(2)}`;
  }
  return `${d}Z`;
})();

/** The gold seal pressed onto the frame: CERTIFIED · CADCW · 2025, ribbons and all. */
function Rosette(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 120 150" aria-hidden {...props}>
      <defs>
        <radialGradient id="rosette-gold" cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#fff3cf" />
          <stop offset="0.45" stopColor="#e3c37c" />
          <stop offset="1" stopColor="#a17b3a" />
        </radialGradient>
        <path id="rosette-ring" d="M60 60m-36 0a36 36 0 1 1 72 0a36 36 0 1 1-72 0" />
      </defs>
      <path d="M40 80 24 146l17-9 12 13 11-59Z" fill="#6b1f2c" />
      <path d="M80 80l16 66-17-9-12 13-11-59Z" fill="#8e2d3d" />
      <path d={edge} fill="url(#rosette-gold)" stroke="#8a6a2e" strokeWidth="0.8" />
      <circle cx="60" cy="60" r="41" fill="none" stroke="#7a5a1c" strokeOpacity="0.5" strokeWidth="1.1" />
      <circle cx="60" cy="60" r="29" fill="none" stroke="#7a5a1c" strokeOpacity="0.4" strokeWidth="0.8" />
      <text fontSize="8" fill="#5c4214" style={{ fontFamily: "var(--font-mono)" }}>
        <textPath href="#rosette-ring" textLength="224" lengthAdjust="spacing">
          CERTIFIED · {certificate.short} · {certificate.issuedISO.slice(0, 4)} ·
        </textPath>
      </text>
      <path d="M60 46.5l3.9 8 8.8 1.3-6.4 6.2 1.5 8.7L60 66.6l-7.8 4.1 1.5-8.7-6.4-6.2 8.8-1.3Z" fill="#7a5a1c" />
    </svg>
  );
}

function Tick() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" aria-hidden>
      <path d="M2.5 8.5 6.5 12 13.5 3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Lightbox({ onClose }: { onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    lenis?.stop();
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [lenis, onClose]);

  useGSAP(
    () => {
      gsap.from(root.current, { autoAlpha: 0, duration: 0.35 });
      gsap.from("[data-lb-card]", { y: 50, scale: 0.94, autoAlpha: 0, duration: 0.8, ease: "expo.out" });
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      data-theme="dark"
      onClick={onClose}
      className="fixed inset-0 z-[110] grid place-items-center bg-ink/85 p-4 backdrop-blur-sm"
    >
      <figure data-lb-card onClick={(e) => e.stopPropagation()} className="w-full max-w-[min(1200px,calc((100svh-8rem)*1.5))]">
        <Image src={cert} alt={alt} sizes="(min-width: 1024px) 1200px, 94vw" className="h-auto w-full rounded-sm shadow-[0_40px_90px_-30px_rgb(0_0_0/0.8)]" />
        <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-3 text-paper">
          <span className="hand text-[1.7rem] leading-none text-gold">
            {certificate.title} ({certificate.short})
          </span>
          <span className="kicker text-mist">
            {certificate.issuer} · No. {certificate.number}
          </span>
        </figcaption>
      </figure>
      <button
        ref={closeBtn}
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-full bg-paper text-ink transition-transform hover:rotate-90"
      >
        <Close />
      </button>
    </div>
  );
}

/**
 * Her certificate, framed. The frame drops onto its nail and swings to rest,
 * the gold seal is pressed on, and each strand of the course stamps in beside
 * it. The frame tilts toward the pointer; click it for the full certificate.
 */
export default function Certified() {
  const section = useRef<HTMLElement>(null);
  const frame = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(section);
        gsap
          .timeline({ scrollTrigger: { trigger: section.current, start: "top 62%", once: true } })
          .from(q("[data-hang]"), { scaleY: 0, transformOrigin: "50% 0%", duration: 0.5, ease: "power2.out" }, 0)
          .from(frame.current, { y: -150, rotation: -11, autoAlpha: 0, duration: 1.7, ease: "elastic.out(1, 0.42)" }, 0.1)
          .from(q("[data-stamp]"), { scale: 1.9, autoAlpha: 0, rotation: (i: number) => [-16, 12, -10, 14][i % 4], duration: 0.45, ease: "back.out(2.4)", stagger: 0.14 }, 0.55)
          .from(q("[data-rosette]"), { scale: 2.6, rotation: -60, autoAlpha: 0, duration: 0.5, ease: "back.out(2)" }, 1.15)
          .to(frame.current, { keyframes: [{ y: 5, duration: 0.06 }, { y: 0, duration: 0.3, ease: "power2.out" }] }, 1.5);

        if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
        const el = frame.current!;
        gsap.set(el, { transformPerspective: 1300 });
        const rx = gsap.quickTo(el, "rotationX", { duration: 0.8, ease: "power3" });
        const ry = gsap.quickTo(el, "rotationY", { duration: 0.8, ease: "power3" });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          ry(((e.clientX - r.left) / r.width - 0.5) * 10);
          rx(-((e.clientY - r.top) / r.height - 0.5) * 8);
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
      });
    },
    { scope: section },
  );

  return (
    <section ref={section} id="certified" data-theme="light" aria-labelledby="cert-title" className="spread relative overflow-hidden bg-paper-2">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_60%_at_72%_50%,rgb(255_252_245/0.75),transparent_70%)]" />
      <div className="shell relative">
        <SectionHead no="08" label="Certified" page="13" />

        <div className="mt-12 grid grid-cols-12 items-center gap-x-6 gap-y-16 lg:mt-[clamp(1.25rem,3.5svh,2.5rem)]">
          <div className="col-span-12 lg:col-span-5">
            <h2 id="cert-title" data-split className="display text-[clamp(3rem,min(6.6vw,9svh),6.2rem)]">
              Signed, sealed, <em className="text-wine">certified.</em>
            </h2>
            <p data-reveal className="mt-6 max-w-[40ch] text-[1.02rem] leading-relaxed text-muted lg:mt-[clamp(0.9rem,2.4svh,1.5rem)]">
              A year-long course with {certificate.issuer} — creative, technical and copywriting, every module signed off. She came
              out a {certificate.title}.
            </p>

            <ul aria-label="What the course covered" className="mt-8 grid max-w-md grid-cols-2 gap-3 lg:mt-[clamp(1.25rem,3.4svh,2rem)]">
              {certificate.modules.map((m, i) => (
                <li key={m} data-stamp className="stamp-tag" style={{ rotate: `${[-2.5, 1.8, -1.4, 2.2][i % 4]}deg` }}>
                  <Tick />
                  {m}
                </li>
              ))}
            </ul>

            <dl className="mt-8 grid max-w-md grid-cols-2 gap-x-6 gap-y-4 border-t border-ink/15 pt-6 text-[0.92rem] lg:mt-[clamp(1.25rem,3.4svh,2rem)]">
              <div>
                <dt className="kicker text-muted">Issued by</dt>
                <dd className="mt-1">{certificate.issuer}</dd>
              </div>
              <div>
                <dt className="kicker text-muted">Credential</dt>
                <dd className="mt-1">{certificate.short}</dd>
              </div>
              <div>
                <dt className="kicker text-muted">Completed</dt>
                <dd className="mt-1">{certificate.issued}</dd>
              </div>
              <div>
                <dt className="kicker text-muted">Certificate no.</dt>
                <dd className="mt-1 font-mono text-[0.86rem]">{certificate.number}</dd>
              </div>
            </dl>

            <button type="button" onClick={() => setOpen(true)} className="btn btn--ink mt-8 lg:mt-[clamp(1.25rem,3.4svh,2rem)]" data-cursor="View">
              View the certificate <ArrowUpRight />
            </button>
          </div>

          <div className="col-span-12 lg:col-span-7">
            <div className="cert-wall">
              <span aria-hidden className="cert-nail" />
              <svg data-hang aria-hidden viewBox="0 0 100 40" preserveAspectRatio="none" className="cert-strings">
                <path d="M50 2 14 40M50 2l36 38" fill="none" stroke="#7a5a1c" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
              </svg>
              <button ref={frame} type="button" onClick={() => setOpen(true)} aria-label="Open the certificate full size" data-cursor="View" className="gilt">
                <span className="gilt__mat">
                  <span className="gilt__glass">
                    <Image src={cert} alt={alt} sizes="(min-width: 1024px) 50vw, 92vw" placeholder="blur" className="h-auto w-full" />
                  </span>
                </span>
                <Rosette data-rosette className="absolute -bottom-[13%] -right-[4%] w-[15%] drop-shadow-[0_10px_14px_rgb(20_17_15/0.35)]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {open && <Lightbox onClose={() => setOpen(false)} />}
    </section>
  );
}
