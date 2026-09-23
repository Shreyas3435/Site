import Lenis from "lenis";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

const LenisContext = createContext<Lenis | null>(null);

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (reduced) return;
    const instance = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // Touch keeps native momentum scrolling — it already feels right.
      syncTouch: false,
    });
    let raf = 0;
    const loop = (time: number) => {
      instance.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    setLenis(instance);
    return () => {
      cancelAnimationFrame(raf);
      instance.destroy();
      setLenis(null);
    };
  }, [reduced]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

export const useLenis = () => useContext(LenisContext);

/** Scroll helper that works with or without Lenis (reduced motion). */
export function scrollToTarget(lenis: Lenis | null, target: string | HTMLElement | number, immediate = false) {
  const offset = -72;
  if (lenis) {
    lenis.scrollTo(target, { offset: typeof target === "number" ? 0 : offset, immediate, duration: 1.4 });
    return;
  }
  if (typeof target === "number") return window.scrollTo({ top: target, behavior: "auto" });
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: "auto" });
}
