import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { projects } from "@/content/projects";
import { cn } from "@/lib/cn";
import { EASE_OUT } from "@/lib/easing";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { PageHero } from "@/components/sections/PageHero";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { SmartLink } from "@/components/ui/SmartLink";
import { SlidingArrow } from "@/components/ui/Arrow";
import { Corners } from "@/components/ui/Placeholder";

export default function WorkIndex() {
  useDocumentTitle("Work");
  const tags = useMemo(() => Array.from(new Set(projects.flatMap((p) => p.tags))), []);
  const [filter, setFilter] = useState<string | null>(null);
  const visible = filter ? projects.filter((p) => p.tags.includes(filter)) : projects;

  return (
    <>
      <PageHero
        label="Work"
        lines={["Selected", "work."]}
        intro="Representative systems across search, product and automation. Full write-ups are added as clients approve them."
        aside={
          <p className="eyebrow text-muted">
            <span className="text-fg">{String(projects.length).padStart(2, "0")}</span> case studies
          </p>
        }
      />

      <section aria-label="Projects" className="pb-28 md:pb-40">
        <div className="shell">
          <div role="group" aria-label="Filter by technology" className="flex flex-wrap gap-2 border-b border-line pb-8">
            {[null, ...tags].map((t) => {
              const on = filter === t;
              return (
                <button
                  key={t ?? "all"}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setFilter(t)}
                  className={cn(
                    "relative rounded-full px-4 py-2 eyebrow transition-colors duration-300",
                    on ? "text-ink" : "text-muted hover:text-fg",
                  )}
                >
                  {on && (
                    <motion.span
                      layoutId="work-filter"
                      className="absolute inset-0 rounded-full bg-fg"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{t ?? "All"}</span>
                </button>
              );
            })}
          </div>

          <motion.ul layout className="mt-16 space-y-24 md:mt-24 md:space-y-36">
            {visible.map((p) => (
              <motion.li
                key={p.slug}
                layout
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ duration: 0.9, ease: EASE_OUT }}
              >
                <ProjectCard project={p} total={projects.length} layout="split" />
              </motion.li>
            ))}

            {/* open slot — replaced as real case studies are added */}
            <motion.li layout>
              <SmartLink
                to="/contact"
                data-cursor="Talk"
                className="group relative flex aspect-[16/7] flex-col items-center justify-center gap-6 border border-dashed border-line-2 text-center transition-colors hover:border-accent/60"
              >
                <Corners />
                <span className="eyebrow text-dim">Slot {String(projects.length + 1).padStart(2, "0")}</span>
                <span className="text-title font-medium uppercase text-fg/30 transition-colors group-hover:text-fg">
                  Your project?
                </span>
                <span className="inline-flex items-center gap-3 eyebrow text-fg-2">
                  Start a conversation <SlidingArrow />
                </span>
              </SmartLink>
            </motion.li>
          </motion.ul>
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
