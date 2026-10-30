import type { SVGProps } from "react";

/**
 * The Hayaz Diaries mark: her diary, closed — wine leather, a gold-foil frame
 * and "h", the elastic strap, the page edges and a ribbon bookmark. It's the
 * same book that opens in the preloader; the favicon and app icon are drawn
 * from these shapes too (src/app/icon.tsx, apple-icon.tsx).
 */
export function BrandMark({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 64" className={className} aria-hidden {...props}>
      {/* page edges */}
      <rect x="6" y="3" width="39.5" height="56" rx="4" fill="#efe6d6" />
      {/* cover and spine */}
      <rect x="3" y="1.5" width="39.5" height="57" rx="4.5" fill="#6b1f2c" />
      <rect x="3" y="1.5" width="6.5" height="57" rx="3" fill="#4a1420" />
      {/* foil frame */}
      <rect x="12.5" y="7" width="21.5" height="46" rx="2" fill="none" stroke="#d9b46a" strokeOpacity="0.7" strokeWidth="1.2" />
      {/* elastic strap */}
      <rect x="36.5" y="1.5" width="3.2" height="57" fill="#2a0a12" />
      {/* ribbon bookmark */}
      <path d="M19.5 57.5h4.4v6.3l-2.2-1.9-2.2 1.9Z" fill="#d9b46a" />
      {/* monogram */}
      <text x="23" y="38.5" textAnchor="middle" fontSize="28" fontStyle="italic" fill="#e9cf94" style={{ fontFamily: "var(--font-serif)" }}>
        h
      </text>
    </svg>
  );
}
