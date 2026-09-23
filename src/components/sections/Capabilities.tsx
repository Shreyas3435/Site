import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { capabilities } from "@/content/capabilities";
import { cn } from "@/lib/cn";
import { EASE_OUT } from "@/lib/easing";
import { useFinePointer, useIsDesktop } from "@/hooks/useMediaQuery";
import { CountUp } from "@/components/ui/CountUp";
import { Corners } from "@/components/ui/Placeholder";
import { RevealText } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TextLink } from "@/components/ui/Button";
import { Schematic } from "@/components/visuals/Schematic";

const totalItems = capabilities.reduce((n, c) => n + c.items.length, 0);

/**
 * WE BUILD ACROSS THE STACK.
 * An index of domains, not a grid of cards. On desktop, hover / focus a domain
 * and a sticky readout draws its schematic; on touch it expands inline.
 */
export function Capabilities() {
  const [active, setActive] = useState(0);
  const fine = useFinePointer();
  const desktop = useIsDesktop();
  const current = capabilities[active];

  return (
    <section id="capabilities" aria-labelledby="cap-title" className="relative overflow-clip py-28 md:py-40">
      {/* background grid drifts with the active domain */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid-bg opacity-50 [--grid-size:88px] [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]"
        animate={{ backgroundPosition: `${active * 22}px ${active * -44}px` }}
        transition={{ duration: 1.4, ease: EASE_OUT }}
      />

      <div className="shell relative">
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <SectionLabel index="02">Capabilities</SectionLabel>
            <RevealText
              id="cap-title"
              lines={["We build across", "the stack."]}
              className="mt-8 text-[clamp(2.75rem,6.4vw,7.25rem)] font-medium uppercase leading-[0.9] tracking-[-0.05em]"
            />
          </div>
          <div className="space-y-6 md:col-span-4">
            <p className="text-lede text-fg-2 text-balance-pretty">
              We're not a single-service shop. Most real problems cross boundaries — interface, service, data, model,
              infrastructure — so we work across all of them.
            </p>
            <p className="flex gap-8 eyebrow text-muted">
              <span>
                <span className="text-fg">
                  <CountUp to={capabilities.length} />
                </span>{" "}
                domains
              </span>
              <span>
                <span className="text-fg">
                  <CountUp to={totalItems} />
                </span>{" "}
                disciplines
              </span>
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-12 md:mt-24 lg:grid-cols-12">
          {/* index */}
          <ul className="border-t border-line lg:col-span-7">
            {capabilities.map((cap, i) => {
              const isActive = i === active;
              return (
                <li key={cap.id} className="border-b border-line">
                  <button
                    type="button"
                    aria-expanded={desktop ? undefined : isActive}
                    aria-controls={desktop ? "cap-readout" : `cap-panel-${cap.id}`}
                    aria-pressed={desktop ? isActive : undefined}
                    onClick={() => setActive(i)}
                    onMouseEnter={fine ? () => setActive(i) : undefined}
                    onFocus={() => setActive(i)}
                    className="group relative flex w-full items-baseline gap-5 py-6 text-left md:gap-8 md:py-8"
                  >
                    <span className={cn("eyebrow transition-colors duration-500", isActive ? "text-accent" : "text-dim")}>
                      {cap.index}
                    </span>
                    <span
                      className={cn(
                        "flex-1 text-[clamp(2.25rem,5.4vw,5.25rem)] font-medium uppercase leading-[0.9] tracking-[-0.05em] transition-[color,transform] duration-700 ease-[var(--ease-out-expo)]",
                        isActive ? "translate-x-2 text-fg" : "text-fg/25 group-hover:text-fg/60",
                      )}
                    >
                      {cap.title}
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "hidden self-center eyebrow transition-opacity duration-500 md:block",
                        isActive ? "text-fg-2 opacity-100" : "opacity-0",
                      )}
                    >
                      {cap.items.length.toString().padStart(2, "0")} ⟶
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isActive && !desktop && (
                      <motion.div
                        id={`cap-panel-${cap.id}`}
                        key="panel"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.7, ease: EASE_OUT }}
                        className="overflow-hidden"
                      >
                        <div className="pb-8 pl-[calc(0.6875rem*2+1.25rem)] md:pb-10 md:pl-[calc(0.6875rem*2+2rem)]">
                          <p className="max-w-lg text-fg-2">{cap.description}</p>
                          <ul className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                            {cap.items.map((item, k) => (
                              <motion.li
                                key={item.name}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.15 + k * 0.05 }}
                                className="border-l border-line-2 pl-4"
                              >
                                <p className="font-medium text-fg">{item.name}</p>
                                <p className="mt-1 text-sm leading-relaxed text-muted">{item.blurb}</p>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>

          {/* sticky readout (desktop) */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-[calc(var(--header-h)+2rem)]">
              <div id="cap-readout" className="relative border border-line bg-ink-2/70 backdrop-blur-sm">
                <Corners />
                <div className="flex items-center justify-between border-b border-line px-5 py-3 eyebrow text-muted">
                  <span>
                    <span className="text-accent">■</span>&nbsp; Readout / {current.title}
                  </span>
                  <span className="tabular-nums">
                    {current.index} / {String(capabilities.length).padStart(2, "0")}
                  </span>
                </div>
                <div className="relative aspect-[16/10]">
                  <div aria-hidden="true" className="absolute inset-0 grid-bg opacity-40 [--grid-size:20px]" />
                  <Schematic id={current.id} className="relative size-full p-4" />
                </div>
                <div className="border-t border-line px-5 py-5">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={current.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.35 }}
                    >
                      <p className="text-lg font-medium tracking-tight">{current.summary}</p>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{current.description}</p>
                      <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-line pt-5">
                        {current.items.map((item) => (
                          <li key={item.name} className="text-sm">
                            <span className="text-accent">↳</span> <span className="text-fg">{item.name}</span>
                          </li>
                        ))}
                      </ul>
                      <ul className="mt-5 flex flex-wrap gap-2">
                        {current.signals.map((s) => (
                          <li key={s} className="rounded-full border border-line-2 px-3 py-1 eyebrow text-[0.625rem] text-fg-2">
                            {s}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
              <TextLink to="/capabilities" className="mt-6">
                All capabilities
              </TextLink>
            </div>
          </div>
        </div>

        <div className="mt-10 lg:hidden">
          <TextLink to="/capabilities">All capabilities</TextLink>
        </div>
      </div>
    </section>
  );
}
