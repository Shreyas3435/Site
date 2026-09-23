import { cn } from "@/lib/cn";

type Dir = "right" | "down" | "up-right" | "up";
const rotation: Record<Dir, string> = { right: "", down: "rotate-90", "up-right": "-rotate-45", up: "-rotate-90" };

export function ArrowGlyph({ dir = "right", className }: { dir?: Dir; className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={cn("size-[1em]", rotation[dir], className)}>
      <path d="M1 8h13M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
    </svg>
  );
}

/** Two stacked arrows — one leaves, the next arrives. Parent needs `group`. */
export function SlidingArrow({ dir = "right", className }: { dir?: Dir; className?: string }) {
  const axis =
    dir === "up"
      ? { out: "group-hover:-translate-y-[110%]", in: "translate-y-[110%] group-hover:translate-y-0" }
      : dir === "down"
      ? { out: "group-hover:translate-y-[110%]", in: "-translate-y-[110%] group-hover:translate-y-0" }
      : dir === "up-right"
        ? {
            out: "group-hover:translate-x-[110%] group-hover:-translate-y-[110%]",
            in: "-translate-x-[110%] translate-y-[110%] group-hover:translate-x-0 group-hover:translate-y-0",
          }
        : { out: "group-hover:translate-x-[110%]", in: "-translate-x-[110%] group-hover:translate-x-0" };
  const t = "transition-transform duration-500 ease-[var(--ease-out-expo)]";
  return (
    <span className={cn("relative inline-flex overflow-hidden", className)} aria-hidden="true">
      <span className={cn("inline-flex", t, axis.out)}>
        <ArrowGlyph dir={dir} />
      </span>
      <span className={cn("absolute inset-0 inline-flex", t, axis.in)}>
        <ArrowGlyph dir={dir} />
      </span>
    </span>
  );
}
