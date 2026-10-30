/** Deterministic faux barcode — derived from the text, so it never changes between renders. */
export function Barcode({ value, className }: { value: string; className?: string }) {
  const bars: { x: number; w: number }[] = [];
  let x = 0;
  for (const ch of value + [...value].reverse().join("")) {
    const code = ch.charCodeAt(0);
    for (let b = 0; b < 3; b++) {
      const w = ((code >> b) & 3) + 1;
      bars.push({ x, w });
      x += w + (((code >> (b + 2)) & 1) + 1);
    }
  }
  return (
    <svg viewBox={`0 0 ${x} 40`} preserveAspectRatio="none" className={className} aria-hidden>
      {bars.map((bar, i) => (
        <rect key={i} x={bar.x} y={0} width={bar.w} height={40} fill="currentColor" />
      ))}
    </svg>
  );
}
