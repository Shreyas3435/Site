import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { principles } from "@/content/studio";
import { SectionLabel } from "@/components/ui/SectionLabel";

/**
 * HOW WE THINK — editorial statements. Each line brightens and settles as it
 * reaches the reading position, then recedes as the next one arrives.
 */
export function Principles() {
  return (
    <section aria-labelledby="principles-title" className="relative overflow-x-clip py-28 md:py-44">
      <div className="shell">
        <div className="flex items-end justify-between gap-8">
          <SectionLabel index="07">How we think</SectionLabel>
          <h2 id="principles-title" className="sr-only">
            How we think
          </h2>
          <span className="hidden eyebrow text-dim md:block">Principles / {String(principles.length).padStart(2, "0")}</span>
        </div>
        <ol className="mt-14 md:mt-20">
          {principles.map((p, i) => (
            <Statement key={i} index={i} lead={p.lead} rest={p.rest} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function Statement({ index, lead, rest }: { index: number; lead: string; rest: string }) {
  const ref = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const opacity = useTransform(scrollYProgress, [0.1, 0.4, 0.6, 0.9], [0.12, 1, 1, 0.25]);
  const x = useTransform(scrollYProgress, [0.1, 0.45], [index % 2 ? -40 : 40, 0]);

  return (
    <motion.li
      ref={ref}
      style={{ opacity }}
      className="grid grid-cols-[2.5rem_1fr] gap-4 border-t border-line py-8 last:border-b md:grid-cols-12 md:gap-8 md:py-12"
    >
      <span className="eyebrow pt-2 text-accent md:col-span-2 md:pt-4">P.{String(index + 1).padStart(2, "0")}</span>
      <motion.p style={{ x }} className="text-title font-medium md:col-span-10 text-balance-pretty">
        {lead} <span className="text-muted">{rest}</span>
      </motion.p>
    </motion.li>
  );
}
