import { chapters } from "@/content/sections";
import { profile } from "@/content/profile";
import { BackToTop } from "./BackToTop";

export default function Footer() {
  return (
    <footer data-theme="dark" className="relative overflow-hidden bg-ink text-paper">
      <div className="shell pt-24 md:pt-32">
        <div className="grid grid-cols-12 gap-x-6 gap-y-12">
          <div className="col-span-12 md:col-span-6">
            <p data-reveal className="display text-[clamp(2.8rem,min(5.6vw,8svh),5.2rem)]">
              Thanks for <em className="text-gold">reading.</em>
            </p>
            <svg viewBox="0 0 420 170" className="mt-2 w-[min(72vw,340px)] overflow-visible text-gold" aria-label="Signed, Haya" role="img">
              <defs>
                <clipPath id="footer-sig">
                  <rect data-wipe="420" x="0" y="-40" width="420" height="260" />
                </clipPath>
              </defs>
              <text x="10" y="120" clipPath="url(#footer-sig)" className="sign fill-current text-[150px]">
                Haya
              </text>
            </svg>
          </div>

          <nav aria-label="Footer index" className="col-span-6 md:col-span-3">
            <p className="kicker text-mist">Index</p>
            <ul className="mt-5 space-y-2.5">
              {chapters.map((c) => (
                <li key={c.id}>
                  <a href={`#${c.id}`} className="ink-link text-paper/85 hover:text-paper">
                    {c.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-6 md:col-span-3">
            <p className="kicker text-mist">Find her</p>
            <ul className="mt-5 space-y-2.5">
              <li>
                <a href={profile.instagram.url} target="_blank" rel="noreferrer" className="ink-link text-paper/85 hover:text-paper">
                  Instagram
                </a>
              </li>
              <li>
                <a href={profile.youtube.url} target="_blank" rel="noreferrer" className="ink-link text-paper/85 hover:text-paper">
                  YouTube
                </a>
              </li>
              <li>
                <a href={profile.whatsapp} target="_blank" rel="noreferrer" className="ink-link text-paper/85 hover:text-paper">
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={`mailto:${profile.email}`} className="ink-link text-paper/85 hover:text-paper">
                  Email
                </a>
              </li>
              <li>
                <a href={profile.resume} download className="ink-link text-paper/85 hover:text-paper">
                  Résumé (PDF)
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* The wordmark spans the text column edge to edge and rises from
            behind the rule below — the cover's masthead, bookended. */}
        <div className="footer-mark mt-20 md:mt-28" aria-hidden>
          <p className="footer-wordmark select-none text-paper/[0.92]">
            <span data-foot-word className="inline-block">
              Hayaz
            </span>{" "}
            <span data-foot-word className="inline-block">
              <em className="text-gold">Diaries</em>
            </span>
          </p>
        </div>

        <div className="kicker flex flex-wrap items-center justify-between gap-4 border-t border-paper/15 py-7 text-mist">
          <span>© {profile.name} · All words reserved</span>
          <span className="hidden md:inline">
            {profile.hometown} ↔ Chennai · {profile.tagline}
          </span>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
