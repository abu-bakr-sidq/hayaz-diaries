"use client";

import Image from "next/image";
import { useRef, type CSSProperties } from "react";
import htmlOrbit from "@/assets/images/hood/html-orbit.webp";
import htmlShield from "@/assets/images/hood/html-shield.webp";
import cssFrame from "@/assets/images/hood/css-frame.webp";
import cssShield from "@/assets/images/hood/css-shield.webp";
import seoLens from "@/assets/images/hood/seo-lens.webp";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

const steps = [
  { no: "01", title: "Structure", tag: "HTML5", body: "HTML and meta tags that tell search what a page is about." },
  { no: "02", title: "Style", tag: "CSS3", body: "CSS that keeps the words clean and readable on every screen." },
  { no: "03", title: "Signals", tag: "SEO", body: "Keywords and schema markup, so the right searches find it." },
];

// Four-point glints that pop as each piece lands (positions are % of their group).
const sparkles = {
  html: [
    { left: "14%", top: "10%", size: "9%" },
    { left: "82%", top: "18%", size: "6%" },
    { left: "80%", top: "70%", size: "8%" },
  ],
  css: [
    { left: "22%", top: "16%", size: "6%" },
    { left: "74%", top: "14%", size: "5%" },
    { left: "78%", top: "58%", size: "7%" },
    { left: "20%", top: "56%", size: "5%" },
  ],
  lens: [
    { left: "8%", top: "6%", size: "16%" },
    { left: "84%", top: "28%", size: "11%" },
  ],
};

function Spark({ group, style }: { group: string; style: CSSProperties }) {
  return (
    <svg data-spark={group} viewBox="0 0 24 24" className="hood-spark" style={style} aria-hidden>
      <path d="M12 0c.8 6.4 5.6 11.2 12 12-6.4.8-11.2 5.6-12 12-.8-6.4-5.6-11.2-12-12C6.4 11.2 11.2 6.4 12 0Z" fill="#fff6dc" />
    </svg>
  );
}

/**
 * Under the hood, told in three acts as you scroll: the HTML5 shield flies into
 * its orange orbit, the CSS3 shield lands in its frame of code and paint, and
 * the SEO magnifier sweeps across both before settling between them.
 */
export default function UnderTheHood() {
  const section = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ desktop: "(min-width: 1024px)", motion: MOTION_OK }, (ctx) => {
        const { desktop, motion } = ctx.conditions as { desktop: boolean; motion: boolean };
        const list = section.current!.querySelector<HTMLElement>("[data-steps]")!;
        if (!motion) {
          list.dataset.step = "2";
          return;
        }
        const q = gsap.utils.selector(section);
        const stage = q("[data-stage]")[0] as HTMLElement;
        const flyIn = (dir: 1 | -1) => ({
          xPercent: 150 * dir,
          yPercent: -140,
          rotation: 34 * dir,
          rotationY: -540 * dir,
          scale: 1.6,
          autoAlpha: 0,
          transformPerspective: 1400,
        });
        const landed = { xPercent: 0, yPercent: 0, rotation: 0, rotationY: 0, scale: 1, autoAlpha: 1 };

        list.dataset.step = "0";
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: desktop ? section.current : stage,
            start: desktop ? "top top" : "top 82%",
            end: desktop ? "bottom bottom" : "bottom 18%",
            scrub: 0.8,
            onUpdate: (self) => {
              const p = self.progress;
              list.dataset.step = p < 0.3 ? "0" : p < 0.6 ? "1" : "2";
            },
          },
        });

        // Act 1 — HTML: the orbit spins up, the shield flies in and lands.
        tl.fromTo(q("[data-glow='html']"), { scale: 0.5, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.14 }, 0.02)
          .fromTo(q("[data-frame='html']"), { scale: 0.62, rotation: -32, autoAlpha: 0 }, { scale: 1, rotation: 0, autoAlpha: 1, duration: 0.16, ease: "power2.out" }, 0.02)
          .fromTo(q("[data-shield='html']"), flyIn(1), { ...landed, duration: 0.16, ease: "power2.out" }, 0.08)
          .fromTo(q("[data-flash='html']"), { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 0.9, scale: 1, duration: 0.02 }, 0.235)
          .to(q("[data-flash='html']"), { autoAlpha: 0, scale: 1.4, duration: 0.07 }, 0.255)
          .to(q("[data-shield='html']"), { scale: 1.06, duration: 0.02, ease: "power2.out" }, 0.24)
          .to(q("[data-shield='html']"), { scale: 1, duration: 0.05, ease: "power2.inOut" }, 0.26)
          .fromTo(q("[data-spark='html']"), { scale: 0, rotation: -60, autoAlpha: 0 }, { scale: 1, rotation: 0, autoAlpha: 1, duration: 0.07, stagger: 0.02, ease: "back.out(3)" }, 0.25);

        // Act 2 — CSS: the frame blooms, the shield lands behind the marble plinth.
        tl.to(q("[data-glow='html']"), { autoAlpha: 0.35, duration: 0.1 }, 0.3)
          .fromTo(q("[data-glow='css']"), { scale: 0.5, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.14 }, 0.3)
          .fromTo(q("[data-frame='css']"), { scale: 0.7, rotation: 12, autoAlpha: 0 }, { scale: 1, rotation: 0, autoAlpha: 1, duration: 0.16, ease: "power2.out" }, 0.3)
          .fromTo(q("[data-shield='css']"), flyIn(1), { ...landed, duration: 0.17, ease: "power2.out" }, 0.37)
          .fromTo(q("[data-flash='css']"), { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 0.9, scale: 1, duration: 0.02 }, 0.535)
          .to(q("[data-flash='css']"), { autoAlpha: 0, scale: 1.4, duration: 0.07 }, 0.555)
          .to(q("[data-shield='css']"), { scale: 1.06, duration: 0.02, ease: "power2.out" }, 0.54)
          .to(q("[data-shield='css']"), { scale: 1, duration: 0.05, ease: "power2.inOut" }, 0.56)
          .fromTo(q("[data-spark='css']"), { scale: 0, rotation: -60, autoAlpha: 0 }, { scale: 1, rotation: 0, autoAlpha: 1, duration: 0.07, stagger: 0.02, ease: "back.out(3)" }, 0.55);

        // Act 3 — SEO: the magnifier sweeps over both shields (each one swells
        // as the lens passes) and settles between them.
        const lens = q("[data-lens]");
        gsap.set(lens, { xPercent: -240, yPercent: 130, rotation: -50, scale: 0.55, autoAlpha: 0 });
        tl.to(q("[data-glow='html']"), { autoAlpha: 0.6, duration: 0.08 }, 0.6)
          .to(q("[data-glow='css']"), { autoAlpha: 0.6, duration: 0.08 }, 0.6)
          .fromTo(q("[data-glow='lens']"), { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.1 }, 0.78)
          .to(
            lens,
            {
              keyframes: [
                { xPercent: -30, yPercent: -95, rotation: -18, scale: 1.12, autoAlpha: 1, ease: "power2.out" },
                { xPercent: 150, yPercent: -80, rotation: 10, scale: 1.12, ease: "sine.inOut" },
                { xPercent: 0, yPercent: 0, rotation: -6, scale: 1, ease: "power3.out" },
              ],
              duration: 0.24,
            },
            0.6,
          )
          .to(q("[data-shield='html']"), { scale: 1.08, duration: 0.03, ease: "sine.out" }, 0.64)
          .to(q("[data-shield='html']"), { scale: 1, duration: 0.04, ease: "sine.inOut" }, 0.67)
          .to(q("[data-shield='css']"), { scale: 1.08, duration: 0.03, ease: "sine.out" }, 0.72)
          .to(q("[data-shield='css']"), { scale: 1, duration: 0.04, ease: "sine.inOut" }, 0.75)
          .fromTo(q("[data-spark='lens']"), { scale: 0, rotation: -60, autoAlpha: 0 }, { scale: 1, rotation: 0, autoAlpha: 1, duration: 0.07, stagger: 0.03, ease: "back.out(3)" }, 0.83)
          .to({}, { duration: 0.1 }, 0.9);

        // Everything breathes a little once it has landed.
        q("[data-bob]").forEach((el, i) => {
          gsap.to(el, { yPercent: i % 2 ? 2.2 : -2.2, duration: 2.6 + i * 0.5, ease: "sine.inOut", yoyo: true, repeat: -1 });
        });

        if (!desktop || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
        gsap.set(stage, { transformPerspective: 1600 });
        const rx = gsap.quickTo(stage, "rotationX", { duration: 1, ease: "power3" });
        const ry = gsap.quickTo(stage, "rotationY", { duration: 1, ease: "power3" });
        const onMove = (e: PointerEvent) => {
          const r = stage.getBoundingClientRect();
          ry(((e.clientX - r.left) / r.width - 0.5) * 8);
          rx(-((e.clientY - r.top) / r.height - 0.5) * 6);
        };
        const onLeave = () => {
          rx(0);
          ry(0);
        };
        stage.addEventListener("pointermove", onMove);
        stage.addEventListener("pointerleave", onLeave);
        return () => {
          stage.removeEventListener("pointermove", onMove);
          stage.removeEventListener("pointerleave", onLeave);
        };
      });
    },
    { scope: section },
  );

  return (
    <section ref={section} id="under-the-hood" data-theme="dark" aria-labelledby="hood-title" className="relative bg-ink text-paper [overflow-x:clip] lg:h-[360vh]">
      <div className="lg:sticky lg:top-0 lg:flex lg:h-[100svh] lg:items-center">
        <div className="shell grid w-full grid-cols-12 gap-x-6 gap-y-12 py-24 lg:gap-y-0 lg:py-0">
          <div className="col-span-12 lg:col-span-5 lg:row-start-1 lg:self-end">
            <p data-reveal className="kicker flex items-center gap-4 text-mist">
              <span className="text-gold">Under the hood</span>
              <span className="h-px w-16 bg-current opacity-30" />
              <span>p. 09</span>
            </p>
            <h2 id="hood-title" data-split className="display mt-8 text-[clamp(2.9rem,min(5.2vw,8.4svh),5.2rem)]">
              A little code, so the words get <em className="text-gold">found.</em>
            </h2>
            <p data-reveal className="mt-6 max-w-[44ch] text-[1.02rem] leading-relaxed text-mist">
              HTML gives a page its structure, CSS gives it style — and SEO makes sure the right people find it. She speaks enough of
              all three to fix what an audit finds.
            </p>
          </div>

          <div className="col-span-12 lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1 lg:self-center">
            <div
              data-stage
              role="img"
              aria-label="An orange HTML5 shield in a glowing orbit, a blue CSS3 shield in a frame of code, leaves and paint, and a magnifying glass labelled SEO"
              className="hood-stage"
            >
              <span data-glow="html" className="hood-glow hood-glow--html" aria-hidden />
              <span data-glow="css" className="hood-glow hood-glow--css" aria-hidden />
              <span data-glow="lens" className="hood-glow hood-glow--lens" aria-hidden />

              {/* HTML5 */}
              <div className="hood-html" aria-hidden>
                <div data-frame="html" className="absolute inset-0">
                  <Image src={htmlOrbit} alt="" sizes="(min-width: 1024px) 420px, 60vw" className="h-full w-full" />
                </div>
                <div data-shield="html" className="hood-shield" style={{ left: "21.61%", top: "12.6%", width: "59.73%" }}>
                  <div data-bob>
                    <Image src={htmlShield} alt="" sizes="(min-width: 1024px) 260px, 36vw" className="h-auto w-full drop-shadow-[0_18px_26px_rgb(80_20_0/0.45)]" />
                  </div>
                </div>
                <span data-flash="html" className="hood-flash" style={{ left: "51%", top: "48%" }} aria-hidden />
                {sparkles.html.map((s) => (
                  <Spark key={`h${s.left}${s.top}`} group="html" style={{ left: s.left, top: s.top, width: s.size }} />
                ))}
              </div>

              {/* CSS3 — the frame is drawn twice: once behind the shield and once,
                  clipped to the marble plinth, in front of it. */}
              <div className="hood-css" aria-hidden>
                <div data-frame="css" className="absolute inset-0">
                  <Image src={cssFrame} alt="" sizes="(min-width: 1024px) 520px, 76vw" className="h-full w-full" />
                </div>
                <div data-shield="css" className="hood-shield" style={{ left: "31%", top: "23.86%", width: "41%" }}>
                  <div data-bob>
                    <Image src={cssShield} alt="" sizes="(min-width: 1024px) 220px, 32vw" className="h-auto w-full drop-shadow-[0_18px_26px_rgb(10_30_90/0.5)]" />
                  </div>
                </div>
                <div data-frame="css" className="hood-plinth absolute inset-0">
                  <Image src={cssFrame} alt="" sizes="(min-width: 1024px) 520px, 76vw" className="h-full w-full" />
                </div>
                <span data-flash="css" className="hood-flash hood-flash--blue" style={{ left: "51.5%", top: "48%" }} aria-hidden />
                {sparkles.css.map((s) => (
                  <Spark key={`c${s.left}${s.top}`} group="css" style={{ left: s.left, top: s.top, width: s.size }} />
                ))}
              </div>

              {/* SEO */}
              <div data-lens className="hood-lens" aria-hidden>
                <div data-bob>
                  <Image src={seoLens} alt="" sizes="(min-width: 1024px) 200px, 32vw" className="h-auto w-full drop-shadow-[0_22px_28px_rgb(0_0_0/0.55)]" />
                </div>
                {sparkles.lens.map((s) => (
                  <Spark key={`l${s.left}${s.top}`} group="lens" style={{ left: s.left, top: s.top, width: s.size }} />
                ))}
              </div>
            </div>
          </div>

          <ol data-steps data-step="2" className="hood-steps col-span-12 border-t border-paper/15 lg:col-span-5 lg:row-start-2 lg:mt-10 lg:self-start">
            {steps.map((s) => (
              <li key={s.no} className="grid grid-cols-[3rem_1fr_auto] items-baseline gap-x-3 border-b border-paper/15 py-4">
                <span className="kicker text-gold">{s.no}</span>
                <div>
                  <p className="display text-[1.9rem] leading-none">{s.title}</p>
                  <p className="mt-1.5 text-[0.92rem] leading-snug text-mist">{s.body}</p>
                </div>
                <span className="kicker rounded-full border border-paper/20 px-2.5 py-1 !text-[0.6rem] text-mist">{s.tag}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
