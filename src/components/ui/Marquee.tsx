import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** CSS-only infinite marquee. Content is duplicated once; the copy is aria-hidden. */
export function Marquee({
  children,
  reverse = false,
  duration = 40,
  className,
  pauseOnHover = true,
}: {
  children: ReactNode;
  reverse?: boolean;
  duration?: number;
  className?: string;
  pauseOnHover?: boolean;
}) {
  return (
    <div className={cn("group/marquee relative flex overflow-hidden", className)}>
      <div
        className={cn(
          "flex w-max shrink-0 motion-reduce:animate-none",
          reverse ? "animate-marquee-rev" : "animate-marquee",
          pauseOnHover && "group-hover/marquee:[animation-play-state:paused]",
        )}
        style={{ ["--marquee-duration" as string]: `${duration}s` }}
      >
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
