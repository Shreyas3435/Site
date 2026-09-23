import { useEffect } from "react";
import { site } from "@/content/site";

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} — ${site.name}` : `${site.name} — Engineering products, systems and hard problems`;
  }, [title]);
}
