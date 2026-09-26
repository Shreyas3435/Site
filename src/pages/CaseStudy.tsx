import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { Navigate, useParams } from "react-router";
import { getProject, projects } from "@/content/projects";
import { EASE_OUT } from "@/lib/easing";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { SmartLink } from "@/components/ui/SmartLink";
import { SlidingArrow } from "@/components/ui/Arrow";
import { Corners, MediaSlot } from "@/components/ui/Placeholder";
import { RevealText, Reveal } from "@/components/ui/Reveal";
import { ProjectVisual } from "@/components/visuals/ProjectVisual";
import { FinalCTA } from "@/components/sections/FinalCTA";

/**
 * Case-study template. Every piece of content comes from `content/projects.ts`,
 * so a CMS can later feed the same shape.
 */
export default function CaseStudy() {
  const { slug } = useParams();
  const project = getProject(slug);
  useDocumentTitle(project?.title);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  if (!project) return <Navigate to="/work" replace />;

  const i = projects.indexOf(project);
  const next = projects[(i + 1) % projects.length];

  return (
    <article>
      <header className="pb-12 pt-[calc(var(--header-h)+5rem)] md:pt-[calc(var(--header-h)+7rem)]">
        <div className="shell">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-between eyebrow text-muted"
          >
            <SmartLink to="/work" className="group inline-flex items-center gap-2 hover:text-fg">
              <SlidingArrow dir="right" className="rotate-180" /> All work
            </SmartLink>
            <span>
              Case {project.index} / {String(projects.length).padStart(2, "0")}
            </span>
          </motion.div>
          <p className="mt-12 eyebrow text-accent">{project.kicker}</p>
          <RevealText as="h1" immediate delay={0.9} lines={[project.title]} className="mt-6 text-mega font-medium uppercase" />
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.9, ease: EASE_OUT }}
            className="mt-8 max-w-2xl text-lede text-fg-2"
          >
            {project.summary}
          </motion.p>
        </div>
      </header>

      <div ref={heroRef} className="shell">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 1.1, ease: EASE_OUT }}
          className="relative aspect-[16/10] overflow-hidden border border-line lg:aspect-[16/8]"
        >
          <motion.div style={{ y }} className="absolute -inset-[6%]">
            {project.images[0]?.src ? (
              <MediaSlot src={project.images[0].src} alt={project.images[0].alt} className="size-full" />
            ) : (
              <ProjectVisual kind={project.visual} />
            )}
          </motion.div>
          <Corners />
        </motion.div>
      </div>

      {/* meta */}
      <section aria-label="Project details" className="shell mt-16 grid gap-10 border-b border-line pb-16 md:grid-cols-12">
        <Meta title="Engagement" className="md:col-span-3">
          <p className="text-fg-2">{project.client}</p>
        </Meta>
        <Meta title="Scope" className="md:col-span-5">
          <ul className="space-y-1 text-fg-2">
            {project.scope.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </Meta>
        <Meta title="Stack" className="md:col-span-4">
          <ul className="flex flex-wrap gap-2">
            {project.tags.map((t) => (
              <li key={t} className="rounded-full border border-line-2 px-3 py-1 eyebrow text-[0.625rem] text-fg-2">
                {t}
              </li>
            ))}
          </ul>
        </Meta>
      </section>

      {/* narrative */}
      <div className="shell py-20 md:py-32">
        {project.sections.map((s, k) => (
          <section key={s.heading} className="grid gap-6 border-t border-line py-12 first:border-t-0 md:grid-cols-12 md:gap-8 md:py-16">
            <div className="md:col-span-4">
              <div className="md:sticky md:top-[calc(var(--header-h)+2rem)]">
                <p className="eyebrow text-accent">{String(k + 1).padStart(2, "0")}</p>
                <h2 className="mt-3 text-heading font-medium uppercase">{s.heading}</h2>
              </div>
            </div>
            <Reveal className="md:col-span-7 md:col-start-6">
              <p className="text-lede text-fg-2">{s.body}</p>
              {k === 1 && project.images[1]?.src && (
                <MediaSlot
                  src={project.images[1].src}
                  alt={project.images[1].alt}
                  className="mt-10 aspect-[16/10] border border-line"
                />
              )}
            </Reveal>
          </section>
        ))}
      </div>

      {/* next */}
      <SmartLink
        to={`/work/${next.slug}`}
        data-cursor="Next"
        className="group block border-t border-line py-20 transition-colors hover:bg-ink-2 md:py-32"
      >
        <div className="shell flex items-end justify-between gap-8">
          <div>
            <p className="eyebrow text-muted">Next case study</p>
            <p className="mt-6 text-mega font-medium uppercase text-fg/40 transition-colors duration-500 group-hover:text-fg">
              {next.title}
            </p>
          </div>
          <span className="mb-4 hidden text-5xl text-accent md:block">
            <SlidingArrow />
          </span>
        </div>
      </SmartLink>
      <FinalCTA />
    </article>
  );
}

function Meta({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <p className="eyebrow text-dim">{title}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}
