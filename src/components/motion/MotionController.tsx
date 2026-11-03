"use client";

import { gsap, ScrollTrigger, SplitText, useGSAP, MOTION_OK } from "@/lib/gsap";

/**
 * One place for the page-wide scroll choreography, driven by data attributes
 * so sections can stay server components:
 *
 *   data-split          headline lines rise out of a mask
 *   data-reveal         fade + lift, batched as they enter
 *   data-ink            body copy inks in word by word while you scroll
 *   data-ink-pin        on a page: desktop pins it until its data-ink copy is fully inked
 *   data-parallax="n"   drifts at a different speed than the page
 *   data-count="n"      counts up (data-decimals for fractions)
 *   data-draw           SVG stroke draws itself (needs pathLength="1")
 *   data-wipe="w"       SVG clip rect wipes open to width w
 *   data-scrub-grow     scales from 0 → 1 while its parent scrolls past
 */
export default function MotionController() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
        SplitText.create(el, {
          type: "lines",
          mask: "lines",
          linesClass: "sl",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 118,
              rotate: 2.5,
              transformOrigin: "0% 100%",
              duration: 1.3,
              ease: "expo.out",
              stagger: 0.09,
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
            }),
        });
      });

      ScrollTrigger.batch("[data-reveal]", {
        start: "top 92%",
        once: true,
        // A jump through the page (menu, contents) enters dozens at once. Ones
        // already scrolled past just appear, so the stagger only plays on
        // screen and the destination isn't kept waiting.
        onEnter: (batch) => {
          const passed = batch.filter((el) => el.getBoundingClientRect().bottom < 0);
          if (passed.length) gsap.set(passed, { autoAlpha: 1, y: 0 });
          const onScreen = batch.filter((el) => !passed.includes(el));
          gsap.to(onScreen, { autoAlpha: 1, y: 0, duration: 1.15, ease: "expo.out", stagger: 0.07, overwrite: true });
        },
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const speed = parseFloat(el.dataset.parallax || "0.15");
        gsap.fromTo(
          el,
          { yPercent: speed * 40 },
          {
            yPercent: -speed * 40,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const end = parseFloat(el.dataset.count || "0");
        const decimals = parseInt(el.dataset.decimals || "0", 10);
        const state = { v: 0 };
        el.textContent = (0).toFixed(decimals);
        gsap.to(state, {
          v: end,
          duration: 2.2,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
          onUpdate: () => {
            el.textContent = state.v.toFixed(decimals);
          },
        });
      });

      gsap.utils.toArray<SVGElement>("[data-draw]").forEach((el) => {
        gsap.fromTo(
          el,
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            duration: 1.3,
            ease: "power2.inOut",
            delay: parseFloat(el.dataset.delay || "0"),
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          },
        );
      });

      gsap.utils.toArray<SVGRectElement>("[data-wipe]").forEach((el) => {
        const svg = el.closest("svg");
        gsap.fromTo(
          el,
          { attr: { width: 0 } },
          {
            attr: { width: parseFloat(el.dataset.wipe || "0") },
            duration: 2,
            ease: "power2.inOut",
            scrollTrigger: { trigger: svg, start: "top 90%", once: true },
          },
        );
      });

      const footWords = gsap.utils.toArray<HTMLElement>("[data-foot-word]");
      if (footWords.length) {
        gsap.fromTo(
          footWords,
          { yPercent: 130 },
          {
            yPercent: 0,
            duration: 1.5,
            ease: "expo.out",
            stagger: 0.14,
            scrollTrigger: { trigger: footWords[0].parentElement, start: "top 92%", once: true },
          },
        );
      }

      gsap.utils.toArray<HTMLElement>("[data-scrub-grow]").forEach((el) => {
        gsap.fromTo(
          el,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: el.parentElement, start: "top 70%", end: "bottom 70%", scrub: true },
          },
        );
      });
    });

    // Body copy inks in word by word. Inside a [data-ink-pin] page on desktop
    // the page holds still (pinned) until the last word has landed, so it never
    // scrolls away half-read; elsewhere the words simply scrub in as they pass.
    mm.add({ motion: MOTION_OK, desktop: "(min-width: 1024px) and (min-height: 600px)" }, (ctx) => {
      const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean };
      if (!motion) return;
      gsap.utils.toArray<HTMLElement>("[data-ink]").forEach((el) => {
        const page = desktop ? el.closest<HTMLElement>("[data-ink-pin]") : null;
        SplitText.create(el, {
          type: "words",
          autoSplit: true,
          onSplit: (self) =>
            gsap.fromTo(
              self.words,
              { opacity: 0.14 },
              {
                opacity: 1,
                ease: "none",
                stagger: 0.1,
                scrollTrigger: page
                  ? {
                      trigger: page,
                      // a page taller than the screen pins once its foot is in view
                      start: () => (page.offsetHeight > window.innerHeight + 4 ? "bottom bottom" : "top top"),
                      end: () => `+=${Math.round(window.innerHeight * 0.9)}`,
                      pin: true,
                      scrub: 0.6,
                      refreshPriority: 1,
                      invalidateOnRefresh: true,
                    }
                  : { trigger: el, start: "top 80%", end: "bottom 48%", scrub: true },
              },
            ),
        });
      });
    });

    // Re-measure once fonts and images have settled.
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh, { once: true });

    return () => {
      mm.revert();
      window.removeEventListener("load", refresh);
    };
  });

  return null;
}
