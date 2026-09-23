import { motion, useInView } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import type { ProjectVisual as Kind } from "@/content/projects";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/cn";
import { EASE_OUT } from "@/lib/easing";

/**
 * Abstract, illustrative previews used until real screenshots exist.
 * They depict the *kind* of system, not real data. Replace by adding
 * `images[].src` to a project — `MediaSlot` will render the image instead.
 */
export function ProjectVisual({ kind, className }: { kind: Kind; className?: string }) {
  return (
    <div className={cn("relative size-full overflow-hidden bg-ink-2", className)}>
      <div aria-hidden="true" className="absolute inset-0 grid-bg opacity-40 [--grid-size:32px]" />
      <div
        aria-hidden="true"
        className="absolute -right-[20%] -top-[30%] size-[70%] rounded-full bg-accent/[0.10] blur-[80px]"
      />
      {kind === "search" && <SearchPreview />}
      {kind === "platform" && <PlatformPreview />}
      {kind === "automation" && <AutomationPreview />}
    </div>
  );
}

const mono = "font-mono uppercase tracking-[0.12em]";

function useTyped(text: string, active: boolean) {
  const reduced = usePrefersReducedMotion();
  const [n, setN] = useState(reduced ? text.length : 0);
  useEffect(() => {
    if (!active || reduced) return;
    let i = 0;
    const id = window.setInterval(() => {
      i++;
      setN(i);
      if (i >= text.length) window.clearInterval(id);
    }, 70);
    return () => window.clearInterval(id);
  }, [active, reduced, text]);
  return text.slice(0, n);
}

function SearchPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  const query = "ss hex bolt m6 x 30";
  const typed = useTyped(query, inView);
  const done = typed.length === query.length;
  const parsed = [
    ["ss", "material: stainless"],
    ["hex bolt", "category"],
    ["m6", "thread: M6"],
    ["30", "length: 30mm"],
  ];

  return (
    <div ref={ref} className="absolute inset-x-[7%] bottom-[7%] top-[16%] flex flex-col gap-[4%]">
      <div className="flex items-center gap-3 rounded-full border border-line-2 bg-ink/80 px-[4%] py-[2.2%]">
        <svg viewBox="0 0 16 16" className="size-3.5 shrink-0 text-muted" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="7" cy="7" r="5" />
          <path d="M11 11l3.5 3.5" />
        </svg>
        <span className="truncate text-[clamp(0.625rem,1.2vw,1rem)] text-fg">
          {typed}
          <span className="ml-px inline-block h-[1em] w-px translate-y-[0.15em] animate-pulse bg-accent" />
        </span>
      </div>

      <div className="flex flex-wrap gap-[1.5%]">
        {parsed.map(([t, v], i) => (
          <motion.span
            key={t}
            initial={{ opacity: 0, y: 6 }}
            animate={done ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: EASE_OUT, delay: i * 0.1 }}
            className={cn(
              "flex items-center gap-1.5 rounded-sm border border-accent/40 bg-accent/10 px-2 py-1 text-[clamp(0.5rem,0.7vw,0.6875rem)] text-accent-2",
              mono,
            )}
          >
            {t} <span className="text-fg/40">→</span> <span className="text-fg/80">{v}</span>
          </motion.span>
        ))}
      </div>

      <div className="flex flex-1 flex-col justify-between">
        {[0.94, 0.81, 0.66, 0.52].map((score, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={done ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.4 + i * 0.08 }}
            className={cn(
              "flex items-center gap-[3%] border-b border-line py-[1.6%]",
              i === 0 && "border-accent/30",
            )}
          >
            <span className="aspect-square w-[7%] shrink-0 rounded-sm border border-line-2 bg-fg/[0.04]" />
            <span className="flex flex-1 flex-col gap-1.5">
              <span className={cn("h-1.5 rounded-full", i === 0 ? "w-[62%] bg-fg/60" : "w-[48%] bg-fg/25")} />
              <span className="h-1 w-[34%] rounded-full bg-fg/10" />
            </span>
            <span className="flex w-[18%] items-center gap-2">
              <span className="h-1 flex-1 overflow-hidden rounded-full bg-fg/10">
                <motion.span
                  className={cn("block h-full", i === 0 ? "bg-accent" : "bg-fg/40")}
                  initial={{ width: 0 }}
                  animate={done ? { width: `${score * 100}%` } : {}}
                  transition={{ duration: 1, ease: EASE_OUT, delay: 0.6 + i * 0.08 }}
                />
              </span>
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function PlatformPreview() {
  const fillId = useId();
  return (
    <div className="absolute inset-x-[7%] bottom-[7%] top-[16%] flex overflow-hidden rounded-md border border-line-2 bg-ink/80">
      <div className="flex w-[18%] flex-col gap-[6%] border-r border-line p-[3%]">
        <span className="h-2 w-2/3 rounded-full bg-accent/70" />
        <span className="mt-[10%] h-1.5 w-full rounded-full bg-fg/30" />
        {[0.8, 0.6, 0.7, 0.5, 0.65].map((w, i) => (
          <span key={i} className="h-1.5 rounded-full bg-fg/10" style={{ width: `${w * 100}%` }} />
        ))}
      </div>
      <div className="flex flex-1 flex-col gap-[4%] p-[3.5%]">
        <div className="flex items-center justify-between">
          <span className="h-2 w-1/4 rounded-full bg-fg/40" />
          <span className="flex gap-2">
            <span className="size-3 rounded-full border border-line-2" />
            <span className="h-3 w-10 rounded-full bg-fg/80" />
          </span>
        </div>
        <div className="grid grid-cols-3 gap-[3%]">
          {[0.7, 0.45, 0.85].map((w, i) => (
            <div key={i} className={cn("space-y-2 rounded border p-[8%]", i === 2 ? "border-accent/40" : "border-line")}>
              <span className="block h-1 w-1/2 rounded-full bg-fg/20" />
              <span className={cn("block h-2.5 rounded-full", i === 2 ? "bg-accent/80" : "bg-fg/50")} style={{ width: `${w * 100}%` }} />
            </div>
          ))}
        </div>
        <div className="relative flex-1 rounded border border-line">
          <svg viewBox="0 0 300 100" preserveAspectRatio="none" className="absolute inset-0 size-full">
            <defs>
              <linearGradient id={fillId} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#ff5b2e" stopOpacity="0.3" />
                <stop offset="1" stopColor="#ff5b2e" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0 80 C30 70 50 76 80 60 S130 50 160 44 S220 30 250 26 S290 16 300 12 V100 H0Z" fill={`url(#${fillId})`} />
            <motion.path
              d="M0 80 C30 70 50 76 80 60 S130 50 160 44 S220 30 250 26 S290 16 300 12"
              fill="none"
              stroke="#ff5b2e"
              strokeWidth="1.2"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: EASE_OUT }}
            />
            <path d="M0 88 C40 84 70 86 110 78 S190 72 230 66 S280 60 300 58" fill="none" stroke="rgb(237 235 230 / 0.2)" strokeWidth="1" vectorEffect="non-scaling-stroke" strokeDasharray="3 3" />
          </svg>
        </div>
        <div className="space-y-[2%]">
          {[0, 1, 2].map((r) => (
            <div key={r} className="flex items-center gap-[4%] border-t border-line pt-[2%]">
              <span className="h-1 w-[20%] rounded-full bg-fg/25" />
              <span className="h-1 w-[30%] rounded-full bg-fg/10" />
              <span className="ml-auto h-1 w-[10%] rounded-full bg-fg/20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AutomationPreview() {
  const nodes = [
    { x: 8, y: 50, label: "Trigger", sub: "webhook" },
    { x: 30, y: 26, label: "Extract", sub: "ai model", hot: true },
    { x: 30, y: 74, label: "Enrich", sub: "api" },
    { x: 54, y: 50, label: "Validate", sub: "rules" },
    { x: 78, y: 24, label: "System A", sub: "sync" },
    { x: 78, y: 50, label: "System B", sub: "sync" },
    { x: 78, y: 76, label: "Review", sub: "human", hot: true },
  ];
  const edges: [number, number][] = [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 3],
    [3, 4],
    [3, 5],
    [3, 6],
  ];
  const path = (a: (typeof nodes)[number], b: (typeof nodes)[number]) => {
    const mx = (a.x + b.x) / 2;
    return `M${a.x + 7} ${a.y} C${mx} ${a.y} ${mx} ${b.y} ${b.x - 7} ${b.y}`;
  };

  return (
    <div className="absolute inset-x-[5%] bottom-[5%] top-[14%]">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden="true">
        {edges.map(([a, b], i) => {
          const d = path(nodes[a], nodes[b]);
          return (
            <g key={i}>
              <path d={d} fill="none" stroke="rgb(237 235 230 / 0.18)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              <circle r="0.9" fill="#ff5b2e">
                <animateMotion dur={`${2.2 + (i % 3) * 0.4}s`} begin={`${i * 0.3}s`} repeatCount="indefinite" path={d} />
              </circle>
            </g>
          );
        })}
      </svg>
      {nodes.map((n) => (
        <div
          key={n.label}
          className={cn(
            "absolute w-[15%] -translate-x-1/2 -translate-y-1/2 rounded border bg-ink/90 px-[1.2%] py-[1%]",
            n.hot ? "border-accent/60" : "border-line-2",
          )}
          style={{ left: `${n.x}%`, top: `${n.y}%` }}
        >
          <p className={cn("truncate text-[clamp(0.45rem,0.75vw,0.6875rem)]", mono, n.hot ? "text-accent" : "text-fg")}>
            {n.label}
          </p>
          <p className={cn("truncate text-[clamp(0.4rem,0.6vw,0.5625rem)] text-muted", mono)}>{n.sub}</p>
        </div>
      ))}
    </div>
  );
}
