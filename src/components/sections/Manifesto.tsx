import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { SectionLabel } from "@/components/ui/SectionLabel";

const TEXT =
  "We're a small group of engineers who take on work that is technical, ambitious, or simply difficult to get right. Products and platforms, search and AI, backends and infrastructure — if it needs to be built properly, we want to hear about it.";

// Words that pick up the accent once lit.
const EMPHASIS = new Set(["technical,", "ambitious,", "difficult", "properly,"]);

export function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = TEXT.split(" ");

  return (
    <section aria-label="About the studio" className="relative py-28 md:py-44">
      <div className="shell grid gap-10 md:grid-cols-12">
        <SectionLabel index="01" className="md:col-span-3 md:pt-4">
          The studio
        </SectionLabel>
        <p
          ref={ref}
          className="text-[clamp(1.75rem,3.9vw,3.75rem)] font-medium leading-[1.08] tracking-[-0.035em] md:col-span-9"
        >
          <span className="sr-only">{TEXT}</span>
          <span aria-hidden="true">
            {words.map((w, i) => (
              <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} accent={EMPHASIS.has(w)}>
                {w}
              </Word>
            ))}
          </span>
        </p>
      </div>
    </section>
  );
}

function Word({
  children,
  progress,
  range,
  accent,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  accent: boolean;
}) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  const color = useTransform(progress, [range[0], range[1]], accent ? ["#edebe6", "#ff5b2e"] : ["#edebe6", "#edebe6"]);
  return (
    <motion.span style={{ opacity, color }} className="inline-block whitespace-pre">
      {children}{" "}
    </motion.span>
  );
}
