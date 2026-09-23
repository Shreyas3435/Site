import type { JSX } from "react";
import { motion } from "motion/react";
import type { Capability } from "@/content/capabilities";
import { EASE_OUT } from "@/lib/easing";

/**
 * Line-drawn technical schematics, one per capability domain.
 * Pure SVG; strokes draw in with pathLength when the domain changes,
 * and SVG-native <animateMotion> moves the little data packets.
 */

const stroke = "rgb(237 235 230 / 0.35)";
const strokeDim = "rgb(237 235 230 / 0.14)";
const accent = "#ff5b2e";

const draw = (i = 0) => ({
  initial: { pathLength: 0, opacity: 0 },
  animate: { pathLength: 1, opacity: 1 },
  transition: { duration: 1.1, ease: EASE_OUT, delay: 0.05 * i },
});

const pop = (i = 0) => ({
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.6, ease: EASE_OUT, delay: 0.15 + 0.05 * i },
});

function Label({ x, y, children, anchor = "start", color = "rgb(237 235 230 / 0.55)" }: {
  x: number;
  y: number;
  children: string;
  anchor?: "start" | "middle" | "end";
  color?: string;
}) {
  return (
    <motion.text
      {...pop()}
      x={x}
      y={y}
      textAnchor={anchor}
      fill={color}
      style={{ font: "500 9px 'Geist Mono Variable', monospace", letterSpacing: "0.12em" }}
    >
      {children}
    </motion.text>
  );
}

function Packet({ path, dur = 2.4, delay = 0 }: { path: string; dur?: number; delay?: number }) {
  return (
    <circle r="2.2" fill={accent}>
      <animateMotion dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" path={path} />
    </circle>
  );
}

function Product() {
  return (
    <g>
      <motion.rect {...draw(0)} x="40" y="40" width="320" height="220" rx="6" fill="none" stroke={stroke} />
      <motion.path {...draw(1)} d="M40 64 H360" stroke={strokeDim} />
      {[0, 1, 2].map((i) => (
        <motion.circle key={i} {...pop(i)} cx={54 + i * 10} cy="52" r="2.5" fill={strokeDim} />
      ))}
      <motion.rect {...draw(2)} x="56" y="80" width="80" height="164" fill="none" stroke={strokeDim} />
      <motion.rect {...draw(3)} x="148" y="80" width="196" height="72" fill="rgb(255 91 46 / 0.08)" stroke={accent} />
      <motion.rect {...draw(4)} x="148" y="164" width="92" height="80" fill="none" stroke={strokeDim} />
      <motion.rect {...draw(5)} x="252" y="164" width="92" height="80" fill="none" stroke={strokeDim} />
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.path key={i} {...draw(6 + i)} d={`M66 ${96 + i * 18} H${118 - (i % 2) * 18}`} stroke={strokeDim} />
      ))}
      <motion.path {...draw(8)} d="M300 130 l0 18 l5 -5 l7 11 l4 -2 l-7 -11 l7 0 z" fill={stroke} stroke="none" />
      <Label x={148} y={74}>HERO / COMPONENT</Label>
      <Label x={40} y={284}>RESPONSIVE · ACCESSIBLE · FAST</Label>
    </g>
  );
}

function Engineering() {
  const tiers = [
    { x: 30, label: "CLIENT" },
    { x: 150, label: "API" },
    { x: 270, label: "DATA" },
  ];
  return (
    <g>
      {tiers.map((t, i) => (
        <g key={t.label}>
          <motion.rect
            {...draw(i)}
            x={t.x}
            y="110"
            width="100"
            height="80"
            rx="4"
            fill={i === 1 ? "rgb(255 91 46 / 0.08)" : "none"}
            stroke={i === 1 ? accent : stroke}
          />
          <Label x={t.x + 50} y={154} anchor="middle" color={i === 1 ? accent : undefined}>
            {t.label}
          </Label>
        </g>
      ))}
      <motion.path {...draw(3)} d="M130 140 H150 M130 160 H150" stroke={stroke} />
      <motion.path {...draw(4)} d="M250 140 H270 M250 160 H270" stroke={stroke} />
      {/* cache + queue satellites */}
      <motion.rect {...draw(5)} x="170" y="40" width="60" height="34" rx="3" fill="none" stroke={strokeDim} />
      <motion.rect {...draw(6)} x="170" y="226" width="60" height="34" rx="3" fill="none" stroke={strokeDim} />
      <motion.path {...draw(7)} d="M200 74 V110 M200 190 V226" stroke={strokeDim} strokeDasharray="3 3" />
      <Label x={200} y={61} anchor="middle">CACHE</Label>
      <Label x={200} y={247} anchor="middle">QUEUE</Label>
      <Packet path="M80 150 H320" dur={2.6} />
      <Packet path="M320 150 H80" dur={2.6} delay={1.3} />
      <Packet path="M200 190 V243" dur={1.8} delay={0.6} />
    </g>
  );
}

function Intelligence() {
  const bars = [0.92, 0.78, 0.61, 0.44, 0.3];
  return (
    <g>
      <motion.rect {...draw(0)} x="30" y="60" width="130" height="30" rx="15" fill="none" stroke={stroke} />
      <Label x={48} y={79}>"quiet ev for city"</Label>
      <motion.path {...draw(1)} d="M95 90 V120" stroke={strokeDim} />
      {/* embedding field */}
      {Array.from({ length: 36 }).map((_, i) => {
        const x = 40 + (i % 9) * 13;
        const y = 132 + Math.floor(i / 9) * 13;
        const on = [3, 12, 13, 21, 22, 30].includes(i);
        return <motion.circle key={i} {...pop(i * 0.2)} cx={x} cy={y} r={on ? 2.6 : 1.6} fill={on ? accent : strokeDim} />;
      })}
      <Label x={30} y={200}>EMBEDDINGS + LEXICAL</Label>
      <motion.path {...draw(2)} d="M165 150 C200 150 200 110 230 110" stroke={stroke} fill="none" />
      <Packet path="M165 150 C200 150 200 110 230 110" dur={1.8} />
      {bars.map((b, i) => (
        <g key={i}>
          <motion.rect {...draw(3 + i)} x="236" y={80 + i * 26} width={130} height="16" fill="none" stroke={strokeDim} />
          <motion.rect
            initial={{ width: 0 }}
            animate={{ width: 130 * b }}
            transition={{ duration: 1.2, ease: EASE_OUT, delay: 0.3 + i * 0.08 }}
            x="236"
            y={80 + i * 26}
            height="16"
            fill={i === 0 ? "rgb(255 91 46 / 0.55)" : "rgb(237 235 230 / 0.12)"}
          />
        </g>
      ))}
      <Label x={236} y={68}>RERANKED RESULTS</Label>
      <Label x={236} y={230}>EVALUATED · GROUNDED</Label>
    </g>
  );
}

function Infrastructure() {
  const nodes = Array.from({ length: 8 }).map((_, i) => ({ x: 50 + (i % 4) * 82, y: 150 + Math.floor(i / 4) * 64 }));
  return (
    <g>
      <motion.rect {...draw(0)} x="150" y="40" width="100" height="36" rx="18" fill="rgb(255 91 46 / 0.08)" stroke={accent} />
      <Label x={200} y={62} anchor="middle" color={accent}>EDGE / LB</Label>
      <motion.rect {...draw(1)} x="34" y="128" width="332" height="148" rx="6" fill="none" stroke={strokeDim} strokeDasharray="4 4" />
      <Label x={42} y={120}>CLUSTER · AUTOSCALING</Label>
      {nodes.map((n, i) => (
        <g key={i}>
          <motion.path {...draw(2 + i * 0.3)} d={`M200 76 L${n.x + 28} ${n.y}`} stroke={strokeDim} />
          <motion.rect {...draw(2 + i)} x={n.x} y={n.y} width="56" height="40" rx="3" fill="none" stroke={stroke} />
          {[0, 1, 2].map((k) => (
            <motion.rect key={k} {...pop(i + k)} x={n.x + 8 + k * 15} y={n.y + 14} width="10" height="12" fill={i === 2 && k === 1 ? accent : strokeDim} />
          ))}
        </g>
      ))}
      <Packet path="M200 76 L106 150" dur={1.6} />
      <Packet path="M200 76 L270 150" dur={1.6} delay={0.8} />
      <Packet path="M200 76 L352 214" dur={2} delay={0.4} />
    </g>
  );
}

function Improvement() {
  return (
    <g>
      <motion.path {...draw(0)} d="M50 40 V240 H360" stroke={stroke} fill="none" />
      {[0, 1, 2, 3].map((i) => (
        <motion.path key={i} {...draw(1 + i)} d={`M50 ${80 + i * 40} H360`} stroke="rgb(237 235 230 / 0.06)" />
      ))}
      <motion.path
        {...draw(2)}
        d="M50 90 L80 70 L110 100 L140 60 L170 85 L200 75"
        stroke={strokeDim}
        fill="none"
        strokeWidth="1.5"
      />
      <motion.path
        {...draw(4)}
        d="M200 75 C230 150 250 190 280 200 L310 196 L340 202 L360 198"
        stroke={accent}
        fill="none"
        strokeWidth="1.8"
      />
      <motion.path {...draw(3)} d="M200 40 V240" stroke={strokeDim} strokeDasharray="3 4" />
      <Label x={206} y={52}>CHANGE SHIPPED</Label>
      <Label x={46} y={34} anchor="start">LATENCY / ERRORS / COST</Label>
      <Label x={60} y={258}>BEFORE</Label>
      <Label x={300} y={258} color={accent}>AFTER</Label>
      <Packet path="M200 75 C230 150 250 190 280 200 L310 196 L340 202 L360 198" dur={3} />
    </g>
  );
}

const MAP: Record<Capability["id"], () => JSX.Element> = {
  product: Product,
  engineering: Engineering,
  intelligence: Intelligence,
  infrastructure: Infrastructure,
  improvement: Improvement,
};

export function Schematic({ id, className }: { id: Capability["id"]; className?: string }) {
  const Diagram = MAP[id];
  return (
    <svg viewBox="0 0 400 300" className={className} aria-hidden="true" fill="none" strokeWidth="1">
      <Diagram key={id} />
    </svg>
  );
}
