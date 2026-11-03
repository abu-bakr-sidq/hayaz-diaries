"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { FRAME_W, frameH, sites, type Site } from "@/content/sites";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { useMedia } from "@/lib/use-media";
import { SectionHead } from "@/components/ui/SectionHead";
import { BrandMark } from "@/components/ui/BrandMark";
import { ArrowUpRight, Bubble } from "@/components/ui/Icons";

type Cam = { x: number; y: number; s: number };

const frames = sites.map((s) => ({ ...s.at, w: FRAME_W, h: frameH(s) }));
const WORLD = {
  w: Math.max(...frames.map((f) => f.x + f.w)),
  h: Math.max(...frames.map((f) => f.y + f.h)),
};
const sectors = sites.map((s) => s.sector);

const crumbs = (url: string) => {
  const u = new URL(url);
  return [u.host, ...u.pathname.split("/").filter(Boolean)].join(" › ");
};
/** Cut like a results page does: at a word, with an ellipsis. */
const clip = (text: string, max: number) => (text.length <= max ? text : `${text.slice(0, max).replace(/\s+\S*$/, "")} ...`);

function FrameIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" className={cn("h-2.5 w-2.5 shrink-0", className)} aria-hidden>
      <path d="M3.5 0.5v11M8.5 0.5v11M0.5 3.5h11M0.5 8.5h11" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

/** How the page shows up in search: name, breadcrumb, title, description. */
function Snippet({ site }: { site: Site }) {
  return (
    <div className="rounded-xl bg-[#fbf8f2] p-3.5 text-ink shadow-[inset_0_0_0_1px_rgb(20_17_15/0.06)]">
      <div className="flex items-center gap-2.5 text-[0.72rem]">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-paper-3 font-serif text-[0.95rem] text-wine">{site.name[0]}</span>
        <span className="min-w-0 leading-tight">
          <span className="block font-medium">{site.name}</span>
          <span className="block truncate text-muted">{crumbs(site.url)}</span>
        </span>
      </div>
      <p className="mt-2.5 font-serif text-[1.12rem] leading-[1.2] text-wine">{clip(site.title, 60)}</p>
      <p className="mt-1.5 text-[0.76rem] leading-relaxed text-muted">{clip(site.description, 158)}</p>
    </div>
  );
}

function Keywords({ site }: { site: Site }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {site.keywords.map((k) => (
        <li key={k} className="rounded-full bg-gold/15 px-2.5 py-1 text-[0.72rem] text-gold">
          {k}
        </li>
      ))}
    </ul>
  );
}

function Visit({ site, className }: { site: Site; className?: string }) {
  return (
    <a
      href={site.url}
      target="_blank"
      rel="noreferrer"
      data-cursor="Visit"
      className={cn("flex items-center justify-center gap-2 rounded-lg bg-gold px-4 py-2.5 text-[0.84rem] font-medium text-ink transition-colors hover:bg-paper", className)}
    >
      Open the live site <ArrowUpRight size={15} />
    </a>
  );
}

/**
 * Five live sites, laid out like a design file: layers on the left, frames on
 * a canvas you can pan, and an inspect panel that shows each page the way
 * Google does. While nobody's touching it, Haya's cursor walks the frames.
 */
export default function LiveSites() {
  const [active, setActive] = useState<number | null>(0);
  const [hover, setHover] = useState<number | null>(null);
  const [inView, setInView] = useState(false);
  const reduced = useMedia("(prefers-reduced-motion: reduce)");

  const viewport = useRef<HTMLDivElement>(null);
  const world = useRef<HTMLDivElement>(null);
  const labels = useRef<(HTMLSpanElement | null)[]>([]);
  const selBox = useRef<HTMLDivElement>(null);
  const hoverBox = useRef<HTMLDivElement>(null);
  const zoomText = useRef<HTMLSpanElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const cam = useRef<Cam>({ x: 0, y: 0, s: 0.2 });
  const shown = useRef({ active: active as number | null, hover: hover as number | null, reduced });
  const drag = useRef<{ x: number; y: number; cx: number; cy: number; moved: boolean; frame: number | null } | null>(null);
  // Set while someone's using the canvas; the tour waits until they've been idle a while.
  const busy = useRef(false);
  const idle = useRef(0);
  const tween = useRef<gsap.core.Tween | null>(null);
  const first = useRef(true);

  // Everything on the canvas follows the camera; overlays stay crisp in screen space.
  const apply = useCallback(() => {
    const { x, y, s } = cam.current;
    if (world.current) world.current.style.transform = `translate(${x}px, ${y}px) scale(${s})`;
    frames.forEach((f, i) => {
      const l = labels.current[i];
      if (l) l.style.transform = `translate(${x + f.x * s}px, ${y + f.y * s - 22}px)`;
    });
    const place = (el: HTMLElement | null, i: number | null) => {
      if (!el) return;
      el.style.opacity = i === null ? "0" : "1";
      if (i === null) return;
      const f = frames[i];
      el.style.transform = `translate(${x + f.x * s}px, ${y + f.y * s}px)`;
      el.style.width = `${f.w * s}px`;
      el.style.height = `${f.h * s}px`;
    };
    const { active: a, hover: h } = shown.current;
    place(selBox.current, a);
    place(hoverBox.current, h !== a ? h : null);
    if (zoomText.current) zoomText.current.textContent = `${Math.round(s * 100)}%`;
  }, []);

  const target = useCallback((i: number | null): Cam => {
    const vw = viewport.current?.clientWidth ?? 1000;
    const vh = viewport.current?.clientHeight ?? 600;
    if (i === null) {
      const s = Math.min((vw - 96) / WORLD.w, (vh - 110) / WORLD.h);
      return { s, x: (vw - WORLD.w * s) / 2, y: (vh - WORLD.h * s) / 2 + 10 };
    }
    const f = frames[i];
    const s = Math.min((vw * 0.76) / f.w, (vh * 0.7) / f.h);
    return { s, x: vw / 2 - (f.x + f.w / 2) * s, y: vh / 2 - (f.y + f.h / 2) * s + 8 };
  }, []);

  const fly = useCallback(
    (i: number | null, instant = false) => {
      if (!viewport.current?.clientWidth) return; // hidden on phones
      tween.current?.kill();
      const to = target(i);
      if (instant || shown.current.reduced) {
        Object.assign(cam.current, to);
        apply();
        return;
      }
      tween.current = gsap.to(cam.current, { ...to, duration: 1.15, ease: "expo.inOut", onUpdate: apply });
    },
    [apply, target],
  );

  const hold = () => {
    busy.current = true;
    window.clearTimeout(idle.current);
    idle.current = window.setTimeout(() => {
      busy.current = false;
    }, 9000);
  };

  const select = (i: number | null) => {
    hold();
    if (i === active) fly(i);
    else setActive(i);
  };

  // Frame the selection on load and whenever the canvas changes size.
  useLayoutEffect(() => {
    const el = viewport.current;
    if (!el) return;
    fly(shown.current.active, true);
    const ro = new ResizeObserver(() => fly(shown.current.active, true));
    ro.observe(el);
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, [fly]);

  useEffect(() => {
    shown.current.active = active;
    if (first.current) {
      first.current = false;
      return;
    }
    fly(active);
  }, [active, fly]);

  useEffect(() => {
    shown.current.hover = hover;
    apply();
  }, [hover, apply]);

  useEffect(() => {
    shown.current.reduced = reduced;
  }, [reduced]);

  // The guided tour: her cursor glides to the next frame and selects it.
  useEffect(() => {
    if (!inView || reduced) return;
    const step = () => {
      if (busy.current) return;
      const a = shown.current.active;
      const next = a === null ? 0 : (a + 1) % sites.length;
      const t = target(next);
      const f = frames[next];
      if (cursor.current) {
        gsap.to(cursor.current, {
          x: t.x + (f.x + f.w * 0.64) * t.s,
          y: t.y + (f.y + f.h * 0.6) * t.s,
          duration: 1.15,
          ease: "power3.inOut",
        });
        gsap.fromTo(cursor.current.firstElementChild, { scale: 1 }, { scale: 0.82, duration: 0.12, yoyo: true, repeat: 1, delay: 1.1 });
      }
      setActive(next);
    };
    const id = window.setInterval(step, 4800);
    return () => window.clearInterval(id);
  }, [inView, reduced, target]);

  // Park the cursor on the first frame to begin with.
  useLayoutEffect(() => {
    const t = target(0);
    const f = frames[0];
    if (cursor.current) gsap.set(cursor.current, { x: t.x + (f.x + f.w * 0.64) * t.s, y: t.y + (f.y + f.h * 0.6) * t.s });
  }, [target]);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button, a")) return;
    hold();
    const frame = (e.target as HTMLElement).closest<HTMLElement>("[data-frame]");
    drag.current = { x: e.clientX, y: e.clientY, cx: cam.current.x, cy: cam.current.y, moved: false, frame: frame ? Number(frame.dataset.frame) : null };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (!d.moved && Math.hypot(dx, dy) < 5) return;
    if (!d.moved) tween.current?.kill();
    d.moved = true;
    cam.current.x = d.cx + dx;
    cam.current.y = d.cy + dy;
    apply();
  };
  const onPointerUp = () => {
    const d = drag.current;
    drag.current = null;
    if (d && !d.moved) select(d.frame);
  };

  const zoom = (factor: number) => {
    hold();
    const vw = viewport.current?.clientWidth ?? 1000;
    const vh = viewport.current?.clientHeight ?? 600;
    const { x, y, s } = cam.current;
    const ns = Math.min(1.4, Math.max(0.06, s * factor));
    const k = ns / s;
    tween.current?.kill();
    tween.current = gsap.to(cam.current, { s: ns, x: vw / 2 - (vw / 2 - x) * k, y: vh / 2 - (vh / 2 - y) * k, duration: 0.5, ease: "power3.out", onUpdate: apply });
  };

  const onKey = (e: KeyboardEvent) => {
    const a = active ?? -1;
    if (e.key === "ArrowRight") select((a + 1) % sites.length);
    else if (e.key === "ArrowLeft") select((a - 1 + sites.length) % sites.length);
    else if (e.key === "Escape" || e.key === "0") select(null);
    else return;
    e.preventDefault();
  };

  const site = active === null ? null : sites[active];

  return (
    <section id="live-sites" data-theme="light" aria-labelledby="sites-title" className="spread relative overflow-hidden bg-paper lg:h-svh lg:min-h-[660px]">
      <div className="shell lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">
        <SectionHead no="06" label="Live Sites" page="09" />

        <div className="mt-12 grid grid-cols-12 items-end gap-x-6 gap-y-5 lg:mt-[clamp(1rem,3svh,2.25rem)]">
          <h2 id="sites-title" data-split className="display col-span-12 text-[clamp(3rem,min(6.8vw,9svh),6.4rem)] lg:col-span-7">
            Live sites, <em className="text-wine">inspected.</em>
          </h2>
          <p data-reveal className="col-span-12 max-w-[44ch] text-[1.02rem] leading-relaxed text-muted lg:col-span-5 lg:justify-self-end lg:pb-2">
            Five live sites from her SEO desk, opened up like a design file. Pick a frame to see how it shows up on Google — or let her
            cursor give you the tour.
          </p>
        </div>

        {/* Desktop: the design file */}
        <div data-reveal className="figma mt-[clamp(1rem,3svh,2rem)] hidden min-h-0 flex-1 lg:grid">
          <div className="figma__bar" aria-hidden>
            <div className="flex items-center gap-1">
              <span className="figma__tool">
                <BrandMark className="h-5 w-auto" />
              </span>
              <span className="figma__tool is-on">
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5">
                  <path d="M3 2l9.5 5.2-4.1 1 2.3 4.6-1.6.8-2.3-4.6L3 12Z" fill="currentColor" />
                </svg>
              </span>
              <span className="figma__tool">
                <FrameIcon className="!h-3.5 !w-3.5" />
              </span>
              <span className="figma__tool font-serif text-[1rem]">T</span>
              <span className="figma__tool">
                <Bubble size={15} />
              </span>
            </div>
            <p className="mx-auto truncate text-[0.78rem] text-mist">
              Drafts / <span className="text-paper">Live sites</span>
            </p>
            <div className="flex items-center gap-2.5">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-wine text-[0.72rem] text-paper ring-2 ring-[#1d1916]">H</span>
              <span className="rounded-md bg-ink-3 px-2 py-1 text-[0.72rem] text-mist">{sites.length} frames</span>
            </div>
          </div>

          <div className="figma__body">
            {/* Layers */}
            <nav aria-label="Sites" className="figma__panel hidden xl:flex">
              <p className="figma__heading">Layers</p>
              <p className="px-3 pb-2 text-[0.72rem] text-mist">▾ Page 1 — Live sites</p>
              <ul>
                {sites.map((s, i) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => select(i)}
                      onPointerEnter={() => setHover(i)}
                      onPointerLeave={() => setHover(null)}
                      aria-pressed={active === i}
                      className={cn("figma__layer", active === i && "is-on")}
                    >
                      <FrameIcon />
                      <span className="truncate">{s.name}</span>
                      {s.note && <span className="ml-auto shrink-0 rounded bg-wine/60 px-1.5 text-[0.6rem] text-paper">{s.note}</span>}
                    </button>
                  </li>
                ))}
              </ul>
              <p className="mt-auto border-t border-paper/[0.08] px-3 py-3 text-[0.7rem] leading-relaxed text-mist">
                Drag to pan · ← → to switch · Esc for all
              </p>
            </nav>

            {/* Canvas */}
            <div
              ref={viewport}
              role="region"
              aria-label="Canvas of live sites — use the arrow keys to move between frames"
              tabIndex={0}
              onKeyDown={onKey}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              className="figma__canvas"
            >
              <div ref={world} className="figma__world" style={{ width: WORLD.w, height: WORLD.h }}>
                {sites.map((s, i) => (
                  <div
                    key={s.id}
                    data-frame={i}
                    onPointerEnter={() => setHover(i)}
                    onPointerLeave={() => setHover(null)}
                    className="figma__frame"
                    style={{ left: frames[i].x, top: frames[i].y, width: frames[i].w, height: frames[i].h }}
                  >
                    <Image src={s.image} alt={`${s.name} — home page`} fill sizes="(min-width: 1024px) 60vw, 90vw" className="pointer-events-none object-cover object-top" draggable={false} />
                  </div>
                ))}
              </div>

              {sites.map((s, i) => (
                <span
                  key={s.id}
                  ref={(el) => {
                    labels.current[i] = el;
                  }}
                  className={cn("figma__label", active === i && "is-on")}
                  aria-hidden
                >
                  <FrameIcon />
                  {s.name}
                  {s.place ? <span className="opacity-60"> — {s.place}</span> : null}
                </span>
              ))}

              <div ref={hoverBox} className="figma__hover" aria-hidden />
              <div ref={selBox} className="figma__select" aria-hidden>
                <i className="-left-1 -top-1" />
                <i className="-right-1 -top-1" />
                <i className="-bottom-1 -left-1" />
                <i className="-bottom-1 -right-1" />
                {site && (
                  <span className="figma__size">
                    {FRAME_W} × {frameH(site)}
                  </span>
                )}
              </div>

              {!reduced && (
                <div ref={cursor} className="figma__cursor" aria-hidden>
                  <svg viewBox="0 0 16 18" className="h-[18px] w-4 drop-shadow-[0_2px_3px_rgb(0_0_0/0.4)]">
                    <path d="M1 1l13 7.5-5.6 1.4L6.2 16Z" fill="#8e2d3d" stroke="#f3ede3" strokeWidth="1.2" strokeLinejoin="round" />
                  </svg>
                  <span className="ml-3 mt-0.5 rounded-full rounded-tl-sm bg-wine px-2 py-0.5 text-[0.7rem] font-medium text-paper">Haya</span>
                </div>
              )}

              <div className="absolute bottom-3 right-3 flex items-center gap-0.5 rounded-lg bg-[#1d1916] p-1 text-[0.72rem] text-mist shadow-[0_0_0_1px_rgb(243_237_227/0.08)]">
                <button type="button" onClick={() => zoom(1 / 1.35)} aria-label="Zoom out" className="figma__zoom">
                  −
                </button>
                <span ref={zoomText} className="w-11 text-center tabular-nums">
                  20%
                </span>
                <button type="button" onClick={() => zoom(1.35)} aria-label="Zoom in" className="figma__zoom">
                  +
                </button>
                <button type="button" onClick={() => select(null)} className="figma__zoom px-2">
                  Fit all
                </button>
              </div>
            </div>

            {/* Inspect */}
            <aside aria-live="polite" className="figma__panel figma__panel--right flex !overflow-hidden">
              <div className="flex gap-4 border-b border-paper/[0.08] px-4 py-3 text-[0.74rem]">
                <span className="text-mist">Design</span>
                <span className="text-paper">Inspect</span>
              </div>
              {site ? (
                <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4" data-lenis-prevent>
                  <div>
                    <p className="flex items-center justify-between text-[0.7rem] uppercase tracking-[0.14em] text-mist">
                      Frame
                      {site.note && <span className="rounded bg-wine px-1.5 py-0.5 normal-case tracking-normal text-paper">{site.note}</span>}
                    </p>
                    <p className="mt-1.5 font-serif text-[1.45rem] leading-tight">{site.name}</p>
                    <div className="mt-3 grid grid-cols-4 gap-1.5 font-mono text-[0.7rem]">
                      {(
                        [
                          ["X", site.at.x],
                          ["Y", site.at.y],
                          ["W", FRAME_W],
                          ["H", frameH(site)],
                        ] as const
                      ).map(([k, v]) => (
                        <span key={k} className="rounded bg-ink-3 px-1.5 py-1 text-paper/85">
                          <span className="text-mist">{k}</span> {v}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="figma__heading !p-0 !pb-2">Search appearance</p>
                    <Snippet site={site} />
                  </div>
                  <div>
                    <p className="figma__heading !p-0 !pb-2">Written around</p>
                    <Keywords site={site} />
                  </div>
                  <dl className="grid grid-cols-[5.5rem_1fr] gap-y-1.5 text-[0.78rem]">
                    <dt className="text-mist">Sector</dt>
                    <dd>{site.sector}</dd>
                    {site.place && (
                      <>
                        <dt className="text-mist">Location</dt>
                        <dd>{site.place}</dd>
                      </>
                    )}
                  </dl>
                </div>
              ) : (
                <div className="space-y-4 p-4">
                  <p className="text-[0.7rem] uppercase tracking-[0.14em] text-mist">Page</p>
                  <p className="font-serif text-[1.45rem] leading-tight">Live sites</p>
                  <p className="text-[0.8rem] leading-relaxed text-mist">
                    {sites.length} frames. Click one to inspect it, or let her cursor show you around.
                  </p>
                  <ul className="flex flex-wrap gap-1.5">
                    {sectors.map((s) => (
                      <li key={s} className="rounded-full bg-paper/[0.07] px-2.5 py-1 text-[0.72rem] text-paper/85">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {site && (
                <div className="border-t border-paper/[0.08] p-3">
                  <Visit site={site} />
                </div>
              )}
            </aside>
          </div>
        </div>

        {/* Phones and tablets: swipe through the frames */}
        <ul data-reveal className="no-scrollbar -mx-4 mt-10 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:-mx-[4vw] sm:px-[4vw] lg:hidden">
          {sites.map((s) => (
            <li key={s.id} className="w-[84vw] max-w-[420px] shrink-0 snap-center rounded-2xl bg-ink p-3 text-paper">
              <p className="flex items-center gap-1.5 px-1 pb-2 text-[0.72rem] text-mist">
                <FrameIcon />
                {s.name}
                {s.note && <span className="ml-auto rounded bg-wine px-1.5 text-[0.62rem] text-paper">{s.note}</span>}
              </p>
              <div className="relative aspect-[16/9] overflow-hidden rounded-sm ring-[1.5px] ring-gold">
                <Image src={s.image} alt={`${s.name} — home page`} fill sizes="84vw" className="object-cover object-top" />
              </div>
              <div className="mt-3 space-y-3">
                <Snippet site={s} />
                <Keywords site={s} />
                <Visit site={s} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
