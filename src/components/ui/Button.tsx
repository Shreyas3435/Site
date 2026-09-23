import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { SlidingArrow } from "./Arrow";
import { Magnetic } from "./Magnetic";
import { SmartLink } from "./SmartLink";

type Variant = "primary" | "ghost" | "accent";
type Size = "sm" | "md" | "lg";

type Common = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  arrow?: "right" | "down" | "up-right" | false;
  magnetic?: boolean;
  className?: string;
  cursorLabel?: string;
};

type AsLink = Common & { to: string; type?: never; onClick?: () => void; disabled?: never };
type AsButton = Common & { to?: never; type?: "button" | "submit"; onClick?: () => void; disabled?: boolean };

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[0.6875rem]",
  md: "h-12 px-6 text-xs",
  lg: "h-14 px-7 text-[0.8125rem] md:h-16 md:px-9",
};

const variants: Record<Variant, { base: string; fill: string }> = {
  primary: { base: "bg-fg text-ink", fill: "bg-accent" },
  accent: { base: "bg-accent text-accent-ink", fill: "bg-fg" },
  ghost: { base: "text-fg ring-1 ring-inset ring-line-2 hover:ring-fg/40", fill: "bg-fg/[0.06]" },
};

export function Button(props: AsLink | AsButton) {
  const { children, variant = "primary", size = "md", arrow = "right", magnetic = true, className, cursorLabel } = props;
  const v = variants[variant];

  const inner = (
    <>
      {/* fill sweeps up from the bottom on hover */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-0 translate-y-[101%] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0 group-focus-visible:translate-y-0",
          v.fill,
        )}
      />
      <span className="relative z-10 inline-flex items-center gap-3">
        <span className="font-mono uppercase tracking-[0.14em]">{children}</span>
        {arrow && <SlidingArrow dir={arrow} />}
      </span>
    </>
  );

  const classes = cn(
    "group relative inline-flex items-center justify-center overflow-hidden rounded-full font-medium whitespace-nowrap select-none",
    "transition-[box-shadow,color,opacity] duration-300 disabled:pointer-events-none disabled:opacity-50",
    sizes[size],
    v.base,
    className,
  );

  const el =
    "to" in props && props.to ? (
      <SmartLink to={props.to} onClick={props.onClick} className={classes} data-cursor={cursorLabel ?? ""}>
        {inner}
      </SmartLink>
    ) : (
      <button
        type={(props as AsButton).type ?? "button"}
        onClick={props.onClick}
        disabled={(props as AsButton).disabled}
        className={classes}
        data-cursor={cursorLabel ?? ""}
      >
        {inner}
      </button>
    );

  return magnetic ? <Magnetic>{el}</Magnetic> : el;
}

/** Inline text link with underline + arrow. */
export function TextLink({
  to,
  children,
  className,
  arrow = "right",
}: {
  to: string;
  children: ReactNode;
  className?: string;
  arrow?: "right" | "down" | "up-right" | false;
}) {
  return (
    <SmartLink
      to={to}
      className={cn("group inline-flex items-center gap-2 eyebrow text-fg-2 hover:text-fg transition-colors", className)}
    >
      <span className="link-line pb-0.5">{children}</span>
      {arrow && <SlidingArrow dir={arrow} />}
    </SmartLink>
  );
}
