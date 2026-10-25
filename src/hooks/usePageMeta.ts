import { useEffect } from "react";
import { metaFor, NOT_FOUND_TITLE, SITE_URL } from "@/content/seo";

function setTag(selector: string, attr: string, value: string) {
  document.head.querySelector(selector)?.setAttribute(attr, value);
}

/** Keeps the title, description, canonical and social tags in step with the route. */
export function usePageMeta(pathname: string) {
  useEffect(() => {
    const meta = metaFor(pathname);
    const title = meta?.title ?? NOT_FOUND_TITLE;
    document.title = title;
    if (!meta) {
      setTag('meta[name="robots"]', "content", "noindex");
      return;
    }
    const url = SITE_URL + meta.path;
    setTag('meta[name="robots"]', "content", "index, follow");
    setTag('meta[name="description"]', "content", meta.description);
    setTag('link[rel="canonical"]', "href", url);
    setTag('meta[property="og:url"]', "content", url);
    setTag('meta[property="og:title"]', "content", title);
    setTag('meta[property="og:description"]', "content", meta.description);
    setTag('meta[name="twitter:title"]', "content", title);
    setTag('meta[name="twitter:description"]', "content", meta.description);
  }, [pathname]);
}
