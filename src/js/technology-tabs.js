/**
 * Technology tabs: when a tab is selected, fills the single tabpanel (name,
 * description) and the responsive image with the matching entry of
 * `data.json`. The tablist is vertical on wide screens and horizontal below,
 * so it keeps `aria-orientation` in sync for the arrow keys in `tabs.js`.
 * @module technology-tabs
 */

import data from "../data.json";

import { getElement, query, queryAll } from "./dom.js";
import { assertImagesFor, technologyImages } from "./images.js";
import { initTabs } from "./tabs.js";
import { fadeUp, swapImage } from "./animations.js";

const { technology } = data;

/**
 * Matches when the viewport reaches Tailwind's `xl` breakpoint (80rem), where
 * the tabs are stacked vertically next to the text.
 * Keep in sync with the `xl` value in the Tailwind theme.
 * @type {MediaQueryList}
 */
const verticalQuery = window.matchMedia("(min-width: 80rem)");

/**
 * Elements the technology tabs depend on. Filled in by `initTechnologyTabs`.
 * @typedef {Object} TechnologyElements
 * @property {HTMLElement} tablist
 * @property {HTMLElement} panel - The tabpanel.
 * @property {HTMLSourceElement} imageSource - Portrait image, used at `xl`.
 * @property {HTMLImageElement} image - Landscape image, used below `xl`.
 * @property {HTMLElement} name
 * @property {HTMLElement} description
 */

/** @type {TechnologyElements} */
let elements;

/**
 * Tells the tablist which arrow keys to use.
 * @returns {void}
 */
const updateOrientation = () => {
  elements.tablist.setAttribute(
    "aria-orientation",
    verticalQuery.matches ? "vertical" : "horizontal",
  );
};

/**
 * Shows one technology. The panel is labelled by the selected tab, so screen
 * readers announce the right name after every change.
 * @param {number} index - Position in `data.technology`.
 * @param {HTMLButtonElement} tab - The selected tab.
 * @returns {void}
 */
const renderTechnology = (index, tab) => {
  const item = technology[index];
  const images = technologyImages[item.name];

  elements.panel.setAttribute("aria-labelledby", tab.id);
  elements.name.textContent = item.name;
  elements.description.textContent = item.description;

  swapImage(elements.image, images.landscape, `Image of ${item.name}`, {
    preload: verticalQuery.matches ? images.portrait : images.landscape,
    onSwap: () => {
      elements.imageSource.srcset = images.portrait;
    },
  });

  fadeUp([elements.name, elements.description]);
};

/**
 * Finds the elements, checks that the HTML and `data.json` match, makes the
 * tabs work and keeps the tablist's `aria-orientation` in sync with the layout.
 * @returns {void}
 * @throws {Error} If a technology has no images, an element is missing, or the
 * number of tabs does not match the number of items in `data.json`.
 */
export const initTechnologyTabs = () => {
  assertImagesFor(
    technologyImages,
    technology.map(({ name }) => name),
  );

  elements = {
    tablist: query('[role="tablist"]', document, HTMLElement),
    panel: getElement("technology-panel", HTMLElement),
    imageSource: getElement("technology-image-source", HTMLSourceElement),
    image: getElement("technology-image", HTMLImageElement),
    name: getElement("technology-name", HTMLElement),
    description: getElement("technology-description", HTMLElement),
  };

  const tabCount = queryAll(
    '[role="tab"]',
    elements.tablist,
    HTMLButtonElement,
  ).length;

  if (tabCount !== technology.length) {
    throw new Error(
      `[technology tabs] ${tabCount} tabs in the HTML but ${technology.length} items in data.json`,
    );
  }

  initTabs(elements.tablist, renderTechnology);

  updateOrientation();
  verticalQuery.addEventListener("change", updateOrientation);
};
