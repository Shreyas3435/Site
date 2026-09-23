import { cn } from "@/lib/cn";

export function StatusDot({ label, className }: { label: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="relative flex size-1.5">
        <span className="absolute inset-0 rounded-full bg-accent animate-pulse-dot" />
        <span className="absolute -inset-1 rounded-full bg-accent/20 blur-[3px]" />
      </span>
      <span>{label}</span>
    </span>
  );
}
