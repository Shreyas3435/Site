import { AnimatePresence, motion } from "motion/react";
import { useId, useState } from "react";
import { faqs } from "@/content/studio";
import { cn } from "@/lib/cn";
import { EASE_OUT } from "@/lib/easing";
import { RevealText, Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TextLink } from "@/components/ui/Button";

export function FAQ({ index }: { index?: string }) {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <section id="faq" aria-labelledby="faq-title" className="relative border-t border-line py-28 md:py-40">
      <div className="shell grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionLabel index={index}>Questions</SectionLabel>
          <RevealText id="faq-title" lines={["Good", "questions."]} className="mt-8 text-title font-medium uppercase" />
          <Reveal className="mt-8 max-w-xs space-y-6 text-muted">
            <p>The things clients usually ask before the first call. Anything else — just ask.</p>
            <TextLink to="/contact">Ask us directly</TextLink>
          </Reveal>
        </div>

        <ul className="border-t border-line lg:col-span-7 lg:col-start-6">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            const panelId = `${baseId}-panel-${i}`;
            return (
              <Reveal as="li" key={f.q} delay={i * 0.05} className="border-b border-line">
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group flex w-full items-center gap-6 py-6 text-left md:py-8"
                  >
                    <span className="eyebrow text-dim transition-colors group-hover:text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "flex-1 text-lg font-medium tracking-tight transition-colors md:text-2xl",
                        isOpen ? "text-fg" : "text-fg-2 group-hover:text-fg",
                      )}
                    >
                      {f.q}
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "relative grid size-10 shrink-0 place-items-center rounded-full border transition-colors duration-300",
                        isOpen ? "border-accent bg-accent text-accent-ink" : "border-line-2 group-hover:border-fg/40",
                      )}
                    >
                      <span className="absolute h-px w-3.5 bg-current" />
                      <span
                        className={cn(
                          "absolute h-3.5 w-px bg-current transition-transform duration-500 ease-[var(--ease-out-expo)]",
                          isOpen && "rotate-90 scale-y-0",
                        )}
                      />
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.55, ease: EASE_OUT }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-8 pl-[calc(1.5rem+2ch)] text-fg-2 md:text-lg">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
