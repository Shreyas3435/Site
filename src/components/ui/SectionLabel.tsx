import { cn } from "@/lib/cn";

/** "[03]  ——  CAPABILITIES" — the consistent section marker used across the site. */
export function SectionLabel({ index, children, className }: { index?: string; children: string; className?: string }) {
  return (
    <div className={cn("flex items-center gap-4 eyebrow text-muted", className)}>
      {index && <span className="text-accent">[{index}]</span>}
      <span aria-hidden="true" className="h-px w-10 bg-line-2" />
      <span>{children}</span>
    </div>
  );
}
