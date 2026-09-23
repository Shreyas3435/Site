import { motion } from "motion/react";
import type { ReactNode } from "react";
import { EASE_OUT } from "@/lib/easing";
import { RevealText } from "@/components/ui/Reveal";

/** Opening block for secondary pages. Animates on mount, after the page curtain lifts. */
export function PageHero({
  label,
  lines,
  intro,
  aside,
}: {
  label: string;
  lines: string[];
  intro?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <header className="relative overflow-hidden pb-16 pt-[calc(var(--header-h)+5rem)] md:pb-24 md:pt-[calc(var(--header-h)+8rem)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid-bg opacity-50 [mask-image:radial-gradient(ellipse_80%_70%_at_20%_0%,black,transparent)]"
      />
      <div className="shell relative">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="flex items-center gap-4 eyebrow text-muted"
        >
          <span className="text-accent">/</span> {label}
        </motion.p>
        <RevealText as="h1" immediate delay={0.85} lines={lines} className="mt-8 text-mega font-medium uppercase" />
        {(intro || aside) && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.9, ease: EASE_OUT }}
            className="mt-12 grid gap-10 border-t border-line pt-8 md:grid-cols-12"
          >
            {intro && <div className="text-lede text-fg-2 md:col-span-6 text-balance-pretty">{intro}</div>}
            {aside && <div className="md:col-span-4 md:col-start-9">{aside}</div>}
          </motion.div>
        )}
      </div>
    </header>
  );
}
