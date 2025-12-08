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

const debugGrid = (grid: string[][]): void => {
  grid.forEach(row => debugLog(row.join('')));
};

const countSplits = (startingPosition: number[], grid: string[][]): number => {
  const [startRow, startCol] = startingPosition;

  const numCols = grid[0].length;
  let numSplits = 0;
  for (let rowIdx = startRow; rowIdx < grid.length; rowIdx++) {
    if (rowIdx !== 0) {
      for (let colIdx = startCol; colIdx < numCols; colIdx++) {
        const above = grid[rowIdx - 1][colIdx];
        if (above === 'S' || above === '|') {
          const col = grid[rowIdx][colIdx];
          if (col === '.') {
            grid[rowIdx][colIdx] = '|';
          } else if (col === '^') {
            numSplits++;
            if (colIdx > 0) {
              grid[rowIdx][colIdx - 1] = '|';
            }
            if (colIdx < numCols - 1) {
              grid[rowIdx][colIdx + 1] = '|';
            }
          }
        }
      }
      debugLog('');
      debugGrid(grid);
    }
  }

  return numSplits;
};

const part1 = () => {
  const grid = input.map(r => r.split(''));
  debugGrid(grid);
  const numSplits = countSplits([0, 0], grid);
  const solution = numSplits;
  console.log(`\nPart 1: ${solution}`);
};

const findStartPoint = (grid: string[][]): number[] => {
  const target = 'S';
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col] === target) {
        return [row, col];
      }
    }
  }
  return [0, 0];
};

const part2 = () => {
  const grid = input.map(r => r.split(''));
  debugGrid(grid);
  const maxRows = grid.length;

  const [beamSourceRow, beamSourceCol] = findStartPoint(grid);

  const cellCache: Map<string, number> = new Map();

  const countTimelines = (row: number, col: number): number => {
    if (row > maxRows - 1) {
      // we hit the bottom, one timeline completed
      return 1;
    }

    const cell = grid[row][col];
    const posStr = [row, col].join(',');

    if (cellCache.has(posStr)) {
      // we've already calculated a path from this cell
      return cellCache.get(posStr) || 0;
    }

    let numTimelines;

    if (cell === '^') {
      // add all the timelines from the left and right of the splitter
      const leftCount = countTimelines(row + 1, col - 1);
      const rightCount = countTimelines(row + 1, col + 1);
      numTimelines = leftCount + rightCount;
    } else {
      // go down one row and check again
      numTimelines = countTimelines(row + 1, col);
    }

    // cache the result for this position
    cellCache.set(posStr, numTimelines);
    return numTimelines;
  };

  const solution = countTimelines(beamSourceRow + 1, beamSourceCol);
  console.log(`\nPart 2: ${solution}`);
};

timeIt(part1);
timeIt(part2);
