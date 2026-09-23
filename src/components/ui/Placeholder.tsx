import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Frame for media that doesn't exist yet (screenshots, portraits).
 * Renders the real image when `src` is provided — so swapping in assets is a data change only.
 */
export function MediaSlot({
  src,
  alt,
  label,
  className,
  children,
}: {
  src?: string;
  alt: string;
  label?: string;
  className?: string;
  children?: ReactNode;
}) {
  if (src) {
    return (
      <div className={cn("relative overflow-hidden bg-ink-3", className)}>
        <img src={src} alt={alt} loading="lazy" decoding="async" className="size-full object-cover" />
      </div>
    );
  }
  return (
    <div role="img" aria-label={alt} className={cn("relative overflow-hidden bg-ink-2 hatch", className)}>
      {children}
      <Corners />
      {label && (
        <span className="absolute bottom-3 left-3 eyebrow text-dim">
          {label}
        </span>
      )}
    </div>
  );
}

/** Four corner ticks — the "technical drawing" frame motif. */
export function Corners({ className }: { className?: string }) {
  const c = "absolute size-2.5 border-fg/30";
  return (
    <span aria-hidden="true" className={cn("pointer-events-none absolute inset-0", className)}>
      <span className={cn(c, "left-2 top-2 border-l border-t")} />
      <span className={cn(c, "right-2 top-2 border-r border-t")} />
      <span className={cn(c, "bottom-2 left-2 border-b border-l")} />
      <span className={cn(c, "bottom-2 right-2 border-b border-r")} />
    </span>
  );
}
