"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { useLenis } from "lenis/react";
import { wall, type WallNote, type WallPage } from "@/content/wall";
import { Draggable, gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { SectionHead } from "@/components/ui/SectionHead";
import { Close } from "@/components/ui/Icons";

export default function Wall() {
  const board = useRef<HTMLDivElement>(null);
  const dragged = useRef(false);
  const [zoom, setZoom] = useState<WallPage | null>(null);
  const close = useCallback(() => setZoom(null), []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-wall-item]", board.current);
        let z = 20;
        const draggables = Draggable.create(items, {
          type: "x,y",
          bounds: board.current,
          inertia: true,
          dragClickables: true,
          edgeResistance: 0.8,
          onPress() {
            const t = this.target as HTMLElement;
            z += 1;
            gsap.set(t, { zIndex: z });
            gsap.to(t.querySelector("[data-tilt]"), { scale: 1.05, rotate: 0, duration: 0.35, ease: "power3.out" });
          },
          onDragStart() {
            dragged.current = true;
          },
          onRelease() {
            const t = this.target as HTMLElement;
            gsap.to(t.querySelector("[data-tilt]"), { scale: 1, rotate: Number(t.dataset.rotate || 0), duration: 0.9, ease: "elastic.out(1, 0.5)" });
            window.setTimeout(() => {
              dragged.current = false;
            }, 80);
          },
        });

        if (window.matchMedia(MOTION_OK).matches) {
          gsap.from(items, {
            y: -120,
            autoAlpha: 0,
            rotate: () => gsap.utils.random(-24, 24),
            duration: 1.1,
            ease: "back.out(1.3)",
            stagger: 0.07,
            scrollTrigger: { trigger: board.current, start: "top 75%", once: true },
          });
        }
        return () => draggables.forEach((d) => d.kill());
      });
    },
    { scope: board },
  );

  return (
    <section id="wall" data-theme="light" aria-labelledby="wall-title" className="spread relative overflow-hidden bg-paper">
      <div className="shell">
        <SectionHead no="08" label="The Wall" page="12" />

        <div className="mt-12 grid grid-cols-12 items-end gap-x-6 gap-y-6 lg:mt-[clamp(1.25rem,3.5svh,2.5rem)]">
          <h2 id="wall-title" data-split className="display col-span-12 text-[clamp(3.2rem,min(7.6vw,10svh),7.2rem)] lg:col-span-8">
            Brands & pages I’ve <em className="text-wine">worked on.</em>
          </h2>
          <p data-reveal className="col-span-12 max-w-[40ch] text-[1.02rem] leading-relaxed text-muted lg:col-span-4">
            Resorts, institutes, tourism boards and the brands she writes for.
            <span className="lg:hidden"> Swipe through, and tap a photo to look closer.</span>
            <span className="hidden lg:inline"> Pick them up, move them around — tap a photo to look closer.</span>
          </p>
        </div>
      </div>

      {/* The board takes the height left on screen; pins shrink if it gets wide and short. */}
      <div className="relative mt-14 lg:mx-auto lg:mt-[clamp(1.25rem,3.5svh,2.5rem)] lg:h-[clamp(500px,calc(100svh-20rem),860px)] lg:w-full lg:max-w-[1800px]">
        <div
          ref={board}
          className="no-scrollbar flex snap-x gap-6 overflow-x-auto px-[clamp(1rem,4vw,3rem)] pb-10 pt-6 lg:absolute lg:inset-y-0 lg:inset-x-[clamp(1rem,4vw,3rem)] lg:block lg:[container-type:size] lg:overflow-visible lg:rounded-[32px] lg:bg-paper-2 lg:bg-[radial-gradient(rgb(20_17_15/0.09)_1px,transparent_1px)] lg:p-0 lg:[background-size:22px_22px]"
        >
        {wall.map((item) => (
          <div
            key={item.id}
            data-wall-item
            data-rotate={item.spot.rotate}
            data-cursor="Drag"
            className={cn(
              "relative shrink-0 snap-center lg:absolute lg:left-[var(--l)] lg:top-[var(--t)] lg:w-[min(calc(var(--w)*1cqw),calc(var(--w)*2.6cqh))]",
              item.kind === "page" ? "w-[76vw] max-w-[340px]" : "w-[62vw] max-w-[260px]",
            )}
            style={{ "--l": item.spot.left, "--t": item.spot.top, "--w": item.spot.w } as CSSProperties}
          >
            <div data-tilt style={{ transform: `rotate(${item.spot.rotate}deg)` }}>
              {item.kind === "page" ? (
                <Polaroid page={item} onOpen={() => !dragged.current && setZoom(item)} />
              ) : (
                <Note note={item} />
              )}
            </div>
          </div>
        ))}
        </div>
      </div>

      {zoom && <Lightbox page={zoom} onClose={close} />}
    </section>
  );
}

function Polaroid({ page, onOpen }: { page: WallPage; onOpen: () => void }) {
  return (
    <button type="button" onClick={onOpen} aria-label={`Open the ${page.name} ${page.platform} page`} className="polaroid relative w-full text-left">
      <span className="tape" aria-hidden />
      <span className="relative block aspect-[16/10] overflow-hidden rounded-[2px] bg-ink">
        <Image src={page.image} alt="" fill sizes="(min-width: 1024px) 30vw, 76vw" className="object-cover object-top" />
      </span>
      <span className="flex items-end justify-between gap-3 px-1 pb-3.5 pt-3">
        <span className="min-w-0">
          <span className="hand block text-[1.55rem] leading-none text-wine">{page.name}</span>
          <span className="kicker mt-1.5 block truncate !text-[0.6rem] text-muted">{page.place}</span>
        </span>
        <span className="kicker shrink-0 text-right !text-[0.6rem] leading-relaxed text-muted">
          {page.platform}
          <br />
          {page.stat}
        </span>
      </span>
    </button>
  );
}

function Note({ note }: { note: WallNote }) {
  return (
    <div className={cn("note", `note--${note.tone}`)}>
      <span className="tape !w-16" aria-hidden />
      <p className="kicker text-ink/55">{note.label}</p>
      <p className="display mt-2 text-[clamp(1.8rem,2.3vw,2.3rem)] leading-[0.95] lg:text-[clamp(1.5rem,min(2vw,3.4svh),2.1rem)]">{note.name}</p>
      <p className="hand mt-3 text-[1.55rem] leading-none text-wine lg:mt-2 lg:text-[clamp(1.2rem,min(1.6vw,2.6svh),1.55rem)]">{note.what}</p>
      <p className="mt-2 text-[0.86rem] leading-snug text-ink/70 lg:text-[0.8rem]">{note.detail}</p>
    </div>
  );
}

function Lightbox({ page, onClose }: { page: WallPage; onClose: () => void }) {
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
      gsap.from("[data-lb-card]", { y: 50, scale: 0.95, autoAlpha: 0, duration: 0.8, ease: "expo.out" });
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label={`${page.name} — ${page.platform} page`}
      data-theme="dark"
      onClick={onClose}
      className="fixed inset-0 z-[110] grid place-items-center bg-ink/85 p-4 backdrop-blur-sm"
    >
      <figure data-lb-card onClick={(e) => e.stopPropagation()} className="polaroid w-full max-w-5xl">
        <Image src={page.image} alt={`${page.name} ${page.platform} page`} sizes="(min-width: 1024px) 1000px, 92vw" className="h-auto w-full" />
        <figcaption className="flex flex-wrap items-center justify-between gap-3 px-1 py-4">
          <span className="hand text-[1.9rem] leading-none text-wine">
            {page.name} · {page.place}
          </span>
          <span className="kicker text-muted">
            {page.platform} · {page.stat}
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
