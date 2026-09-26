import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { site } from "@/content/site";
import { PageHero } from "@/components/sections/PageHero";
import { Manifesto } from "@/components/sections/Manifesto";
import { Principles } from "@/components/sections/Principles";
import { Process } from "@/components/sections/Process";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { CrewGrid } from "@/components/sections/Crew";
import { FAQ } from "@/components/sections/FAQ";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

const WAYS = [
  {
    title: "Solo",
    body: "One senior engineer owns a focused problem end to end — an audit, a search overhaul, a performance push.",
  },
  {
    title: "Squad",
    body: "Two to four of us form around a product or platform build, covering design, frontend, backend and infrastructure.",
  },
  {
    title: "Alongside",
    body: "We embed with your team, pair on the hard parts and leave the system — and the people — stronger.",
  },
];

export default function About() {
  useDocumentTitle("About");
  return (
    <>
      <PageHero
        label="About"
        lines={["Engineers who like", "difficult things."]}
        intro={`${site.name} is a team of four experienced engineers. We work independently and together — engineering, product, AI and design — on the problems that don't fit neatly into a template.`}
      />

      <Manifesto />

      <section aria-labelledby="ways-title" className="border-t border-line py-28 md:py-40">
        <div className="shell">
          <SectionLabel>How we engage</SectionLabel>
          <h2 id="ways-title" className="mt-8 max-w-3xl text-title font-medium uppercase">
            Shaped around the problem.
          </h2>
          <div className="mt-16 grid gap-px border border-line bg-line md:grid-cols-3">
            {WAYS.map((w, i) => (
              <Reveal key={w.title} delay={i * 0.08} className="group bg-ink p-8 transition-colors hover:bg-ink-2 md:p-10">
                <p className="eyebrow text-accent">0{i + 1}</p>
                <h3 className="mt-10 text-heading font-medium uppercase">{w.title}</h3>
                <p className="mt-4 text-fg-2">{w.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="team-title" className="border-t border-line py-28 md:py-40">
        <div className="shell">
          <div className="grid gap-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <SectionLabel>Team</SectionLabel>
              <h2 id="team-title" className="mt-8 text-title font-medium uppercase">
                A team of four.
              </h2>
            </div>
            <p className="text-fg-2 md:col-span-4 md:col-start-9">
              Four senior engineers, each experienced in the technology their layer needs. Small enough that you
              always talk to the builders; broad enough to cover the whole stack.
            </p>
          </div>
          <CrewGrid className="mt-16 md:mt-24" />
        </div>
      </section>

      <Principles />
      <Process />
      <FAQ />
      <FinalCTA />
    </>
  );
}
