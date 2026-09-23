import { motion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { EASE_IN_OUT } from "@/lib/easing";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

let firstRender = true;

/**
 * Wraps every route. On navigation:
 *   1. the exit curtain rises from the bottom and covers the old page
 *   2. scroll resets (Layout → onExitComplete)
 *   3. the enter curtain lifts away to reveal the new page, carrying its label
 * The very first load skips the curtain so the hero intro plays immediately.
 */
export function PageShell({ label, children }: { label: string; children: ReactNode }) {
  const reduced = usePrefersReducedMotion();
  // Read the flag in a state initializer and clear it in an effect so
  // StrictMode's double render can't flip it early.
  const [skipEnter] = useState(() => firstRender);
  useEffect(() => {
    firstRender = false;
  }, []);

  if (reduced) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 1 }}>
      {children}

      {/* exit curtain — covers the leaving page */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[80] bg-ink-2"
        initial={{ clipPath: "inset(100% 0 0 0)" }}
        animate={{ clipPath: "inset(100% 0 0 0)" }}
        exit={{ clipPath: "inset(0% 0 0 0)" }}
        transition={{ duration: 0.55, ease: EASE_IN_OUT }}
      >
        <span className="absolute inset-x-0 top-0 h-px bg-accent" />
      </motion.div>

      {/* enter curtain — lifts to reveal the new page */}
      {!skipEnter && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[80] flex items-center justify-center bg-ink-2"
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          animate={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.75, ease: EASE_IN_OUT, delay: 0.15 }}
        >
          <motion.span
            className="eyebrow text-fg-2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: [0, 1, 1, 0], y: [8, 0, 0, -8] }}
            transition={{ duration: 0.8, times: [0, 0.25, 0.6, 1] }}
          >
            <span className="text-accent">/</span> {label}
          </motion.span>
          <span className="absolute inset-x-0 bottom-0 h-px bg-accent" />
        </motion.div>
      )}
    </motion.div>
  );
}
