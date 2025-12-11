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
  .filter(Boolean)
  .map(n => n.split(',').map(Number));
debugLog(input);

const calcArea = (x1: number, y1: number, x2: number, y2: number): number => {
  return (Math.abs(x1 - x2) + 1) * (Math.abs(y1 - y2) + 1);
};

const part1 = () => {
  const numPoints = input.length;

  let maxArea = 0;
  input.forEach(([x, y], idx) => {
    for (let j = idx + 1; j < numPoints; j++) {
      const [x2, y2] = input[j];
      const area = calcArea(x, y, x2, y2);
      maxArea = Math.max(maxArea, area);
    }
  });

  const solution = maxArea;
  console.log(`\nPart 1: ${solution}`);
};

// prints out a grid like the one shown in the examples
// just for fun
const debugGrid = (
  points: number[][],
  pointsOnBoundary: Set<string>,
  pointsOutside: Set<string>,
): void => {
  const maxRows = points.map(i => i[0]).sort((a, b) => b - a)[0];
  const maxCols = points.map(i => i[1]).sort((a, b) => b - a)[0];

  debugLog(maxRows, maxCols);

  const pointsSet = new Set(points.map(p => p.join(',')));
  // +2 adds a nice buffer like shown in the example
  const grid = Array.from({length: maxCols + 2}, () =>
    Array.from({length: maxRows + 2}, () => '.'),
  );
  for (const boundary of pointsOnBoundary) {
    // swap row/col because I have them reversed compared to the shown example lol
    const [col, row] = boundary.split(',').map(Number);
    grid[row][col] = pointsSet.has(boundary) ? '#' : 'X';
  }
  for (const shape of pointsOutside) {
    const [col, row] = shape.split(',').map(Number);
    grid[row][col] = '*';
  }

  grid.forEach(row => debugLog(row.join('')));
};

type Direction = 'L' | 'R' | 'U' | 'D';

// given an array of coordinate pairs, store all points that connect them (and themselves)
const connectTheDots = (dots: number[][]) => {
  const numPoints = dots.length;
  const pointsOnBoundary: Set<string> = new Set();

  // the corner maps are used later to determine how to
  // shape the shell that surrounds the puzzle
  // the cornerIn/OutMaps store the index of a given coordinate
  // and what "direction" the line was going when it entered
  // or exited the point. Note that the shape proceeds counter-
  // clockwise
  const cornerInMap: Record<number, Direction> = {};
  const cornerOutMap: Record<number, Direction> = {};
  dots.forEach(([row1, col1], i1) => {
    // get next point, accounting for loop around to 0
    const i2 = i1 < numPoints - 1 ? i1 + 1 : 0;
    const [row2, col2] = dots[i2];

    if (row1 === row2) {
      // handle horizontal lines
      let start: number;
      let end: number;
      if (col1 > col2) {
        // right to left
        start = col2;
        end = col1;
        cornerOutMap[i1] = 'L';
        cornerInMap[i2] = 'R';
      } else {
        // left to right
        start = col1;
        end = col2;
        cornerOutMap[i1] = 'R';
        cornerInMap[i2] = 'L';
      }
      for (let j = start; j <= end; j++) {
        pointsOnBoundary.add([row1, j].join(','));
      }
    } else if (col1 === col2) {
      // handle vertical lines
      let start: number;
      let end: number;
      if (row1 > row2) {
        // bottom to top
        start = row2;
        end = row1;
        cornerOutMap[i1] = 'U';
        cornerInMap[i2] = 'D';
      } else {
        // top to bottom
        start = row1;
        end = row2;
        cornerOutMap[i1] = 'D';
        cornerInMap[i2] = 'U';
      }
      for (let j = start; j <= end; j++) {
        pointsOnBoundary.add([j, col1].join(','));
      }
    }
  });

  return {
    pointsOnBoundary,
    cornerInMap,
    cornerOutMap,
  };
};

// true if the rectangle contains any points that sit
// on the shell around the shape
const doesRectHaveBoundary = (
  row1: number,
  col1: number,
  row2: number,
  col2: number,
  pointsOutside: Set<string>,
): boolean => {
  const rectangleBoundaries = [
    [row1, col1],
    [row1, col2],
    [row2, col1],
    [row2, col2],
  ];
  const {pointsOnBoundary: rectBoundaryPoints} =
    connectTheDots(rectangleBoundaries);

  return rectBoundaryPoints.intersection(pointsOutside).size > 0;
};

const part2 = () => {
  const numPoints = input.length;

  // build the initial shape
  const {cornerInMap, cornerOutMap, pointsOnBoundary} = connectTheDots(input);

  // use the results of the shape to determine the corners just *outside* the given corners
  const outsideInput: number[][] = [];
  input.forEach(([row, col], i) => {
    const inDir = cornerInMap[i];
    const outDir = cornerOutMap[i];

    let pointOutside: number[] = [];
    if (
      (inDir === 'U' && outDir === 'L') ||
      (inDir === 'R' && outDir === 'D')
    ) {
      // outside corner goes to the top left
      pointOutside = [row - 1, col - 1];
    } else if (
      (inDir === 'U' && outDir === 'R') ||
      (inDir === 'L' && outDir === 'D')
    ) {
      // outside corner goes to the bottom left
      pointOutside = [row + 1, col - 1];
    } else if (
      (inDir === 'D' && outDir === 'L') ||
      (inDir === 'R' && outDir === 'U')
    ) {
      // outside corner goes to the top right
      pointOutside = [row - 1, col + 1];
    } else if (
      (inDir === 'D' && outDir === 'R') ||
      (inDir === 'L' && outDir === 'U')
    ) {
      // outside corner goes to the bottom right
      pointOutside = [row + 1, col + 1];
    }

    outsideInput.push(pointOutside);
  });

  // create a new shape based on those new corners
  const {pointsOnBoundary: pointsOutside} = connectTheDots(outsideInput);

  // draw the grid
  debugGrid(input, pointsOnBoundary, pointsOutside);

  let maxArea = 0;
  input.forEach(([row1, col1], i) => {
    debugLog(i);
    debugLog('maxArea', maxArea);
    // nested loop starts at i+1 because we dont need to double count corners
    for (let j = i + 1; j < numPoints; j++) {
      const [row2, col2] = input[j];
      // i === j means the points are adjacent, which we know is valid
      if (
        i === j ||
        !doesRectHaveBoundary(row1, col1, row2, col2, pointsOutside)
      ) {
        const area = calcArea(row1, col1, row2, col2);
        maxArea = Math.max(maxArea, area);
      }
    }
  });

  const solution = maxArea;
  console.log(`\nPart 2: ${solution}`);
};

timeIt(part1);
timeIt(part2);
