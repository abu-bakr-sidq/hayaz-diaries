import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 18, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...props,
  };
}

export const ArrowRight = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const ArrowDown = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 5v14M6 13l6 6 6-6" />
  </svg>
);

export const ArrowUpRight = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

export const Envelope = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3" y="5.5" width="18" height="13" rx="2" />
    <path d="m4 7 8 6 8-6" />
  </svg>
);

export const Heart = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
  </svg>
);

export const Bubble = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.1A8 8 0 1 1 20 12Z" />
  </svg>
);

export const Send = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M21 3 10 14M21 3l-7 18-4-7-7-4 18-7Z" />
  </svg>
);

export const Bookmark = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 3.5h12v17l-6-4.2-6 4.2v-17Z" />
  </svg>
);

export const Search = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.2-4.2" />
  </svg>
);

export const Play = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M8 5.5v13l10.5-6.5L8 5.5Z" fill="currentColor" />
  </svg>
);

export const Pause = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M8 5v14M16 5v14" strokeWidth={2.4} />
  </svg>
);

export const SoundOn = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4v-5Z" fill="currentColor" />
    <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" />
  </svg>
);

export const SoundOff = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4v-5Z" fill="currentColor" />
    <path d="m16 9.5 5 5M21 9.5l-5 5" />
  </svg>
);

export const ChevronLeft = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m15 6-6 6 6 6" />
  </svg>
);

export const ChevronRight = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m9 6 6 6-6 6" />
  </svg>
);

export const Close = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const Copy = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="8" y="8" width="12" height="12" rx="2" />
    <path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" />
  </svg>
);

export const Music = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M9 18V5l11-2v13" />
    <circle cx="6.5" cy="18" r="2.5" />
    <circle cx="17.5" cy="16" r="2.5" />
  </svg>
);

/** Six-point asterisk used as a separator — a printer's mark. */
export const Asterisk = (p: IconProps) => (
  <svg {...base({ strokeWidth: 2.2, ...p })}>
    <path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9" />
  </svg>
);

/** Hand-drawn style arrow for margin notes. */
export const ScribbleArrow = ({ className, ...p }: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 120 60" fill="none" aria-hidden className={className} {...p}>
    <path d="M4 10c22 30 58 38 98 26" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    <path d="M90 26l13 10-15 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
