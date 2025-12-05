import {readFileSync} from 'fs';
import _ from 'lodash';
import path from 'path';

import {debugLog, timeIt} from '../utils/utils';

const inputFileName =
  process.env.AOC_DEMO === 'true' ? './demo.txt' : './input.txt';
const input = readFileSync(path.resolve(__dirname, inputFileName), {
  encoding: 'utf8',
  flag: 'r',
}).split('\n');
// debugLog(input);

const part1 = () => {
  const lineBreak = input.indexOf('');
  const ranges = input.slice(0, lineBreak);
  const ingredients = input.slice(lineBreak).filter(Boolean);

  let numFresh = 0;

  ingredients.forEach(ingredient => {
    let alreadyFound = false;
    // debugLog(ingredient);
    ranges.forEach(range => {
      if (!alreadyFound) {
        // debugLog(range);
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

const addComparisons = (comparisons: Set<string>, rIdx: number, compIdx: number) => {
  comparisons.add(`${rIdx}_${compIdx}`);
  comparisons.add(`${compIdx}_${rIdx}`);
}

const part2 = () => {
  const lineBreak = input.indexOf('');
  const ranges = input.slice(0, lineBreak);

  let allRanges = ranges.map(r => r.split('-').map(Number));

  allRanges.forEach((range, rIdx) => {
    debugLog(`R_${rIdx}: ${range.join('-')}`);
  });

  let comparisons: Set<string>= new Set();
  let freshRanges: Set<string> = new Set();

  allRanges.forEach((range, rIdx) => {
    let [freshStart, freshEnd] = structuredClone(range);
    debugLog(`R_${rIdx}: ${range.join('-')}`);
    allRanges.forEach((compRange, compIdx) => {
      const [compStart, compEnd] = compRange;
      if (rIdx !== compIdx) { // && !comparisons.has(`${rIdx}_${compIdx}`)){
        addComparisons(comparisons, rIdx, compIdx);
        // debugLog(`starting comparison for R_${rIdx} against C_${compIdx}`);
        // if my end is in your range but my start is not:
        if (freshEnd >= compStart && freshEnd <= compEnd && freshStart < compStart) {
          freshEnd = compStart - 1;
          debugLog(`\tend is in C_${compIdx} ${compRange.join('-')}, new safe end is ${freshEnd}`);
        }
        // if my start is in your range but my end is not:
        if (freshStart >= compStart && freshStart <= compEnd && freshEnd > compEnd) { 
          freshStart = compEnd + 1;
          debugLog(`\tstart is in C_${compIdx} ${compRange.join('-')}, new safe start is ${freshStart}`);
        }
        // if my range is entirely within your range:
        if (freshStart >= compStart && freshStart <=compEnd && freshEnd <= compEnd && freshEnd >= compStart) {
          freshStart = 0;
          freshEnd = 0;
          debugLog(`\trange is completely within C_${compIdx} ${compRange.join('-')}, no fresh ingredients`);
        } 
      }
    });
    debugLog(`final fresh range for R_${rIdx} is ${freshStart}-${freshEnd}`);
    allRanges[rIdx] = [freshStart, freshEnd];
    if (freshStart > freshEnd) {
      debugLog(`R_${rIdx} is fully accounted for in other ranges.`);
    } else {
      freshRanges.add(`${freshStart}-${freshEnd}`); 
    }
  });
  debugLog(freshRanges);

  let fresh = [...freshRanges].reduce((numFresh, currRange) => {
    const [start, end] = currRange.split('-').map(Number);
    if (start === 0 && end === 0) {
      return numFresh;
    }
    return numFresh + 1 + (end-start);
  }, 0);

  const solution = fresh;
  console.log(`\nPart 2: ${solution}`);
};

timeIt(part1);
timeIt(part2); 
