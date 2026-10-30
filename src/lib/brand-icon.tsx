import { readFile } from "node:fs/promises";
import { join } from "node:path";

/** Italic serif for the monogram — read at module scope so the icons prerender. */
export const monogramFont = readFile(join(process.cwd(), "src/assets/og/InstrumentSerif-Italic.ttf"));

/**
 * The diary mark for next/og: the book as SVG with the "h" set as real type on
 * top, since Satori draws text with the font it's given. Mirrors
 * components/ui/BrandMark.tsx; `scale` 1 is 48×64. `small` drops the foil frame
 * and sets a bigger "h", so the mark still reads at 16px in a browser tab.
 */
export function DiaryIcon({ scale = 1, small = false }: { scale?: number; small?: boolean }) {
  const s = (n: number) => n * scale;
  return (
    <div style={{ position: "relative", display: "flex", width: s(48), height: s(64) }}>
      <svg width={s(48)} height={s(64)} viewBox="0 0 48 64">
        <rect x="6" y="3" width="39.5" height="56" rx="4" fill="#efe6d6" />
        <rect x="3" y="1.5" width="39.5" height="57" rx="4.5" fill="#6b1f2c" />
        <rect x="3" y="1.5" width="6.5" height="57" rx="3" fill="#4a1420" />
        {!small && <rect x="12.5" y="7" width="21.5" height="46" rx="2" fill="none" stroke="#d9b46a" strokeOpacity="0.7" strokeWidth="1.2" />}
        <rect x={small ? 36 : 36.5} y="1.5" width={small ? 4.2 : 3.2} height="57" fill="#2a0a12" />
        <path d="M19.5 57.5h4.4v6.3l-2.2-1.9-2.2 1.9Z" fill="#d9b46a" />
      </svg>
      <div
        style={{
          position: "absolute",
          left: s(12.5),
          top: s(7),
          width: s(21.5),
          height: s(46),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: s(small ? 5 : 4),
          fontFamily: "Serif",
          fontSize: s(small ? 40 : 31),
          color: "#e9cf94",
        }}
      >
        h
      </div>
    </div>
  );
}
