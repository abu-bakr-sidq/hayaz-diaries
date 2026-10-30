import type { CSSProperties } from "react";
import { chapters } from "@/content/sections";
import { ArrowUpRight } from "@/components/ui/Icons";

export default function Contents() {
  return (
    // Extra room at the bottom: the hook tapes from the Ticker overlap it.
    <section
      id="contents"
      data-theme="dark"
      aria-labelledby="contents-title"
      className="spread relative bg-ink pb-44 text-paper md:pb-52 lg:pb-[clamp(8.5rem,17svh,11rem)]"
    >
      <div className="shell">
        <div className="kicker flex items-center gap-4 text-mist" data-reveal>
          <span className="text-gold">Contents</span>
          <span className="h-px flex-1 bg-current opacity-20" />
          <span>p. 02</span>
        </div>

        <div className="mt-10 grid grid-cols-12 items-end gap-x-6 gap-y-8 lg:mt-[clamp(1.25rem,3.5svh,2.5rem)]">
          <h2 id="contents-title" data-split className="display col-span-12 text-[clamp(3.6rem,min(11vw,12.5svh),10rem)] md:col-span-7">
            In this <em className="text-gold">issue</em>
          </h2>
          <p data-reveal className="col-span-12 max-w-[40ch] text-[1.05rem] leading-relaxed text-mist md:col-span-5 md:justify-self-end">
            A content writer’s portfolio, laid out like a magazine — hooks that play like reels, the reels themselves, carousels you can
            swipe, the search data behind it all, and a peek inside her bag.
          </p>
        </div>

        <ol
          className="toc mt-14 border-t border-paper/15 md:mt-20 lg:mt-[clamp(1.75rem,5svh,3.5rem)]"
          style={{ "--rows": Math.ceil(chapters.length / 2) } as CSSProperties}
        >
          {chapters.map((c) => (
            <li key={c.id} data-reveal>
              <a href={`#${c.id}`} data-cursor="Read" className="toc-row">
                <span className="kicker text-gold">{c.no}</span>
                <span className="toc-row__title display text-[clamp(2rem,4.6vw,4.4rem)] lg:text-[clamp(2.2rem,min(3.4vw,5.4svh),3.6rem)]">
                  {c.title}
                </span>
                <span className="hidden text-[0.98rem] text-mist md:block">{c.teaser}</span>
                <span className="flex items-center justify-end gap-3">
                  <span className="kicker whitespace-nowrap text-mist">p. {c.page}</span>
                  <ArrowUpRight size={20} className="toc-row__arrow hidden rotate-45 sm:block" />
                </span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
