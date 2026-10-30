"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useLenis } from "lenis/react";
import { brands, scripts, type Beat, type BrandKey } from "@/content/scripts";
import { reels } from "@/content/reels";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { SectionHead } from "@/components/ui/SectionHead";
import { Bubble, ChevronLeft, ChevronRight, Heart, Music, Pause, Play, Send } from "@/components/ui/Icons";

const filters: { key: BrandKey | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "studio53", label: "Studio53" },
  { key: "urbancore", label: "UrbanCore" },
  { key: "signshop", label: "The Sign Shop" },
];

const toWords = (text: string) => text.split(/\s+/).filter(Boolean);
const beatDuration = (b: Beat) => Math.min(9000, Math.max(2800, toWords(b.vo).length * 330 + 1000));
const pad = (n: number) => String(n).padStart(2, "0");

export default function HookLab() {
  const [filter, setFilter] = useState<BrandKey | "all">("all");
  const [activeId, setActiveId] = useState(scripts[0].id);
  const [beat, setBeat] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [inView, setInView] = useState(false);

  const list = useMemo(() => (filter === "all" ? scripts : scripts.filter((s) => s.brand === filter)), [filter]);
  const active = scripts.find((s) => s.id === activeId) ?? scripts[0];
  const brand = brands[active.brand];
  const current = active.beats[beat] ?? active.beats[0];
  const words = useMemo(() => toWords(current.vo), [current]);
  const running = playing && inView;
  const activeReel = reels.find((r) => r.script === active.id);
  const lenis = useLenis();

  const section = useRef<HTMLElement>(null);
  const segs = useRef<(HTMLElement | null)[]>([]);
  const caption = useRef<HTMLParagraphElement>(null);
  const sticker = useRef<HTMLDivElement>(null);
  const pageBody = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const elapsed = useRef(0);

  const select = useCallback((id: string) => {
    elapsed.current = 0;
    setActiveId(id);
    setBeat(0);
  }, []);

  const goBeat = useCallback((i: number) => {
    elapsed.current = 0;
    setBeat(i);
  }, []);

  const nextScript = useCallback(() => {
    const idx = list.findIndex((s) => s.id === active.id);
    select(list[(idx + 1) % list.length].id);
  }, [list, active.id, select]);

  const next = useCallback(() => {
    if (beat < active.beats.length - 1) goBeat(beat + 1);
    else nextScript();
  }, [beat, active.beats.length, goBeat, nextScript]);

  const prev = useCallback(() => goBeat(Math.max(0, beat - 1)), [beat, goBeat]);

  // "Read the script" from Now Playing opens it here; this jumps the other way.
  useEffect(() => {
    const open = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (!scripts.some((s) => s.id === id)) return;
      setFilter("all");
      select(id);
    };
    window.addEventListener("hooklab:open", open);
    return () => window.removeEventListener("hooklab:open", open);
  }, [select]);

  const watchReel = (id: string) => {
    setPlaying(false);
    window.dispatchEvent(new CustomEvent("reels:open", { detail: id }));
    lenis?.scrollTo("#reels", { duration: 1.6 });
  };

  const changeFilter = (key: BrandKey | "all") => {
    setFilter(key);
    const nextList = key === "all" ? scripts : scripts.filter((s) => s.brand === key);
    if (!nextList.some((s) => s.id === activeId)) select(nextList[0].id);
  };

  // Only play while the section is on screen.
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // The reel clock: fills the story bar and lights up captions word by word.
  useEffect(() => {
    const spans = caption.current ? (Array.from(caption.current.children) as HTMLElement[]) : [];
    const seg = segs.current[beat];
    const dur = beatDuration(current);

    if (!running) {
      spans.forEach((sp) => sp.classList.add("on"));
      if (seg) seg.style.transform = `scaleX(${Math.min(elapsed.current / dur, 1)})`;
      return;
    }

    let raf = 0;
    let last = performance.now();
    let lastK = -1;
    const tick = (now: number) => {
      elapsed.current += now - last;
      last = now;
      const p = Math.min(elapsed.current / dur, 1);
      if (seg) seg.style.transform = `scaleX(${p})`;
      const k = Math.min(spans.length, Math.ceil(p * 1.25 * spans.length));
      if (k !== lastK) {
        spans.forEach((sp, i) => {
          sp.classList.toggle("on", i < k);
          sp.classList.toggle("now", i === k - 1 && k < spans.length);
        });
        lastK = k;
      }
      if (p >= 1) {
        next();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, beat, current, next]);

  // Each beat pops in like a fresh caption.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        if (sticker.current) {
          gsap.fromTo(
            sticker.current,
            { autoAlpha: 0, scale: 0.75, rotate: -8, y: 12 },
            { autoAlpha: 1, scale: 1, rotate: -2, y: 0, duration: 0.75, ease: "back.out(2.2)" },
          );
        }
        if (caption.current) {
          gsap.fromTo(caption.current, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.55, ease: "power3.out" });
        }
      });
      return () => mm.revert();
    },
    { dependencies: [activeId, beat], scope: section, revertOnUpdate: true },
  );

  // Keep the script page and the list in step with the reel.
  useEffect(() => {
    const body = pageBody.current;
    const el = body?.querySelector<HTMLElement>(`[data-beat="${beat}"]`);
    if (body && el) body.scrollTo({ top: Math.max(0, el.offsetTop - body.clientHeight / 2 + el.clientHeight / 2), behavior: "smooth" });
  }, [beat, activeId]);

  useEffect(() => {
    const ul = listRef.current;
    const el = ul?.querySelector<HTMLElement>(`[data-script="${activeId}"]`);
    if (!ul || !el || ul.scrollWidth <= ul.clientWidth) return;
    ul.scrollTo({ left: el.offsetLeft - 16, behavior: "smooth" });
  }, [activeId]);

  const onPhoneKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") next();
    else if (e.key === "ArrowLeft") prev();
    else if (e.key === " " || e.key === "k") setPlaying((p) => !p);
    else return;
    e.preventDefault();
  };

  return (
    <section ref={section} id="hook-lab" data-theme="dark" aria-labelledby="hook-lab-title" className="spread relative overflow-hidden bg-ink text-paper">
      <div className="shell">
        <SectionHead no="02" label="Hook Lab" page="04" tone="dark" />

        {/* From 1280px the heading, filters and list share the left column so
            the whole lab — list, phone, script — fits on one screen. */}
        <div className="mt-12 grid grid-cols-1 gap-12 lg:mt-[clamp(1.25rem,3.5svh,2.5rem)] xl:grid-cols-[minmax(0,0.9fr)_auto_minmax(0,1.05fr)] xl:gap-14">
        <div className="min-w-0 xl:flex xl:h-0 xl:min-h-full xl:flex-col">
        <div className="grid grid-cols-12 items-end gap-x-6 gap-y-6 xl:block">
          <h2 id="hook-lab-title" data-split className="display col-span-12 text-[clamp(3rem,min(8.4vw,10.5svh),8.2rem)] lg:col-span-8 xl:text-[clamp(3rem,min(4.6vw,8.6svh),5.6rem)]">
            The first three seconds <em className="text-gold">are mine.</em>
          </h2>
          <p data-reveal className="col-span-12 max-w-[42ch] text-[1.02rem] leading-relaxed text-mist lg:col-span-4 xl:mt-[clamp(0.9rem,2.4svh,1.5rem)]">
            Twelve of her scripts, played the way they’d hit your feed. Tap the phone to skip a beat, or read along on the script
            page — every word written by Haya.
          </p>
        </div>

        {/* Filters */}
        <div data-reveal role="group" aria-label="Filter scripts by brand" className="no-scrollbar mt-14 flex shrink-0 gap-2 overflow-x-auto xl:mt-[clamp(1rem,3svh,1.75rem)] xl:flex-wrap">
          {filters.map((f) => {
            const count = f.key === "all" ? scripts.length : scripts.filter((s) => s.brand === f.key).length;
            return (
              <button
                key={f.key}
                type="button"
                aria-pressed={filter === f.key}
                onClick={() => changeFilter(f.key)}
                className={cn(
                  "flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-sm transition-colors duration-500",
                  filter === f.key ? "bg-paper text-ink" : "bg-paper/[0.07] text-paper hover:bg-paper/15",
                )}
              >
                {f.label}
                <span className="kicker !text-[0.6rem] opacity-60">{pad(count)}</span>
              </button>
            );
          })}
        </div>

          {/* Script list */}
          <ul
            ref={listRef}
            data-reveal
            aria-label="Scripts"
            className="no-scrollbar -mx-4 mt-8 flex snap-x gap-3 overflow-x-auto px-4 xl:mx-0 xl:mt-[clamp(0.75rem,2svh,1.25rem)] xl:min-h-0 xl:flex-1 xl:flex-col xl:gap-0 xl:overflow-x-visible xl:overflow-y-auto xl:px-0 xl:[mask-image:linear-gradient(#000_88%,transparent)]"
            data-lenis-prevent
          >
            {list.map((s, i) => {
              const on = s.id === activeId;
              const hasReel = reels.some((r) => r.script === s.id);
              return (
                <li key={s.id} data-script={s.id} className="shrink-0 snap-start xl:border-b xl:border-paper/10">
                  <button
                    type="button"
                    onClick={() => select(s.id)}
                    aria-current={on}
                    className={cn(
                      "group relative flex w-[15.5rem] flex-col gap-2 rounded-2xl p-4 text-left transition-colors duration-500 xl:w-full xl:rounded-none xl:px-2 xl:py-4",
                      on ? "bg-paper/[0.08] xl:bg-transparent" : "bg-paper/[0.03] hover:bg-paper/[0.06] xl:bg-transparent",
                    )}
                  >
                    <span className="kicker flex items-center gap-3 text-mist">
                      <span className={on ? "text-gold" : ""}>{pad(i + 1)}</span>
                      <span>
                        {brands[s.brand].name} · {s.lang}
                      </span>
                      {hasReel && <span className="rounded-full bg-wine px-1.5 py-0.5 !text-[0.52rem] text-paper">Reel</span>}
                      {on && (
                        <span className="ml-auto flex h-3 items-end gap-[2px]" aria-hidden>
                          {[0, 1, 2].map((b) => (
                            <span
                              key={b}
                              className="w-[3px] origin-bottom rounded-sm bg-gold"
                              style={{ height: "100%", animation: running ? `eq ${0.7 + b * 0.18}s ease-in-out infinite` : "none" }}
                            />
                          ))}
                        </span>
                      )}
                    </span>
                    <span
                      className={cn(
                        "font-serif text-[1.45rem] leading-[1.05] transition-transform duration-500 ease-expo xl:group-hover:translate-x-1.5",
                        on ? "text-paper" : "text-paper/70",
                      )}
                    >
                      {s.title}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

          {/* Phone */}
          <div className="relative flex flex-col items-center">
            {/* soft, static stage light behind the phone */}
            <div
              className="pointer-events-none absolute left-1/2 top-[42%] aspect-square w-[160%] max-w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(142_45_61/0.45),rgb(194_154_82/0.08)_60%,transparent)]"
              aria-hidden
            />

            <div
              className="phone"
              tabIndex={0}
              role="region"
              aria-roledescription="reel player"
              aria-label={`${active.title} — beat ${beat + 1} of ${active.beats.length}. Use arrow keys to skip, space to pause.`}
              onKeyDown={onPhoneKey}
              data-cursor="Tap"
            >
              <div className="phone__screen">
                <div className={cn("reel-bg", `reel-bg--${active.brand}`)} aria-hidden>
                  <div className="reel-bg__layer" />
                  <div className="reel-bg__pattern" />
                </div>
                <span className="phone__island" aria-hidden />

                <div className="absolute inset-x-0 top-0 z-[5] px-3.5 pt-11">
                  <div className="segments" aria-hidden>
                    {active.beats.map((_, i) => (
                      <span key={`${active.id}-${i}`}>
                        <i
                          ref={(el) => {
                            segs.current[i] = el;
                          }}
                          style={{ transform: `scaleX(${i < beat ? 1 : 0})` }}
                        />
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-2.5 text-[0.82rem]">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-paper font-mono text-[0.7rem] font-bold text-ink ring-2 ring-gold/80">
                      {brand.initials}
                    </span>
                    <span className="font-semibold">{brand.name}</span>
                    <span className="opacity-60">· {active.format}</span>
                  </div>
                </div>

                <span className="kicker absolute left-4 top-[7.4rem] z-[5] rounded-full bg-black/35 px-2.5 py-1 !text-[0.6rem] backdrop-blur-sm">
                  {current.tag}
                  {current.time ? ` · ${current.time}` : ""}
                </span>

                {current.onScreen && (
                  <div key={`os-${activeId}-${beat}`} ref={sticker} className="sticker">
                    {current.onScreen}
                  </div>
                )}

                <p
                  key={`vo-${activeId}-${beat}`}
                  ref={caption}
                  className={cn("caption z-[4]", current.onScreen ? "caption--sub" : "caption--big")}
                >
                  {words.map((w, i) => (
                    <span key={i}>{w} </span>
                  ))}
                </p>

                <div className="absolute bottom-24 right-3 z-[5] flex flex-col items-center gap-5 opacity-90" aria-hidden>
                  <Heart size={24} />
                  <Bubble size={23} />
                  <Send size={22} />
                </div>

                <div className="absolute inset-x-4 bottom-5 z-[5] flex items-center gap-2 text-[0.75rem] opacity-80">
                  <Music size={14} />
                  <span className="truncate">Script · S. Thasneem · {active.lang}</span>
                </div>

                <button type="button" aria-label="Previous beat" onClick={prev} className="absolute inset-y-0 left-0 z-[6] w-[35%]" />
                <button type="button" aria-label="Next beat" onClick={next} className="absolute inset-y-0 right-0 z-[6] w-[65%]" />
              </div>
            </div>

            <div className="relative mt-8 flex items-center gap-3 xl:mt-[clamp(0.9rem,2.4svh,2rem)]">
              <button type="button" onClick={prev} aria-label="Previous beat" className="grid h-11 w-11 place-items-center rounded-full bg-paper/10 transition-colors hover:bg-paper/20">
                <ChevronLeft />
              </button>
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                aria-label={playing ? "Pause reel" : "Play reel"}
                className="grid h-14 w-14 place-items-center rounded-full bg-paper text-ink transition-transform duration-500 ease-expo hover:scale-105"
              >
                {playing ? <Pause /> : <Play />}
              </button>
              <button type="button" onClick={next} aria-label="Next beat" className="grid h-11 w-11 place-items-center rounded-full bg-paper/10 transition-colors hover:bg-paper/20">
                <ChevronRight />
              </button>
              <span className="kicker ml-2 w-16 text-mist" aria-live="polite">
                {pad(beat + 1)} / {pad(active.beats.length)}
              </span>
            </div>
          </div>

          {/* Script page */}
          <article aria-label={`Full script: ${active.title}`} className="script-page mx-auto w-full max-w-[560px] xl:max-w-none">
            <header className="border-b border-ink/10 px-5 pb-4 pl-[3.3rem] pt-5">
              <div className="kicker flex items-center justify-between text-muted">
                <span>{brand.name}</span>
                <span>{active.lang}</span>
              </div>
              <h3 className="mt-3 font-mono text-[1.15rem] font-bold uppercase leading-snug tracking-wide">{active.title}</h3>
              <p className="kicker mt-1.5 text-wine">
                {active.format} · Written by S. Thasneem
              </p>
              {activeReel && (
                <button
                  type="button"
                  onClick={() => watchReel(activeReel.id)}
                  className="kicker mt-3 inline-flex items-center gap-2 rounded-full bg-wine py-1.5 pl-2 pr-3 !text-[0.6rem] text-paper transition-colors hover:bg-ink"
                >
                  <Play size={12} /> Watch the final reel
                </button>
              )}
            </header>
            <div ref={pageBody} data-lenis-prevent className="relative max-h-[420px] overflow-y-auto px-2 py-3 xl:max-h-[clamp(15rem,calc(100svh-26rem),34rem)]">
              {active.beats.map((b, i) => (
                <button
                  key={`${active.id}-${i}`}
                  type="button"
                  data-beat={i}
                  onClick={() => goBeat(i)}
                  className={cn("beat", i === beat && "is-active")}
                >
                  <span className="block font-bold uppercase tracking-wide">
                    {b.tag}
                    {b.time ? ` (${b.time})` : ""}
                  </span>
                  <span className="mt-1 block text-muted">VO</span>
                  <span className="block pl-4">“{b.vo}”</span>
                  {b.onScreen && (
                    <>
                      <span className="mt-1 block text-muted">ON-SCREEN</span>
                      <span className="block pl-4 font-bold text-wine">{b.onScreen}</span>
                    </>
                  )}
                </button>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
