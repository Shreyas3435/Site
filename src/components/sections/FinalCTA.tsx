import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { RevealText } from "@/components/ui/Reveal";

/** The natural conclusion of the page. The headline grows into place as you arrive. */
export function FinalCTA() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.88, 1]);
  const glow = useTransform(scrollYProgress, [0.3, 1], [0, 1]);

  return (
    <section ref={ref} aria-labelledby="cta-title" className="relative overflow-hidden py-32 md:py-52">
      <motion.div aria-hidden="true" style={{ opacity: glow }} className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 size-[min(90vw,900px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.13] blur-[120px]" />
        <div className="absolute inset-0 grid-bg [--grid-size:56px] [mask-image:radial-gradient(circle_at_center,black,transparent_65%)]" />
      </motion.div>

      <motion.div style={{ scale }} className="shell relative text-center">
        <p className="eyebrow text-accent">[ Next step ]</p>
        <RevealText
          id="cta-title"
          lines={["Have a problem", "worth building?"]}
          className="mx-auto mt-8 text-mega font-medium uppercase"
        />
        <p className="mx-auto mt-8 max-w-xl text-lede text-fg-2">
          Tell us what you're trying to build, fix or improve. We'll tell you honestly how we'd approach it — and
          whether we're the right people for it.
        </p>
        <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button to="/contact" variant="accent" size="lg" cursorLabel="Talk">
            Let's talk
          </Button>
          <Button to="/work" variant="ghost" size="lg">
            View our work
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
