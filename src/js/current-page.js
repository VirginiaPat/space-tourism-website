/**
 * Marks the nav links that point to the current page with aria-current="page".
 * The header is a shared partial, so this can't be written by hand per page.
 * @module current-page
 */

import { queryAll } from "./dom.js";

/**
 * Makes equivalent URLs comparable: "/index.html" and "/" match, and
 * "/crew.html" matches "/crew" (clean URLs).
 * @param {string} pathname
 * @returns {string}
 */
const normalizePath = (pathname) =>
  pathname
    .replace(/index\.html$/, "")
    .replace(/\.html$/, "")
    .replace(/\/$/, "") || "/";

/**
 * Sets aria-current on the desktop and hamburger links of the current page.
 * @returns {void}
 * @throws {Error} If no nav links are found.
 */
export const initCurrentPage = () => {
  const current = normalizePath(window.location.pathname);
  const links = queryAll("a.nav-link, a.ham-link", document, HTMLAnchorElement);

  links.forEach((link) => {
    if (normalizePath(link.pathname) === current) {
      link.setAttribute("aria-current", "page");
    }
  });
};
