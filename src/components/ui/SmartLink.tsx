import { forwardRef, type AnchorHTMLAttributes, type MouseEvent } from "react";
import { Link, useLocation } from "react-router";
import { scrollToTarget, useLenis } from "@/lib/smooth-scroll";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string };

/**
 * One link component for the whole site:
 *  - external / mailto → plain <a>
 *  - "/path#hash" on the current page → smooth scroll, no navigation
 *  - everything else → router <Link> (which triggers the page transition)
 */
export const SmartLink = forwardRef<HTMLAnchorElement, Props>(function SmartLink(
  { to, onClick, children, ...rest },
  ref,
) {
  const location = useLocation();
  const lenis = useLenis();
  const isExternal = /^(https?:|mailto:|tel:)/.test(to) || to === "#";

  if (isExternal) {
    const newTab = to.startsWith("http");
    return (
      <a
        ref={ref}
        href={to}
        onClick={onClick}
        {...(newTab ? { target: "_blank", rel: "noreferrer noopener" } : {})}
        {...rest}
      >
        {children}
      </a>
    );
  }

  const [path, hash] = to.split("#");
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    const samePage = (path || "/") === location.pathname;
    if (samePage && hash) {
      e.preventDefault();
      scrollToTarget(lenis, `#${hash}`);
      history.replaceState(null, "", `#${hash}`);
    } else if (samePage && !hash) {
      e.preventDefault();
      scrollToTarget(lenis, 0);
    }
  };

  return (
    <Link ref={ref} to={to} onClick={handle} {...rest}>
      {children}
    </Link>
  );
});
