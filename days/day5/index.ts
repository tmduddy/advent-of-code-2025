import {readFileSync} from 'fs';
import path from 'path';

import {debugLog, timeIt} from '../utils/utils';

const inputFileName =
  process.env.AOC_DEMO === 'true' ? './demo.txt' : './input.txt';
const input = readFileSync(path.resolve(__dirname, inputFileName), {
  encoding: 'utf8',
  flag: 'r',
}).split('\n');

const part1 = () => {
  const lineBreak = input.indexOf('');
  const ranges = input.slice(0, lineBreak);
  const ingredients = input.slice(lineBreak).filter(Boolean);

  let numFresh = 0;

  ingredients.forEach(ingredient => {
    let alreadyFound = false;
    ranges.forEach(range => {
      if (!alreadyFound) {
        const [start, end] = range.split('-').map(Number);
        const id = Number(ingredient);
        if (id >= start && id <= end) {
          numFresh++;
          alreadyFound = true;
        }
      }
    });
  });

  const solution = numFresh;
  console.log(`\nPart 1: ${solution}`);
};

const part2 = () => {
  const lineBreak = input.indexOf('');
  const ranges = input.slice(0, lineBreak);

  const allRanges = ranges.map(r => r.split('-').map(Number));
  const freshRanges: Set<string> = new Set();

  allRanges.forEach((range, rIdx) => {
    let [freshStart, freshEnd] = range;
    debugLog(`R_${rIdx}: ${range.join('-')}`);
    allRanges.forEach((compRange, compIdx) => {
      const [compStart, compEnd] = compRange;
      if (rIdx !== compIdx) {
        // if my end is in your range but my start is not:
        if (
          freshEnd >= compStart &&
          freshEnd <= compEnd &&
          freshStart < compStart
        ) {
          freshEnd = compStart - 1;
          debugLog(
            `\tend is in C_${compIdx} ${compRange.join('-')}, new safe end is ${freshEnd}`,
          );
        }
        // if my start is in your range but my end is not:
        if (
          freshStart >= compStart &&
          freshStart <= compEnd &&
          freshEnd > compEnd
        ) {
          freshStart = compEnd + 1;
          debugLog(
            `\tstart is in C_${compIdx} ${compRange.join('-')}, new safe start is ${freshStart}`,
          );
        }
        // if my range is entirely within your range:
        if (
          freshStart >= compStart &&
          freshStart <= compEnd &&
          freshEnd <= compEnd &&
          freshEnd >= compStart
        ) {
          freshStart = 0;
          freshEnd = 0;
          debugLog(
            `\trange is completely within C_${compIdx} ${compRange.join('-')}, no fresh ingredients`,
          );
        }
      }
    });
    // change the range in place to the new, all-fresh array
    allRanges[rIdx] = [freshStart, freshEnd];

    if (!(freshStart > freshEnd)) { 
      freshRanges.add(`${freshStart}-${freshEnd}`);
    }
  });

  const fresh = [...freshRanges].reduce((numFresh, currRange) => {
    if (currRange !== '0-0') {
      const [start, end] = currRange.split('-').map(Number);
      return numFresh + 1 + (end - start);
    }
    return numFresh;
  }, 0);

  const solution = fresh;
  console.log(`\nPart 2: ${solution}`);
};

timeIt(part1);
timeIt(part2);
