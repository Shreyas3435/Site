import { crew } from "@/content/studio";
import { cn } from "@/lib/cn";
import { CountUp } from "@/components/ui/CountUp";
import { Corners } from "@/components/ui/Placeholder";
import { Reveal } from "@/components/ui/Reveal";
import { Spotlight } from "@/components/ui/Spotlight";

/** The team, presented as one crew of four — no names, just coverage. */
export function CrewGrid({ className }: { className?: string }) {
  return (
    <div className={cn("grid gap-px border border-line bg-line lg:grid-cols-12", className)}>
      <Reveal className="relative flex flex-col justify-between bg-ink p-8 md:p-10 lg:col-span-4">
        <Corners />
        <p className="eyebrow text-muted">
          <span className="text-accent">■</span>&nbsp; The crew
        </p>
        <div className="mt-16 lg:mt-0">
          <p className="text-[clamp(6rem,14vw,12rem)] font-medium leading-[0.8] tracking-[-0.07em] text-fg">
            <CountUp to={crew.size} />
          </p>
          <p className="mt-6 max-w-xs text-fg-2">
            Senior engineers. Each one experienced in the technology their layer demands — together, the whole stack.
          </p>
        </div>
      </Reveal>

      <ul className="grid gap-px bg-line sm:grid-cols-2 lg:col-span-8">
        {crew.disciplines.map((d, i) => (
          <Reveal as="li" key={d.code} delay={i * 0.08} className="bg-ink">
            <Spotlight className="flex h-full flex-col p-8 md:p-10">
              <div className="flex items-center justify-between eyebrow">
                <span className="text-accent">[{String(i + 1).padStart(2, "0")}]</span>
                <span className="text-dim transition-colors duration-500 group-hover/spot:text-accent">{d.code}</span>
              </div>
              <h3 className="mt-12 text-heading font-medium uppercase">{d.title}</h3>
              <p className="mt-3 text-fg-2">{d.body}</p>
              <ul className="mt-8 flex flex-wrap gap-1.5">
                {d.stack.map((t, k) => (
                  <li
                    key={t}
                    style={{ transitionDelay: `${k * 40}ms` }}
                    className="rounded-full border border-line-2 px-2.5 py-1 eyebrow text-[0.5625rem] text-muted transition-colors duration-300 group-hover/spot:border-accent/40 group-hover/spot:text-fg"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </Spotlight>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
