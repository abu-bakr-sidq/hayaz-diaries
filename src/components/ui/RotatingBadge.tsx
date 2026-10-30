import { cn } from "@/lib/cn";
import { Envelope } from "./Icons";

/** Round "sticker" with orbiting text, straight out of her bio: DM for collabs. */
export function RotatingBadge({
  id,
  href,
  tone = "wine",
  className,
}: {
  id: string;
  href: string;
  tone?: "wine" | "paper";
  className?: string;
}) {
  const paper = tone === "paper";
  return (
    <a
      href={href}
      data-cursor="Write"
      aria-label="DM for collabs — jump to contact"
      className={cn(
        "group relative grid aspect-square place-items-center rounded-full shadow-[0_18px_40px_-18px_rgb(20_17_15/0.7)]",
        paper ? "bg-paper text-wine" : "bg-wine text-paper",
        className,
      )}
    >
      <svg viewBox="0 0 200 200" className="animate-spin-slow absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <path id={id} d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" />
        </defs>
        <text className="fill-current font-mono text-[15px] uppercase" letterSpacing="3.2">
          <textPath href={`#${id}`} textLength="462">
            DM for collabs ✦ DM for collabs ✦
          </textPath>
        </text>
      </svg>
      <span
        className={cn(
          "grid h-[34%] w-[34%] place-items-center rounded-full transition-transform duration-700 ease-expo group-hover:rotate-[-12deg] group-hover:scale-110",
          paper ? "bg-wine text-paper" : "bg-paper text-wine",
        )}
      >
        <Envelope size={22} />
      </span>
    </a>
  );
}
