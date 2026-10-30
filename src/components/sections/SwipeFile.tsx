"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { carousels } from "@/content/carousels";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { SectionHead } from "@/components/ui/SectionHead";
import { ArrowRight, Bookmark, ChevronLeft, ChevronRight } from "@/components/ui/Icons";

type Slide = { kind: "cover" } | { kind: "mistake"; n: number; mistake: string; fix: string } | { kind: "save" };

const pad = (n: number) => String(n).padStart(2, "0");

// Resting pose of a card by its depth in the stack.
const pose = (d: number) => {
  const visible = d < 3;
  const k = Math.min(d, 2);
  return { x: k * 16, y: k * 14, rotate: [0, 3.2, -2.6][k], scale: 1 - k * 0.045, autoAlpha: visible ? 1 : 0 };
};

export default function SwipeFile() {
  const [ci, setCi] = useState(0);
  const [si, setSi] = useState(0);
  const deck = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const busy = useRef(false);
  const drag = useRef<{ id: number; x0: number; t0: number; dx: number } | null>(null);

  const carousel = carousels[ci];
  const slides = useMemo<Slide[]>(
    () => [{ kind: "cover" }, ...carousel.items.map((it, i) => ({ kind: "mistake" as const, n: i + 1, ...it })), { kind: "save" }],
    [carousel],
  );
  const n = slides.length;

  // Settle every card into its place in the stack.
  useEffect(() => {
    cards.current.forEach((el, i) => {
      if (!el) return;
      const d = (i - si + n) % n;
      gsap.to(el, { ...pose(d), zIndex: n - d, duration: 0.75, ease: "expo.out", overwrite: "auto" });
    });
  }, [si, ci, n]);

  const width = () => deck.current?.offsetWidth ?? 480;

  const next = useCallback(
    (dx = -1) => {
      const top = cards.current[si];
      if (busy.current || !top) return;
      busy.current = true;
      const dir = dx > 0 ? 1 : -1;
      gsap.to(top, {
        x: dir * width() * 1.25,
        y: 40,
        rotate: dir * 16,
        autoAlpha: 0,
        duration: 0.5,
        ease: "power2.in",
        overwrite: true,
        onComplete: () => {
          busy.current = false;
          setSi((s) => (s + 1) % n);
        },
      });
    },
    [si, n],
  );

  const prev = useCallback(() => {
    if (busy.current) return;
    const target = (si - 1 + n) % n;
    const el = cards.current[target];
    if (!el) return;
    gsap.set(el, { x: -width() * 1.2, y: 30, rotate: -14, autoAlpha: 1, zIndex: n + 1 });
    setSi(target);
  }, [si, n]);

  const switchTo = (i: number) => {
    if (i === ci || busy.current) return;
    busy.current = true;
    const els = cards.current.filter(Boolean);
    gsap.to(els, {
      y: "+=46",
      autoAlpha: 0,
      duration: 0.32,
      stagger: 0.025,
      ease: "power2.in",
      overwrite: true,
      onComplete: () => {
        busy.current = false;
        setCi(i);
        setSi(0);
      },
    });
  };

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    const top = cards.current[si];
    if (busy.current || !top || !top.contains(e.target as Node)) return;
    top.setPointerCapture(e.pointerId);
    drag.current = { id: e.pointerId, x0: e.clientX, t0: performance.now(), dx: 0 };
    gsap.to(top, { scale: 1.02, duration: 0.3 });
  };

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    d.dx = e.clientX - d.x0;
    gsap.set(cards.current[si], { x: d.dx, rotate: d.dx * 0.05 });
  };

  const onUp = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    const top = cards.current[si];
    const v = d.dx / Math.max(1, performance.now() - d.t0);
    if (d.dx < -80 || v < -0.55) next(d.dx);
    else if (d.dx > 80 || v > 0.55) {
      gsap.to(top, { x: 0, rotate: 0, scale: 1, duration: 0.45 });
      prev();
    } else gsap.to(top, { x: 0, rotate: 0, scale: 1, duration: 0.8, ease: "elastic.out(1, 0.6)" });
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") next();
    else if (e.key === "ArrowLeft") prev();
    else return;
    e.preventDefault();
  };

  return (
    <section id="swipe-file" data-theme="light" aria-labelledby="swipe-title" className="spread relative overflow-hidden bg-paper">
      <div className="shell">
        <SectionHead no="04" label="Swipe File" page="06" />

        {/* Phones get heading → deck → list; desktop puts the list under the heading. */}
        <div className="mt-12 grid grid-cols-12 gap-x-6 gap-y-14 lg:mt-[clamp(1.25rem,3.5svh,2.5rem)] lg:gap-y-0">
          <div className="col-span-12 lg:col-span-5 lg:row-start-1">
            <h2 id="swipe-title" data-split className="display text-[clamp(3rem,min(6.8vw,9.2svh),6.4rem)]">
              Carousels people actually <em className="text-wine">save.</em>
            </h2>
            <p data-reveal className="mt-6 max-w-[40ch] text-[1.02rem] leading-relaxed text-muted lg:mt-[clamp(0.9rem,2.4svh,1.5rem)]">
              Seven carousel sets written for Studio53 — five mistakes, five fixes, one “save this”. Drag the cards; they swipe like
              the real thing.
            </p>
          </div>

          <div className="col-span-12 lg:col-span-5 lg:row-start-2 lg:mt-[clamp(1.25rem,3.5svh,2.5rem)]">
            <ol data-reveal className="border-t border-ink/15">
              {carousels.map((c, i) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => switchTo(i)}
                    aria-pressed={i === ci}
                    className="group flex w-full items-baseline gap-4 border-b border-ink/15 py-3.5 text-left lg:py-[clamp(0.5rem,1.35svh,0.875rem)]"
                  >
                    <span className={cn("kicker w-7 shrink-0", i === ci ? "text-wine" : "text-muted")}>{pad(i + 1)}</span>
                    <span
                      className={cn(
                        "font-serif text-[clamp(1.25rem,1.9vw,1.65rem)] leading-tight transition-all duration-500 ease-expo",
                        i === ci ? "translate-x-1.5 text-ink" : "text-ink/45 group-hover:text-ink/80",
                      )}
                    >
                      {c.title}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </div>

          <div className="col-span-12 row-start-2 flex flex-col items-center lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1 lg:pt-6">
            <div
              ref={deck}
              className="deck"
              role="region"
              aria-roledescription="carousel"
              aria-label={`${carousel.title} — slide ${si + 1} of ${n}`}
              tabIndex={0}
              onKeyDown={onKey}
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onUp}
              data-cursor="Drag"
            >
              {slides.map((slide, i) => (
                <div
                  key={i}
                  ref={(el) => {
                    cards.current[i] = el;
                  }}
                  className="deck__card cursor-grab active:cursor-grabbing"
                  aria-hidden={i !== si}
                  style={i === 0 ? undefined : { opacity: 0 }}
                >
                  <SlideView slide={slide} title={carousel.title} index={i} total={n} />
                </div>
              ))}
            </div>

            <div className="mt-12 flex w-full max-w-[520px] items-center gap-4 lg:mt-[clamp(1.25rem,4svh,3rem)] lg:max-w-[min(520px,calc(100svh-17rem))]">
              <button type="button" onClick={prev} aria-label="Previous slide" className="grid h-12 w-12 place-items-center rounded-full border border-ink/20 transition-colors hover:bg-ink hover:text-paper">
                <ChevronLeft />
              </button>
              <div className="flex flex-1 gap-1.5" aria-hidden>
                {slides.map((_, i) => (
                  <span key={i} className={cn("h-[3px] flex-1 rounded-full transition-colors duration-500", i <= si ? "bg-wine" : "bg-ink/15")} />
                ))}
              </div>
              <span className="kicker w-14 text-center text-muted" aria-live="polite">
                {pad(si + 1)}/{pad(n)}
              </span>
              <button type="button" onClick={() => next()} aria-label="Next slide" className="grid h-12 w-12 place-items-center rounded-full bg-ink text-paper transition-colors hover:bg-wine">
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SlideView({ slide, title, index, total }: { slide: Slide; title: string; index: number; total: number }) {
  const counter = `${index + 1}/${total}`;

  if (slide.kind === "cover") {
    const [num, ...rest] = title.split(" ");
    return (
      <div className="slide bg-wine text-paper">
        <div className="flex items-center justify-between">
          <span className="slide__label rounded-full bg-paper/15 px-[2.6cqw] py-[1.3cqw]">Studio53</span>
          <span className="slide__label opacity-70">{counter}</span>
        </div>
        <div className="mt-auto">
          <span className="block font-serif text-[34cqw] leading-[0.7] text-gold">{num}</span>
          <p className="slide__title mt-[4cqw]">{rest.join(" ")}</p>
        </div>
        <p className="slide__label mt-[5cqw] flex items-center gap-[1.6cqw]">
          Swipe <ArrowRight className="h-[3.4cqw] w-[3.4cqw]" />
        </p>
      </div>
    );
  }

  if (slide.kind === "mistake") {
    return (
      <div className="slide overflow-hidden bg-[#fbf8f2] text-ink">
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-[14cqw] -right-[3cqw] font-serif text-[62cqw] leading-none text-transparent [-webkit-text-stroke:1px_rgb(107_31_44/0.16)]"
        >
          {slide.n}
        </span>
        <div className="relative flex items-center justify-between">
          <span className="slide__label text-wine">✕ Mistake #{slide.n}</span>
          <span className="slide__label text-muted">{counter}</span>
        </div>
        <p className="slide__body relative mt-[6cqw] max-w-[92%]">{slide.mistake}</p>
        <div className="relative mt-auto rounded-[3.4cqw] bg-ink p-[4.6cqw] text-paper">
          <span className="slide__label text-gold">✓ Fix</span>
          <p className="mt-[1.6cqw] text-[4.5cqw] leading-[1.28]">{slide.fix}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="slide bg-ink text-paper">
      <div className="flex items-center justify-between">
        <span className="slide__label text-gold">Studio53</span>
        <span className="slide__label opacity-60">{counter}</span>
      </div>
      <div className="my-auto">
        <Bookmark className="h-[13cqw] w-[13cqw] text-gold" />
        <p className="slide__title mt-[4cqw] italic">Save this.</p>
        <p className="mt-[3cqw] text-[4.4cqw] text-mist">Follow Studio53 for more.</p>
      </div>
    </div>
  );
}
