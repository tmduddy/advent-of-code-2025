import {readFileSync} from 'fs';
import * as _ from 'lodash';
import path from 'path';

import {debugLog} from '../utils/utils';

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
  // split in half
  const half = length / 2;
  const front = input.substring(0, half);
  const back = input.substring(half);

  // compare halves
  return front === back;
};

const part1 = () => {
  const ids = input[0].split(',');
  debugLog(ids);
  const invalidIds: number[] = [];
  ids.forEach(range => {
    const [first, last] = range.split('-').map(Number);
    const allIds = _.range(first, last + 1).map(i => i.toString());
    invalidIds.push(...allIds.filter(isInvalid).map(Number));
  });

  debugLog(invalidIds);

  const solution = invalidIds.reduce((a, c) => a + c, 0);
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
    const sub = input.substring(0, i);
    const replaced = input.replaceAll(sub, '');
    isInvalid = replaced === '';
    if (isInvalid) {
      debugLog(`--- ${sub} is invalid for ${input} in range ${range} ---`);
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

  const solution = invalidIds.reduce((a, c) => a + c, 0);
  console.log(`\nPart 2: ${solution}`);
};

part1();
part2();
