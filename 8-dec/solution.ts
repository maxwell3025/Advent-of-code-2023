import * as fs from "node:fs/promises";
const fileData = (await fs.readFile("./input")).toString();
// const fileData = `LR
// 
// 11A = (11B, XXX)
// 11B = (XXX, 11Z)
// 11Z = (11B, XXX)
// 22A = (22B, XXX)
// 22B = (22C, 22C)
// 22C = (22Z, 22Z)
// 22Z = (22B, 22B)
// XXX = (XXX, XXX)`
const lines = fileData.trim().split("\n");

const instructions = lines[0];
const pathList = lines
  .slice(2)
  .map((node) => node.split(/[^A-Z0-9]+/))
  .map(([name, left, right]) => [name, [left, right]]);

const graph = Object.fromEntries(pathList);

type PeriodicEvent = {
  offset: number;
  period: number;
};
type Chunk = string[];
type Ghost = {
  node: string;
  milestones: string[];
  history: string[];
  looped: boolean;
  loopSize: number;
  loopedChunks: Chunk[];
  chunkOffset: number;
  periods: PeriodicEvent[];
};

function gcd(a: number, b: number) {
  if (a === 0) {
    return b;
  }
  if (b === 0) {
    return a;
  }
  return gcd(b, a % b);
}

/**
 * This solves for the modular inverse of `a` mod `m`.
 */
function modInverse(a: number, m: number) {
  let x1 = 1;
  let y1 = 0;
  let x2 = 0;
  let y2 = 1;
  while (a * x2 + m * y2 > 1) {
    const oldResult = a * x1 + m * y1;
    const newResult = a * x2 + m * y2;
    const factor = Math.floor(oldResult / newResult);

    const xTemp = x1 - factor * x2;
    const yTemp = y1 - factor * y2;

    x1 = x2;
    y1 = y2;
    x2 = xTemp;
    y2 = yTemp;
  }
  if (a * x2 + m * y2 === 1) {
    x2 -= m * Math.floor(x2 / m);
    return x2;
  }
  throw new Error(`Failed to find 1 / ${a} mod ${m}`);
}

function intersect(
  a: PeriodicEvent,
  b: PeriodicEvent
): PeriodicEvent | undefined {
  const blockSize = gcd(a.period, b.period);
  if (a.offset % blockSize !== b.offset % blockSize) {
    return undefined;
  }
  const blockOffset = a.offset % blockSize;
  const subSolution = intersectCoprimes(
    {
      offset: Math.floor(a.offset / blockSize),
      period: a.period / blockSize,
    },
    {
      offset: Math.floor(b.offset / blockSize),
      period: b.period / blockSize,
    }
  );
  return {
    period: subSolution.period * blockSize,
    offset: subSolution.offset * blockSize + blockOffset,
  };
}

function intersectCoprimes(a: PeriodicEvent, b: PeriodicEvent): PeriodicEvent {
  const newPeriod = a.period * b.period;
  const term1 = a.offset * b.period * modInverse(b.period, a.period);
  const term2 = b.offset * a.period * modInverse(a.period, b.period);
  const newOffset =
    term1 + term2 - newPeriod * Math.floor(term1 + term2 / newPeriod);
  return {
    offset: newOffset,
    period: newPeriod,
  };
}

const ghosts = Object.keys(graph)
  .filter((x) => /A$/.test(x))
  .map(
    (node) =>
      ({
        node,
        milestones: [],
        history: [],
        looped: false,
        loopSize: 0,
        loopedChunks: [],
        chunkOffset: 0,
        periods: [],
      } as Ghost)
  );

let stepNum = 0;

function step(ghost: Ghost, instruction: string) {
  ghost.history.push(ghost.node);
  if (instruction === "R") {
    ghost.node = graph[ghost.node][1];
  } else {
    ghost.node = graph[ghost.node][0];
  }
}

while (!ghosts.every((ghost) => ghost.looped)) {
  const instrIndex = stepNum % instructions.length;
  ghosts.forEach((ghost) => {
    if (instrIndex === 0) {
      if (ghost.milestones.includes(ghost.node)) {
        ghost.looped = true;
        if (ghost.loopSize === 0) {
          ghost.loopSize =
            ghost.milestones.length -
            ghost.milestones.findIndex((str) => str === ghost.node);
        }
      }
      ghost.milestones.push(ghost.node);
    }
    step(ghost, instructions.charAt(instrIndex));
  });
  stepNum++;
}

//blockify
ghosts.forEach((ghost) => {
  const milestones = ghost.milestones;
  let loopStart = 0;
  for (let i = 0; i < milestones.length; i++) {
    const currentMilestone = ghost.milestones[i];
    if (milestones.slice(i + 1).includes(currentMilestone)) {
      loopStart = i;
      break;
    }
  }
  ghost.chunkOffset = loopStart * instructions.length;
  const loopSeg = ghost.history.slice(
    ghost.chunkOffset,
    ghost.chunkOffset + ghost.loopSize * instructions.length
  );
  loopSeg.forEach((node, index) => {
    if(node.charAt(2) === "Z"){
      console.log(node)
      const newPeriod = {
        period: loopSeg.length,
        offset: index + ghost.chunkOffset
      }
      newPeriod.offset -= newPeriod.period * Math.floor(newPeriod.offset / newPeriod.period)
      ghost.periods.push(newPeriod)
    }
  });
});

console.log(ghosts.map(x => x.periods))
