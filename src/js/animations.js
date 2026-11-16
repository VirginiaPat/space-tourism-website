/**
 * Enter animations for content that changes when a tab is selected. They use
 * the Web Animations API, so they can be replayed on every change without
 * adding and removing classes. Nothing animates when the user prefers reduced
 * motion.
 * @module animations
 */

/**
 * Matches when the user asked the system to reduce motion.
 * @type {MediaQueryList}
 */
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

/**
 * The source most recently requested for each image, so a slow response for
 * an earlier tab can never replace the image of a later one.
 * @type {WeakMap<HTMLImageElement, string>}
 */
const latestSource = new WeakMap();

/**
 * Plays an animation on an element, replacing any still running on it.
 * `fill: "backwards"` keeps the element in its first keyframe during the
 * stagger delay, so it does not flash before it starts.
 * @param {HTMLElement} element
 * @param {Keyframe[]} keyframes
 * @param {number} duration - In milliseconds.
 * @param {number} [delay=0] - In milliseconds.
 * @returns {void}
 */
const play = (element, keyframes, duration, delay = 0) => {
  element.getAnimations().forEach((animation) => animation.cancel());
  element.animate(keyframes, {
    duration,
    delay,
    easing: "ease-out",
    fill: "backwards",
  });
};

/**
 * Fades elements in while moving them up a little, one after the other.
 * @param {HTMLElement[]} elements - In the order they should appear.
 * @param {Object} [options]
 * @param {number} [options.duration=400] - Per element, in milliseconds.
 * @param {number} [options.stagger=80] - Delay between elements, in milliseconds.
 * @returns {void}
 */
export const fadeUp = (elements, { duration = 400, stagger = 80 } = {}) => {
  if (reducedMotion.matches) return;

  elements.forEach((element, index) => {
    play(
      element,
      [
        { opacity: 0, translate: "0 1rem" },
        { opacity: 1, translate: "0 0" },
      ],
      duration,
      index * stagger,
    );
  });
};

/**
 * Swaps the image and fades the new one in. The new file is decoded first, so
 * the animation never plays on the old picture or on an empty frame.
 * @param {HTMLImageElement} image
 * @param {string} src
 * @param {string} alt
 * @param {Object} [options]
 * @param {number} [options.duration=500] - In milliseconds.
 * @returns {Promise<void>}
 */
export const swapImage = async (image, src, alt, { duration = 500 } = {}) => {
  latestSource.set(image, src);

  if (reducedMotion.matches) {
    image.src = src;
    image.alt = alt;
    return;
  }

  try {
    const preload = new Image();
    preload.src = src;
    await preload.decode();
  } catch {
    // A failed decode must not block the swap: show the image as usual.
  }

  if (latestSource.get(image) !== src) return;

  image.src = src;
  image.alt = alt;
  play(
    image,
    [
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1 },
    ],
    duration,
  );
};
