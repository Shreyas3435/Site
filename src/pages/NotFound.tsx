import { useLocation } from "react-router";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { Button } from "@/components/ui/Button";
import { RevealText } from "@/components/ui/Reveal";

export default function NotFound() {
  useDocumentTitle("Not found");
  const { pathname } = useLocation();
  return (
    <section className="flex min-h-[90svh] items-center pt-[var(--header-h)]">
      <div className="shell">
        <p className="eyebrow text-muted">
          <span className="text-accent">ERR 404</span> — GET {pathname}
        </p>
        <RevealText as="h1" immediate delay={0.9} lines={["Route not", "found."]} className="mt-8 text-mega font-medium uppercase" />
        <p className="mt-8 max-w-md text-lede text-fg-2">
          This page doesn't exist — or hasn't been built yet. Either way, the rest of the system is running fine.
        </p>
        <div className="mt-12">
          <Button to="/" variant="accent" size="lg">
            Back to index
          </Button>
        </div>
      </div>
    </section>
  );
}
