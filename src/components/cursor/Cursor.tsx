import { useEffect, useRef, useState } from "react";
import { useFinePointer, usePrefersReducedMotion } from "@/hooks/useMediaQuery";

/**
 * Custom cursor — only for fine pointers (mouse / trackpad).
 *
 *  dot   → tracks the pointer almost 1:1 (the real hotspot)
 *  ring  → lags slightly, grows over interactive elements, shows labels
 *  glow  → trails further behind, a soft accent haze
 *
 * Hover state is detected by event delegation, so any `a`, `button`,
 * `[role=button]`, `label` or element with `data-cursor` just works.
 * `data-cursor="View"` shows a text label inside the ring.
 * Text inputs hide it so the native caret takes over.
 */

const INTERACTIVE = 'a, button, [role="button"], label, select, summary, [data-cursor]';
const TEXT_INPUT = 'input:not([type="checkbox"]):not([type="radio"]):not([type="submit"]), textarea, [contenteditable="true"]';

export function Cursor() {
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const enabled = fine;

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [state, setState] = useState<"idle" | "hover" | "text" | "hidden">("hidden");
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    const target = { x: -100, y: -100 };
    const dot = { x: -100, y: -100 };
    const ring = { x: -100, y: -100 };
    const glow = { x: -100, y: -100 };
    let raf = 0;
    let running = false;
    let visible = false;

    const k = reduced ? { dot: 1, ring: 1, glow: 1 } : { dot: 0.55, ring: 0.18, glow: 0.07 };

    const tick = () => {
      dot.x += (target.x - dot.x) * k.dot;
      dot.y += (target.y - dot.y) * k.dot;
      ring.x += (target.x - ring.x) * k.ring;
      ring.y += (target.y - ring.y) * k.ring;
      glow.x += (target.x - glow.x) * k.glow;
      glow.y += (target.y - glow.y) * k.glow;

      dotRef.current!.style.transform = `translate3d(${dot.x}px, ${dot.y}px, 0)`;
      ringRef.current!.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
      glowRef.current!.style.transform = `translate3d(${glow.x}px, ${glow.y}px, 0)`;

      // Sleep once everything has settled — no idle rAF.
      const settled = Math.abs(target.x - glow.x) + Math.abs(target.y - glow.y) < 0.3;
      if (settled) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) {
        visible = true;
        // Jump into place instead of flying in from the corner.
        dot.x = ring.x = glow.x = target.x;
        dot.y = ring.y = glow.y = target.y;
        setState("idle");
      }
      wake();
    };

    const onOver = (e: PointerEvent) => {
      const el = e.target as Element | null;
      if (!el?.closest) return;
      if (el.closest(TEXT_INPUT)) {
        setState("text");
        setLabel("");
        return;
      }
      const hit = el.closest<HTMLElement>(INTERACTIVE);
      if (hit) {
        setState("hover");
        setLabel(hit.dataset.cursor ?? "");
      } else {
        setState("idle");
        setLabel("");
      }
    };

    const onLeaveWindow = () => {
      visible = false;
      setState("hidden");
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeaveWindow);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("blur", onLeaveWindow);

    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeaveWindow);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("blur", onLeaveWindow);
    };
  }, [enabled, reduced]);

  if (!enabled) return null;

  const hidden = state === "hidden" || state === "text";
  const hover = state === "hover";
  const hasLabel = hover && label.length > 0;
  const ringSize = hasLabel ? 88 : hover ? 56 : 30;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100]">
      {/* trailing glow */}
      <div ref={glowRef} className="absolute left-0 top-0 will-change-transform">
        <div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-500"
          style={{
            width: 220,
            height: 220,
            background: "radial-gradient(circle, rgb(255 91 46 / 0.10) 0%, rgb(255 91 46 / 0) 65%)",
            opacity: hidden ? 0 : 1,
          }}
        />
      </div>

      {/* ring */}
      <div ref={ringRef} className="absolute left-0 top-0 will-change-transform">
        <div
          className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border transition-[width,height,opacity,background-color,border-color] duration-500 ease-[var(--ease-out-expo)]"
          style={{
            width: ringSize,
            height: ringSize,
            opacity: hidden ? 0 : 1,
            borderColor: hover ? "rgb(255 91 46 / 0.9)" : "rgb(237 235 230 / 0.28)",
            backgroundColor: hasLabel ? "rgb(255 91 46 / 0.95)" : hover ? "rgb(255 91 46 / 0.08)" : "transparent",
            scale: pressed ? 0.85 : 1,
          }}
        >
          <span
            className="eyebrow text-[0.625rem] text-accent-ink transition-opacity duration-300"
            style={{ opacity: hasLabel ? 1 : 0 }}
          >
            {label}
          </span>
        </div>
      </div>

      {/* dot */}
      <div ref={dotRef} className="absolute left-0 top-0 will-change-transform">
        <div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full bg-accent transition-[width,height,opacity] duration-300"
          style={{
            width: hover ? 4 : 7,
            height: hover ? 4 : 7,
            opacity: hidden || hasLabel ? 0 : 1,
            boxShadow: "0 0 12px 2px rgb(255 91 46 / 0.55)",
          }}
        />
      </div>
    </div>
  );
}
