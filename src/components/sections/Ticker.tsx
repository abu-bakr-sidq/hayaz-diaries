import { Fragment } from "react";
import { tickerHooks } from "@/content/scripts";
import { Marquee } from "@/components/ui/Marquee";
import { Asterisk } from "@/components/ui/Icons";

function Hooks({ lines }: { lines: string[] }) {
  return (
    <>
      {lines.map((line) => (
        <Fragment key={line}>
          <span className="display whitespace-nowrap px-6 text-[clamp(1.6rem,min(3.6vw,5.2svh),3.1rem)] italic leading-none">“{line}”</span>
          <Asterisk size={26} className="shrink-0 text-gold" />
        </Fragment>
      ))}
    </>
  );
}

/** Two tapes of real hooks from her scripts, crossing the seam between spreads. */
export default function Ticker() {
  return (
    <div aria-label="Opening lines from her scripts" className="relative z-10 -mb-24 -mt-24 overflow-x-clip py-10 md:-mb-28 md:-mt-28">
      <div className="-mx-[5%] -rotate-[2.4deg] bg-wine py-4 text-paper shadow-[0_24px_50px_-24px_rgb(20_17_15/0.7)] md:py-5">
        <Marquee duration={70} label="English hooks">
          <Hooks lines={tickerHooks.english} />
        </Marquee>
      </div>
      <div className="-mx-[5%] -mt-3 rotate-[1.6deg] border-y border-ink/80 bg-paper py-4 text-ink md:py-5">
        <Marquee duration={80} reverse label="Tanglish hooks">
          <Hooks lines={tickerHooks.tanglish} />
        </Marquee>
      </div>
    </div>
  );
}
