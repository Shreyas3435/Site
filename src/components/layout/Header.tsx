import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { nav } from "@/content/site";
import { cn } from "@/lib/cn";
import { EASE_OUT } from "@/lib/easing";
import { useLenis } from "@/lib/smooth-scroll";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { SmartLink } from "@/components/ui/SmartLink";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const location = useLocation();
  const lenis = useLenis();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    // Hide while reading downward, return on any upward intent.
    setHidden(y > 240 && y > prev + 2 && !menuOpen);
    if (y < prev - 2) setHidden(false);
  });

  useEffect(() => setMenuOpen(false), [location.pathname]);

  useEffect(() => {
    if (menuOpen) lenis?.stop();
    else lenis?.start();
    document.documentElement.style.overflow = menuOpen && !lenis ? "hidden" : "";
  }, [menuOpen, lenis]);

  const isActive = (to: string) => {
    if (to.includes("#")) return false;
    return location.pathname === to || location.pathname.startsWith(`${to}/`);
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: hidden ? -96 : 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE_OUT }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={cn(
            "absolute inset-0 border-b transition-[background-color,border-color,backdrop-filter] duration-500",
            scrolled && !menuOpen
              ? "border-line bg-ink/70 backdrop-blur-xl backdrop-saturate-150"
              : "border-transparent bg-transparent",
          )}
        />
        <div className="shell relative flex h-[var(--header-h)] items-center justify-between">
          <SmartLink to="/" aria-label="Arka home" className="relative z-[70] -m-2 w-auto p-2" data-cursor="">
            <Logo />
          </SmartLink>

          <nav aria-label="Primary" className="hidden items-center gap-10 lg:flex">
            <ul className="flex items-center gap-1" onMouseLeave={() => setHovered(null)}>
              {nav.map((item) => {
                const active = isActive(item.to);
                return (
                  <li key={item.to} className="relative">
                    <SmartLink
                      to={item.to}
                      onMouseEnter={() => setHovered(item.to)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative block px-4 py-2 eyebrow transition-colors duration-300",
                        active ? "text-fg" : "text-muted hover:text-fg",
                      )}
                    >
                      {hovered === item.to && (
                        <motion.span
                          layoutId="nav-hover"
                          className="absolute inset-0 rounded-full bg-fg/[0.06]"
                          transition={{ type: "spring", stiffness: 400, damping: 34 }}
                        />
                      )}
                      <span className="relative">{item.label}</span>
                      {active && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute bottom-0 left-1/2 size-1 -translate-x-1/2 rounded-full bg-accent"
                          transition={{ type: "spring", stiffness: 400, damping: 34 }}
                        />
                      )}
                    </SmartLink>
                  </li>
                );
              })}
            </ul>
            <Button to="/contact" size="sm" variant="primary">
              Start a project
            </Button>
          </nav>

          <button
            type="button"
            className="relative z-[70] flex h-11 items-center gap-3 pl-2 lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="eyebrow text-fg-2">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={menuOpen ? "close" : "menu"}
                  initial={{ y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -8, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="block"
                >
                  {menuOpen ? "Close" : "Menu"}
                </motion.span>
              </AnimatePresence>
            </span>
            <span className="relative block h-3 w-6" aria-hidden="true">
              <span
                className={cn(
                  "absolute left-0 top-0.5 h-px w-6 bg-fg transition-transform duration-500 ease-[var(--ease-out-expo)]",
                  menuOpen && "translate-y-[5px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "absolute bottom-0.5 left-0 h-px bg-fg transition-all duration-500 ease-[var(--ease-out-expo)]",
                  menuOpen ? "w-6 -translate-y-[4px] -rotate-45" : "w-4",
                )}
              />
            </span>
          </button>
        </div>
      </motion.header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
