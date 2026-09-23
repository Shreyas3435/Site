import { cn } from "@/lib/cn";

/**
 * LOGO PLACEHOLDER
 * Fixed-size box so the final logo (SVG recommended, ~120×28) drops in
 * without moving anything. Replace the inner <span> with <img>/<svg>.
 */
export function LogoSlot({ className, size = "md" }: { className?: string; size?: "md" | "lg" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-start font-mono tracking-[0.2em] text-fg",
        size === "md" ? "h-7 w-[7.5rem] text-[0.6875rem]" : "h-14 w-60 text-sm",
        className,
      )}
    >
      <span className="text-accent">[</span>
      <span className="px-2.5">LOGO</span>
      <span className="text-accent">]</span>
    </span>
  );
}
