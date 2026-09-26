import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { site } from "@/content/site";
import { EASE_OUT } from "@/lib/easing";
import { SmartLink } from "@/components/ui/SmartLink";
import { StatusDot } from "@/components/ui/StatusDot";
import { SlidingArrow } from "@/components/ui/Arrow";

/** Sections the pill should never cover. */
const HIDE_OVER = ["contact", "planner"];

/**
 * A small "start a project" pill that follows the reader once they're past the
 * hero, and gets out of the way whenever a contact form or the planner is on screen.
 */
export function FloatingCTA() {
  const { scrollY } = useScroll();
  const { pathname } = useLocation();
  const [past, setPast] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setPast(y > window.innerHeight * 0.9));

  useEffect(() => {
    setFormVisible(false);
    // Sections mount after the page transition, so look for them shortly after navigation.
    let io: IntersectionObserver | undefined;
    const id = window.setTimeout(() => {
      const els = HIDE_OVER.map((s) => document.getElementById(s)).filter((el): el is HTMLElement => !!el);
      if (!els.length) return;
      const visible = new Set<Element>();
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
          setFormVisible(visible.size > 0);
        },
        { rootMargin: "0px 0px -20% 0px" },
      );
      els.forEach((el) => io!.observe(el));
    }, 1000);
    return () => {
      window.clearTimeout(id);
      io?.disconnect();
    };
  }, [pathname]);

  const show = past && !formVisible && pathname !== "/contact";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 24, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 24, opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
          className="fixed bottom-5 right-5 z-40 md:bottom-8 md:right-8"
        >
          <SmartLink
            to={pathname === "/" ? "/#contact" : "/contact"}
            data-cursor="Talk"
            className="group flex items-center gap-4 rounded-full border border-line-2 bg-ink/80 py-2 pl-5 pr-2 shadow-[0_20px_60px_-20px_rgb(0_0_0/0.8)] backdrop-blur-xl transition-colors hover:border-accent/60"
          >
            <span className="hidden eyebrow text-fg-2 sm:block">
              <StatusDot label={site.status} />
            </span>
            <span className="eyebrow text-fg sm:hidden">Start a project</span>
            <span className="grid size-10 place-items-center rounded-full bg-accent text-accent-ink transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:rotate-[-45deg]">
              <SlidingArrow />
            </span>
          </SmartLink>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
