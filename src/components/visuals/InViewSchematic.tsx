import { useRef, type ReactNode } from "react";
import { useInView } from "motion/react";

/** Mounts its child only once scrolled near, so draw-in animations play on arrival. */
export function InViewSchematic({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  return (
    <div ref={ref} className="size-full">
      {inView ? children : null}
    </div>
  );
}
