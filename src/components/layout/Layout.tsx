import { AnimatePresence } from "motion/react";
import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router";
import { scrollToTarget, useLenis } from "@/lib/smooth-scroll";
import { Cursor } from "@/components/cursor/Cursor";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { PageShell } from "./PageShell";
import { ScrollProgress } from "./ScrollProgress";
import Home from "@/pages/Home";

// Secondary pages are split out so the landing page ships less JS.
const WorkIndex = lazy(() => import("@/pages/WorkIndex"));
const CaseStudy = lazy(() => import("@/pages/CaseStudy"));
const CapabilitiesPage = lazy(() => import("@/pages/CapabilitiesPage"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function labelFor(pathname: string) {
  if (pathname === "/") return "Index";
  return pathname.split("/").filter(Boolean).join(" / ").replace(/-/g, " ");
}

export function Layout() {
  const location = useLocation();
  const lenis = useLenis();

  // Deep links to sections (/#process) scroll once the new page is revealed.
  useEffect(() => {
    if (!location.hash) return;
    const id = window.setTimeout(() => scrollToTarget(lenis, location.hash), 900);
    return () => window.clearTimeout(id);
  }, [location.key, location.hash, lenis]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-fg focus:px-5 focus:py-3 focus:text-ink eyebrow"
      >
        Skip to content
      </a>
      <ScrollProgress />
      <Header />

      <AnimatePresence
        mode="wait"
        onExitComplete={() => {
          lenis?.scrollTo(0, { immediate: true, force: true });
          window.scrollTo(0, 0);
        }}
      >
        <PageShell key={location.pathname} label={labelFor(location.pathname)}>
          <main id="main" tabIndex={-1} className="outline-none">
            <Suspense fallback={<div className="min-h-screen" />}>
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/work" element={<WorkIndex />} />
                <Route path="/work/:slug" element={<CaseStudy />} />
                <Route path="/capabilities" element={<CapabilitiesPage />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </PageShell>
      </AnimatePresence>

      <Cursor />
      <div aria-hidden="true" className="grain" />
    </>
  );
}
