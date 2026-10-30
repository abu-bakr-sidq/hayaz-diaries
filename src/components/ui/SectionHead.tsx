import { cn } from "@/lib/cn";

/** Running folio at the top of every chapter: number, rule, title, page. */
export function SectionHead({
  no,
  label,
  page,
  tone = "light",
  className,
}: {
  no: string;
  label: string;
  page: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div data-reveal className={cn("kicker flex items-center gap-4", className)}>
      <span className={tone === "dark" ? "text-gold" : "text-wine"}>№ {no}</span>
      <span className="h-px flex-1 bg-current opacity-20" />
      <span>{label}</span>
      <span className="opacity-50">p. {page}</span>
    </div>
  );
}
