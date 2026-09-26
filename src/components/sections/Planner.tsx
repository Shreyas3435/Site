import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState, type ReactNode } from "react";
import { crew } from "@/content/studio";
import { needs, stages, timelines, type CrewCode } from "@/content/planner";
import { setBriefDraft } from "@/lib/brief";
import { cn } from "@/lib/cn";
import { EASE_OUT } from "@/lib/easing";
import { Button } from "@/components/ui/Button";
import { Corners } from "@/components/ui/Placeholder";
import { RevealText, Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

type StageId = (typeof stages)[number]["id"];

/**
 * PROJECT PLANNER
 * Visitors pick what they need, where they are and when — the console on the
 * right assembles the crew and a draft brief live, which can be sent straight
 * into the enquiry form.
 */
export function Planner() {
  const [picked, setPicked] = useState<string[]>([]);
  const [stage, setStage] = useState<StageId | null>(null);
  const [timeline, setTimeline] = useState<string | null>(null);

  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const chosen = needs.filter((n) => picked.includes(n.id));
  const active = useMemo(() => new Set<CrewCode>(chosen.flatMap((n) => n.crew)), [chosen]);
  const stageInfo = stages.find((s) => s.id === stage);

  const engagement =
    active.size === 0 ? "—" : stage === "scaling" && active.size > 1 ? "Alongside" : active.size === 1 ? "Solo" : "Squad";

  const brief = chosen.length
    ? [
        `We need: ${chosen.map((n) => n.label).join(", ")}.`,
        stageInfo && `Stage: ${stageInfo.label.toLowerCase()}.`,
        timeline && `Timeline: ${timeline}.`,
      ]
        .filter(Boolean)
        .join(" ")
    : "";

  const ready = chosen.length > 0;

  return (
    <section id="planner" aria-labelledby="planner-title" className="relative border-t border-line py-28 md:py-40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid-bg opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_75%_60%,black,transparent)]"
      />
      <div className="shell relative">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <SectionLabel index="09">Plan your project</SectionLabel>
            <RevealText
              id="planner-title"
              lines={["Scope it", "in 30 seconds."]}
              className="mt-8 text-mega font-medium uppercase"
            />
          </div>
          <Reveal className="md:col-span-5 md:self-end">
            <p className="text-lede text-fg-2">
              Pick what you need. We'll show who from the team you'd work with, how we'd start — and draft the brief for
              you.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-px border border-line bg-line md:mt-24 lg:grid-cols-12">
          {/* inputs */}
          <Reveal className="space-y-12 bg-ink p-6 md:p-10 lg:col-span-7">
            <Step n={1} title="What do you need?" hint="Pick any">
              {(["Build", "Improve"] as const).map((g) => (
                <div key={g} className="mt-5 first:mt-0">
                  <p className="eyebrow text-dim">{g}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {needs
                      .filter((n) => n.group === g)
                      .map((n) => (
                        <Chip key={n.id} selected={picked.includes(n.id)} onClick={() => toggle(n.id)} multi>
                          {n.label}
                        </Chip>
                      ))}
                  </div>
                </div>
              ))}
            </Step>

            <Step n={2} title="Where are you today?">
              <div className="flex flex-wrap gap-2">
                {stages.map((s) => (
                  <Chip key={s.id} selected={stage === s.id} onClick={() => setStage(stage === s.id ? null : s.id)}>
                    {s.label}
                  </Chip>
                ))}
              </div>
            </Step>

            <Step n={3} title="When does it need to exist?">
              <div className="flex flex-wrap gap-2">
                {timelines.map((t) => (
                  <Chip key={t} selected={timeline === t} onClick={() => setTimeline(timeline === t ? null : t)}>
                    {t}
                  </Chip>
                ))}
              </div>
            </Step>
          </Reveal>

          {/* live output */}
          <Reveal delay={0.1} className="relative bg-ink-2 p-6 md:p-10 lg:col-span-5">
            <Corners />
            <div className="flex items-center justify-between eyebrow text-muted">
              <span>
                <span className="text-accent">$</span> plan --live
              </span>
              <span aria-live="polite">{ready ? "Draft ready" : "Waiting for input"}</span>
            </div>

            <p className="mt-10 eyebrow text-dim">Your crew</p>
            <ul className="mt-4 grid grid-cols-2 gap-2">
              {crew.disciplines.map((d) => {
                const on = active.has(d.code as CrewCode);
                return (
                  <li
                    key={d.code}
                    className={cn(
                      "relative overflow-hidden rounded-sm border px-3 py-3 transition-colors duration-500",
                      on ? "border-accent/60 bg-accent/10" : "border-line-2",
                    )}
                  >
                    <span className={cn("eyebrow transition-colors", on ? "text-accent" : "text-dim")}>{d.code}</span>
                    <p className={cn("mt-1 text-sm transition-colors", on ? "text-fg" : "text-muted")}>{d.title}</p>
                    {on && (
                      <motion.span
                        aria-hidden="true"
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ duration: 0.9, ease: EASE_OUT }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/20 to-transparent"
                      />
                    )}
                  </li>
                );
              })}
            </ul>

            <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-line pt-6">
              <Readout label="Engineers" value={active.size ? `${active.size} of ${crew.size}` : "—"} />
              <Readout label="Engagement" value={engagement} />
              <Readout label="We'd start with" value={stageInfo?.start ?? "—"} wide />
            </dl>

            <div className="mt-8 min-h-[7.5rem] border-t border-line pt-6">
              <p className="eyebrow text-dim">Draft brief</p>
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={brief || "empty"}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                  className={cn("mt-3 text-[0.9375rem] leading-relaxed", brief ? "text-fg-2" : "text-dim")}
                >
                  {brief || "Select at least one need to generate a brief."}
                  {stageInfo && <span className="mt-2 block text-muted">{stageInfo.note}</span>}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="mt-8 flex flex-col gap-4 border-t border-line pt-6">
              {ready ? (
                <Button
                  to="/#contact"
                  variant="accent"
                  size="lg"
                  cursorLabel="Send"
                  onClick={() => setBriefDraft({ brief, timeline: timeline ?? undefined })}
                >
                  Use this brief
                </Button>
              ) : (
                <Button variant="accent" size="lg" disabled>
                  Use this brief
                </Button>
              )}
              <p className="text-xs text-muted">Indicative only — we confirm scope, timeline and cost on a call.</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Step({ n, title, hint, children }: { n: number; title: string; hint?: string; children: ReactNode }) {
  return (
    <fieldset>
      <legend className="flex items-baseline gap-4">
        <span className="eyebrow text-accent">0{n}</span>
        <span className="text-xl font-medium tracking-tight md:text-2xl">{title}</span>
        {hint && <span className="eyebrow text-dim">{hint}</span>}
      </legend>
      <div className="mt-5">{children}</div>
    </fieldset>
  );
}

function Chip({
  selected,
  onClick,
  multi = false,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  multi?: boolean;
  children: ReactNode;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors duration-300",
        selected ? "border-accent bg-accent/10 text-fg" : "border-line-2 text-fg-2 hover:border-fg/40 hover:text-fg",
      )}
    >
      {multi && (
        <span
          aria-hidden="true"
          className={cn(
            "grid size-3.5 place-items-center rounded-[3px] border text-[0.5rem] transition-colors",
            selected ? "border-accent bg-accent text-accent-ink" : "border-line-2",
          )}
        >
          {selected ? "✓" : ""}
        </span>
      )}
      {children}
    </motion.button>
  );
}

function Readout({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={cn(wide && "col-span-2")}>
      <dt className="eyebrow text-dim">{label}</dt>
      <dd className="mt-2 overflow-hidden text-xl font-medium tracking-tight">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={value}
            className="block"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </dd>
    </div>
  );
}
