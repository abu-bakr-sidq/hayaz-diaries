"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState, type FormEvent, type InputHTMLAttributes } from "react";
import avatar from "@/assets/images/haya-avatar.webp";
import { profile } from "@/content/profile";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { SectionHead } from "@/components/ui/SectionHead";
import { ArrowUpRight, Copy } from "@/components/ui/Icons";

const needs = ["reel scripts", "carousel content", "Meta ad scripts", "SEO for our website", "website copy", "a bit of everything"];

let measureCtx: CanvasRenderingContext2D | null = null;

/** Width of `text` in the element's own font, so the blanks hug what's typed. */
function textWidth(el: HTMLElement, text: string) {
  measureCtx ??= document.createElement("canvas").getContext("2d");
  if (!measureCtx) return 0;
  const cs = getComputedStyle(el);
  measureCtx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
  return measureCtx.measureText(text).width;
}

/** `extraEm` covers the field's own padding (and the select arrow), in ems of its font. */
function useFitWidth(ref: React.RefObject<HTMLElement | null>, text: string, extraEm: number) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      const em = parseFloat(getComputedStyle(el).fontSize) || 16;
      el.style.width = `${Math.ceil(textWidth(el, text) + em * extraEm)}px`;
    };
    fit();
    document.fonts?.ready.then(fit);
  }, [ref, text, extraEm]);
}

function Blank({ value, placeholder, ...props }: InputHTMLAttributes<HTMLInputElement> & { value: string; placeholder: string }) {
  const ref = useRef<HTMLInputElement>(null);
  useFitWidth(ref, value || placeholder, 0.5);
  return <input ref={ref} value={value} placeholder={placeholder} className="field" {...props} />;
}

export default function WriteToMe() {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [need, setNeed] = useState(needs[0]);
  const [contact, setContact] = useState("");
  const [errors, setErrors] = useState<{ name?: boolean; contact?: boolean }>({});
  const [copied, setCopied] = useState(false);
  const letter = useRef<HTMLFormElement>(null);
  const seal = useRef<HTMLButtonElement>(null);
  const select = useRef<HTMLSelectElement>(null);
  useFitWidth(select, need, 1.6);

  const message = () =>
    `Hi Haya,\n\nI'm ${name.trim()}${brand.trim() ? ` from ${brand.trim()}` : ""}, and we need ${need}.\nYou can reach me at ${contact.trim()}.\n\nThanks!`;

  const validate = () => {
    const next = { name: !name.trim(), contact: !contact.trim() };
    setErrors(next);
    if (!next.name && !next.contact) return true;
    gsap.fromTo(letter.current, { x: -10 }, { x: 0, duration: 0.7, ease: "elastic.out(1, 0.22)" });
    letter.current?.querySelector<HTMLInputElement>(next.name ? "#lt-name" : "#lt-contact")?.focus();
    return false;
  };

  const sendMail = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const subject = `Collab enquiry — ${brand.trim() || name.trim()}`;
    const href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message())}`;
    gsap
      .timeline()
      .to(seal.current, { scale: 1.32, rotate: -16, duration: 0.18, ease: "power2.out" })
      .to(seal.current, { scale: 1, rotate: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" })
      .to(letter.current, { y: 6, duration: 0.07, yoyo: true, repeat: 1 }, "<")
      .call(() => {
        window.location.href = href;
      }, [], "-=0.35");
  };

  const sendWhatsApp = () => {
    if (!validate()) return;
    window.open(`${profile.whatsapp}?text=${encodeURIComponent(message())}`, "_blank", "noopener,noreferrer");
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  return (
    <section id="write-to-me" data-theme="wine" aria-labelledby="contact-title" className="spread relative overflow-hidden bg-wine text-paper">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[10vw] -top-[12vw] h-[46vw] w-[46vw] rounded-full bg-[radial-gradient(circle,rgb(194_154_82/0.28),transparent_65%)]"
      />
      <div className="shell relative">
        <SectionHead no="10" label="Write to Me" page="15" tone="dark" />

        <div className="mt-12 grid grid-cols-12 gap-x-6 gap-y-16 lg:mt-[clamp(1.5rem,4.5svh,3rem)]">
          <div className="col-span-12 lg:col-span-6">
            <h2 id="contact-title" data-split className="display text-[clamp(3.6rem,min(8.6vw,11.4svh),8.6rem)]">
              Vaanga, <em className="text-gold">pesuvom.</em>
            </h2>
            <p data-reveal className="kicker mt-7 text-paper/60 lg:mt-[clamp(1rem,2.6svh,1.75rem)]">
              (Tamil for “come, let’s talk” — straight from one of her scripts)
            </p>
            <p data-reveal className="mt-8 max-w-[40ch] text-[1.08rem] leading-relaxed text-paper/85 lg:mt-[clamp(1rem,3svh,2rem)]">
              Got a brand that needs a voice — or a website that needs to be found? DM for collabs, or do it properly and write
              her a letter.
            </p>

            <ul data-reveal className="mt-12 border-t border-paper/20 lg:mt-[clamp(1.5rem,4.5svh,3rem)]">
              <li className="flex flex-wrap items-center justify-between gap-3 border-b border-paper/20 py-4 lg:py-[clamp(0.6rem,1.5svh,1rem)]">
                <span className="kicker text-paper/60">Email</span>
                <span className="flex items-center gap-3">
                  <a href={`mailto:${profile.email}`} className="ink-link font-serif text-[1.35rem] sm:text-[clamp(1.35rem,min(1.9vw,2.7svh),1.6rem)]">
                    {profile.email}
                  </a>
                  <button
                    type="button"
                    onClick={copyEmail}
                    aria-label="Copy email address"
                    className="relative grid h-9 w-9 place-items-center rounded-full bg-paper/10 transition-colors hover:bg-paper/20"
                  >
                    <Copy size={16} />
                    <span
                      aria-live="polite"
                      className={cn(
                        "hand pointer-events-none absolute -top-8 right-0 whitespace-nowrap text-[1.3rem] text-gold transition-all duration-500",
                        copied ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
                      )}
                    >
                      {copied ? "copied!" : ""}
                    </span>
                  </button>
                </span>
              </li>
              {[
                ["Phone & WhatsApp", profile.phoneDisplay, profile.whatsapp],
                ["Instagram", profile.handle, profile.instagram.url],
                ["YouTube", profile.youtube.handle, profile.youtube.url],
              ].map(([label, value, href]) => (
                <li key={label} className="border-b border-paper/20">
                  <a href={href} target="_blank" rel="noreferrer" className="group flex flex-wrap items-center justify-between gap-3 py-4 lg:py-[clamp(0.6rem,1.5svh,1rem)]">
                    <span className="kicker text-paper/60">{label}</span>
                    <span className="flex items-center gap-2 font-serif text-[1.35rem] sm:text-[clamp(1.35rem,min(1.9vw,2.7svh),1.6rem)]">
                      {value}
                      <ArrowUpRight size={18} className="transition-transform duration-500 ease-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </a>
                </li>
              ))}
              <li className="border-b border-paper/20">
                <a href={profile.resume} download className="group flex items-center justify-between gap-3 py-4 lg:py-[clamp(0.6rem,1.5svh,1rem)]">
                  <span className="kicker text-paper/60">Résumé</span>
                  <span className="flex items-center gap-2 font-serif text-[1.35rem] sm:text-[clamp(1.35rem,min(1.9vw,2.7svh),1.6rem)]">
                    Download PDF
                    <ArrowUpRight size={18} className="rotate-90 transition-transform duration-500 ease-expo group-hover:translate-y-0.5" />
                  </span>
                </a>
              </li>
            </ul>
          </div>

          <div className="relative col-span-12 lg:col-span-6 lg:pl-4">
            <div aria-hidden className="envelope hidden lg:block">
              <div className="absolute inset-x-[9%] bottom-[11%] flex items-end justify-between gap-6">
                <p className="hand text-[clamp(1.5rem,2vw,1.9rem)] leading-[1.1] text-ink/75">
                  Ms. Haya
                  <span className="block text-[0.78em] text-ink/50">Hayaz Diaries · {profile.location}</span>
                </p>
                <span className="postmark">
                  <span className="kicker text-center !text-[0.5rem] leading-[1.6]">
                    Kumbakonam
                    <br />↔<br />
                    Chennai
                  </span>
                </span>
              </div>
            </div>
            <form ref={letter} data-reveal onSubmit={sendMail} noValidate className="letter relative z-[1] -rotate-1 p-6 pb-8 sm:p-10 lg:p-[clamp(1.75rem,4.2svh,2.5rem)]">
              <div className="flex items-start justify-between gap-6">
                <div className="kicker space-y-1 text-muted">
                  <p>Air mail · Par avion</p>
                  <p>To: Haya, {profile.location}</p>
                </div>
                {/* postage stamp */}
                <div className="shrink-0 rotate-3 drop-shadow-[0_6px_8px_rgb(20_17_15/0.3)]">
                  <div className="stamp">
                    <div className="relative h-[5.2rem] w-[4.4rem] overflow-hidden border border-wine/40">
                      <Image src={avatar} alt="" fill sizes="72px" className="object-cover" />
                      <span className="kicker absolute inset-x-0 bottom-0 bg-wine/90 py-0.5 text-center !text-[0.5rem] text-paper">India ₹5</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="hand mt-6 text-[clamp(2.2rem,min(3vw,4.4svh),2.6rem)] leading-none text-wine lg:mt-[clamp(1rem,2.8svh,1.5rem)]">Dear Haya,</p>

              <div className="mt-5 font-serif text-[clamp(1.3rem,min(2.3vw,2.9svh),1.9rem)] leading-[1.9]">
                I’m{" "}
                <label htmlFor="lt-name" className="sr-only">
                  Your name
                </label>
                <Blank
                  id="lt-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="your name"
                  autoComplete="name"
                  aria-invalid={errors.name || undefined}
                  required
                />{" "}
                from{" "}
                <label htmlFor="lt-brand" className="sr-only">
                  Your brand
                </label>
                <Blank
                  id="lt-brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="your brand"
                  autoComplete="organization"
                />
                , and we need{" "}
                <label htmlFor="lt-need" className="sr-only">
                  What you need
                </label>
                <select ref={select} id="lt-need" className="field" value={need} onChange={(e) => setNeed(e.target.value)}>
                  {needs.map((n) => (
                    <option key={n} value={n} className="not-italic text-ink">
                      {n}
                    </option>
                  ))}
                </select>
                . You can reach me at{" "}
                <label htmlFor="lt-contact" className="sr-only">
                  Your email or phone
                </label>
                <Blank
                  id="lt-contact"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="email or phone"
                  autoComplete="email"
                  aria-invalid={errors.contact || undefined}
                  required
                />
                .
              </div>

              <div className="mt-10 flex flex-wrap items-end justify-between gap-6 lg:mt-[clamp(1.25rem,3.6svh,2.5rem)]">
                <div className="min-w-0">
                  <p className="kicker text-muted">Yours,</p>
                  <p className={cn("sign mt-1 min-h-[1.1em] truncate text-[clamp(2.4rem,min(4.6vw,5.6svh),3.4rem)]", name ? "text-ink" : "text-ink/25")}>
                    {name || "your name"}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <button type="button" onClick={sendWhatsApp} className="kicker text-wine underline decoration-wine/40 underline-offset-4 hover:decoration-wine">
                    or WhatsApp
                  </button>
                  <button ref={seal} type="submit" className="seal" aria-label="Seal and send by email" data-cursor="Send">
                    <span className="display text-[2.6rem] leading-none">h</span>
                  </button>
                </div>
              </div>

              {(errors.name || errors.contact) && (
                <p role="alert" className="hand mt-4 text-[1.4rem] text-[#b3261e]">
                  Psst — fill in your {errors.name ? "name" : "email or phone"} so she can write back.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
