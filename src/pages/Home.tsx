import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { Capabilities } from "@/components/sections/Capabilities";
import { Diagnostics } from "@/components/sections/Diagnostics";
import { Work } from "@/components/sections/Work";
import { Stack } from "@/components/sections/Stack";
import { Process } from "@/components/sections/Process";
import { Principles } from "@/components/sections/Principles";
import { AboutTeaser } from "@/components/sections/AboutTeaser";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { ContactSection } from "@/components/sections/Contact";

export default function Home() {
  useDocumentTitle();
  return (
    <>
      <Hero />
      <Manifesto />
      <Capabilities />
      <Diagnostics />
      <Work />
      <Stack />
      <Process />
      <Principles />
      <AboutTeaser />
      <FinalCTA />
      <ContactSection />
    </>
  );
}
