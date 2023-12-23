import { group } from "node:console";
import * as fs from "node:fs/promises";
const fileData = (await fs.readFile("./input")).toString();
const cases = fileData
  .trim()
  .split("\n")
  .map((line) => line.split(" "))
  .map(([springText, groupText]) => {
    const unfoldedSpringText = new Array(5).fill(springText).join("?");
    const springList = unfoldedSpringText.split("");
    const groupList = groupText.split(",").map((str) => parseInt(str));
    return {
      springList,
      groupList: new Array(5).fill(groupList).flat(),
    } as SpringLine;
  });

type SpringLine = {
  springList: string[];
  groupList: number[];
};

function getIterations(line: SpringLine) {
  const missingSlotCount = line.springList.filter((s) => s === "?").length;
  const knownSpringCount = line.springList.filter((s) => s === "#").length;
  const totalSpringCount = line.groupList.reduce((a, b) => a + b);
  const placeableSpringCount = totalSpringCount - knownSpringCount;
  let total = 1n;
  for (let i = placeableSpringCount + 1; i <= missingSlotCount; i++) {
    total = total * BigInt(i);
  }
  for (let i = 2; i <= missingSlotCount - placeableSpringCount; i++) {
    total = total / BigInt(i);
  }
  return Number(total);
}

/**
 * Returns all boolean arrays with length `n` and `k` values that are `true`
 */
function genCombinatoricArrays(n: number, k: number): boolean[][] {
  const out = [] as boolean[][];
  if (k === 0) {
    return [new Array<boolean>(n).fill(false)];
  }
  for (let i = 0; i <= n - k; i++) {
    const prefix = new Array<boolean>(i + 1).fill(false);
    prefix[i] = true;
    const suffixes = genCombinatoricArrays(n - i - 1, k - 1);
    const newAdditions = suffixes.map((array) => prefix.concat(array));
    out.push(...newAdditions);
  }
  return out;
}

function testValidArrangement(line: SpringLine, fillPattern: boolean[]) {
  const filledLine = line.springList.map((x) => x);
  let patternIndex = 0;
  for (let i = 0; i < filledLine.length; i++) {
    if (filledLine[i] === "?") {
      filledLine[i] = fillPattern[patternIndex] ? "#" : ".";
      patternIndex++;
    }
  }
  const groupSizeList = filledLine
    .join("")
    .split(/\.+/)
    .map((group) => group.length)
    .filter((x) => x > 0);
  if (groupSizeList.length !== line.groupList.length) return false;
  for (let i = 0; i < groupSizeList.length; i++) {
    if (groupSizeList[i] !== line.groupList[i]) return false;
  }
  console.log(filledLine.join(""));
  return true;
}

const memo = new Map<string, bigint>();
function countHuggingArrangements(line: SpringLine): bigint {
  const key = JSON.stringify(line);
  if (memo.has(key)) {
    return memo.get(key) as bigint;
  }

  const groupList = line.groupList;
  const springList = line.springList;
  const lineSize = line.springList.length;
  const totalSpringCount = groupList.reduce((a, b) => a + b, 0);
  const groupSize = groupList[0];

  //If this is a single group
  if (groupList.length === 1) {
    if (lineSize !== groupSize) {
      memo.set(key, 0n);
      return 0n;
    }
    if (springList.includes(".")) {
      memo.set(key, 0n);
      return 0n;
    }
    memo.set(key, 1n);
    return 1n;
  }

  // Validate that left side can have a group
  if (springList.length <= groupSize) {
    memo.set(key, 0n);
    return 0n;
  }
  const leftGroup = springList.slice(0, groupSize);
  if (leftGroup.includes(".")) {
    memo.set(key, 0n);
    return 0n;
  }
  if (springList[groupSize] === "#") {
    memo.set(key, 0n);
    return 0n;
  }

  let total = 0n;
  /** Last ? or . before the next group */
  let splitIndex = groupSize;
  const rightGroup = groupList.slice(1);
  while (springList[splitIndex] === "." || springList[splitIndex] === "?") {
    const rightSpring = springList.slice(splitIndex + 1);
    total += countHuggingArrangements({
      springList: rightSpring,
      groupList: rightGroup,
    });
    splitIndex++;
  }
  memo.set(key, total);
  return total;
}

function countTotalArrangements(line: SpringLine): bigint {
  const { groupList, springList } = line;
  let total = 0n
  for (let start = -1; springList[start] !== "#" && start < springList.length - 1; start++) {
    for (let end = springList.length; end > start + 1 && springList[end] !== "#"; end--) {
      const subLine = {
        groupList,
        springList: springList.slice(start+1, end)
      }
      total += countHuggingArrangements(subLine);
    }
  }
  return total;
}
// function getNumArrangements(line: SpringLine): bigint {}
console.log(cases.map(countTotalArrangements).reduce((a, b) => a + b));
