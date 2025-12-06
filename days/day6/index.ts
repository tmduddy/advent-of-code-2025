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

const transpose = (grid: string[][]) => {
  return grid.reduce((transposed: string[][], row: string[]) => {
    return row.map((_, i) => (transposed[i] || []).concat(row[i]));
  }, []);
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
    if (op === '*') {
      finalSum += nums.reduce((product, num) => product * num);
    } else if (op === '+') {
      finalSum += nums.reduce((sum, num) => sum + num);
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
    // left or right pad digits with 0s to fill max column width
    parsedRow.push(row.substring(start, len).replaceAll(' ', '0'));
    // account for the space between cols
    start = len + 1;
  });

  return parsedRow;
};

const numsToCephalopodNums = (nums: string[]): string[] => {
  // nums is a single "column" of input numbers, which we know
  // all share the same width
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
  // find the "widest" number in each column
  const maxWidthEachCol = transpose(
    input.map(r => r.split(' ').filter(Boolean)),
  )
    .map(r => r.map(c => c.length))
    .map(r => Math.max(...r));

  // split the inputs into columns based on the known width of each
  const problems = transpose(input.map(row => parseRow(row, maxWidthEachCol)));
  debugLog(problems);

  let finalSum = 0;
  problems.forEach(problem => {
    const op = problem[problem.length - 1];
    const nums = numsToCephalopodNums(problem.slice(0, -1)).map(Number);

    if (op === '*') {
      finalSum += nums.reduce((product, num) => product * num);
    } else if (op === '+') {
      finalSum += nums.reduce((sum, num) => sum + num);
    }
  });

  const solution = finalSum;
  console.log(`\nPart 2: ${solution}`);
};

timeIt(part1);
timeIt(part2);
