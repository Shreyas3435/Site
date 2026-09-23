import { team, type TeamMember } from "@/content/studio";
import { cn } from "@/lib/cn";
import { SlidingArrow } from "@/components/ui/Arrow";
import { MediaSlot } from "@/components/ui/Placeholder";
import { Reveal } from "@/components/ui/Reveal";

/** Team grid. Fully data-driven from `content/studio.ts`. */
export function TeamGrid({ detailed = false, className }: { detailed?: boolean; className?: string }) {
  return (
    <ul className={cn("grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {team.map((m, i) => (
        <Reveal as="li" key={i} delay={i * 0.08}>
          <MemberCard member={m} index={i} detailed={detailed} />
        </Reveal>
      ))}
    </ul>
  );
}

function MemberCard({ member, index, detailed }: { member: TeamMember; index: number; detailed: boolean }) {
  return (
    <article className="group">
      <div className="relative aspect-[4/5] overflow-hidden border border-line">
        <MediaSlot
          src={member.photo}
          alt={member.photo ? `Portrait of ${member.name}` : "Placeholder for team member portrait"}
          label="Portrait"
          className="size-full transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
        >
          {!member.photo && (
            <span
              aria-hidden="true"
              className="absolute inset-0 flex items-center justify-center text-[5rem] font-medium tracking-[-0.06em] text-fg/[0.06] transition-colors duration-700 group-hover:text-accent/20"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          )}
        </MediaSlot>
        {/* links slide up on hover (always visible on touch) */}
        <ul className="absolute inset-x-0 bottom-0 flex gap-px bg-line [@media(hover:hover)]:translate-y-full [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-focus-within:translate-y-0 transition-transform duration-500 ease-[var(--ease-out-expo)]">
          {member.links.map((l) => (
            <li key={l.label} className="flex-1">
              <a
                href={l.href}
                aria-label={`${member.name} on ${l.label}`}
                className="flex items-center justify-between bg-ink/90 px-4 py-3 eyebrow text-fg-2 backdrop-blur hover:text-accent"
              >
                {l.label} <SlidingArrow dir="up-right" />
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-5">
        <h3 className="text-xl font-medium tracking-tight">
          {member.name} <span className="eyebrow align-middle text-dim">[ {String(index + 1).padStart(2, "0")} ]</span>
        </h3>
        <p className="mt-1 text-sm text-muted">{member.role}</p>
        {detailed && (
          <>
            <p className="mt-4 text-sm leading-relaxed text-fg-2">{member.bio}</p>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {member.focus.map((f) => (
                <li key={f} className="rounded-full border border-line-2 px-2.5 py-0.5 eyebrow text-[0.5625rem] text-muted">
                  {f}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </article>
  );
}
