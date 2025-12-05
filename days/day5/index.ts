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
debugLog(input);

const part1 = () => {
  const lineBreak = input.indexOf('');
  const ranges = input.slice(0, lineBreak);
  const ingredients = input.slice(lineBreak).filter(Boolean);

  let numFresh = 0;

  ingredients.forEach(ingredient => {
    let alreadyFound = false;
    debugLog(ingredient);
    ranges.forEach(range => {
      if (!alreadyFound) {
        debugLog(range);
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
  const solution = 0;
  console.log(`\nPart 2: ${solution}`);
};

timeIt(part1);
timeIt(part2);
