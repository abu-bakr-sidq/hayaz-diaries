"use client";

import { useEffect, useRef } from "react";
import { useLenis } from "lenis/react";
import { gsap, useGSAP } from "@/lib/gsap";
import { finishIntro, useIntroDone } from "@/lib/intro";
import { profile } from "@/content/profile";

/**
 * "Opening the diary", on every load. A leather diary rises out of the dark;
 * its foil frame and Haya's signature write themselves while the counter runs
 * to 100; the strap snaps off, the cover swings open, a few pages flick past —
 * and the camera dives into the first page. That page is the site's own paper,
 * so the cover's entrance simply carries on from it.
 */
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const done = useIntroDone();

  useEffect(() => {
    if (!lenis) return;
    if (done) lenis.start();
    else lenis.stop();
  }, [lenis, done]);

  useGSAP(
    () => {
      const el = root.current!;
      const html = document.documentElement;
      if ("scrollRestoration" in history) history.scrollRestoration = "manual";
      if (!location.hash) window.scrollTo(0, 0);
      html.classList.add("is-loading");

      const q = gsap.utils.selector(el);
      const book = q("[data-book]")[0] as HTMLElement;
      const count = q("[data-counter]")[0] as HTMLElement;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const tl = gsap.timeline({
        paused: true,
        onComplete: () => {
          html.classList.remove("is-loading");
          el.style.display = "none";
        },
      });

      if (reduce) {
        tl.to(el, { autoAlpha: 0, duration: 0.5, ease: "power2.out" }).call(finishIntro, [], 0.05);
      } else {
        const n = { v: 0 };
        const bw = () => book.offsetWidth;
        const bh = () => book.offsetHeight;
        // Centre the open spread when it fits; on narrow phones keep the first page in view.
        const shift = () => Math.max(0, Math.min(bw() / 2, (innerWidth - bw()) / 2 - 16));
        // Enough zoom for the first page to cover the whole screen.
        const dive = () => Math.max(innerWidth / bw(), innerHeight / (bh() * 0.97)) * 1.15;

        gsap.set(book, { rotationX: 24, rotationZ: -6, y: 80, scale: 0.86, autoAlpha: 0 });
        tl.to(book, { rotationX: 10, rotationZ: -2.5, y: 0, scale: 1, autoAlpha: 1, duration: 1.05, ease: "expo.out" }, 0)
          .from(q("[data-ui]"), { autoAlpha: 0, y: 14, duration: 0.8, stagger: 0.08, ease: "power3.out" }, 0.1)
          .to(n, {
            v: 100,
            duration: 2,
            ease: "power3.inOut",
            onUpdate: () => {
              count.textContent = String(Math.round(n.v)).padStart(3, "0");
            },
          }, 0)
          // foil frame, title and signature
          .fromTo(q("[data-frame]"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, stagger: 0.12, ease: "power2.inOut" }, 0.2)
          .fromTo(q("[data-title]"), { clipPath: "inset(0% 100% 0% 0%)", y: 10 }, { clipPath: "inset(0% 0% 0% 0%)", y: 0, duration: 0.85, ease: "power3.inOut" }, 0.35)
          .from(q("[data-cover-fade]"), { autoAlpha: 0, y: 8, duration: 0.6, stagger: 0.1 }, 0.6)
          .to(q("[data-sig-clip]"), { attr: { width: 640 }, duration: 1.2, ease: "power2.inOut" }, 0.6)
          .to(q("[data-sig]"), { strokeDashoffset: 0, duration: 1.3, ease: "power2.inOut" }, 0.6)
          .to(q("[data-sig]"), { fillOpacity: 1, duration: 0.45, ease: "power1.out" }, 1.45)
          // the strap snaps off, the book squares up and the cover swings open…
          .to(q("[data-strap]"), { x: () => bw() * 0.45, rotationZ: 12, autoAlpha: 0, duration: 0.38, ease: "power3.in" }, 1.85)
          .to(book, { rotationX: 0, rotationZ: 0, x: shift, duration: 1, ease: "power3.inOut" }, 2.05)
          .to(q("[data-cover]"), { rotationY: -172, duration: 1.05, ease: "power3.inOut" }, 2.1)
          .to(q("[data-shadow]"), { scaleX: 2, duration: 1.05, ease: "power3.inOut" }, 2.1)
          // …a beat to read "Dear diary", then the pages flick past…
          .to(q("[data-leaf]"), { rotationY: (i) => -170 + i * 2, duration: 0.5, stagger: 0.08, ease: "power2.inOut" }, 3.4)
          // …and the camera dives into a clean page — the site's own paper.
          .to(q("[data-ui]"), { autoAlpha: 0, duration: 0.35 }, 3.7)
          .to(q("[data-page-lines]"), { autoAlpha: 0, duration: 0.4 }, 3.85)
          .to(book, { x: 0, scale: dive, duration: 0.9, ease: "power2.in" }, 3.8)
          .call(finishIntro, [], 4.25)
          .to(el, { autoAlpha: 0, duration: 0.4, ease: "power1.out" }, 4.6);
      }

      let cancelled = false;
      let started = false;
      const start = () => {
        if (cancelled || started) return;
        started = true;
        tl.play();
      };
      document.fonts?.ready.then(start);
      const timer = window.setTimeout(start, 1600);

      return () => {
        cancelled = true;
        window.clearTimeout(timer);
        html.classList.remove("is-loading");
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className="preloader" aria-hidden>
      <div className="absolute inset-0 flex flex-col justify-between p-[clamp(1rem,4vw,3rem)]">
        <div data-ui className="kicker flex justify-between gap-4 text-mist">
          <span>Hayaz Diaries</span>
          <span>Vol. 01 — Issue No. {profile.instagram.posts}</span>
        </div>
        <div data-ui className="flex items-end justify-between gap-4">
          <span className="kicker text-mist">Opening the diary…</span>
          <span data-counter className="display text-[clamp(2.4rem,min(6vw,8svh),4.5rem)] leading-none text-gold">
            000
          </span>
        </div>
      </div>

      <div className="diary-scene">
        <div data-book className="diary">
          <div data-shadow className="diary__shadow" />
          <div className="diary__block" />

          {/* the clean page we dive into */}
          <div className="diary__page">
            <div data-page-lines className="diary__lines" />
          </div>

          {/* three leaves on top of it — the first one is "Dear diary" */}
          {[0, 1, 2].map((i) => (
            <div key={i} data-leaf className="diary__leaf" style={{ transform: `translateZ(${3 - i * 0.5}px)` }}>
              {/* the first page keeps its ruling clear of the handwriting */}
              <div className={i === 0 ? "diary__lines top-[50%]" : "diary__lines"} />
              {i === 0 && (
                <div className="diary__ink">
                  <p className="hand diary__dear">Dear diary,</p>
                  <p className="hand diary__note mt-[5%] text-ink/70">
                    it’s me — Haya.
                    <br />
                    Welcome to the writer’s issue.
                  </p>
                  <span className="kicker diary__small absolute bottom-[6%] right-[10%] text-muted">p. 01</span>
                </div>
              )}
            </div>
          ))}

          <div data-cover className="diary__cover">
            <div className="diary__face diary__face--front">
              <svg viewBox="0 0 72 100" className="pointer-events-none absolute inset-[5%] h-[90%] w-[90%]" aria-hidden>
                <rect data-frame pathLength={1} strokeDasharray="1" x="0.4" y="0.4" width="71.2" height="99.2" rx="2.4" fill="none" stroke="#d6b06a" strokeWidth="0.45" />
                <rect data-frame pathLength={1} strokeDasharray="1" x="2" y="2" width="68" height="96" rx="1.6" fill="none" stroke="#d6b06a" strokeOpacity="0.45" strokeWidth="0.25" />
              </svg>
              <p data-cover-fade className="kicker diary__small foil">Vol. 01 · The Writer’s Issue</p>
              <p data-title className="display diary__title foil mt-[16%]">Hayaz</p>
              <p data-cover-fade className="display diary__sub foil mt-[3%] italic">diaries_</p>
              <svg viewBox="0 0 640 300" className="mt-auto w-[80%] overflow-visible" aria-hidden>
                <defs>
                  <clipPath id="diary-sig">
                    <rect data-sig-clip x="0" y="-60" width="0" height="420" />
                  </clipPath>
                </defs>
                <text data-sig x="50%" y="66%" textAnchor="middle" className="diary__sig" clipPath="url(#diary-sig)">
                  Haya
                </text>
              </svg>
              <p data-cover-fade className="kicker diary__small foil mt-[3%]">
                {profile.hometown} ↔ Chennai
              </p>
            </div>

            <div className="diary__face diary__face--back">
              <p className="kicker diary__small text-muted">This diary belongs to</p>
              <p className="sign diary__owner mt-[5%] text-wine">Haya</p>
              <p className="hand diary__note mt-[8%] text-ink/60">if found, DM {profile.handle}</p>
            </div>
          </div>

          <div data-strap className="diary__strap" />
          <div className="diary__ribbon" />
        </div>
      </div>
    </div>
  );
}
