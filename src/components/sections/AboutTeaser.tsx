import { TextLink } from "@/components/ui/Button";
import { RevealText, Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TeamGrid } from "./Team";

export function AboutTeaser() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative border-t border-line py-28 md:py-40">
      <div className="shell">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-8">
            <SectionLabel index="08">The people</SectionLabel>
            <RevealText
              id="about-title"
              lines={["A small group of engineers", "who like building", "difficult things."]}
              className="mt-8 text-title font-medium"
            />
          </div>
          <Reveal className="space-y-5 text-fg-2 md:col-span-4 md:self-end">
            <p>
              We're working technologists who collaborate across engineering, product, AI and design. Sometimes one of
              us takes a project end-to-end; sometimes it needs all of us.
            </p>
            <p className="text-muted">
              No account managers, no hand-offs to a junior bench. The people you talk to are the people who build it.
            </p>
            <TextLink to="/about">More about the studio</TextLink>
          </Reveal>
        </div>
        <TeamGrid className="mt-16 md:mt-24" />
      </div>
    </section>
  );
}
