import {readFileSync} from 'fs';
import path from 'path';

import {debugLog, timeIt} from '../utils/utils';

const inputFileName =
  process.env.AOC_DEMO === 'true' ? './demo.txt' : './input.txt';
const input = readFileSync(path.resolve(__dirname, inputFileName), {
  encoding: 'utf8',
  flag: 'r',
}).split('\n');
debugLog(input);

const transpose = (grid: string[][]): string[][] => {
  const numRows = grid.length;
  const numCols = grid[0].length;
  const transposed: string[][] = Array.from({length: numCols}).map(_ =>
    Array.from({length: numRows}),
  );
  grid.forEach((row, i) => {
    row.forEach((col, j) => {
      transposed[j][i] = col;
    });
  });

  return transposed;
};

const part1 = () => {
  const problems = transpose(
    input
      .map(r => r.split(' ').filter(i => i && i !== ' '))
      .filter(i => i.length > 0),
  );
  debugLog(problems);
  let finalSum = 0;

  problems.forEach(problem => {
    const op = problem[problem.length - 1];
    const nums = problem.slice(0, -1).map(Number);
    switch (op) {
      case '*':
        finalSum += nums.reduce((product, num) => product * num);
        break;
      case '+':
        finalSum += nums.reduce((sum, num) => sum + num);
        break;
      default:
        break;
    }
  });

  const solution = finalSum;
  console.log(`\nPart 1: ${solution}`);
};

const part2 = () => {
  const problems = transpose(
    input
      .map(r => r.split(' ').filter(i => i && i !== ' '))
      .filter(i => i.length > 0),
  );
  debugLog(problems);
  let finalSum = 0;

  problems.forEach(problem => {
    const op = problem[problem.length - 1];
    const nums = problem.slice(0, -1).map(Number);
    switch (op) {
      case '*':
        finalSum += nums.reduce((product, num) => product * num);
        break;
      case '+':
        finalSum += nums.reduce((sum, num) => sum + num);
        break;
      default:
        break;
    }
  });

  const solution = finalSum;
  console.log(`\nPart 2: ${solution}`);
};

timeIt(part1);
timeIt(part2);
