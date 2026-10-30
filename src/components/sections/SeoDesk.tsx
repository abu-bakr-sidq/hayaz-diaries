"use client";

import { useEffect, useRef, useState } from "react";
import { capabilities, skills } from "@/content/seo";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { BrandMark } from "@/components/ui/BrandMark";
import { SectionHead } from "@/components/ui/SectionHead";
import { Search } from "@/components/ui/Icons";

export default function SeoDesk() {
  const section = useRef<HTMLElement>(null);
  const rank = useRef<HTMLSpanElement>(null);

  // "#48 → #1" — the badge climbs the rankings as the section scrolls in.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const el = rank.current;
        if (!el) return;
        const state = { v: 48 };
        el.textContent = "#48";
        gsap.to(state, {
          v: 1,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top 90%", end: "top 35%", scrub: 0.6 },
          onUpdate: () => {
            el.textContent = `#${Math.round(state.v)}`;
          },
        });
      });
    },
    { scope: section },
  );

  return (
    <section ref={section} id="seo-desk" data-theme="light" aria-labelledby="seo-title" className="spread relative bg-paper-2">
      <div className="shell">
        <SectionHead no="05" label="The SEO Desk" page="08" />

        <div className="mt-12 grid grid-cols-12 items-end gap-x-6 gap-y-6 lg:mt-[clamp(1.25rem,3.5svh,2.5rem)]">
          <h2 id="seo-title" className="display col-span-12 text-[clamp(3.4rem,min(9vw,10.4svh),8.4rem)] lg:col-span-8" data-reveal>
            Words that{" "}
            <span className="relative inline-block">
              <em className="text-wine">rank</em>
              <span
                ref={rank}
                className="kicker absolute -right-[1.6em] -top-[0.2em] grid h-[2.9em] w-[2.9em] rotate-12 place-items-center rounded-full bg-ink !text-[clamp(0.7rem,1.2vw,1rem)] !tracking-normal text-paper"
                aria-hidden
              >
                #1
              </span>
            </span>
            .
          </h2>
          <p data-reveal className="col-span-12 max-w-[42ch] text-[1.02rem] leading-relaxed text-muted lg:col-span-4">
            Turning search data into growth. The quieter half of the job: making sure the right people actually find the words.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-12 gap-x-6 gap-y-14 md:mt-20 lg:mt-[clamp(1.5rem,4.5svh,3rem)]">
          <div data-reveal className="col-span-12 lg:col-span-7">
            <Serp />
          </div>
          <div className="col-span-12 lg:col-span-5 lg:pl-6">
            <p data-reveal className="kicker flex items-center justify-between border-b border-ink/15 pb-3 text-muted">
              <span>Core skills — the index</span>
              <span>09</span>
            </p>
            <ol className="lg:grid lg:grid-cols-2 lg:gap-x-7">
              {skills.map((s, i) => (
                <li key={s.title} data-reveal className="group grid grid-cols-[2.4rem_1fr] gap-x-3 border-b border-ink/15 py-4 lg:grid-cols-[1.7rem_1fr] lg:gap-x-2 lg:py-[clamp(0.55rem,1.5svh,0.95rem)]">
                  <span className="kicker pt-2 text-wine">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="display text-[clamp(1.6rem,min(2.2vw,3.4svh),1.85rem)] leading-none transition-transform duration-500 ease-expo group-hover:translate-x-1.5 group-hover:italic">
                      {s.title}
                    </h3>
                    <p className="mt-1.5 text-[0.9rem] leading-snug text-muted lg:text-[0.84rem]">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

/** A search page for her own services: each typed query lights up the matching result. */
function Serp() {
  const box = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [typed, setTyped] = useState(capabilities[0].query);
  const [auto, setAuto] = useState(true);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!auto || !inView) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let timer = 0;
    let i = active;
    let chars = 0;

    const typeNext = () => {
      const q = capabilities[i].query;
      chars += 1;
      setTyped(q.slice(0, chars));
      if (chars < q.length) {
        timer = window.setTimeout(typeNext, 34 + Math.random() * 46);
        return;
      }
      setActive(i);
      timer = window.setTimeout(erase, 2600);
    };
    const erase = () => {
      chars -= 2;
      if (chars > 0) {
        setTyped(capabilities[i].query.slice(0, chars));
        timer = window.setTimeout(erase, 16);
        return;
      }
      chars = 0;
      setTyped("");
      i = (i + 1) % capabilities.length;
      timer = window.setTimeout(typeNext, 300);
    };
    const step = () => {
      i = (i + 1) % capabilities.length;
      setTyped(capabilities[i].query);
      setActive(i);
      timer = window.setTimeout(step, 3800);
    };

    if (reduce) timer = window.setTimeout(step, 3800);
    else timer = window.setTimeout(erase, 1800);
    return () => window.clearTimeout(timer);
    // `active` is read once to resume from the current result.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, inView]);

  const focus = (i: number) => {
    setAuto(false);
    setActive(i);
    setTyped(capabilities[i].query);
  };

  return (
    <div
      ref={box}
      onPointerLeave={() => setAuto(true)}
      className="overflow-hidden rounded-[26px] bg-paper shadow-[0_40px_80px_-50px_rgb(20_17_15/0.55)] ring-1 ring-ink/10"
    >
      <div className="flex items-center gap-3 border-b border-ink/10 px-5 py-4 sm:px-6">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-wine/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-gold/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink/20" />
        </span>
        <div className="flex min-w-0 flex-1 items-center gap-3 rounded-full bg-paper-2 px-4 py-2.5">
          <Search size={17} className="shrink-0 text-muted" />
          <span className="truncate font-mono text-[0.92rem]" aria-live="polite">
            {typed}
            <span className="caret" aria-hidden />
          </span>
        </div>
      </div>

      <div className="px-3 pb-4 pt-3 sm:px-4">
        <p className="kicker px-3 py-2 text-muted">About 4 results (0.42 seconds)</p>
        <ol>
          {capabilities.map((c, i) => (
            <li key={c.slug}>
              <button
                type="button"
                onPointerEnter={() => focus(i)}
                onFocus={() => focus(i)}
                onClick={() => focus(i)}
                className={cn("serp-result block w-full text-left", i === active ? "is-active" : "is-dim")}
              >
                {/* on desktop the other results fold down to their titles */}
                <span className="serp-site">
                  <span>
                    <span className="flex items-center gap-2.5 pb-2.5 text-[0.8rem]">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-paper-2 ring-1 ring-ink/10">
                        <BrandMark className="h-5 w-auto" />
                      </span>
                      <span className="leading-tight">
                        <span className="block font-medium">Hayaz Diaries</span>
                        <span className="block text-muted">hayazdiaries › seo › {c.slug}</span>
                      </span>
                    </span>
                  </span>
                </span>
                <span className="block font-serif text-[clamp(1.4rem,min(2.1vw,3.2svh),1.8rem)] leading-tight text-wine">
                  {c.title} — {c.kicker}
                </span>
                {/* only the result for the typed query opens up */}
                <span className="serp-more">
                  <span>
                    <span className="mt-1.5 block max-w-[60ch] text-[0.93rem] leading-relaxed text-muted">{c.body}</span>
                    <span className="mt-3 flex flex-wrap gap-2">
                      {c.focus.map((f) => (
                        <span key={f} className={cn("rounded-full px-3 py-1 text-[0.78rem] transition-colors duration-500", i === active ? "bg-ink text-paper" : "bg-ink/[0.06]")}>
                          {f}
                        </span>
                      ))}
                    </span>
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
