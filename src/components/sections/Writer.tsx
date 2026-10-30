import Image from "next/image";
import igShot from "@/assets/images/work/hayaz-ig.webp";
import { profile } from "@/content/profile";
import { SectionHead } from "@/components/ui/SectionHead";
import { PressPass } from "./PressPass";

const stats = [
  { value: 10.5, decimals: 1, suffix: "K", label: `readers on ${profile.handle}` },
  { value: 40, decimals: 0, suffix: "+", label: "reel & ad scripts written" },
  { value: 2, decimals: 0, suffix: "+ yrs", label: "of SEO at Codux Digital" },
  { value: 2, decimals: 0, suffix: "", label: "languages I write in — three, if you count Tanglish" },
];

export default function Writer() {
  return (
    // Extra room on top: the two hook tapes from the Ticker overlap this page.
    <section
      id="writer"
      data-theme="light"
      data-ink-pin
      aria-labelledby="writer-title"
      className="spread relative bg-paper pt-[clamp(10rem,16vw,14rem)] lg:pt-[clamp(8.5rem,17svh,11.5rem)]"
    >
      <div className="shell">
        <SectionHead no="01" label="The Writer" page="03" />

        <div className="mt-12 grid grid-cols-12 gap-x-6 gap-y-16 md:mt-14 lg:mt-[clamp(1.75rem,5svh,3.5rem)] lg:items-center">
          <div className="order-2 col-span-12 flex flex-col gap-14 sm:flex-row sm:items-start sm:justify-center sm:gap-8 lg:order-1 lg:col-span-4 lg:flex-col lg:items-stretch lg:gap-[clamp(1.75rem,5svh,3.5rem)]">
            <div data-reveal className="sm:w-1/2 lg:w-auto">
              <PressPass />
            </div>

            <a
              data-reveal
              href={profile.instagram.url}
              target="_blank"
              rel="noreferrer"
              data-cursor="Visit"
              className="polaroid relative mx-auto block w-full max-w-[340px] rotate-[2.5deg] transition-transform duration-700 ease-expo hover:rotate-0 sm:mt-6 sm:w-1/2 lg:mt-0 lg:w-full"
            >
              <span className="tape" aria-hidden />
              <Image src={igShot} alt="Haya’s Instagram profile, @hayaz_diaries_ — 113 posts, 10.5K followers" sizes="340px" className="h-auto w-full" />
              <span className="flex items-center justify-between px-1 py-3">
                <span className="hand text-[1.45rem] text-wine">the diary itself →</span>
                <span className="kicker text-muted">{profile.handle}</span>
              </span>
            </a>
          </div>

          <div className="order-1 col-span-12 lg:order-2 lg:col-span-8 lg:pl-6">
            <p data-reveal className="hand text-[clamp(2rem,min(3.4vw,4.6svh),2.9rem)] text-wine">
              Dear diary,
            </p>
            <h2 id="writer-title" data-reveal className="display mt-4 text-[clamp(2.9rem,min(6.6vw,9.4svh),6.4rem)]">
              I don’t write{" "}
              <span className="relative inline-block">
                content
                <svg viewBox="0 0 200 40" preserveAspectRatio="none" aria-hidden className="absolute -left-[6%] top-[38%] h-[42%] w-[112%] overflow-visible text-wine">
                  <path
                    data-draw
                    data-delay="0.45"
                    pathLength={1}
                    d="M3 26C38 12 70 31 104 18s64 6 93-10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>
                <span data-reveal aria-hidden className="hand absolute -top-[0.42em] left-[62%] whitespace-nowrap text-[0.3em] text-wine rotate-[-7deg]">
                  too boring ↘
                </span>
              </span>
              .
              <br />I write <em className="text-wine">reasons to stay.</em>
            </h2>

            {/* Copy and the numbers that back it up, side by side on wide screens. */}
            <div className="mt-12 grid gap-x-14 gap-y-14 lg:mt-[clamp(1.75rem,4.5svh,3rem)] xl:grid-cols-[minmax(0,1.12fr)_minmax(0,1fr)] xl:items-start">
              <p data-ink className="max-w-[34ch] font-serif text-[clamp(1.35rem,min(2.5vw,3.2svh),2.1rem)] leading-[1.28] tracking-[-0.01em]">
                Hi, I’m Thasneem — Haya, if you found me on Instagram. I’m a content writer and SEO analyst from {profile.hometown}, now
                based in Chennai. I write the first three seconds that decide whether you scroll past or stay: reels, carousels and Meta
                ad scripts, in English and in Tanglish. And because a great line is wasted if nobody finds it, I do the quiet work too —
                keyword research, technical fixes and the reports that prove it worked.
              </p>

              <div className="xl:pt-2">
                <p data-reveal className="kicker hidden pb-4 text-muted xl:block">
                  By the numbers
                </p>
                <dl className="ledger">
                  {stats.map((s) => (
                    <div key={s.label} data-reveal>
                      <dt className="mt-3 max-w-[22ch] text-[0.9rem] leading-snug text-muted">{s.label}</dt>
                      <dd className="display text-[clamp(2.6rem,min(5vw,6.6svh),4.4rem)] leading-none">
                        <span data-count={s.value} data-decimals={s.decimals}>
                          {s.value.toFixed(s.decimals)}
                        </span>
                        <span className="text-wine">{s.suffix}</span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
