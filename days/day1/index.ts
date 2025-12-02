import {readFileSync} from 'fs';
import path from 'path';

import {debugLog} from '../utils/utils';

const inputFileName =
  process.env.AOC_DEMO === 'true' ? './demo.txt' : './input.txt';
const input = readFileSync(path.resolve(__dirname, inputFileName), {
  encoding: 'utf8',
  flag: 'r',
}).split('\n');
debugLog(input);

const part1 = () => {
  const instructions = input.filter(Boolean);
  const dialSize = 100;
  let dialPosition = 50;
  let zeroes = 0;
  let modifier = 1;

  debugLog(instructions);

  instructions.forEach(step => {
    const dir = step[0];
    const magnitude = parseInt(step.slice(1), 10);
    if (dir === 'L') {
      modifier = -1;
    } else {
      modifier = 1;
    }

    // move the needle by the magnitude in the correct direction
    dialPosition = dialPosition + modifier * magnitude;
    debugLog(dir, magnitude, dialPosition);

    // modulo to account for the looping dial
    if (dialPosition % dialSize === 0) {
      zeroes++;
    }
  });

  const solution = zeroes;
  console.log(`\nPart 1: ${solution}`);
};

const part2 = () => {
  const instructions = input.filter(Boolean);
  const dialSize = 100;
  let dialPosition = 50;
  let zeroes = 0;
  let modifier = 1;

  debugLog(instructions);

  instructions.forEach(step => {
    const dir = step[0];
    const magnitude = parseInt(step.slice(1), 10);
    if (dir === 'L') {
      modifier = -1;
    } else {
      modifier = 1;
    }
    // account for moves larger than the dial size, counting each zero
    let zeroPasses = Math.floor(magnitude / dialSize);

    const lastDialPosition = dialPosition;
    // Move the dial to the new position, and modulo to keep it in the dial range
    dialPosition = dialPosition + ((modifier * magnitude) % dialSize);

    // if we ended up at zero and didn't come from zero, count it
    if (dialPosition === 0 && lastDialPosition !== 0) {
      zeroPasses++;
    } else if (dialPosition < 0) {
      // normalize to a 'real' dialPosition
      dialPosition += dialSize;
      // if we ended up below zero and didn't come from 0, we passed 0
      if (lastDialPosition !== 0) {
        zeroPasses++;
      }
    } else if (dialPosition >= 100) {
      // normalize to 'real' dialPosition
      dialPosition -= dialSize;
      // if we ended up over 100 and didn't come from 0, we passed 0
      if (lastDialPosition !== 0) {
        zeroPasses++;
      }
    }
    debugLog(dir, magnitude, zeroPasses, dialPosition);
    zeroes += zeroPasses;
  });

  const solution = zeroes;
  console.log(`\nPart 2: ${solution}`);
};

part1();
part2();
