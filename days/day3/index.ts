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

const part1 = () => {
  const banks = input.filter(Boolean);

  let joltageSum = 0;

  banks.forEach(bank => {
    const bankSize = bank.length;
    const maxTens = Math.max(
      ...bank
        .substring(0, bankSize - 1)
        .split('')
        .map(Number),
    );
    joltageSum += maxTens * 10;
    const maxTensLocation = bank.indexOf(maxTens.toString());
    const maxOnes = Math.max(
      ...bank
        .substring(maxTensLocation + 1, bankSize)
        .split('')
        .map(Number),
    );
    debugLog(`joltage ${maxTens * 10 + maxOnes}`);
    joltageSum += maxOnes;
  });
  const solution = joltageSum;
  console.log(`\nPart 1: ${solution}`);
};

const getMaxDigitAndIndex = (
  bank: string,
  startIndex: number,
  factor: number,
  bankSize: number,
) => {
  const endIndex = bankSize - factor;
  const maxDigit = Math.max(
    ...bank.substring(startIndex, endIndex).split('').map(Number),
  );
  const maxDigitIndex = bank.substring(startIndex).indexOf(maxDigit.toString());
  return {
    digit: maxDigit,
    index: maxDigitIndex,
  };
};

const part2 = () => {
  const banks = input.filter(Boolean);
  let joltageSum = 0;

  banks.forEach(bank => {
    const bankSize = bank.length;
    let startIndex = 0;
    debugLog(`--- bank: ${bank} ---`);
    for (let i = 11; i >= 0; i--) {
      const {digit, index} = getMaxDigitAndIndex(
        bank,
        startIndex,
        i,
        bankSize,
      );
      startIndex += index + 1;
      joltageSum += digit * 10 ** i;
      debugLog(
        `factor 10^${i}: ${digit} at ${index}`,
      );
    }
  });

  const solution = joltageSum;
  console.log(`\nPart 2: ${solution}`);
};

timeIt(part1);
timeIt(part2);
