/**
 * "" locally, "/fundi-now" on GitHub Pages. Next.js already adds it to <Link> and router calls;
 * use these helpers only for raw URLs (iframes, service worker, web workers, share links, manifest).
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const TRAILING_SLASH = !!process.env.NEXT_PUBLIC_TRAILING_SLASH;

/** A static asset URL, e.g. withBase("/sw.js"). */
export const withBase = (path: string) => `${BASE_PATH}${path}`;

/** A page URL, matching the export's trailing-slash style, e.g. pageUrl("/app"). */
export const pageUrl = (path: string) =>
  withBase(TRAILING_SLASH && !path.endsWith("/") ? `${path}/` : path);
