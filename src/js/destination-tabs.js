/**
 * Destination tabs: when a tab is selected, fills the single tabpanel, the
 * image and the details with the matching entry of `data.json`.
 * @module destination-tabs
 */

import data from "../data.json";

import { getElement, query, queryAll } from "./dom.js";
import { assertImagesFor, destinationImages } from "./images.js";
import { initTabs } from "./tabs.js";

const { destinations } = data;

/**
 * Elements the destination tabs depend on. Filled in by `initDestinationTabs`.
 * @typedef {Object} DestinationElements
 * @property {HTMLElement} panel - The tabpanel.
 * @property {HTMLImageElement} image - Destination image (outside the panel).
 * @property {HTMLElement} name - Destination name (heading).
 * @property {HTMLElement} description
 * @property {HTMLElement} distance - Average distance (`dd`).
 * @property {HTMLElement} travel - Estimated travel time (`dd`).
 */

/** @type {DestinationElements} */
let elements;

/**
 * Shows one destination. The panel is labelled by the selected tab, so screen
 * readers announce the right name after every change.
 * @param {number} index - Position in `data.destinations`.
 * @param {HTMLButtonElement} tab - The selected tab.
 * @returns {void}
 */
const renderDestination = (index, tab) => {
  const destination = destinations[index];

  elements.panel.setAttribute("aria-labelledby", tab.id);
  elements.image.src = destinationImages[destination.name];
  elements.image.alt = `Image of ${destination.name}`;
  elements.name.textContent = destination.name;
  elements.description.textContent = destination.description;
  elements.distance.textContent = destination.distance;
  elements.travel.textContent = destination.travel;
};

/**
 * Finds the elements and makes the tabs work.
 * @returns {void}
 * @throws {Error} If an element is missing, a destination has no image, or the
 * number of tabs does not match the number of destinations in `data.json`.
 */
export const initDestinationTabs = () => {
  assertImagesFor(
    destinationImages,
    destinations.map(({ name }) => name),
  );

  elements = {
    panel: getElement("destination-panel", HTMLElement),
    image: getElement("destination-image", HTMLImageElement),
    name: getElement("destination-name", HTMLElement),
    description: getElement("destination-description", HTMLElement),
    distance: getElement("destination-distance", HTMLElement),
    travel: getElement("destination-travel", HTMLElement),
  };

  const tablist = query('[role="tablist"]', document, HTMLElement);
  const tabCount = queryAll('[role="tab"]', tablist, HTMLButtonElement).length;

  if (tabCount !== destinations.length) {
    throw new Error(
      `[destination tabs] ${tabCount} tabs in the HTML but ${destinations.length} destinations in data.json`,
    );
  }

  initTabs(tablist, renderDestination);
};
