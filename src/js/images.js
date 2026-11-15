/**
 * Image URLs for the tabs, keyed by the `name` of each entry in `data.json`.
 *
 * Parcel only finds, hashes and copies a file when the path is a string
 * literal inside `new URL(..., import.meta.url)`. That is why the paths are
 * written out here instead of being built from `data.json`. Paths are relative
 * to this file (`src/js/`).
 * @module images
 */

/**
 * @typedef {Object} ResponsiveImage
 * @property {string} portrait - Used on wide screens.
 * @property {string} landscape - Used on mobile and tablet.
 */

/** @type {Record<string, string>} */
export const destinationImages = {
  Moon: new URL("../assets/destination/image-moon.webp", import.meta.url).href,
  Mars: new URL("../assets/destination/image-mars.webp", import.meta.url).href,
  Europa: new URL("../assets/destination/image-europa.webp", import.meta.url)
    .href,
  Titan: new URL("../assets/destination/image-titan.webp", import.meta.url)
    .href,
};

/** @type {Record<string, string>} */
export const crewImages = {
  "Douglas Hurley": new URL(
    "../assets/crew/image-douglas-hurley.webp",
    import.meta.url,
  ).href,
  "Mark Shuttleworth": new URL(
    "../assets/crew/image-mark-shuttleworth.webp",
    import.meta.url,
  ).href,
  "Victor Glover": new URL(
    "../assets/crew/image-victor-glover.webp",
    import.meta.url,
  ).href,
  "Anousheh Ansari": new URL(
    "../assets/crew/image-anousheh-ansari.webp",
    import.meta.url,
  ).href,
};

/** @type {Record<string, ResponsiveImage>} */
export const technologyImages = {
  "Launch vehicle": {
    portrait: new URL(
      "../assets/technology/image-launch-vehicle-portrait.jpg",
      import.meta.url,
    ).href,
    landscape: new URL(
      "../assets/technology/image-launch-vehicle-landscape.jpg",
      import.meta.url,
    ).href,
  },
  Spaceport: {
    portrait: new URL(
      "../assets/technology/image-spaceport-portrait.jpg",
      import.meta.url,
    ).href,
    landscape: new URL(
      "../assets/technology/image-spaceport-landscape.jpg",
      import.meta.url,
    ).href,
  },
  "Space capsule": {
    portrait: new URL(
      "../assets/technology/image-space-capsule-portrait.jpg",
      import.meta.url,
    ).href,
    landscape: new URL(
      "../assets/technology/image-space-capsule-landscape.jpg",
      import.meta.url,
    ).href,
  },
};

/**
 * Checks at start-up that every name has an image, so a typo or a new entry
 * in `data.json` fails immediately instead of when the tab is clicked.
 * @param {Record<string, unknown>} images - One of the maps above.
 * @param {string[]} names - The `name` of every entry in `data.json`.
 * @returns {void}
 * @throws {Error} If one or more names have no image.
 */
export const assertImagesFor = (images, names) => {
  const missing = names.filter((name) => !(name in images));

  if (missing.length > 0) {
    throw new Error(`[images] No image for: ${missing.join(", ")}`);
  }
};
