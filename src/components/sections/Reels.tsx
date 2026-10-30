"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import { useLenis } from "lenis/react";
import { reelBrands, reels, type ReelBrand } from "@/content/reels";
import { cn } from "@/lib/cn";
import { useMedia } from "@/lib/use-media";
import { SectionHead } from "@/components/ui/SectionHead";
import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play, SoundOff, SoundOn } from "@/components/ui/Icons";

const filters: { key: ReelBrand | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "studio53", label: "Studio53" },
  { key: "signshop", label: "The Sign Shop" },
  { key: "basiha", label: "Basiha Fitness" },
  { key: "diary", label: "Her diary" },
];

const pad = (n: number) => String(n).padStart(2, "0");
const clock = (s: number) => `${Math.floor(s / 60)}:${pad(Math.floor(s % 60))}`;

/**
 * Where each card sits relative to the one playing (d = 0). Desktop queues the
 * next reels in depth to the right, like an up-next stack; phones show the
 * neighbours peeking in from both sides.
 */
function cardStyle(d: number, wide: boolean): CSSProperties {
  const a = Math.abs(d);
  if (wide) {
    if (d < 0) return { transform: "translate(-50%, -50%) translateX(-75%) scale(0.86)", opacity: 0, zIndex: 1, pointerEvents: "none" };
    return {
      transform: `translate(-50%, -50%) translateX(${d * 47}%) translateZ(${-d * 190}px) rotateY(${d ? -13 : 0}deg) scale(${1 - d * 0.04})`,
      opacity: d > 3 ? 0 : 1,
      zIndex: 20 - d,
      pointerEvents: d > 3 ? "none" : undefined,
    };
  }
  return {
    transform: `translate(-50%, -50%) translateX(${d * 84}%) scale(${1 - Math.min(a, 2) * 0.12})`,
    opacity: a > 2 ? 0 : 1,
    zIndex: 20 - a,
    pointerEvents: a > 2 ? "none" : undefined,
  };
}

export default function Reels() {
  const [filter, setFilter] = useState<ReelBrand | "all">("all");
  const [index, setIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  // null until the visitor presses play or pause; reduced motion starts paused
  const [choice, setPaused] = useState<boolean | null>(null);
  const [inView, setInView] = useState(false);
  const [clockAt, setClockAt] = useState({ id: "", sec: 0 });
  const wide = useMedia("(min-width: 1024px)");
  const reduced = useMedia("(prefers-reduced-motion: reduce)");
  const paused = choice ?? reduced;

  const list = useMemo(() => (filter === "all" ? reels : reels.filter((r) => r.brand === filter)), [filter]);
  const cur = Math.min(index, list.length - 1);
  const reel = list[cur];
  const time = clockAt.id === reel.id ? clockAt.sec : 0;

  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const bar = useRef<HTMLElement>(null);
  const ambient = useRef<HTMLCanvasElement>(null);
  const swipe = useRef<{ x: number; moved: boolean } | null>(null);
  const lenis = useLenis();

  const go = useCallback(
    (i: number) => {
      setIndex(((i % list.length) + list.length) % list.length);
      setPaused(false);
    },
    [list.length],
  );
  const next = useCallback(() => go(cur + 1), [go, cur]);
  const prev = useCallback(() => go(cur - 1), [go, cur]);

  const changeFilter = (key: ReelBrand | "all") => {
    setFilter(key);
    setIndex(0);
    setPaused(false);
  };

  // Only play while the stage is on screen.
  useEffect(() => {
    const el = stage.current;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.45 });
    if (el) io.observe(el);
    return () => io.disconnect();
  }, []);

  // Hook Lab's "watch the reel" lands here.
  useEffect(() => {
    const open = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      const i = reels.findIndex((r) => r.id === id);
      if (i < 0) return;
      setFilter("all");
      setIndex(i);
      setPaused(false);
    };
    window.addEventListener("reels:open", open);
    return () => window.removeEventListener("reels:open", open);
  }, []);

  useEffect(() => {
    const v = video.current;
    if (v) v.muted = muted;
  }, [muted, reel.id]);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (inView && !paused) v.play().catch(() => setPaused(true));
    else v.pause();
  }, [inView, paused, reel.id]);

  // Progress bar + an ambient glow sampled from the frame that's playing.
  useEffect(() => {
    const id = reel.id;
    const v = video.current;
    const ctx = ambient.current?.getContext("2d", { willReadFrequently: false });
    let raf = 0;
    let last = 0;
    let lastSec = -1;
    const paint = (now: number) => {
      if (v && v.duration) {
        if (bar.current) bar.current.style.transform = `scaleX(${v.currentTime / v.duration})`;
        const sec = Math.floor(v.currentTime);
        if (sec !== lastSec) {
          lastSec = sec;
          setClockAt({ id, sec });
        }
      }
      if (ctx && now - last > 140) {
        last = now;
        try {
          const src: CanvasImageSource | null =
            v && v.readyState >= 2 ? v : (stage.current?.querySelector<HTMLImageElement>(".reel-card.is-active img") ?? null);
          if (src) ctx.drawImage(src, 0, 0, 24, 24);
        } catch {}
      }
      raf = requestAnimationFrame(paint);
    };
    if (inView) raf = requestAnimationFrame(paint);
    return () => cancelAnimationFrame(raf);
  }, [inView, reel.id]);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") next();
    else if (e.key === "ArrowLeft") prev();
    else return;
    e.preventDefault();
  };

  const onPointerDown = (e: PointerEvent) => {
    swipe.current = { x: e.clientX, moved: false };
  };
  const onPointerUp = (e: PointerEvent) => {
    const s = swipe.current;
    if (!s) return;
    const dx = e.clientX - s.x;
    if (Math.abs(dx) > 44) {
      s.moved = true;
      if (dx < 0) next();
      else prev();
    }
  };
  const tapCard = (i: number) => {
    if (swipe.current?.moved) return;
    if (i === cur) setMuted((m) => !m);
    else go(i);
  };

  const readScript = () => {
    if (!reel.script) return;
    window.dispatchEvent(new CustomEvent("hooklab:open", { detail: reel.script }));
    lenis?.scrollTo("#hook-lab", { duration: 1.6 });
  };

  const brand = reelBrands[reel.brand];

  return (
    <section ref={section} id="reels" data-theme="dark" aria-labelledby="reels-title" className="spread relative overflow-hidden bg-ink text-paper">
      <canvas ref={ambient} width={24} height={24} aria-hidden className="reels-ambient" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_0%_50%,var(--color-ink)_30%,transparent_75%)]" />

      <div className="shell relative">
        <SectionHead no="03" label="Now Playing" page="05" tone="dark" />

        <div className="mt-12 grid grid-cols-12 gap-x-6 gap-y-10 lg:mt-[clamp(1.25rem,3.5svh,2.5rem)] lg:grid-rows-[auto_1fr]">
          <div className="col-span-12 lg:col-span-5 xl:col-span-4">
            <h2 id="reels-title" data-split className="display text-[clamp(3rem,min(6.4vw,9svh),6.2rem)]">
              Words, now <em className="text-gold">playing.</em>
            </h2>
            <p data-reveal className="mt-5 max-w-[40ch] text-[1.02rem] leading-relaxed text-mist lg:mt-[clamp(0.9rem,2.4svh,1.5rem)]">
              The scripts, shot and posted. Meta ads for Studio53, Tanglish reels for The Sign Shop and Basiha Fitness — and a couple
              from her own diary. Tap the reel for sound.
            </p>
            <div data-reveal role="group" aria-label="Filter reels by brand" className="no-scrollbar mt-7 flex gap-2 overflow-x-auto lg:mt-[clamp(1.1rem,3svh,1.75rem)] lg:flex-wrap">
              {filters.map((f) => {
                const count = f.key === "all" ? reels.length : reels.filter((r) => r.brand === f.key).length;
                return (
                  <button
                    key={f.key}
                    type="button"
                    aria-pressed={filter === f.key}
                    onClick={() => changeFilter(f.key)}
                    className={cn(
                      "flex h-9 shrink-0 items-center gap-2 rounded-full px-3.5 text-[0.84rem] transition-colors duration-500",
                      filter === f.key ? "bg-paper text-ink" : "bg-paper/[0.07] text-paper hover:bg-paper/15",
                    )}
                  >
                    {f.label}
                    <span className="kicker !text-[0.58rem] opacity-60">{pad(count)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* The stage */}
          <div className="col-span-12 lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1 xl:col-span-8 xl:col-start-5">
            <div
              ref={stage}
              role="region"
              aria-roledescription="carousel"
              aria-label="Reels"
              tabIndex={0}
              onKeyDown={onKey}
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
              className="reel-stage h-[min(66svh,36rem)] lg:h-[clamp(26rem,calc(100svh-12.5rem),44rem)]"
            >
              {list.map((r, i) => {
                const d = i - cur;
                const active = d === 0;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => tapCard(i)}
                    tabIndex={Math.abs(d) > 2 ? -1 : 0}
                    aria-label={active ? (muted ? "Turn the sound on" : "Mute") : `Play “${r.title}”`}
                    data-cursor={active ? (muted ? "Sound" : "Mute") : "Play"}
                    className={cn("reel-card", active && "is-active")}
                    style={cardStyle(d, wide)}
                  >
                    <Image src={r.poster} alt="" fill sizes="(min-width: 1024px) 420px, 70vw" placeholder="blur" className="object-cover" />
                    {active && (
                      <video
                        ref={video}
                        key={r.id}
                        src={r.src}
                        muted
                        playsInline
                        preload="metadata"
                        onEnded={next}
                        className="absolute inset-0 h-full w-full object-cover"
                        aria-label={`${reelBrands[r.brand].name} — ${r.title}`}
                      />
                    )}
                    {active && (
                      <>
                        <span className="reel-progress" aria-hidden>
                          <i ref={bar} />
                        </span>
                        <span className="absolute left-3 top-6 flex items-center gap-2 rounded-full bg-ink/45 py-1 pl-1 pr-3 text-[0.72rem] text-white backdrop-blur-md">
                          <span className="display grid h-6 w-6 place-items-center rounded-full bg-wine text-[0.8rem]">{reelBrands[r.brand].short}</span>
                          {reelBrands[r.brand].name}
                        </span>
                        <span className="absolute right-3 top-6 grid h-8 w-8 place-items-center rounded-full bg-ink/45 text-white backdrop-blur-md" aria-hidden>
                          {muted ? <SoundOff size={16} /> : <SoundOn size={16} />}
                        </span>
                        {paused && (
                          <span className="absolute inset-0 grid place-items-center bg-ink/25" aria-hidden>
                            <span className="grid h-16 w-16 place-items-center rounded-full bg-paper/90 text-ink">
                              <Play size={26} />
                            </span>
                          </span>
                        )}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Now playing */}
          <div className="col-span-12 lg:col-span-5 lg:self-end xl:col-span-4">
            <div className="border-t border-paper/15 pt-5" aria-live="polite">
              <p className="kicker flex items-center justify-between gap-4 text-mist">
                <span className="flex items-center gap-2 text-gold">
                  <span className={cn("eq", (paused || !inView) && "is-still")} aria-hidden>
                    <i />
                    <i />
                    <i />
                  </span>
                  Now playing
                </span>
                <span>
                  {pad(cur + 1)} / {pad(list.length)}
                </span>
              </p>
              <p className="mt-4 text-[0.86rem] text-mist">
                {brand.name} · {reel.format}
                {reel.lang ? ` · ${reel.lang}` : ""}
              </p>
              <p className="display mt-2 text-[clamp(1.9rem,min(2.6vw,4.2svh),2.6rem)] leading-[1.02]">{reel.title}</p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2 lg:mt-[clamp(1rem,3svh,1.75rem)]">
              <button type="button" onClick={prev} aria-label="Previous reel" className="grid h-11 w-11 place-items-center rounded-full ring-1 ring-paper/25 transition-colors hover:bg-paper hover:text-ink">
                <ChevronLeft />
              </button>
              <button
                type="button"
                onClick={() => setPaused(!paused)}
                aria-label={paused ? "Play" : "Pause"}
                className="grid h-11 w-11 place-items-center rounded-full bg-paper text-ink transition-transform hover:scale-105"
              >
                {paused ? <Play size={18} /> : <Pause size={16} />}
              </button>
              <button type="button" onClick={next} aria-label="Next reel" className="grid h-11 w-11 place-items-center rounded-full ring-1 ring-paper/25 transition-colors hover:bg-paper hover:text-ink">
                <ChevronRight />
              </button>
              <button
                type="button"
                onClick={() => setMuted((m) => !m)}
                aria-pressed={!muted}
                className="ml-1 flex h-11 items-center gap-2 rounded-full px-4 text-[0.84rem] ring-1 ring-paper/25 transition-colors hover:bg-paper/10"
              >
                {muted ? <SoundOff size={17} /> : <SoundOn size={17} />}
                {muted ? "Sound off" : "Sound on"}
              </button>
              <span className="kicker ml-auto text-mist">
                {clock(time)} / {reel.length}
              </span>
            </div>

            {reel.script && (
              <button type="button" onClick={readScript} className="kicker mt-5 inline-flex items-center gap-2 text-gold underline decoration-gold/40 underline-offset-4 hover:decoration-gold">
                Read the script in Hook Lab <ArrowUpRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
