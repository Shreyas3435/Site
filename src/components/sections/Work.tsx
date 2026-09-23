import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useLayoutEffect, useRef, useState, type FocusEvent } from "react";
import { projects } from "@/content/projects";
import { scrollToTarget, useLenis } from "@/lib/smooth-scroll";
import { useIsDesktop, usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { Button } from "@/components/ui/Button";
import { CountUp } from "@/components/ui/CountUp";
import { RevealText, Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ProjectCard } from "./ProjectCard";

/**
 * Selected work. On desktop the section pins and the vertical scroll drives
 * a horizontal track; on smaller screens it's a considered vertical list.
 */
export function Work() {
  const desktop = useIsDesktop();
  const reduced = usePrefersReducedMotion();
  return desktop && !reduced ? <HorizontalWork /> : <StackedWork />;
}

function Intro({ className }: { className?: string }) {
  return (
    <div className={className}>
      <SectionLabel index="04">Selected work</SectionLabel>
      <RevealText id="work-title" lines={["Things", "we've built."]} className="mt-8 text-mega font-medium uppercase" />
      <p className="mt-8 max-w-md text-lede text-fg-2">
        A few representative systems. Each one started as a hard problem, not a template.
      </p>
      <p className="mt-8 eyebrow text-muted">
        <span className="text-fg">
          <CountUp to={projects.length} />
        </span>{" "}
        case studies — more being written up
      </p>
    </div>
  );
}

function HorizontalWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [vh, setVh] = useState(0);
  const [step, setStep] = useState(0);
  const lenis = useLenis();

  // Keyboard focus: browsers try to scroll the overflow-hidden pin, which would
  // desync the track. Undo that and scroll the page to where the card is visible.
  const onFocus = (e: FocusEvent) => {
    const pin = e.currentTarget.parentElement!;
    pin.scrollLeft = 0;
    const card = (e.target as HTMLElement).closest("article, div.shrink-0") as HTMLElement | null;
    if (!card || !sectionRef.current || !distance) return;
    const offset = Math.min(distance, Math.max(0, card.offsetLeft - window.innerWidth * 0.1));
    scrollToTarget(lenis, sectionRef.current.offsetTop + offset, true);
  };

  useLayoutEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      setDistance(Math.max(0, trackRef.current.scrollWidth - window.innerWidth));
      setVh(window.innerHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(trackRef.current!);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, (v) => -v * distance);
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1]);
  useMotionValueEvent(scrollYProgress, "change", (v) =>
    setStep(Math.min(projects.length, Math.max(1, Math.ceil(v * (projects.length + 0.6))))),
  );

  return (
    <section
      id="work"
      ref={sectionRef}
      aria-labelledby="work-title"
      className="relative"
      style={{ height: distance + vh || "300vh" }}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <motion.div ref={trackRef} style={{ x }} onFocus={onFocus} className="flex w-max items-center gap-[6vw] pl-[var(--gutter)] pr-[8vw] will-change-transform">
          <Intro className="w-[34vw] max-w-[560px] shrink-0" />
          {projects.map((p) => (
            <ProjectCard
              key={p.slug}
              project={p}
              total={projects.length}
              className="shrink-0 self-start"
              // keep the card (visual + meta) inside the pinned viewport
              style={{ width: "min(64vw, calc((100vh - var(--header-h) - 20rem) * 1.6))" }}
            />
          ))}
          <div className="flex w-[28vw] shrink-0 flex-col items-start gap-8">
            <p className="text-heading font-medium text-fg-2">
              There's more we can't show yet — and a slot here for yours.
            </p>
            <Button to="/work" variant="ghost" size="lg">
              All work
            </Button>
          </div>
        </motion.div>

        {/* progress rail */}
        <div className="shell absolute inset-x-0 bottom-8 flex items-center gap-6 eyebrow text-muted">
          <span className="tabular-nums text-fg">
            {String(step).padStart(2, "0")} <span className="text-dim">/ {String(projects.length).padStart(2, "0")}</span>
          </span>
          <span className="relative h-px flex-1 bg-line">
            <motion.span style={{ scaleX: bar }} className="absolute inset-0 origin-left bg-accent" />
          </span>
          <span>Scroll</span>
        </div>
      </div>
    </section>
  );
}

function StackedWork() {
  return (
    <section id="work" aria-labelledby="work-title" className="relative py-28 md:py-40">
      <div className="shell">
        <Intro />
        <div className="mt-16 space-y-20 md:mt-24 md:space-y-28">
          {projects.map((p) => (
            <Reveal key={p.slug}>
              <ProjectCard project={p} total={projects.length} />
            </Reveal>
          ))}
        </div>
        <div className="mt-20">
          <Button to="/work" variant="ghost" size="lg">
            All work
          </Button>
        </div>
      </div>
    </section>
  );
}
