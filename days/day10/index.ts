import {readFileSync} from 'fs';
import path from 'path';

import {debugLog, timeIt} from '../utils/utils';

const inputFileName =
  process.env.AOC_DEMO === 'true' ? './demo.txt' : './input.txt';
const input = readFileSync(path.resolve(__dirname, inputFileName), {
  encoding: 'utf8',
  flag: 'r',
})
  .split('\n')
  .filter(Boolean);
debugLog(input);

// I googled for this one, basically replaces pythons itertools.combinations
// ex. combinations([1, 2, 3], 2) -> [[1, 2], [1, 3], [2, 3]]
function* combinations<T>(arr: T[], r: number): IterableIterator<T[]> {
  const n = arr.length;
  if (r < 0 || r > n) {
    return;
  }

  // Indices array acts as the state for the generator
  const indices = Array.from({length: r}, (_, i) => i);

  while (true) {
    // Yield the current combination
    yield indices.map(i => arr[i]);

    // Find the rightmost index that can be incremented
    let i = r - 1;
    while (i >= 0 && indices[i] === n - r + i) {
      i--;
    }

    // If no index can be incremented, we're done
    if (i < 0) {
      break;
    }

    // Increment the found index
    indices[i]++;

    // Set subsequent indices to their minimum possible value
    for (let j = i + 1; j < r; j++) {
      indices[j] = indices[j - 1] + 1;
    }
  }
}

type Parts = {
  lights: string;
  lightsBinToDec: number;
  buttons: number[][];
  buttonsBin: string[];
  joltages: number[];
};
const getParts = (row: string): Parts => {
  const lightsEnd = row.indexOf(']');
  const lights = row.substring(1, lightsEnd);
  const lightsBinToDec = parseInt(
    lights
      .split('')
      .map(i => (i === '.' ? 0 : 1))
      .join(''),
    2,
  );

  const joltagesStart = row.indexOf('{');
  const buttons = row
    .substring(lightsEnd + 2, joltagesStart - 1)
    .trim()
    .split(' ')
    .map(v => v.replaceAll(/\(|\)/g, '').split(',').map(Number));

  const buttonsBin = buttons.map(button => {
    const base = new Array(lights.length).fill(0);
    button.forEach(i => {
      base[i] = 1;
    });
    return base.join('');
  });

  const joltages = row
    .substring(joltagesStart + 1)
    .replaceAll(/}/g, '')
    .split(',')
    .map(Number);

  return {
    lights,
    lightsBinToDec,
    buttons,
    buttonsBin,
    joltages,
  };
};

const part1 = () => {
  const machines = input.map(getParts);

  const presses: number[] = [];

  machines.forEach(({lights, lightsBinToDec, buttonsBin}) => {
    debugLog(lights, buttonsBin);
    let pressesNeeded = 0;
    const target = lightsBinToDec;
    debugLog('target', target.toString(2));

    let xorResult = 0;
    let isFound = false;
    while (!isFound) {
      pressesNeeded++;
      const combos = combinations(buttonsBin, pressesNeeded);
      for (const combo of combos) {
        xorResult = combo.map(p => parseInt(p, 2)).reduce((a, c) => a ^ c);
        const pressResult = xorResult.toString(2);
        if (parseInt(pressResult, 2) === target) {
          presses.push(pressesNeeded);
          isFound = true;
          break;
        }
      }
    }
  });

  const solution = presses.reduce((a, c) => a + c);
  console.log(`\nPart 1: ${solution}`);
};

const part2 = () => {
  const solution = 0;
  console.log(`\nPart 2: ${solution}`);
};

timeIt(part1);
timeIt(part2);
