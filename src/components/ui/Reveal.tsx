import { motion, type Variants } from "motion/react";
import { createElement, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { EASE_OUT } from "@/lib/easing";

type Tag = "h1" | "h2" | "h3" | "p" | "div" | "span";

/**
 * Word-by-word masked reveal. Pass `lines` to control line breaks explicitly.
 * Screen readers get the plain string; the animated spans are aria-hidden.
 */
export function RevealText({
  as = "h2",
  id,
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.045,
  once = true,
  immediate = false,
}: {
  as?: Tag;
  id?: string;
  lines: (string | ReactNode)[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
  /** Animate on mount rather than on scroll into view. */
  immediate?: boolean;
}) {
  const plain = lines.map((l) => (typeof l === "string" ? l : "")).join(" ");
  let wordIndex = 0;

  const word: Variants = {
    hidden: { y: "108%" },
    show: (i: number) => ({ y: "0%", transition: { duration: 1, ease: EASE_OUT, delay: delay + i * stagger } }),
  };

  const trigger = immediate
    ? { initial: "hidden", animate: "show" }
    : { initial: "hidden", whileInView: "show", viewport: { once, margin: "0px 0px -12% 0px" } };

  return createElement(
    as,
    { className, id },
    <>
      <span className="sr-only">{plain}</span>
      <motion.span aria-hidden="true" className="block" {...trigger}>
        {lines.map((line, li) => (
          <span key={li} className={cn("block", lineClassName)}>
            {typeof line === "string"
              ? line.split(" ").map((w, wi) => {
                  const i = wordIndex++;
                  return (
                    <span key={wi} className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-top">
                      <motion.span custom={i} variants={word} className="inline-block will-change-transform">
                        {w}
                        {wi < line.split(" ").length - 1 ? " " : ""}
                      </motion.span>
                    </span>
                  );
                })
              : (() => {
                  const i = wordIndex++;
                  return (
                    <span className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-top">
                      <motion.span custom={i} variants={word} className="inline-block">
                        {line}
                      </motion.span>
                    </span>
                  );
                })()}
          </span>
        ))}
      </motion.span>
    </>,
  );
}

/** Generic fade-up on scroll. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "li" | "section" | "article" | "p" | "span";
}) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.9, ease: EASE_OUT, delay }}
    >
      {children}
    </M>
  );
}
