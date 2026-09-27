import { useEffect } from "react";
import { site } from "@/content/site";

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} — ${site.name}` : `${site.name} — Light up the stack`;
  }, [title]);
}
