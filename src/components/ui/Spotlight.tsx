import { useRef, type ReactNode, type PointerEvent } from "react";
import { cn } from "@/lib/cn";

/**
 * Card surface with a soft accent glow that follows the pointer.
 * Position is written to CSS variables, so there are no re-renders.
 */
export function Spotlight({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <div ref={ref} onPointerMove={onMove} className={cn("group/spot relative isolate overflow-hidden", className)}>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100 [background:radial-gradient(420px_circle_at_var(--mx,50%)_var(--my,50%),rgb(255_91_46/0.14),transparent_60%)]"
      />
      {children}
    </div>
  );
}
