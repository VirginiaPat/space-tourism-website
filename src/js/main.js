/**
 * Entry point: starts every feature of the page. Each feature validates its
 * own required DOM elements, and is started independently: an error in one of
 * them is logged with the feature's name and does not stop the others.
 * @module main
 */

import { initCurrentPage } from "./current-page.js";
import { initMenu } from "./ham-menu.js";
import { initHeaderScroll } from "./header-scroll.js";
import { initCrewTabs } from "./crew-tabs.js";
import { initDestinationTabs } from "./destination-tabs.js";

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

/** Features that only exist on one page, keyed by `data-page` on the body. */
const pageFeatures = {
  destination: [["destination tabs", initDestinationTabs]],
  crew: [["crew tabs", initCrewTabs]],
};

/**
 * Initializes all interactive features of the page.
 * @returns {void}
 */
const init = () => {
  startFeature("current page", initCurrentPage);
  startFeature("menu", initMenu);
  startFeature("header scroll", initHeaderScroll);

  const page = document.body.dataset.page ?? "";
  (pageFeatures[page] ?? []).forEach(([name, feature]) =>
    startFeature(name, feature),
  );
};

init();
