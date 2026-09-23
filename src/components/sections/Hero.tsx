import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { EASE_OUT } from "@/lib/easing";
import { useFinePointer } from "@/hooks/useMediaQuery";
import { Button } from "@/components/ui/Button";
import { RevealText } from "@/components/ui/Reveal";
import { SystemOrb } from "@/components/visuals/SystemOrb";

const DISCIPLINES = ["Products", "Platforms", "APIs", "Search", "AI", "Infrastructure"];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const orbScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const orbOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.1]);

  return (
    <section
      ref={ref}
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] flex-col overflow-hidden pt-[var(--header-h)]"
    >
      {/* background: fine grid, masked so it dissolves toward the edges */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid-bg opacity-60 [mask-image:radial-gradient(ellipse_70%_60%_at_65%_50%,black,transparent)]"
      />

      <motion.div aria-hidden="true" className="absolute inset-0" style={{ scale: orbScale, opacity: orbOpacity }}>
        <motion.div
          className="size-full"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2.2, ease: EASE_OUT, delay: 0.2 }}
        >
          <SystemOrb />
        </motion.div>
      </motion.div>

      <motion.div style={{ y: textY, opacity: textOpacity }} className="shell relative flex flex-1 flex-col">
        {/* top meta row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="flex items-center justify-between border-b border-line py-5 eyebrow text-muted"
        >
          <span>
            <span className="text-accent">●</span>&nbsp;&nbsp;Engineering studio
          </span>
          <span className="hidden md:block">{DISCIPLINES.join("  /  ")}</span>
        </motion.div>

        <div className="flex flex-1 flex-col justify-end pb-10 pt-[42vh] md:justify-center md:pb-0 md:pt-0">
          <RevealText
            as="h1"
            id="hero-title"
            immediate
            delay={0.35}
            stagger={0.08}
            lines={["We build", "the hard parts."]}
            className="text-display font-medium uppercase"
          />

          <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-12 md:items-end">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE_OUT, delay: 0.95 }}
              className="max-w-xl text-lede text-fg-2 text-balance-pretty md:col-span-5"
            >
              {site.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE_OUT, delay: 1.1 }}
              className="flex flex-col gap-3 sm:flex-row md:col-span-7 md:justify-end"
            >
              <Button to="/contact" variant="accent" size="lg" cursorLabel="Let's go">
                Start a project
              </Button>
              <Button to="/#work" variant="ghost" size="lg" arrow="down">
                See our work
              </Button>
            </motion.div>
          </div>
        </div>

        <HeroFooter />
      </motion.div>
    </section>
  );
}

function HeroFooter() {
  const fine = useFinePointer();
  const [coords, setCoords] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    if (!fine) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() =>
        setCoords({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight }),
      );
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [fine]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 1.4 }}
      className="mt-12 flex items-center justify-between border-t border-line py-5 eyebrow text-muted md:mt-16"
    >
      <span className="flex items-center gap-3">
        <span className="relative block h-6 w-px overflow-hidden bg-line-2" aria-hidden="true">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-accent"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
        Scroll
      </span>
      {fine ? (
        <span aria-hidden="true" className="hidden tabular-nums md:block">
          X {coords.x.toFixed(3)} &nbsp; Y {coords.y.toFixed(3)}
        </span>
      ) : null}
      <span>{fine ? "Move the cursor over the system" : DISCIPLINES.slice(0, 3).join(" / ")}</span>
    </motion.div>
  );
}
