import { useId } from "react";

type MarkProps = { size?: number; animated?: boolean; className?: string };

// Sharp A = the structure we build. Orange half-sun rising inside it = Arka, the sun.
export function LogoMark({ size = 26, animated = true, className = "" }: MarkProps) {
  const clipId = `ar-hz-${useId().replace(/:/g, "")}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      aria-hidden="true"
      className={`ar-mark shrink-0 ${animated ? "ar-animated" : ""} ${className}`}
    >
      <defs>
        <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
          <rect x="0" y="0" width="48" height="34" />
        </clipPath>
      </defs>
      <circle className="ar-ray" cx="24" cy="34" r="6" />
      <g clipPath={`url(#${clipId})`}>
        <path className="ar-sun" d="M17.5 34A6.5 6.5 0 0 1 30.5 34Z" />
      </g>
      <polyline className="ar-a" points="7,43 24,5 41,43" />
    </svg>
  );
}

type LogoProps = MarkProps & { wordmark?: boolean };

export function Logo({ size = 26, wordmark = true, animated = true, className = "" }: LogoProps) {
  return (
    <span className={`ar-logo inline-flex items-center gap-3 text-fg ${className}`}>
      <LogoMark size={size} animated={animated} />
      {wordmark && (
        <span className={`ar-word font-sans text-[0.8125rem] font-semibold ${animated ? "ar-animated" : ""}`}>
          ARKA
        </span>
      )}
    </span>
  );
}
