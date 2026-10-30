"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { useLenis } from "lenis/react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { chapters, folios, type Folio } from "@/content/sections";
import { profile } from "@/content/profile";
import { cn } from "@/lib/cn";

export default function Header() {
  const header = useRef<HTMLElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const openRef = useRef(false);
  const [folio, setFolio] = useState<Folio>(folios[0]);
  const [tone, setTone] = useState<"light" | "dark">("light");
  const [open, setOpen] = useState(false);

  const lenis = useLenis(({ scroll, direction, progress }) => {
    if (bar.current) bar.current.style.transform = `scaleX(${progress})`;
    const el = header.current;
    if (!el || direction === 0) return;
    el.dataset.hidden = String(direction === 1 && scroll > 480 && !openRef.current);
  });

  useEffect(() => {
    openRef.current = open;
    if (open && header.current) header.current.dataset.hidden = "false";
  }, [open]);

  // Track which "page" we're on and whether the header sits on a dark spread.
  useEffect(() => {
    const triggers: ScrollTrigger[] = [];
    document.querySelectorAll<HTMLElement>("main > section[data-theme], body footer[data-theme]").forEach((section) => {
      triggers.push(
        ScrollTrigger.create({
          trigger: section,
          start: "top 40px",
          end: "bottom 40px",
          onToggle: (self) => {
            if (!self.isActive) return;
            const theme = section.dataset.theme;
            setTone(theme === "dark" || theme === "wine" ? "dark" : "light");
          },
        }),
      );
    });
    folios.forEach((f) => {
      const el = document.getElementById(f.id);
      if (!el) return;
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: "top 45%",
          end: "bottom 45%",
          onToggle: (self) => {
            if (self.isActive) setFolio(f);
          },
        }),
      );
    });
    return () => triggers.forEach((t) => t.kill());
  }, []);

  const jump = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    lenis?.scrollTo(`#${id}`, { duration: 1.6 });
  };

  return (
    <>
      <a
        href="#main"
        className="kicker fixed left-4 top-4 z-[130] -translate-y-24 rounded-full bg-ink px-4 py-3 text-paper focus:translate-y-0"
      >
        Skip to content
      </a>
      <header ref={header} data-tone={open ? "dark" : tone} className="site-header">
        <div className="shell flex items-center justify-between gap-3 pt-3 sm:pt-4">
          <a href="#cover" onClick={(e) => jump(e, "cover")} className="cap !pl-1.5" aria-label="Hayaz Diaries — back to cover">
            <span className="display grid h-8 w-8 place-items-center rounded-full bg-wine pb-0.5 text-[1.35rem] text-paper">h</span>
            <span className="hidden font-serif text-[1.15rem] tracking-tight xs:inline">Hayaz Diaries</span>
          </a>

          <div className="cap kicker hidden !h-9 !text-[0.68rem] md:inline-flex" aria-live="polite">
            <span className="opacity-60">p. {folio.page}</span>
            <span className="h-3 w-px bg-current opacity-30" />
            <span>{folio.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <a href="#write-to-me" onClick={(e) => jump(e, "write-to-me")} className="cap cap--accent hidden sm:inline-flex">
              Let’s talk
            </a>
            <button
              type="button"
              data-menu-button
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="cap gap-3"
            >
              <span className="kicker !tracking-[0.2em]">{open ? "Close" : "Index"}</span>
              <span className="relative block h-2.5 w-5" aria-hidden>
                <span className={cn("absolute left-0 top-0 h-px w-full bg-current transition-transform duration-500 ease-expo", open && "translate-y-[5px] rotate-45")} />
                <span className={cn("absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-500 ease-expo", open && "-translate-y-[4px] -rotate-45")} />
              </span>
            </button>
          </div>
        </div>
        <span ref={bar} className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-wine" aria-hidden />
      </header>
      <Menu open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function Menu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  const lenis = useLenis();

  useEffect(() => {
    if (!open || !lenis) return;
    lenis.stop();
    return () => lenis.start();
  }, [open, lenis]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useGSAP(
    () => {
      if (first.current) {
        first.current = false;
        return;
      }
      const el = root.current!;
      const btn = document.querySelector("[data-menu-button]")?.getBoundingClientRect();
      const cx = btn ? btn.left + btn.width / 2 : window.innerWidth - 48;
      const cy = btn ? btn.top + btn.height / 2 : 36;
      const r = Math.hypot(Math.max(cx, window.innerWidth - cx), Math.max(cy, window.innerHeight - cy));

      if (open) {
        gsap.set(el, { autoAlpha: 1 });
        gsap.fromTo(
          el,
          { clipPath: `circle(0px at ${cx}px ${cy}px)` },
          { clipPath: `circle(${r}px at ${cx}px ${cy}px)`, duration: 0.95, ease: "expo.inOut" },
        );
        gsap.fromTo(
          el.querySelectorAll("[data-menu-item]"),
          { yPercent: 120 },
          { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.045, delay: 0.32 },
        );
        gsap.fromTo(el.querySelectorAll("[data-menu-fade]"), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.06, delay: 0.55 });
      } else {
        gsap.to(el, {
          clipPath: `circle(0px at ${cx}px ${cy}px)`,
          duration: 0.75,
          ease: "expo.inOut",
          onComplete: () => {
            gsap.set(el, { autoAlpha: 0 });
          },
        });
      }
    },
    { dependencies: [open], scope: root },
  );

  const go = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    onClose();
    window.setTimeout(() => lenis?.scrollTo(`#${id}`, { duration: 1.6 }), 450);
  };

  return (
    <div
      ref={root}
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Index"
      aria-hidden={!open}
      data-theme="dark"
      className="invisible fixed inset-0 z-[78] bg-ink text-paper opacity-0"
    >
      <div data-lenis-prevent className="shell flex h-full flex-col overflow-y-auto pb-8 pt-24">
        <div className="grid flex-1 grid-cols-12 gap-x-6 gap-y-10">
          <nav aria-label="Chapters" className="col-span-12 lg:col-span-8">
            <p data-menu-fade className="kicker mb-4 text-mist">In this issue</p>
            <ol>
              {chapters.map((c) => (
                <li key={c.id} className="overflow-hidden border-b border-paper/10">
                  <a
                    data-menu-item
                    href={`#${c.id}`}
                    tabIndex={open ? 0 : -1}
                    onClick={(e) => go(e, c.id)}
                    className="group flex items-baseline gap-4 py-2 md:py-2.5"
                  >
                    <span className="kicker w-9 shrink-0 text-gold">{c.no}</span>
                    <span className="display text-[clamp(2.1rem,min(5.2vw,6.2svh),4.2rem)] transition-transform duration-700 ease-expo group-hover:translate-x-3 group-hover:italic">
                      {c.title}
                    </span>
                    <span className="kicker ml-auto shrink-0 text-mist">p. {c.page}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <aside className="col-span-12 flex flex-col justify-end gap-8 lg:col-span-4">
            <div data-menu-fade>
              <p className="kicker text-mist">Write to me</p>
              <a href={`mailto:${profile.email}`} tabIndex={open ? 0 : -1} className="ink-link mt-2 inline-block font-serif text-2xl">
                {profile.email}
              </a>
            </div>
            <div data-menu-fade className="flex flex-wrap gap-2">
              {[
                ["Instagram", profile.instagram.url],
                ["YouTube", profile.youtube.url],
                ["WhatsApp", profile.whatsapp],
              ].map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  tabIndex={open ? 0 : -1}
                  className="btn btn--line !h-11 !px-5 text-sm"
                >
                  {label}
                </a>
              ))}
            </div>
            <p data-menu-fade className="hand text-3xl text-gold">
              {profile.bio}
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}
