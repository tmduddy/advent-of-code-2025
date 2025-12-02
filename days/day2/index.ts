import {readFileSync} from 'fs';
import * as _ from 'lodash'
import path from 'path';

import { debugLog } from '../utils/utils';

const inputFileName =
  process.env.AOC_DEMO === 'true' ? './demo.txt' : './input.txt';
const input = readFileSync(path.resolve(__dirname, inputFileName), {
  encoding: 'utf8',
  flag: 'r',
}).split('\n');
debugLog(input);

const isInvalid = (input: string) => {
  const length = input.length;
  if (length % 2 != 0) {
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
  const invalidIds: string[] = [];
  ids.forEach(range => {
    const [first, last] = range.split('-').map(Number);
    const allIds = _.range(first, last+1).map(i => i.toString());
    const newInvalid = allIds.filter(isInvalid);
    debugLog(newInvalid);
    invalidIds.push(...allIds.filter(isInvalid).map(Number));
  });

  debugLog(invalidIds);

  const solution = invalidIds.reduce((a, c) => a + c, 0);
  console.log(`\nPart 1: ${solution}`);
};

const part2 = () => {
  const solution = 0;
  console.log(`\nPart 2: ${solution}`);
};

part1();
part2();
