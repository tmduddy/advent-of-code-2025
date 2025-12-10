import { readFileSync } from 'fs';
import path from 'path';

import { debugLog, timeIt } from '../utils/utils';

const inputFileName =
  process.env.AOC_DEMO === 'true' ? './demo.txt' : './input.txt';
const input = readFileSync(path.resolve(__dirname, inputFileName), {
  encoding: 'utf8',
  flag: 'r',
}).split('\n').filter(Boolean).map(n => n.split(',').map(Number));
debugLog(input);

const calcArea = (x1: number, y1: number, x2: number, y2: number): number => {
  return (Math.abs(x1 - x2) + 1) * (Math.abs(y1 - y2) + 1);
}

const part1 = () => {
  const numPoints = input.length;

  let maxArea = 0;
  input.forEach(([x, y], idx) => {
    for (let j = idx + 1; j < numPoints; j++) {
      const [x2, y2] = input[j];
      const area = calcArea(x, y, x2, y2);
      debugLog(`[${x}, ${y}] -> [${x2}, ${y2}] = ${area}`);
      maxArea = Math.max(maxArea, area);
    }
  });

  const solution = maxArea;
  console.log(`\nPart 1: ${solution}`);
};

const part2 = () => {
  const solution = 0;
  console.log(`\nPart 2: ${solution}`);
};

timeIt(part1);
timeIt(part2);
