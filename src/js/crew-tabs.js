/**
 * Crew tabs: when a tab is selected, fills the single tabpanel (role, name,
 * bio) and the portrait with the matching entry of `data.json`.
 * @module crew-tabs
 */

import data from "../data.json";

import { getElement, query, queryAll } from "./dom.js";
import { assertImagesFor, crewImages } from "./images.js";
import { initTabs } from "./tabs.js";

const { crew } = data;

/**
 * Elements the crew tabs depend on. Filled in by `initCrewTabs`.
 * @typedef {Object} CrewElements
 * @property {HTMLElement} panel - The tabpanel.
 * @property {HTMLImageElement} image - Crew member portrait (outside the panel).
 * @property {HTMLElement} role - Role, e.g. "Commander".
 * @property {HTMLElement} name - Crew member name.
 * @property {HTMLElement} bio
 */

/** @type {CrewElements} */
let elements;

/**
 * Shows one crew member. The panel is labelled by the selected tab, so screen
 * readers announce the right name after every change.
 * @param {number} index - Position in `data.crew`.
 * @param {HTMLButtonElement} tab - The selected tab.
 * @returns {void}
 */
const renderCrewMember = (index, tab) => {
  const member = crew[index];

  elements.panel.setAttribute("aria-labelledby", tab.id);
  elements.image.src = crewImages[member.name];
  elements.image.alt = `Portrait of ${member.name}`;
  elements.role.textContent = member.role;
  elements.name.textContent = member.name;
  elements.bio.textContent = member.bio;
};

/**
 * Finds the elements and makes the tabs work.
 * @returns {void}
 * @throws {Error} If an element is missing, a crew member has no image, or the
 * number of tabs does not match the number of crew members in `data.json`.
 */
export const initCrewTabs = () => {
  assertImagesFor(
    crewImages,
    crew.map(({ name }) => name),
  );

  elements = {
    panel: getElement("crew-panel", HTMLElement),
    image: getElement("crew-image", HTMLImageElement),
    role: getElement("crew-role", HTMLElement),
    name: getElement("crew-name", HTMLElement),
    bio: getElement("crew-bio", HTMLElement),
  };

  const tablist = query('[role="tablist"]', document, HTMLElement);
  const tabCount = queryAll('[role="tab"]', tablist, HTMLButtonElement).length;

  if (tabCount !== crew.length) {
    throw new Error(
      `[crew tabs] ${tabCount} tabs in the HTML but ${crew.length} crew members in data.json`,
    );
  }

  initTabs(tablist, renderCrewMember);
};
