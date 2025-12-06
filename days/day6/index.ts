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

const parseRow = (row: string, maxWidthEachCol: number[]): string[] => {
  if (row.includes('+')) {
    return row.split(' ').filter(Boolean);
  }

  const parsedRow: string[] = [];
  let start = 0;
  maxWidthEachCol.forEach(colWidth => {
    const len = colWidth + start;
    parsedRow.push(row.substring(start, len).replaceAll(' ', '0'));
    // account for the space between cols
    start = len + 1;
  });

  return parsedRow;
};

const numsToCephalopodNums = (nums: string[]): string[] => {
  const colWidth: number = nums[0].length;
  const cephNums = [];
  for (let i = 0; i < colWidth; i++) {
    cephNums.push(
      nums.reduce(
        (cephNum, elfNum) => (cephNum += elfNum[i] !== '0' ? elfNum[i] : ''),
        '',
      ),
    );
  }

  return cephNums;
};

const part2 = () => {
  const maxWidthEachCol = transpose(
    input.map(r => r.split(' ').filter(Boolean)),
  )
    .map(r => r.map(c => c.length))
    .map(r => Math.max(...r));
  debugLog(maxWidthEachCol);

  const parsed = input.map(row => parseRow(row, maxWidthEachCol));
  debugLog('parsed', parsed);
  const problems = transpose(parsed);
  debugLog(problems);
  let finalSum = 0;

  problems.forEach(problem => {
    const op = problem[problem.length - 1];
    const nums = numsToCephalopodNums(problem.slice(0, -1)).map(Number);
    debugLog(op, nums);
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
