/** Instagram-style short count, rounded down like the app: 11,143 → "11.1K". */
export function compactCount(n: number) {
  const short = (v: number, unit: string) => `${Math.floor(v * 10) / 10}${unit}`;
  if (n >= 1_000_000) return short(n / 1_000_000, "M");
  if (n >= 1_000) return short(n / 1_000, "K");
  return String(n);
}
