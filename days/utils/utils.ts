/**
 * console log that only applies when in demo or debug mode to keep prod solutions clean
 */
export const debugLog = (...args) => {
  if (process.env.AOC_DEMO === 'true' || process.env.AOC_DEBUG === 'true') {
    console.log(...args);
  }
};
