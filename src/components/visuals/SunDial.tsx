import { motion, useInView, useSpring, useTransform } from "motion/react";
import { useId, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import { nav } from "@/content/site";
import { cn } from "@/lib/cn";
import { EASE_OUT } from "@/lib/easing";
import { SmartLink } from "@/components/ui/SmartLink";

/**
 * The Arka mark blown up into a sundial navigation.
 * The A stands on the horizon, the sun rises inside it, and every page is a
 * direction on the arc above. The beam swings to whichever direction the
 * pointer is closest to; clicking anywhere on the dial follows it.
 */

// Dial space. The horizon runs through (CX, CY), which is the sun's centre.
const W = 900;
const H = 470;
const CX = 450;
const CY = 400;
const R_NODE = 300;
const R_LABEL = 350;
const SCALE = 6; // logo-mark units → dial units
const R_SUN = 6.5 * SCALE;

const BLURB: Record<string, string> = {
  "/work": "Systems we've built",
  "/capabilities": "What we take on",
  "/#process": "How an engagement runs",
  "/#planner": "Scope your project",
  "/about": "The team behind Arka",
  "/contact": "Start a conversation",
};

// Spread the pages across the sky, left (170°) to right (10°).
const ANGLES = nav.map((_, i) => 170 - (160 / Math.max(nav.length - 1, 1)) * i);

const polar = (deg: number, r: number) => {
  const t = (deg * Math.PI) / 180;
  return [CX + r * Math.cos(t), CY - r * Math.sin(t)] as const;
};

// Logo-mark coordinates (48×48, sun centre at 24,34) → dial coordinates.
const mark = (x: number, y: number) => `${CX + (x - 24) * SCALE},${CY + (y - 34) * SCALE}`;
const A_POINTS = [mark(7, 43), mark(24, 5), mark(41, 43)].join(" ");

function wedge(deg: number, spread = 7, r0 = R_SUN + 10, r1 = R_NODE - 20) {
  const [ax, ay] = polar(deg - spread, r0);
  const [bx, by] = polar(deg - spread, r1);
  const [cx, cy] = polar(deg + spread, r1);
  const [dx, dy] = polar(deg + spread, r0);
  return `M${ax} ${ay}L${bx} ${by}A${r1} ${r1} 0 0 0 ${cx} ${cy}L${dx} ${dy}Z`;
}

function nearest(deg: number) {
  let best = 0;
  ANGLES.forEach((a, i) => {
    if (Math.abs(a - deg) < Math.abs(ANGLES[best] - deg)) best = i;
  });
  return best;
}

export function SunDial({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, "");
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const touchArmed = useRef(false);
  const inView = useInView(wrapRef, { once: true, margin: "0px 0px -15% 0px" });
  const [active, setActive] = useState<number | null>(null);

  const beam = useSpring(90, { stiffness: 170, damping: 22 });
  const beamPath = useTransform(beam, (a) => wedge(a));

  const select = (i: number | null) => {
    setActive(i);
    if (i !== null) beam.set(ANGLES[i]);
  };

  const indexAt = (e: PointerEvent) => {
    const rect = svgRef.current!.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    const y = ((e.clientY - rect.top) / rect.height) * H;
    // Below the horizon, snap to whichever end of the sky is closer.
    const deg = y >= CY ? (x < CX ? 180 : 0) : (Math.atan2(CY - y, x - CX) * 180) / Math.PI;
    return nearest(deg);
  };

  const onPointerMove = (e: PointerEvent) => {
    if (e.pointerType === "mouse") select(indexAt(e));
  };

  // Touch: first tap aims the beam, a second tap on the same direction follows it.
  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType === "mouse") return;
    const i = indexAt(e);
    touchArmed.current = i === active;
    select(i);
  };

  const onClick = (e: MouseEvent) => {
    if ((e.target as Element).closest("a") || active === null) return;
    const isTouch = (e.nativeEvent as globalThis.PointerEvent).pointerType !== "mouse";
    if (isTouch && !touchArmed.current) return;
    linkRefs.current[active]?.click();
  };

  const current = active !== null ? nav[active] : null;

  return (
    <nav aria-label="Explore Arka" className={cn("relative", className)}>
      <div
        ref={wrapRef}
        className="relative mx-auto max-w-[56rem] cursor-pointer select-none"
        data-cursor={current ? "Go" : ""}
        onPointerMove={onPointerMove}
        onPointerDown={onPointerDown}
        onPointerLeave={() => select(null)}
        onClick={onClick}
      >
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} aria-hidden="true" className="block w-full overflow-visible">
          <defs>
            <radialGradient id={`beam-${uid}`} gradientUnits="userSpaceOnUse" cx={CX} cy={CY} r={R_NODE}>
              <stop offset="0" stopColor="#ff5b2e" stopOpacity="0.55" />
              <stop offset="1" stopColor="#ff5b2e" stopOpacity="0" />
            </radialGradient>
            <clipPath id={`sky-${uid}`}>
              <rect x="0" y="0" width={W} height={CY} />
            </clipPath>
          </defs>

          {/* orbit + horizon */}
          <motion.path
            d={`M${CX - R_NODE} ${CY}A${R_NODE} ${R_NODE} 0 0 1 ${CX + R_NODE} ${CY}`}
            fill="none"
            className="stroke-line-2"
            strokeDasharray="2 7"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.6 }}
          />
          <motion.line
            x1="0"
            x2={W}
            y1={CY}
            y2={CY}
            className="stroke-line-2"
            initial={{ pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : {}}
            transition={{ duration: 1.4, ease: EASE_OUT }}
          />

          {/* rays, one per page */}
          {ANGLES.map((a, i) => {
            const [x1, y1] = polar(a, R_SUN + 16);
            const [x2, y2] = polar(a, R_NODE - 16);
            return (
              <motion.line
                key={a}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                strokeWidth={1.5}
                className={cn("transition-[stroke] duration-300", active === i ? "stroke-accent" : "stroke-line-2")}
                initial={{ pathLength: 0 }}
                animate={inView ? { pathLength: 1 } : {}}
                transition={{ duration: 0.9, ease: EASE_OUT, delay: 1.1 + i * 0.07 }}
              />
            );
          })}

          <motion.path
            d={beamPath}
            fill={`url(#beam-${uid})`}
            animate={{ opacity: active !== null ? 1 : 0 }}
            transition={{ duration: 0.35 }}
          />

          {/* the sun, rising over the horizon */}
          {active !== null && (
            <motion.circle
              cx={CX}
              cy={CY}
              r={R_SUN}
              fill="none"
              stroke="#ff5b2e"
              initial={{ scale: 1, opacity: 0.9 }}
              animate={{ scale: 2.6, opacity: 0 }}
              transition={{ duration: 1.6, ease: EASE_OUT, repeat: Infinity }}
            />
          )}
          <g clipPath={`url(#sky-${uid})`}>
            <motion.path
              d={`M${CX - R_SUN} ${CY}A${R_SUN} ${R_SUN} 0 0 1 ${CX + R_SUN} ${CY}Z`}
              fill="#ff5b2e"
              initial={{ y: R_SUN + 6 }}
              animate={{ y: !inView ? R_SUN + 6 : active !== null ? -10 : 0 }}
              transition={{ duration: 1.1, ease: EASE_OUT, delay: inView && active === null ? 0.9 : 0 }}
            />
          </g>

          {/* the A */}
          <motion.polyline
            points={A_POINTS}
            fill="none"
            strokeWidth={5 * SCALE}
            strokeLinejoin="miter"
            className="stroke-fg"
            initial={{ pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : {}}
            transition={{ duration: 1.3, ease: [0.65, 0, 0.35, 1], delay: 0.2 }}
          />

          {/* nodes */}
          {ANGLES.map((a, i) => {
            const [x, y] = polar(a, R_NODE);
            const on = active === i;
            return (
              <g key={a}>
                <circle
                  cx={x}
                  cy={y}
                  r={on ? 14 : 0}
                  fill="none"
                  className="stroke-accent transition-[r] duration-300"
                />
                <circle
                  cx={x}
                  cy={y}
                  r={5}
                  className={cn(
                    "transition-[fill,stroke] duration-300",
                    on ? "fill-accent stroke-accent" : "fill-ink stroke-muted",
                  )}
                  strokeWidth={1.5}
                />
              </g>
            );
          })}
        </svg>

        {/* labels on the arc (desktop) */}
        {nav.map((item, i) => {
          const [x, y] = polar(ANGLES[i], R_LABEL);
          return (
            <SmartLink
              key={item.to}
              ref={(el) => {
                linkRefs.current[i] = el;
              }}
              to={item.to}
              onFocus={() => select(i)}
              onBlur={() => select(null)}
              className={cn(
                "absolute hidden -translate-x-1/2 -translate-y-1/2 whitespace-nowrap px-2 py-1 eyebrow transition-colors duration-300 md:block",
                active === i ? "text-fg" : "text-muted",
              )}
              style={{ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` }}
            >
              <span className={cn("mr-2 transition-colors", active === i ? "text-accent" : "text-dim")}>
                {String(i + 1).padStart(2, "0")}
              </span>
              {item.label}
            </SmartLink>
          );
        })}
      </div>

      {/* readout */}
      <p aria-hidden="true" className="mt-6 h-5 text-center eyebrow text-muted md:mt-8">
        {current ? (
          <>
            <span className="text-accent">→</span>&nbsp;&nbsp;
            <span className="text-fg">{current.label}</span>&nbsp;&nbsp;·&nbsp;&nbsp;{BLURB[current.to] ?? ""}
          </>
        ) : (
          <>
            <span className="hidden md:inline">Point the sun somewhere</span>
            <span className="md:hidden">Tap a direction, tap again to go</span>
          </>
        )}
      </p>

      {/* the same directions as a list (mobile) */}
      <ul className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:hidden">
        {nav.map((item, i) => (
          <li key={item.to}>
            <SmartLink
              to={item.to}
              className={cn(
                "flex h-full items-center gap-3 bg-ink px-4 py-4 eyebrow transition-colors",
                active === i ? "text-fg" : "text-fg-2",
              )}
            >
              <span className={active === i ? "text-accent" : "text-dim"}>{String(i + 1).padStart(2, "0")}</span>
              {item.label}
            </SmartLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
