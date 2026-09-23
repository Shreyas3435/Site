import type { CSSProperties } from "react";
import type { Project } from "@/content/projects";
import { cn } from "@/lib/cn";
import { SlidingArrow } from "@/components/ui/Arrow";
import { Corners, MediaSlot } from "@/components/ui/Placeholder";
import { SmartLink } from "@/components/ui/SmartLink";
import { ProjectVisual } from "@/components/visuals/ProjectVisual";

/** Case-study preview. The whole card is one link. */
export function ProjectCard({
  project,
  total,
  className,
  style,
  layout = "stacked",
}: {
  style?: CSSProperties;
  project: Project;
  total: number;
  className?: string;
  /** "split" puts meta beside the visual on large screens. */
  layout?: "stacked" | "split";
}) {
  const cover = project.images[0];
  return (
    <article className={cn("group", className)} style={style}>
      <SmartLink
        to={`/work/${project.slug}`}
        data-cursor="View"
        className={cn("block", layout === "split" && "lg:grid lg:grid-cols-12 lg:gap-10")}
      >
        <div
          className={cn(
            "relative aspect-[16/10] overflow-hidden border border-line transition-colors duration-500 group-hover:border-line-2",
            layout === "split" && "lg:col-span-8",
          )}
        >
          <div className="absolute inset-0 transition-transform duration-[1400ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.035]">
            {cover?.src ? (
              <MediaSlot src={cover.src} alt={cover.alt} className="size-full" />
            ) : (
              <ProjectVisual kind={project.visual} />
            )}
          </div>
          <Corners />
          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4 eyebrow md:p-5">
            <span className="rounded-full bg-ink/70 px-2.5 py-1 text-fg backdrop-blur">
              {project.index} <span className="text-dim">/ {String(total).padStart(2, "0")}</span>
            </span>
            {!cover?.src && <span className="hidden text-dim sm:block">Preview · screenshot slot</span>}
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </div>

        <div className={cn("mt-6 md:mt-8", layout === "split" && "lg:col-span-4 lg:mt-0 lg:flex lg:flex-col lg:justify-end")}>
          <p className="eyebrow text-accent">{project.kicker}</p>
          <h3 className="mt-3 text-heading font-medium uppercase">
            <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-700 ease-[var(--ease-out-expo)] group-hover:bg-[length:100%_2px]">
              {project.title}
            </span>
          </h3>
          <p className="mt-4 max-w-xl text-fg-2 text-balance-pretty">{project.summary}</p>
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technologies">
            {project.tags.map((t) => (
              <li key={t} className="rounded-full border border-line-2 px-3 py-1 eyebrow text-[0.625rem] text-fg-2">
                {t}
              </li>
            ))}
          </ul>
          <span className="mt-7 inline-flex items-center gap-3 eyebrow text-fg">
            Read case study <SlidingArrow />
          </span>
        </div>
      </SmartLink>
    </article>
  );
}
