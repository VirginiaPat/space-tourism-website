/**
 * Entry point: starts every feature of the page. Each feature validates its
 * own required DOM elements, and is started independently: an error in one of
 * them is logged with the feature's name and does not stop the others.
 * @module main
 */

import { initCurrentPage } from "./current-page.js";
import { initMenu } from "./ham-menu.js";
import { initHeaderScroll } from "./header-scroll.js";

/**
 * Starts one feature and logs its error, if any, without rethrowing.
 * @param {string} name - Feature name, used in the error message.
 * @param {() => void} init - The feature's init function.
 * @returns {void}
 */
const startFeature = (name, init) => {
  try {
    init();
  } catch (error) {
    console.error(`[${name}] failed to start:`, error);
  }
};

/**
 * Initializes all interactive features of the page.
 * @returns {void}
 */
const init = () => {
  startFeature("current page", initCurrentPage);
  startFeature("menu", initMenu);
  startFeature("header scroll", initHeaderScroll);
};

init();
