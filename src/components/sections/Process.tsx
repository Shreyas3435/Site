import { AnimatePresence, motion, useInView, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { process as steps } from "@/content/studio";
import { cn } from "@/lib/cn";
import { EASE_OUT } from "@/lib/easing";
import { useIsDesktop } from "@/hooks/useMediaQuery";
import { RevealText } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

/**
 * 01 → 02 → 03 → 04, driven by scroll.
 * Desktop: the section pins; a giant numeral and the step list advance together.
 * Mobile: each step lights up as it crosses the middle of the viewport.
 */
export function Process() {
  const desktop = useIsDesktop();
  return (
    <section id="process" aria-labelledby="process-title" className="relative">
      {desktop ? <PinnedProcess /> : <ListProcess />}
    </section>
  );
}

function Header() {
  return (
    <div>
      <SectionLabel index="06">Process</SectionLabel>
      <RevealText id="process-title" lines={["How the", "work happens."]} className="mt-8 text-title font-medium uppercase" />
    </div>
  );
}

function PinnedProcess() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);
  const rail = useTransform(scrollYProgress, [0.05, 0.95], [0, 1]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(steps.length - 1, Math.max(0, Math.floor(v * steps.length * 1.02))));
  });

  return (
    <div ref={ref} style={{ height: `${steps.length * 75 + 50}vh` }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="shell grid w-full grid-cols-12 gap-8">
          <div className="col-span-5 flex flex-col justify-between">
            <Header />
            {/* giant numeral */}
            <div className="relative mt-10 h-[clamp(8rem,20vw,18rem)] overflow-hidden" aria-hidden="true">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={active}
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  exit={{ y: "-100%" }}
                  transition={{ duration: 0.8, ease: EASE_OUT }}
                  className="absolute left-0 top-0 block text-[clamp(8rem,20vw,18rem)] font-medium leading-none tracking-[-0.07em] text-accent"
                >
                  {steps[active].index}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          <div className="relative col-span-6 col-start-7 flex items-center">
            {/* vertical rail */}
            <div className="absolute -left-10 bottom-0 top-0 w-px bg-line" aria-hidden="true">
              <motion.div style={{ scaleY: rail }} className="absolute inset-0 origin-top bg-accent" />
            </div>
            <ol className="w-full space-y-2">
              {steps.map((s, i) => {
                const on = i === active;
                const past = i < active;
                return (
                  <li key={s.index} aria-current={on ? "step" : undefined} className="border-b border-line pb-2">
                    <div className="flex items-baseline gap-6 py-4">
                      <span className={cn("eyebrow transition-colors duration-500", on || past ? "text-accent" : "text-dim")}>
                        {s.index}
                      </span>
                      <h3
                        className={cn(
                          "text-heading font-medium uppercase transition-colors duration-500",
                          on ? "text-fg" : past ? "text-fg/40" : "text-fg/20",
                        )}
                      >
                        {s.title}
                      </h3>
                    </div>
                    <motion.div
                      initial={false}
                      animate={{ height: on ? "auto" : 0, opacity: on ? 1 : 0 }}
                      transition={{ duration: 0.7, ease: EASE_OUT }}
                      className="overflow-hidden"
                    >
                      <div className="pb-6 pl-[calc(0.6875rem*2+1.5rem)]">
                        <p className="max-w-md text-lede text-fg-2">{s.body}</p>
                        <ul className="mt-5 flex flex-wrap gap-2">
                          {s.outputs.map((o) => (
                            <li key={o} className="rounded-full border border-line-2 px-3 py-1 eyebrow text-[0.625rem] text-muted">
                              {o}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

function ListProcess() {
  return (
    <div className="shell py-28">
      <Header />
      <ol className="relative mt-14 space-y-2 border-l border-line pl-6">
        {steps.map((s) => (
          <MobileStep key={s.index} step={s} />
        ))}
      </ol>
    </div>
  );
}

function MobileStep({ step }: { step: (typeof steps)[number] }) {
  const ref = useRef<HTMLLIElement>(null);
  const on = useInView(ref, { margin: "-45% 0px -45% 0px" });
  const seen = useInView(ref, { once: true, margin: "-45% 0px -45% 0px" });
  return (
    <li ref={ref} className="relative py-6">
      <span
        aria-hidden="true"
        className={cn(
          "absolute -left-[calc(1.5rem+3.5px)] top-8 size-1.5 rounded-full transition-all duration-500",
          on ? "scale-150 bg-accent shadow-[0_0_12px_2px_rgb(255_91_46/0.6)]" : seen ? "bg-accent/60" : "bg-dim",
        )}
      />
      <p className={cn("eyebrow transition-colors", on ? "text-accent" : "text-dim")}>{step.index}</p>
      <h3 className={cn("mt-2 text-heading font-medium uppercase transition-colors duration-500", on ? "text-fg" : "text-fg/30")}>
        {step.title}
      </h3>
      <p className={cn("mt-3 text-fg-2 transition-opacity duration-500", on ? "opacity-100" : "opacity-50")}>{step.body}</p>
    </li>
  );
}
