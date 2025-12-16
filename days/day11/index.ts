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
  const dfs1 = (node: string, visitedNodes: Set<string>) => {
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
      dfs1(neighbor, visitedNodes);
    }

    // keep 'you' in the visisted list so we don't loop
    if (node !== 'you') {
      visitedNodes.delete(node);
    }

    return;
  };

  dfs1('you', new Set());

  const solution = pathCount;
  console.log(`\nPart 1: ${solution}`);
};

const dfs = (
  node: string,
  visitedNodes: Set<string>,
  pathCount: number,
  pathMap: Map<string, number>,
  graph: Record<string, Set<string>>,
  start: string,
  target: string,
  mustNotInclude?: Set<string>,
  deadEndMap?: Map<string, boolean>,
): number => {
  // if the node is in the forbidden list
  if (mustNotInclude && mustNotInclude.has(node)) {
    return pathCount;
  }

  if (deadEndMap && deadEndMap.get(node)) {
    return pathCount;
  }

  // If we've already calculated the path to the target from here
  if (pathMap.get(node)) {
    pathCount += pathMap.get(node) || 0;
    return pathCount;
  }

  // if the node is our target
  if (node === target) {
    pathCount++;
    return pathCount;
  }

  // if we've already seen this node:
  if (visitedNodes.has(node)) {
    return pathCount;
  }

  visitedNodes.add(node);

  const neighbors = graph[node];

  if (!neighbors) {
    return pathCount;
  }

  // debugLog(`source node ${node} has neighbors ${[...neighbors]}`);
  if (
    mustNotInclude &&
    neighbors.intersection(mustNotInclude).size === neighbors.size
  ) {
    // all of the neighbors are dead ends, and this node should be added to the path map
    pathMap.set(node, 0);
    return pathCount;
  }

  // we dont want to waste cycles looking through extra neighbors if one of the neighbors is our target
  if (neighbors.has(target)) {
    pathCount = dfs(
      target,
      visitedNodes,
      pathCount,
      pathMap,
      graph,
      start,
      target,
      mustNotInclude,
      deadEndMap,
    );
  } else {
    for (const neighbor of neighbors) {
      pathCount = dfs(
        neighbor,
        visitedNodes,
        pathCount,
        pathMap,
        graph,
        start,
        target,
        mustNotInclude,
        deadEndMap,
      );
    }
  }

  // keep the start point in the visisted list so we don't loop
  if (node !== start) {
    visitedNodes.delete(node);
  }

  return pathCount;
};

const getPathsToX = (
  x: string,
  graph: Record<string, Set<string>>,
  mustNotInclude?: Set<string>,
  source?: string,
  deadEndMap?: Map<string, boolean>,
): Map<string, number> => {
  // loop through every start point -> x and store the path counts
  // prioritizing short paths to start and building out from there DP style
  const pathMapToX = new Map<string, number>();
  const nodesNotExplored = new Set(Object.keys(graph));
  let keysToSearch = new Set([x]);
  let lastKeysSearched = new Set();
  while (
    nodesNotExplored.size > 0 &&
    // if we're looking for the same set of keys twice in a row, bail
    keysToSearch.intersection(lastKeysSearched).size !== keysToSearch.size
  ) {
    lastKeysSearched = new Set(structuredClone(keysToSearch));

    // prefer nodes that only reference nodes we've checked
    let nodes = [...nodesNotExplored].filter(node => {
      const neighbors = graph[node];
      return neighbors.intersection(keysToSearch).size === keysToSearch.size;
    });

    // otherwise, expand to nodes that _include_ nodes we've checked
    if (nodes.length === 0) {
      nodes = [...nodesNotExplored].filter(node => {
        const neighbors = graph[node];
        return neighbors.intersection(keysToSearch).size > 0;
      });
    }

    keysToSearch = new Set();

    nodes.forEach(node => {
      nodesNotExplored.delete(node);
      // next time we'll look for nodes that reference *this* node
      keysToSearch.add(node);
      pathMapToX.set(
        node,
        dfs(
          node,
          new Set(),
          0,
          pathMapToX,
          graph,
          node,
          x,
          mustNotInclude,
          deadEndMap,
        ),
      );
    });
    if (source && nodes.includes(source)) {
      break;
    }
  }

  return pathMapToX;
};

const part2 = () => {
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

  const pathMapToOut = getPathsToX('out', graph);
  const pathMapToOutNoFft = getPathsToX('out', graph, new Set(['fft']));
  const pathMapToOutNoDac = getPathsToX('out', graph, new Set(['dac']));

  const dacDeadEndMap = new Map<string, boolean>();
  for (const [node, allPaths] of pathMapToOut.entries()) {
    const nonDacPaths = pathMapToOutNoDac.get(node) || 0;
    // if all of the paths out from this node get to 'out'
    // without touching 'dac' then consider it a dead end
    dacDeadEndMap.set(node, nonDacPaths - allPaths === 0);
  }
  const pathMapToDacNoFft = getPathsToX(
    'dac',
    graph,
    new Set(['out', 'fft']),
    undefined,
    dacDeadEndMap,
  );
  const allPathsToDac = getPathsToX(
    'dac',
    graph,
    new Set(['out']),
    undefined,
    dacDeadEndMap,
  );

  const fftDeadEndMap = new Map<string, boolean>();
  for (const [node, allPaths] of pathMapToOut.entries()) {
    const nonFftPaths = pathMapToOutNoFft.get(node) || 0;
    // if all of the paths out from this node get to 'out'
    // without touching 'fft' then consider it a dead end
    fftDeadEndMap.set(node, nonFftPaths - allPaths === 0);
  }
  const pathMapToFftNoDac = getPathsToX(
    'fft',
    graph,
    new Set(['out', 'dac']),
    undefined,
    fftDeadEndMap,
  );
  const allPathsToFft = getPathsToX(
    'fft',
    graph,
    new Set(['out']),
    undefined,
    fftDeadEndMap,
  );
  const svr2fft0dac = pathMapToFftNoDac.get('svr') || 0;
  const fft2dac = allPathsToDac.get('fft') || 0;
  const dac2out0fft = pathMapToOutNoFft.get('dac') || 0;

  debugLog('all paths svr -> fft (no DAC)', svr2fft0dac);
  debugLog('all paths fft -> dac', fft2dac);
  debugLog('all paths dac -> out (no FFT)', dac2out0fft);
  debugLog('');

  const svr2dac0fft = pathMapToDacNoFft.get('svr') || 0;
  const dac2fft = allPathsToFft.get('dac') || 0;
  const fft2out0dac = pathMapToOutNoDac.get('fft') || 0;
  debugLog('all paths svr -> dac (no FFT)', svr2dac0fft);
  debugLog('all paths dac -> fft', dac2fft);
  debugLog('all paths fft -> out (no DAC)', fft2out0dac);

  // consider the paths:
  // 'svr' -> 'fft' -> 'dac' -> 'out'
  // +
  // 'svr' -> 'dac' -> 'fft' -> 'out'
  // and multiply each '->' connection to find the total possible combinations
  const solution =
    svr2fft0dac * fft2dac * dac2out0fft + svr2dac0fft * dac2fft * fft2out0dac;
  console.log(`\nPart 2: ${solution}`);
};

timeIt(part1);
timeIt(part2);
