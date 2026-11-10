/**
 * Header scroll state: sets `data-scrolled` on the header once the page is
 * scrolled, so CSS can fade the background in and out.
 * @module header-scroll
 */

import { query } from "./dom.js";

/**
 * Scroll distance (px) after which the header counts as scrolled.
 * @type {number}
 */
const SCROLL_THRESHOLD = 0;

/**
 * Sets or removes `data-scrolled` depending on the scroll position.
 * @param {HTMLElement} header
 * @returns {void}
 */
const updateHeader = (header) => {
  header.toggleAttribute("data-scrolled", window.scrollY > SCROLL_THRESHOLD);
};

/**
 * Finds the header and keeps its scrolled state up to date.
 * @returns {void}
 * @throws {Error} If the header is missing.
 */
export const initHeaderScroll = () => {
  const header = query("header", document, HTMLElement);

  // Correct state on load, e.g. after a refresh in the middle of the page.
  updateHeader(header);

  window.addEventListener("scroll", () => updateHeader(header), {
    passive: true,
  });
};
