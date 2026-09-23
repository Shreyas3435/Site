import { useEffect, useState, type RefObject } from "react";

/** Lightweight visibility flag used to pause canvas/rAF work off-screen. */
export function useInViewport(ref: RefObject<Element | null>, rootMargin = "0px") {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);
  return visible;
}
