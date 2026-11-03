"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import portrait from "@/assets/images/haya-portrait.webp";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { useIntroDone } from "@/lib/intro";
import { profile } from "@/content/profile";
import { compactCount } from "@/lib/format";
import type { InstagramStats } from "@/lib/instagram";
import { Barcode } from "@/components/ui/Barcode";
import { Magnetic } from "@/components/ui/Magnetic";
import { RotatingBadge } from "@/components/ui/RotatingBadge";
import { ArrowDown, ArrowRight } from "@/components/ui/Icons";

const coverLines = [
  ["40+ hooks that land in 3 seconds", "#hook-lab", "04"],
  ["Search data → growth", "#seo-desk", "08"],
  ["What’s in her bag?", "#in-her-bag", "11"],
] as const;

/** Her Instagram bio, scribbled on the cover — the arrow points across at her photo. */
function Note() {
  return (
    <div data-c-reveal aria-hidden className="w-max -rotate-[4deg] text-wine">
      <p className="hand text-[1.9rem] leading-[0.95]">{profile.bio}</p>
      <svg viewBox="0 0 120 60" fill="none" className="ml-14 mt-0.5 hidden h-10 w-24 rotate-[6deg] lg:block">
        <path
          data-c-draw
          pathLength={1}
          d="M4 10c22 30 58 38 98 26M90 26l13 10-15 6"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ strokeDasharray: 1 }}
        />
      </svg>
    </div>
  );
}

function Readers({ followers }: { followers: number }) {
  return (
    <a
      data-c-reveal
      href={profile.instagram.url}
      target="_blank"
      rel="noreferrer"
      className="cover__readers group"
      aria-label={`${compactCount(followers)} readers on Instagram — open ${profile.handle}`}
    >
      <span className="cover__stat display">{compactCount(followers)}</span>
      <span className="kicker block pb-1 leading-relaxed text-muted">
        readers on Instagram
        <br />
        <span className="text-wine transition-colors group-hover:text-ink">{profile.handle} ↗</span>
      </span>
    </a>
  );
}

export default function Cover({ followers, posts }: InstagramStats) {
  const root = useRef<HTMLElement>(null);
  const intro = useRef<gsap.core.Timeline | null>(null);
  const ready = useIntroDone();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(root);

        // Entrance, held until the preloader lifts.
        const tl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
        tl.fromTo(q("[data-c-line]"), { scaleX: 0 }, { scaleX: 1, duration: 1.4, stagger: 0.08 }, 0)
          .fromTo(q("[data-mast-char]"), { yPercent: 108 }, { yPercent: 0, duration: 1.45, stagger: 0.065 }, 0.05)
          .fromTo(q("[data-card]"), { scaleY: 0, transformOrigin: "50% 100%" }, { scaleY: 1, duration: 1.3, ease: "expo.inOut" }, 0.05)
          .fromTo(
            q("[data-portrait]"),
            { clipPath: "inset(100% 0% 0% 0%)", yPercent: 6 },
            { clipPath: "inset(0% 0% 0% 0%)", yPercent: 0, duration: 1.7 },
            0.35,
          )
          .fromTo(q("[data-diaries]"), { autoAlpha: 0, x: -40, rotate: -6 }, { autoAlpha: 1, x: 0, rotate: 0, duration: 1.3 }, 0.7)
          .fromTo(q("[data-c-reveal]"), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.07 }, 0.7)
          .fromTo(
            q("[data-c-pop]"),
            { autoAlpha: 0, scale: 0.3, rotate: -16 },
            { autoAlpha: 1, scale: 1, rotate: 0, duration: 1.3, ease: "back.out(1.7)", stagger: 0.1 },
            0.95,
          )
          .fromTo(q("[data-c-draw]"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1, ease: "power2.inOut" }, 1.3);
        intro.current = tl;

        // Pointer parallax on desktop.
        if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
        const movers = q("[data-mouse]").map((el) => ({
          depth: parseFloat(el.dataset.mouse || "1"),
          x: gsap.quickTo(el, "x", { duration: 1.2, ease: "power3" }),
          y: gsap.quickTo(el, "y", { duration: 1.2, ease: "power3" }),
        }));
        const section = root.current!;
        const onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          movers.forEach((m) => {
            m.x(nx * 34 * m.depth);
            m.y(ny * 24 * m.depth);
          });
        };
        section.addEventListener("pointermove", onMove);
        return () => section.removeEventListener("pointermove", onMove);
      });

      // Layers drift apart as the cover scrolls away — only on the desktop
      // spread; on phones the layers are stacked and would slide into each other.
      mm.add(`${MOTION_OK} and (min-width: 1024px)`, () => {
        const q = gsap.utils.selector(root);
        const scrub = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
        gsap.to(q("[data-px-mast]"), { yPercent: -24, ease: "none", scrollTrigger: scrub });
        gsap.to(q("[data-px-portrait]"), { yPercent: 7, ease: "none", scrollTrigger: scrub });
        gsap.to(q("[data-px-copy]"), { y: -80, ease: "none", scrollTrigger: scrub });
      });
    },
    { scope: root },
  );

  useEffect(() => {
    if (ready) intro.current?.play();
  }, [ready]);

  return (
    <section ref={root} id="cover" data-theme="light" aria-labelledby="cover-title" className="cover">
      <div className="cover__frame">
        {/* Issue strip */}
        <div className="cover__strip shell">
          <div data-c-line className="h-px origin-left bg-ink/25" />
          <div data-c-reveal className="kicker flex items-center justify-between gap-4 whitespace-nowrap py-2.5 text-muted">
            <span>
              Vol. 01<span className="hidden sm:inline"> — The Writer’s Issue</span>
            </span>
            <span className="hidden md:inline">Content · Scripts · Search</span>
            <span>
              <span className="hidden sm:inline">Issue </span>No. {posts}
            </span>
          </div>
          <div data-c-line className="h-px origin-left bg-ink/25" />
        </div>

        {/* Masthead sits behind her head */}
        <div data-px-mast className="cover__mast" aria-hidden>
          <span className="display inline-flex overflow-hidden pb-[0.02em] pt-[0.08em] leading-[0.8]">
            {"HAYAZ".split("").map((c, i) => (
              <span key={i} data-mast-char className="inline-block">
                {c}
              </span>
            ))}
          </span>
        </div>

        <p data-diaries aria-hidden className="cover__diaries display italic">
          diaries_
        </p>

        {/* Portrait in its card, with everything pinned to it */}
        <div data-px-portrait className="cover__portrait-wrap">
          {/* card + photo move as one so the crop always sits on the card's edge */}
          <div data-mouse="0.3" className="relative">
            <div data-card className="cover__card" aria-hidden />
            <div data-portrait className="cover__portrait">
              <Image
                src={portrait}
                alt="S. Thasneem (Haya) in a black niqab with gold sunglasses, resting her chin on her hand beside a champagne handbag"
                preload
                sizes="(min-width: 1024px) 700px, 86vw"
                quality={90}
              />
            </div>
          </div>

          <div data-c-pop className="absolute bottom-[4%] right-[4%] z-[4] w-[26%] lg:bottom-[6%] lg:right-[6%] lg:w-[21%]">
            <RotatingBadge id="cover-badge" href="#write-to-me" tone="paper" className="w-full" />
          </div>
        </div>

        {/* Lower band: the lead, plus a side column docked against the photo card. */}
        <div data-px-copy className="cover__band">
          <div className="cover__lead">
            <h1 id="cover-title" data-c-reveal className="cover__title display">
              <span className="sr-only">S. Thasneem — content writer and SEO analyst. </span>
              Words that <em className="text-wine">stop</em> the&nbsp;scroll.
            </h1>
            <p data-c-reveal className="cover__copytext mt-5 text-[1.02rem] leading-relaxed text-muted">
              Reels, carousels & ad scripts in English and Tanglish — written to hook in three seconds, and optimised so Google
              finds them too.
            </p>
            <div data-c-reveal className="mt-7 flex flex-wrap gap-3">
              <Magnetic>
                <a href="#hook-lab" className="btn btn--ink" data-cursor="Read">
                  Read the work <ArrowRight />
                </a>
              </Magnetic>
              <Magnetic>
                <a href="#write-to-me" className="btn btn--line">
                  DM for collabs
                </a>
              </Magnetic>
            </div>
          </div>

          <aside className="cover__side" aria-label="Haya on Instagram">
            <Note />
            <Readers followers={followers} />
            <ul className="cover__lines mt-7 border-t border-ink/15 text-[0.95rem]">
              {coverLines.map(([label, href, page]) => (
                <li key={href} data-c-reveal className="border-b border-ink/15">
                  <a href={href} className="flex items-center justify-between gap-4 py-2.5">
                    <span>{label}</span>
                    <span className="kicker text-wine">p. {page}</span>
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        </div>

        {/* Bottom strip */}
        <div className="cover__bottom shell mt-12 items-end justify-between gap-6 whitespace-nowrap pb-8 lg:mt-0 lg:pb-0 xl:justify-start xl:gap-10">
          <div data-c-reveal className="flex items-end gap-3">
            <Barcode value={`HAYAZ${posts}`} className="h-9 w-24 text-ink" />
            <p className="kicker leading-snug text-muted">
              ₹0 · Free to read
              <span className="hidden sm:inline">
                <br />
                {profile.hometown} ↔ Chennai
              </span>
            </p>
          </div>
          <a data-c-reveal href="#contents" className="kicker hidden items-center gap-2 text-muted hover:text-ink sm:flex">
            Scroll to open <ArrowDown size={14} className="animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
}
