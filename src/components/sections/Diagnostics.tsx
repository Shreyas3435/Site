import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { diagnostics, type Diagnostic } from "@/content/diagnostics";
import { cn } from "@/lib/cn";
import { EASE_OUT } from "@/lib/easing";
import { Corners } from "@/components/ui/Placeholder";
import { RevealText, Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

/**
 * ALREADY HAVE A PRODUCT?
 * Framed as a diagnostic console: symptom → treatment rows that "resolve"
 * as they scroll into view. Rows open to show what we actually check.
 */
export function Diagnostics() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section aria-labelledby="diag-title" className="relative py-28 md:py-40">
      <div className="shell">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <SectionLabel index="03">Existing products</SectionLabel>
            <RevealText
              id="diag-title"
              lines={["Already have", "a product?"]}
              className="mt-8 text-mega font-medium uppercase"
            />
          </div>
          <Reveal className="md:col-span-5 md:self-end">
            <p className="text-heading font-medium text-fg-2">
              We can make it faster, smarter, cleaner and more capable.
            </p>
            <p className="mt-5 max-w-md text-muted">
              Not everything needs to be built from scratch. A lot of our work is stepping into an existing system,
              finding what is actually holding it back, and fixing that.
            </p>
          </Reveal>
        </div>

        <Reveal className="relative mt-16 border border-line bg-ink-2/60 md:mt-24">
          <Corners />
          {/* console header */}
          <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-3 eyebrow text-muted md:px-6">
            <span className="flex items-center gap-3">
              <span className="text-accent">$</span> diagnose --system=yours
            </span>
            <span className="hidden sm:inline">{diagnostics.length} common patterns</span>
          </div>

          {/* column headings */}
          <div className="hidden grid-cols-12 gap-6 border-b border-line px-6 py-3 eyebrow text-dim md:grid">
            <span className="col-span-1">Code</span>
            <span className="col-span-4">Symptom</span>
            <span className="col-span-1" />
            <span className="col-span-4">Treatment</span>
            <span className="col-span-2 text-right">Status</span>
          </div>

          <ul className="relative overflow-hidden">
            {/* sweeping scan line */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-full animate-scan bg-gradient-to-b from-transparent via-accent/[0.05] to-transparent motion-reduce:hidden"
            />
            {diagnostics.map((d, i) => (
              <DiagRow key={d.code} d={d} i={i} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

function DiagRow({ d, i, open, onToggle }: { d: Diagnostic; i: number; open: boolean; onToggle: () => void }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });

  return (
    <li ref={ref} className="border-b border-line last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`diag-${d.code}`}
        data-cursor={open ? "Close" : "Inspect"}
        className={cn(
          "group grid w-full grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-2 px-4 py-5 text-left transition-colors duration-300 md:grid-cols-12 md:gap-6 md:px-6 md:py-6",
          open ? "bg-fg/[0.03]" : "hover:bg-fg/[0.02]",
        )}
      >
        <span className="eyebrow text-dim md:col-span-1">{d.code}</span>

        <span className="text-lg font-medium text-muted line-through decoration-accent/0 decoration-1 transition-[text-decoration-color] duration-700 group-hover:decoration-accent/70 md:col-span-4 md:text-2xl md:tracking-tight">
          {d.symptom}
        </span>

        <span className="row-span-2 self-center md:hidden">
          <StatusBadge resolved={inView} delay={i * 0.12} />
        </span>

        {/* animated connector */}
        <span aria-hidden="true" className="hidden items-center md:col-span-1 md:flex">
          <motion.span
            className="h-px flex-1 origin-left bg-accent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: inView ? 1 : 0 }}
            transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.2 + i * 0.12 }}
          />
          <motion.span
            className="-ml-1 size-0 border-y-[4px] border-l-[6px] border-y-transparent border-l-accent"
            initial={{ opacity: 0 }}
            animate={{ opacity: inView ? 1 : 0 }}
            transition={{ delay: 0.9 + i * 0.12 }}
          />
        </span>

        <span className="col-start-2 flex items-center gap-2 text-lg font-medium text-fg md:col-span-4 md:col-start-auto md:text-2xl md:tracking-tight">
          <span aria-hidden="true" className="text-accent md:hidden">
            ↳
          </span>
          <span className="sr-only">fixed by </span>
          {d.treatment}
        </span>

        <span className="hidden justify-end md:col-span-2 md:flex">
          <StatusBadge resolved={inView} delay={i * 0.12} />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`diag-${d.code}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
            className="overflow-hidden"
          >
            <div className="grid gap-6 px-4 pb-7 md:grid-cols-12 md:px-6">
              <p className="text-fg-2 md:col-span-5 md:col-start-2">{d.detail}</p>
              <ul className="grid grid-cols-2 gap-2 md:col-span-5 md:col-start-8">
                {d.checks.map((c) => (
                  <li key={c} className="flex items-center gap-2 eyebrow text-[0.625rem] text-muted">
                    <span className="size-1 bg-accent" /> {c}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

function StatusBadge({ resolved, delay }: { resolved: boolean; delay: number }) {
  // Hold "Scanning" briefly after the row enters view, then resolve.
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!resolved) return;
    const t = window.setTimeout(() => setDone(true), (0.9 + delay) * 1000);
    return () => window.clearTimeout(t);
  }, [resolved, delay]);

  return (
    <span className="relative inline-flex h-6 min-w-[6.5rem] items-center justify-center overflow-hidden rounded-full border border-line-2 px-3 eyebrow text-[0.625rem]">
      <AnimatePresence mode="wait" initial={false}>
        {done ? (
          <motion.span
            key="ok"
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
            className="flex items-center gap-1.5 text-accent"
          >
            <span className="size-1 rounded-full bg-accent" /> Fixable
          </motion.span>
        ) : (
          <motion.span
            key="scan"
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-dim animate-pulse"
          >
            Scanning
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
