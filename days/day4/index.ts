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

const isAccessible = (grid: string[], rowCount: number, colCount: number, row: number, col: number) => {

  const firstRow = row === 0;
  const lastRow = row === rowCount -1;

  const firstCol = col === 0;
  const lastCol = col === colCount -1;
  
  const upLeft = !firstRow && !firstCol ? grid[row-1][col-1] : '';
  const up = !firstRow ? grid[row-1][col] : '';
  const upRight = !firstRow && !lastCol ? grid[row-1][col+1] : '';

  const left = !firstCol ? grid[row][col-1] : '';
  const right = !lastCol ? grid[row][col+1] : '';

  const downLeft = !lastRow && !firstCol ? grid[row+1][col-1] : '';
  const down = !lastRow ? grid[row+1][col] : '';
  const downRight = !lastRow && !lastCol ? grid[row+1][col+1]: '';

  const neighbors = [
    upLeft,
    up,
    upRight,
    left,
    right,
    downLeft,
    down,
    downRight,
  ];
  debugLog(row, col, neighbors);

  const numPapers = neighbors.filter(i => i === '@').length;

  return numPapers < 4;
}

const part1 = () => {
  const grid = input.filter(Boolean);
  grid.forEach(row => {
    debugLog(row);
  });

  const rowCount = grid.length;
  const colCount = grid[0].length;

  let numAccessible = 0;
  for (let row = 0; row < rowCount; row++) {
    for (let col = 0; col < colCount; col++) {
      if (grid[row][col] === '@') {
        numAccessible += isAccessible(grid, rowCount, colCount, row, col) ? 1 : 0;
      }
    }
  }

  const solution = numAccessible;
  console.log(`\nPart 1: ${solution}`);
};

const part2 = () => {
  const solution = 0;
  console.log(`\nPart 2: ${solution}`);
};

timeIt(part1);
timeIt(part2);
