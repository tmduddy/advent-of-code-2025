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

const part1 = () => {
  // build graph
  const graph: Record<string, Set<string>> = {};
  input.forEach(row => {
    const [node, neighbors] = row.split(':');
    if (!graph[node]) {
      graph[node] = new Set();
    }
    neighbors
      .split(' ')
      .filter(Boolean)
      .forEach(n => {
        graph[node].add(n);
      });
  });

  debugLog(graph);

  let pathCount = 0;
  // dfs to track all paths from 'you' to 'out'
  const dfs = (node: string, visitedNodes: Set<string>) => {
    if (node === 'out') {
      pathCount++;
      return;
    }

    if (visitedNodes.has(node)) {
      return;
    }

    visitedNodes.add(node);

    const neighbors = graph[node];
    for (const neighbor of neighbors) {
      dfs(neighbor, visitedNodes);
    }

    // keep 'you' in the visisted list so we don't loop
    if (node !== 'you') {
      visitedNodes.delete(node);
    }

    return;
  };

  dfs('you', new Set());

  const solution = pathCount;
  console.log(`\nPart 1: ${solution}`);
};

const part2 = () => {
  const solution = 0;
  console.log(`\nPart 2: ${solution}`);
};

timeIt(part1);
timeIt(part2);
