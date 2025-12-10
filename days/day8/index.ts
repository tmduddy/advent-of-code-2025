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
// debugLog(input);

const distanceBetweenPoints = (pos1: number[], pos2: number[]): number => {
  const [[x1, y1, z1], [x2, y2, z2]] = [pos1, pos2];
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2 + (z1 - z2) ** 2);
};

const part1 = () => {
  const boxes = input.map(row => row.split(',').map(Number));
  debugLog(boxes);

  const numBoxes = boxes.length;

  // pre-compute all distances
  // { [distance]: 'srcBoxId;destBoxId' }
  const distanceBoxes: Map<number, string> = new Map();
  boxes.forEach((box, idx) => {
    // we can use idx+1 here because we dont need to include idx->idx
    // and circuits are bi-directional which means we've already covered
    // the cases where j < idx
    for (let j = idx + 1; j < numBoxes; j++) {
      const distance = distanceBetweenPoints(box, boxes[j]);
      const ijKey = `${idx};${j}`;
      distanceBoxes.set(distance, ijKey);
    }
  });

  // Collect the N lowest distances
  const n = process.env.AOC_DEMO === 'true' ? 10 : 1000;
  const nLowestDistances = [...distanceBoxes.keys()]
    .sort((a, b) => Number(a) - Number(b))
    .slice(0, n);

  // store every final circuit
  const circuitsMade: Set<Set<number>> = new Set();

  // for .. of loop so we can leverage `continue`
  for (const distance of nLowestDistances) {
    const [src, dest] =
      distanceBoxes.get(distance)?.split(';').map(Number) || [];
    const newCircuit = new Set([src, dest]);

    // find first (and only) circuit in existing circuits with src and dest
    const circuitWithSrc = [...circuitsMade].filter(circuit =>
      circuit.has(src),
    )[0];
    const circuitWithDest = [...circuitsMade].filter(circuit =>
      circuit.has(dest),
    )[0];

    if (circuitWithSrc && circuitWithDest) {
      if (circuitWithSrc.symmetricDifference(circuitWithDest).size === 0) {
        // we're looking at the same circuit, on to the next ...
        continue;
      }
      // merge the circuits with eachother and the new, remove both originals from the circuitsMade and add the merged one
      const merged = circuitWithSrc.union(circuitWithDest).union(newCircuit);
      circuitsMade.delete(circuitWithSrc);
      circuitsMade.delete(circuitWithDest);
      circuitsMade.add(merged);
    } else if (circuitWithSrc) {
      // remove existing circuitWithSrc and add new one that includes the new circuit plus the old
      const merged = circuitWithSrc.union(newCircuit);
      circuitsMade.delete(circuitWithSrc);
      circuitsMade.add(merged);
    } else if (circuitWithDest) {
      // remove existing circuitWithDest and add new one that includes the new circuit plus the old
      const merged = circuitWithDest.union(newCircuit);
      circuitsMade.delete(circuitWithDest);
      circuitsMade.add(merged);
    } else {
      // net new circuit, just add
      circuitsMade.add(new Set([src, dest]));
    }
  }

  debugLog(circuitsMade);

  const sizes = [...circuitsMade]
    .map(c => c.size)
    .sort((a, b) => b - a)
    .slice(0, 3);

  debugLog(sizes);

  const solution = sizes.reduce((p, f) => p * f);
  console.log(`\nPart 1: ${solution}`);
};

const part2 = () => {
  const boxes = input.map(row => row.split(',').map(Number));
  debugLog(boxes.slice(0, 10));

  const numBoxes = boxes.length;

  // pre-compute all distances
  // { [distance]: 'srcBoxId;destBoxId' }
  const distanceBoxes: Map<number, string> = new Map();
  boxes.forEach((box, idx) => {
    for (let j = idx + 1; j < numBoxes; j++) {
      const distance = distanceBetweenPoints(box, boxes[j]);
      const ijKey = `${idx};${j}`;
      distanceBoxes.set(distance, ijKey);
    }
  });

  // store every final circuit
  const circuitsMade: Set<Set<number>> = new Set();

  const sortedDistances = [...distanceBoxes.keys()].sort(
    (a, b) => Number(a) - Number(b),
  );

  debugLog(sortedDistances.slice(0, 10));

  let src = -1;
  let dest = -1;
  let largestCircuitSize = 0;

  // for .. of loop so we can leverage `continue` and `break`
  for (const distance of sortedDistances) {
    if (largestCircuitSize === numBoxes) {
      break;
    }

    [src, dest] = distanceBoxes.get(distance)?.split(';').map(Number) || [];
    const newCircuit = new Set([src, dest]);

    // find first (and only) circuit in existing circuits with src and dest
    const circuitWithSrc = [...circuitsMade].filter(circuit =>
      circuit.has(src),
    )[0];
    const circuitWithDest = [...circuitsMade].filter(circuit =>
      circuit.has(dest),
    )[0];

    if (circuitWithSrc && circuitWithDest) {
      if (circuitWithSrc.symmetricDifference(circuitWithDest).size === 0) {
        // we're looking at the same circuit, on to the next ...
        continue;
      }
      // merge the circuits with eachother and the new, remove both originals from the circuitsMade and add the merged one
      const merged = circuitWithSrc.union(circuitWithDest).union(newCircuit);
      if (merged.size > largestCircuitSize) {
        largestCircuitSize = merged.size;
      }
      circuitsMade.delete(circuitWithSrc);
      circuitsMade.delete(circuitWithDest);
      circuitsMade.add(merged);
    } else if (circuitWithSrc) {
      // remove existing circuitWithSrc and add new one that includes the new circuit plus the old
      const merged = circuitWithSrc.union(newCircuit);
      if (merged.size > largestCircuitSize) {
        largestCircuitSize = merged.size;
      }
      circuitsMade.delete(circuitWithSrc);
      circuitsMade.add(merged);
    } else if (circuitWithDest) {
      // remove existing circuitWithDest and add new one that includes the new circuit plus the old
      const merged = circuitWithDest.union(newCircuit);
      if (merged.size > largestCircuitSize) {
        largestCircuitSize = merged.size;
      }
      circuitsMade.delete(circuitWithDest);
      circuitsMade.add(merged);
    } else {
      // net new circuit, just add
      circuitsMade.add(new Set([src, dest]));
    }
  }
  const [srcX] = boxes[src];
  const [destX] = boxes[dest];

  const solution = srcX * destX;
  console.log(`\nPart 2: ${solution}`);
};

timeIt(part1);
timeIt(part2);
