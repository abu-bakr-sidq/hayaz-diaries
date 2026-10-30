import { education, experience, languages } from "@/content/journey";
import { profile } from "@/content/profile";
import { SectionHead } from "@/components/ui/SectionHead";
import { ArrowDown } from "@/components/ui/Icons";

function Tick() {
  return (
    <svg viewBox="0 0 16 16" className="mt-[0.3em] h-4 w-4 shrink-0 text-gold" aria-hidden>
      <path data-draw pathLength={1} d="M2.5 8.5 6.5 12 13.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Vertical rhythm for the timeline stops, tightened by screen height on desktop.
const stop = "relative pb-16 pl-10 lg:pb-[clamp(1.75rem,4.4svh,3.5rem)]";
const kickerGap = "mt-4 lg:mt-[clamp(0.5rem,1.4svh,1rem)]";

export default function Journey() {
  const years = education.map((e) => e.year).sort();

  return (
    <section id="journey" data-theme="dark" aria-labelledby="journey-title" className="spread relative bg-ink text-paper">
      <div className="shell">
        <SectionHead no="07" label="The Journey" page="11" tone="dark" />

        <div className="mt-12 grid grid-cols-12 gap-x-6 gap-y-16 lg:mt-[clamp(1.25rem,3.5svh,2.5rem)]">
          <div className="col-span-12 self-start lg:sticky lg:top-28 lg:col-span-5">
            <h2 id="journey-title" data-split className="display text-[clamp(3.2rem,min(7.4vw,9.6svh),7rem)]">
              Chapters <em className="text-gold">so far.</em>
            </h2>
            <p data-reveal className="mt-6 max-w-[38ch] text-[1.05rem] leading-relaxed text-mist lg:mt-[clamp(0.9rem,2.4svh,1.5rem)]">
              An English literature graduate who fell for search engines. Two degrees in reading closely — and now a job in being
              read.
            </p>

            <div data-reveal className="mt-10 rounded-3xl border border-paper/12 p-6 lg:mt-[clamp(1.25rem,3.6svh,2.5rem)] lg:p-[clamp(1rem,2.6svh,1.5rem)]">
              <p className="kicker text-mist">Languages</p>
              <ul className="mt-4 space-y-3 lg:mt-[clamp(0.6rem,1.6svh,1rem)]">
                {languages.map((l) => (
                  <li key={l.name} className="flex items-baseline justify-between gap-4 border-b border-paper/10 pb-3 last:border-0 last:pb-0">
                    <span className="font-serif text-[1.7rem] leading-none">{l.name}</span>
                    <span className={l.name === "Tanglish" ? "hand text-[1.4rem] text-gold" : "text-[0.9rem] text-mist"}>{l.note}</span>
                  </li>
                ))}
              </ul>
            </div>

            <a data-reveal href={profile.resume} download className="btn btn--line mt-8 lg:mt-[clamp(1rem,3svh,2rem)]">
              Download résumé (PDF) <ArrowDown size={16} />
            </a>
          </div>

          <ol className="relative col-span-12 lg:col-span-7 lg:pl-8">
            <span className="timeline-track" aria-hidden>
              <span data-scrub-grow className="timeline-fill" />
            </span>

            <li className={stop}>
              <span className="timeline-dot timeline-dot--live" aria-hidden />
              <p data-reveal className="kicker flex flex-wrap items-center gap-3 text-gold">
                {experience.period}
                <span className="rounded-full bg-gold/15 px-2.5 py-1 !text-[0.6rem] text-gold">Current chapter</span>
              </p>
              <h3 data-reveal className={`display text-[clamp(2.4rem,min(4.4vw,5.6svh),3.8rem)] ${kickerGap}`}>
                {experience.role}
              </h3>
              <p data-reveal className="mt-1 font-serif text-[clamp(1.3rem,min(1.9vw,2.8svh),1.6rem)] italic text-mist">{experience.company}</p>
              <ul className="mt-8 space-y-3.5 lg:mt-[clamp(0.9rem,2.6svh,2rem)] lg:space-y-[clamp(0.3rem,0.9svh,0.8rem)]">
                {experience.points.map((p) => (
                  <li key={p} data-reveal className="flex gap-3 text-[1rem] leading-relaxed text-paper/85 lg:text-[0.95rem] lg:leading-snug">
                    <Tick />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </li>

            <li className={stop}>
              <span className="timeline-dot" aria-hidden />
              <p data-reveal className="kicker text-gold">Ongoing — side quest</p>
              <h3 data-reveal className={`display text-[clamp(2.2rem,min(3.8vw,4.6svh),3.2rem)] ${kickerGap}`}>
                Creator, Hayaz Diaries
              </h3>
              <p data-reveal className="mt-3 max-w-[52ch] text-[1rem] leading-relaxed text-paper/80 lg:mt-2">
                {profile.tagline}. {profile.instagram.followers} followers and {profile.instagram.posts} posts of “juz reality yaps” on
                Instagram, plus long-form videos on YouTube.
              </p>
            </li>

            {/* Both degrees share one stop on the line. */}
            <li className="relative pl-10">
              <span className="timeline-dot" aria-hidden />
              <p data-reveal className="kicker text-gold">
                {years[0]} — {years[years.length - 1]} · {education[0].school}
              </p>
              <div className={`grid gap-x-8 gap-y-6 sm:grid-cols-2 ${kickerGap}`}>
                {education.map((e) => (
                  <div key={e.degree} data-reveal>
                    <h3 className="display text-[clamp(2rem,min(3.2vw,4.2svh),2.9rem)]">{e.degree}</h3>
                    <p className="mt-1 font-serif text-[1.35rem] italic text-mist">{e.year}</p>
                  </div>
                ))}
              </div>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
