import { stack } from "@/content/studio";
import { Marquee } from "@/components/ui/Marquee";
import { RevealText, Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

const rows = [[stack[0], stack[1]], [stack[2], stack[3]], [stack[4]]];

/**
 * Tools, not identity. Three counter-flowing rows of technologies, grouped by
 * layer, to say "we use whatever the problem requires".
 */
export function Stack() {
  return (
    <section aria-labelledby="stack-title" className="relative overflow-hidden border-y border-line py-28 md:py-40">
      <div className="shell grid gap-10 md:grid-cols-12">
        <div className="md:col-span-7">
          <SectionLabel index="05">Technology</SectionLabel>
          <RevealText
            id="stack-title"
            lines={["Whatever the", "problem requires."]}
            className="mt-8 text-title font-medium uppercase"
          />
        </div>
        <Reveal className="md:col-span-4 md:col-start-9 md:self-end">
          <p className="text-fg-2">
            No default stack, no vendor loyalty. We pick tools based on your team, your scale, your budget and how long
            the system needs to live — then we use them properly.
          </p>
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 eyebrow text-muted">
            {stack.map((g) => (
              <li key={g.group}>
                <span className="text-accent">/</span> {g.group}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <div
        className="mt-16 space-y-4 md:mt-24 md:space-y-6 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
        role="list"
        aria-label="Technologies we work with"
      >
        {rows.map((groups, r) => (
          <Marquee key={r} reverse={r % 2 === 1} duration={48 + r * 8}>
            {groups.map((g) =>
              g.items.map((item) => (
                <span
                  key={g.group + item}
                  role="listitem"
                  className="group/item flex items-center gap-4 pr-10 md:gap-6 md:pr-16"
                >
                  <span className="text-[clamp(2rem,5vw,4.75rem)] font-medium leading-none tracking-[-0.045em] text-fg/25 transition-colors duration-300 group-hover/item:text-fg">
                    {item}
                  </span>
                  <span className="eyebrow text-[0.5625rem] text-dim transition-colors group-hover/item:text-accent">
                    {g.group}
                  </span>
                  <span aria-hidden="true" className="ml-6 size-1.5 rotate-45 bg-accent/60 md:ml-10" />
                </span>
              )),
            )}
          </Marquee>
        ))}
      </div>
    </section>
  );
}
