import {readFileSync} from 'fs';
import * as _ from 'lodash';
import path from 'path';

import {debugLog, timeIt} from '../utils/utils';

const inputFileName =
  process.env.AOC_DEMO === 'true' ? './demo.txt' : './input.txt';
const input = readFileSync(path.resolve(__dirname, inputFileName), {
  encoding: 'utf8',
  flag: 'r',
}).split('\n');
debugLog(input);

const isInvalid = (input: string) => {
  const length = input.length;
  if (length % 2 !== 0) {
    return false;
  }
  // split in half and compare
  const half = length / 2;
  return input.substring(0, half) === input.substring(half);
};

const part1 = () => {
  const ids = input[0].split(',');
  debugLog(ids);
  const invalidIds: number[] = [];
  ids.forEach(range => {
    const [first, last] = range.split('-').map(Number);
    const allIds = _.range(first, last + 1).map(i => i.toString());
    debugLog(allIds);
    invalidIds.push(...allIds.filter(isInvalid).map(Number));
  });

  debugLog(invalidIds);

  const solution = _.sum(invalidIds);
  console.log(`\nPart 1: ${solution}`);
};

const isInvalidPart2 = (input: string, range: string) => {
  const length = input.length;
  if (length === 1) {
    return false;
  }
  const half = Math.ceil(length / 2);
  let isInvalid = false;
  for (let i = 1; i <= half; i++) {
    // only check substrings that evenly divide the input
    if (length % i !== 0) {
      continue;
    }
    isInvalid = true;
    const substrToCheck = input.substring(0, i);
    let remainder = input.substring(i);
    // look at the next i characters of the input and exit early
    // if they dont match.
    while (remainder.length >= i) {
      if (remainder.substring(0, i) === substrToCheck) {
        remainder = remainder.substring(i);
      } else {
        isInvalid = false;
        break;
      }
    }
    if (isInvalid) {
      break;
    }
  }

  return isInvalid;
};

const part2 = () => {
  const ids = input[0].split(',');
  debugLog(ids);
  const invalidIds: number[] = [];
  ids.forEach(range => {
    const [first, last] = range.split('-').map(Number);
    const allIds = _.range(first, last + 1).map(i => i.toString());
    invalidIds.push(
      ...allIds.filter(i => isInvalidPart2(i, range)).map(Number),
    );
  });

  debugLog(invalidIds);

  const solution = _.sum(invalidIds);
  console.log(`\nPart 2: ${solution}`);
};

timeIt(part1);
timeIt(part2);
