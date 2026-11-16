/**
 * Tabs behaviour shared by every page (ARIA tabs pattern): click, arrow keys,
 * Home / End, `aria-selected` and roving `tabindex`. It knows nothing about
 * what a tab shows; the page module does that in the `onSelect` callback.
 * @module tabs
 */

import { queryAll } from "./dom.js";

/**
 * Called after a different tab has been selected.
 * @callback TabSelectHandler
 * @param {number} index - Position of the selected tab in the tablist.
 * @param {HTMLButtonElement} tab - The selected tab.
 * @returns {void}
 */

/**
 * Makes a tablist interactive.
 * Arrow keys follow `aria-orientation` of the tablist (default: horizontal),
 * read on every key press so a page can change it, e.g. at a breakpoint.
 * The tab that is already `aria-selected="true"` in the HTML stays selected;
 * `onSelect` is not called for it.
 * @param {HTMLElement} tablist
 * @param {TabSelectHandler} onSelect
 * @returns {HTMLButtonElement[]} The tabs, in DOM order.
 * @throws {Error} If the tablist has fewer than 2 tabs.
 */
export const initTabs = (tablist, onSelect) => {
  const tabs = queryAll('[role="tab"]', tablist, HTMLButtonElement, 2);
  let current = tabs.findIndex(
    (tab) => tab.getAttribute("aria-selected") === "true",
  );

  /**
   * Selects a tab. Does nothing if it is already the selected one.
   * @param {number} index
   * @param {boolean} [shouldFocus=false] - Move focus too (keyboard use).
   * @returns {void}
   */
  const select = (index, shouldFocus = false) => {
    if (shouldFocus) tabs[index].focus();
    if (index === current) return;

    tabs.forEach((tab, i) => {
      const isSelected = i === index;
      tab.setAttribute("aria-selected", String(isSelected));
      tab.tabIndex = isSelected ? 0 : -1;
    });

    current = index;
    onSelect(index, tabs[index]);
  };

  /**
   * @param {MouseEvent} event
   * @returns {void}
   */
  const handleClick = (event) => {
    if (!(event.target instanceof Element)) return;

    const tab = event.target.closest('[role="tab"]');
    const index = tabs.findIndex((item) => item === tab);

    if (index !== -1) select(index);
  };

  /**
   * @param {KeyboardEvent} event
   * @returns {void}
   */
  const handleKeydown = (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
      return;

    const index = tabs.findIndex((tab) => tab === event.target);
    if (index === -1) return;

    const isVertical = tablist.getAttribute("aria-orientation") === "vertical";
    const previousKey = isVertical ? "ArrowUp" : "ArrowLeft";
    const nextKey = isVertical ? "ArrowDown" : "ArrowRight";
    const last = tabs.length - 1;

    /** @type {number | undefined} */
    let target;

    if (event.key === previousKey) target = index === 0 ? last : index - 1;
    else if (event.key === nextKey) target = index === last ? 0 : index + 1;
    else if (event.key === "Home") target = 0;
    else if (event.key === "End") target = last;

    if (target === undefined) return;

    event.preventDefault();
    select(target, true);
  };

  tablist.addEventListener("click", handleClick);
  tablist.addEventListener("keydown", handleKeydown);

  return tabs;
};
