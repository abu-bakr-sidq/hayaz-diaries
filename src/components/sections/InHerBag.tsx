"use client";

import Image from "next/image";
import { useRef, type CSSProperties } from "react";
import { tools } from "@/content/tools";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { SectionHead } from "@/components/ui/SectionHead";

/** Width ÷ height of the desktop flat-lay; tool spots are % of this box. */
const RATIO = 2.5;
const BAG = { x: 50, y: 46.5, w: 24 };
const BAG_ASPECT = 300 / 210;

function Bag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 210" className={className} aria-hidden>
      <ellipse cx="150" cy="204" rx="128" ry="6" fill="rgb(20 17 15 / 0.18)" />
      <path d="M96 74C96 22 204 22 204 74" fill="none" stroke="#9a7b45" strokeWidth="7" strokeLinecap="round" />
      <path
        d="M40 70h220c11 0 19 9 17 20l-14 92c-2 11-10 18-21 18H58c-11 0-19-7-21-18L23 90c-2-11 6-20 17-20Z"
        fill="#bea886"
        stroke="#9a7b45"
        strokeWidth="2"
      />
      <path d="M26 82c34 54 214 54 248 0" fill="#c9b493" stroke="#9a7b45" strokeWidth="2" />
      <rect x="128" y="113" width="44" height="11" rx="2" fill="#d9b46a" stroke="#9a7b45" />
      <path d="M44 150c60 10 152 10 212 0" fill="none" stroke="rgb(20 17 15 / 0.12)" strokeWidth="2" strokeDasharray="5 6" />
    </svg>
  );
}

/** Top-left corner of a box whose centre is (x, y), as % of the canvas. */
const place = (x: number, y: number, w: number, aspect: number) => {
  const h = (w * RATIO) / aspect;
  return { left: `${x - w / 2}%`, top: `${y - h / 2}%`, width: `${w}%` };
};

export default function InHerBag() {
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`(min-width: 1024px) and ${MOTION_OK}`, () => {
        const q = gsap.utils.selector(section);
        const box = canvas.current!;
        const bag = q("[data-bag]")[0] as HTMLElement;
        const items = q("[data-spill]") as HTMLElement[];

        // Everything starts tucked inside the bag and spills out as the page
        // rises into place — done by the time the spread fills the screen.
        const center = (el: HTMLElement) => ({ x: el.offsetLeft + el.offsetWidth / 2, y: el.offsetTop + el.offsetHeight / 2 });
        const tl = gsap.timeline({
          scrollTrigger: { trigger: section.current, start: "top 70%", end: "top 4%", scrub: 1, invalidateOnRefresh: true },
        });
        items.forEach((el, i) => {
          tl.from(
            el,
            {
              x: () => center(bag).x - center(el).x,
              y: () => bag.offsetTop + bag.offsetHeight * 0.32 - center(el).y,
              scale: 0.18,
              rotate: (i % 2 ? 1 : -1) * (28 + i * 7),
              autoAlpha: 0,
              ease: "power2.out",
              duration: 1,
            },
            0.15 + i * 0.07,
          );
        });
        tl.from(bag, { y: 24, scale: 0.92, duration: 0.5, ease: "power2.out" }, 0);
        tl.from(q("[data-note]"), { autoAlpha: 0, y: 12, stagger: 0.05, duration: 0.35 }, ">-0.3");

        q("[data-float]").forEach((el, i) => {
          gsap.to(el, { y: "+=12", duration: 2.8 + (i % 3) * 0.5, ease: "sine.inOut", yoyo: true, repeat: -1, delay: i * 0.2 });
        });

        if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
        const movers = q("[data-mouse]").map((el) => ({
          depth: parseFloat(el.dataset.mouse || "1"),
          x: gsap.quickTo(el, "x", { duration: 1, ease: "power3" }),
          y: gsap.quickTo(el, "y", { duration: 1, ease: "power3" }),
        }));
        const onMove = (e: PointerEvent) => {
          const r = box.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width - 0.5;
          const ny = (e.clientY - r.top) / r.height - 0.5;
          movers.forEach((m) => {
            m.x(nx * -30 * m.depth);
            m.y(ny * -22 * m.depth);
          });
        };
        box.addEventListener("pointermove", onMove);
        return () => box.removeEventListener("pointermove", onMove);
      });
    },
    { scope: section },
  );

  return (
    <section
      ref={section}
      id="in-her-bag"
      data-theme="light"
      aria-labelledby="bag-title"
      className="spread relative overflow-hidden bg-champagne lg:h-svh lg:min-h-[640px]"
    >
      <div className="shell lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">
        <SectionHead no="06" label="In Her Bag" page="10" />

        <div className="mt-12 grid grid-cols-12 items-end gap-x-6 gap-y-6 lg:mt-[clamp(1.25rem,3.5svh,2.5rem)]">
          <h2 id="bag-title" data-reveal className="display col-span-12 text-[clamp(3.2rem,min(8vw,10.2svh),7.4rem)] lg:col-span-8">
            What’s in my{" "}
            <span className="relative inline-block w-[0.42em] align-baseline" aria-hidden>
              <span className="hand absolute -top-[1.9em] left-1/2 -translate-x-1/2 -rotate-6 text-[0.5em] text-wine">tool</span>
              <svg viewBox="0 0 20 16" className="absolute bottom-[0.02em] left-0 w-full text-wine">
                <path data-draw data-delay="0.3" pathLength={1} d="M2 14 10 2l8 12" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
            </span>
            <span className="sr-only">tool</span> bag?
          </h2>
          <p data-reveal className="col-span-12 max-w-[40ch] text-[1.02rem] leading-relaxed text-ink/70 lg:col-span-4 lg:pb-2">
            The everyday kit behind the words: the tools that tell her what people search for, what Google sees, and what actually
            worked.
          </p>
        </div>

        {/* Desktop flat-lay — one fixed ratio, sized to the room left on screen. */}
        <div className="bag-stage relative mt-[clamp(0.75rem,2.5svh,2rem)] hidden min-h-0 flex-1 lg:block">
          <div ref={canvas} className="bag-canvas" style={{ "--ratio": RATIO } as CSSProperties}>
            <div data-bag className="absolute" style={place(BAG.x, BAG.y, BAG.w, BAG_ASPECT)}>
              <Bag className="h-auto w-full" />
              <p className="hand bag-caption mt-1 text-center text-ink/60">(the champagne one, obviously)</p>
            </div>

            {tools.map((t) => (
              <div key={t.id} data-spill className="absolute" style={place(t.spot.x, t.spot.y, t.spot.w, t.image.width / t.image.height)}>
                <div data-mouse={t.depth}>
                  <div data-float>
                    <div style={{ rotate: `${t.spot.rotate}deg` }} className="transition-transform duration-700 ease-expo hover:scale-[1.06]">
                      <Image
                        src={t.image}
                        alt={t.name}
                        sizes="(min-width: 1024px) 16vw, 40vw"
                        className="h-auto w-full drop-shadow-[0_22px_26px_rgb(20_17_15/0.3)]"
                      />
                    </div>
                  </div>
                </div>
                <p data-note className="bag-note">
                  <span className="kicker block text-ink/60">{t.name}</span>
                  <span className="hand mt-1 block leading-[1.05] text-wine">{t.note}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile & tablet grid */}
        <ul className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:hidden">
          {tools.map((t) => (
            <li key={t.id} data-reveal className="flex flex-col items-center rounded-3xl bg-paper/45 p-4 text-center">
              <div className="flex aspect-square w-full items-center justify-center p-2">
                <Image src={t.image} alt={t.name} sizes="40vw" className="h-auto max-h-full w-auto max-w-full drop-shadow-[0_14px_18px_rgb(20_17_15/0.25)]" />
              </div>
              <span className="kicker mt-2 text-ink/60">{t.name}</span>
              <span className="hand mt-1 text-[1.3rem] leading-[1.05] text-wine">{t.note}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
