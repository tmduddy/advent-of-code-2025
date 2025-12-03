/**
 * console log that only applies when in demo or debug mode to keep prod solutions clean
 */
export const debugLog = (...args: any[]) => {
  if (process.env.AOC_DEMO === 'true' || process.env.AOC_DEBUG === 'true') {
    console.log(...args);
  }
};

/**
 * print out timing information
 */
export const timeIt = (fn: () => void) => {
  if (process.env.AOC_TIME === 'true') {
    const start = performance.now();
    fn();
    const end = performance.now();
    console.log(`execution took ${end - start} ms`);
  } else {
    fn();
  }
};
