import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { nav, site, socials } from "@/content/site";
import { EASE_IN_OUT, EASE_OUT } from "@/lib/easing";
import { useLocalTime } from "@/hooks/useLocalTime";
import { SmartLink } from "@/components/ui/SmartLink";
import { Button } from "@/components/ui/Button";
import { StatusDot } from "@/components/ui/StatusDot";

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const time = useLocalTime(site.location.timeZone);

  // Escape closes; focus moves into the dialog and is trapped while open.
  useEffect(() => {
    if (!open) return;
    const el = ref.current;
    const focusables = () =>
      Array.from(el?.querySelectorAll<HTMLElement>("a, button") ?? []).filter((n) => !n.hasAttribute("disabled"));
    const t = window.setTimeout(() => focusables()[0]?.focus(), 350);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const f = focusables();
        if (!f.length) return;
        const first = f[0],
          last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-[45] flex flex-col bg-ink lg:hidden"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.8, ease: EASE_IN_OUT }}
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid-bg opacity-40 [--grid-size:48px]" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-1/3 top-1/4 size-[80vw] rounded-full bg-accent/10 blur-[100px]"
          />

          <div className="shell relative flex flex-1 flex-col pb-8 pt-[calc(var(--header-h)+2rem)]">
            <nav aria-label="Mobile" className="flex-1">
              <ul className="border-t border-line">
                {[{ label: "Home", to: "/" }, ...nav].map((item, i) => (
                  <li key={item.to} className="overflow-hidden border-b border-line">
                    <motion.div
                      initial={{ y: "100%" }}
                      animate={{ y: "0%" }}
                      exit={{ y: "100%" }}
                      transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.25 + i * 0.05 }}
                    >
                      <SmartLink
                        to={item.to}
                        onClick={onClose}
                        className="group flex items-baseline justify-between py-4 active:text-accent"
                      >
                        <span className="text-[clamp(2.25rem,11vw,4.5rem)] font-medium leading-none tracking-[-0.05em]">
                          {item.label}
                        </span>
                        <span className="eyebrow text-dim group-active:text-accent">0{i}</span>
                      </SmartLink>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.55, ease: EASE_OUT }}
              className="mt-10 space-y-8"
            >
              <Button to="/contact" variant="accent" size="lg" className="w-full" magnetic={false} onClick={onClose}>
                Start a project
              </Button>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="eyebrow text-dim">Contact</p>
                  <a href={`mailto:${site.email}`} className="block text-sm text-fg-2">
                    {site.email}
                  </a>
                </div>
                <div className="space-y-2">
                  <p className="eyebrow text-dim">Social</p>
                  <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-fg-2">
                    {socials.map((s) => (
                      <li key={s.label}>
                        <a href={s.href}>{s.label}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-line pt-5 eyebrow text-muted">
                <StatusDot label={site.status} />
                <span className="tabular-nums">{time}</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
