import * as fs from "node:fs/promises";
import test from "node:test";
const fileData = (await fs.readFile("./input")).toString();
// const fileData = `seeds: 79 14 55 13
// 
// seed-to-soil map:
// 50 98 2
// 52 50 48
// 
// soil-to-fertilizer map:
// 0 15 37
// 37 52 2
// 39 0 15
// 
// fertilizer-to-water map:
// 49 53 8
// 0 11 42
// 42 0 7
// 57 7 4
// 
// water-to-light map:
// 88 18 7
// 18 25 70
// 
// light-to-temperature map:
// 45 77 23
// 81 45 19
// 68 64 13
// 
// temperature-to-humidity map:
// 0 69 1
// 1 0 69
// 
// humidity-to-location map:
// 60 56 37
// 56 93 4`;
const dataList = fileData.trim().split("\n");
const mapBlocks = fileData.split(/\n\n\w+-\w+-\w+ map:\n/);
const seedList = mapBlocks.shift()?.slice(7).trim().split(" ").map(BigInt)!;
const seedIntervals: Interval[] = [];
while (seedList.length) {
  const location = seedList.shift()!;
  const range = seedList.shift()!;
  seedIntervals.push([location, location + range - 1n]);
}
const mappings = mapBlocks
  .map((data) =>
    data
      .trim()
      .split("\n")
      .map((line) => line.split(" ").map(BigInt))
      .map(
        ([destStart, srcStart, range]) =>
          ({
            src: [srcStart, srcStart + range - 1n],
            displacement: destStart - srcStart,
          } as Mapping)
      )
  )
  .map(normalizeMapping);

/** [min, max] inclusive */
type Bound = bigint | "infinity" | "-infinity";
function compare(a: Bound, b: Bound): -1 | 0 | 1 {
  if (a === b) {
    return 0;
  }
  if (a === "infinity" || b === "-infinity") {
    return 1;
  }
  if (a === "-infinity" || b === "infinity") {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  if (a < b) {
    return -1;
  }
  throw new Error("Bounds must be greater, less than or equal");
}

function subtractBounds(a: Bound, b: Bound): Bound {
  if (
    (a === "-infinity" && b === "-infinity") ||
    (a === "infinity" && b === "infinity")
  )
    throw new Error("Subtracting inconsistent infinities is undefined");
  if (a === b) {
    return 0n;
  }
  if (a === "infinity" || b === "-infinity") {
    return "infinity";
  }
  if (a === "-infinity" || b === "infinity") {
    return "-infinity";
  }
  return a - b;
}

function addBounds(a: Bound, b: Bound): Bound {
  return subtractBounds(a, subtractBounds(0n, b));
}

type Interval = [Bound, Bound];
function intersectionUnchecked(a: Interval, b: Interval): Interval {
  return [
    compare(a[0], b[0]) > 0 ? a[0] : b[0],
    compare(a[1], b[1]) < 0 ? a[1] : b[1],
  ];
}

function unionUnchecked(a: Interval, b: Interval): Interval {
  return [
    compare(a[0], b[0]) < 0 ? a[0] : b[0],
    compare(a[1], b[1]) > 0 ? a[1] : b[1],
  ];
}

function isValid(x: Interval): boolean {
  return compare(x[0], x[1]) <= 0;
}

function intervalIncludes(x: Interval, y: Bound): boolean {
  return compare(x[0], y) <= 0 && compare(x[1], y) >= 0;
}

/**
 * Merges sorted list of intervals
 */
function mergeAll(intervals: Interval[]): Interval[] {
  if (intervals.length === 0) return [];

  const sortedIntervals = intervals
    .map((x) => x.map((y) => y))
    .sort(([astart, _aend], [bstart, _bend]) =>
      compare(astart, bstart)
    ) as Interval[];

  const out: Interval[] = [];

  let workingInterval = sortedIntervals[0];
  for (let i = 1; i < sortedIntervals.length; i++) {
    const currentInterval = sortedIntervals[i];
    /** Distance from current blob to next blob */
    const intervalDist = subtractBounds(currentInterval[0], workingInterval[1]);
    if (compare(intervalDist, 1n) <= 0) {
      workingInterval = unionUnchecked(workingInterval, currentInterval);
    } else {
      out.push(workingInterval);
      workingInterval = currentInterval;
    }
  }

  out.push(workingInterval);

  return out;
}

type Mapping = {
  src: Interval;
  displacement: bigint;
};

function normalizeMapping(mappingList: Mapping[]): Mapping[] {
  if (mappingList.length === 0) return [];
  const sortedMappingList = mappingList
    .map(
      ({ src: [srcStart, srcEnd], displacement }) =>
        ({
          src: [srcStart, srcEnd],
          displacement,
        } as Mapping)
    )
    .sort((a, b) => compare(a.src[0], b.src[0]));

  const N = sortedMappingList.length;

  const output: Mapping[] = sortedMappingList.slice(0);
  // Add to start
  if (sortedMappingList[0].src[0] !== "-infinity") {
    output.push({
      src: ["-infinity", subtractBounds(sortedMappingList[0].src[0], 1n)],
      displacement: 0n,
    });
  }
  // Add between
  for (let i = 0; i < N - 1; i++) {
    const prevMap = sortedMappingList[i];
    const nextMap = sortedMappingList[i + 1];
    if (subtractBounds(nextMap.src[0], prevMap.src[1]) !== 1n) {
      output.push({
        src: [
          addBounds(prevMap.src[1], 1n),
          subtractBounds(nextMap.src[0], 1n),
        ],
        displacement: 0n,
      });
    }
  }
  // Add to end
  if (sortedMappingList[N - 1].src[1] !== "infinity") {
    output.push({
      src: [addBounds(sortedMappingList[N - 1].src[1], 1n), "infinity"],
      displacement: 0n,
    });
  }

  // Sort mapping
  output.sort((a, b) => compare(a.src[0], b.src[0]));

  // Verify properties
  if (output.some((mapping) => !isValid(mapping.src)))
    throw new Error("Invalid mapping!");

  return output;
}

function findMappingIndex(mappingList: Mapping[], value: Bound): number {
  if (mappingList.length === 0)
    throw new Error("Mapping list must cover all integers");
  let low = 0;
  let high = mappingList.length - 1;
  let mid = Math.floor((low + high) * 0.5);
  while (low <= high) {
    const testInterval = mappingList[mid].src;
    if (intervalIncludes(testInterval, value)) return mid;
    if (compare(value, testInterval[0]) < 0) {
      high = mid - 1;
    }
    if (compare(value, testInterval[1]) > 0) {
      low = mid + 1;
    }
    mid = Math.floor((low + high) * 0.5);
  }
  throw new Error("Failed to find mapping");
}

function mapMapping(elements: Interval, map: Mapping): Interval {
  const [sectionStart, sectionEnd] = intersectionUnchecked(elements, map.src);
  return [
    addBounds(sectionStart, map.displacement),
    addBounds(sectionEnd, map.displacement),
  ];
}

function swizzleInterval(
  mappingList: Mapping[],
  section: Interval
): Interval[] {
  const start = findMappingIndex(mappingList, section[0]);
  const end = findMappingIndex(mappingList, section[1]);
  const returnValue = mappingList
    .slice(start, end + 1)
    .map((mapping) => mapMapping(section, mapping));
  console.log(section, " -> ", returnValue);
  return returnValue;
}

function swizzleSet(mappingList: Mapping[], section: Interval[]): Interval[] {
  return mergeAll(
    section.flatMap((interval) => swizzleInterval(mappingList, interval))
  );
}

let element = mergeAll(seedIntervals);
mappings.forEach((mappingList) => {
  console.log("Elements: ", ...element);
  console.log("Performing Mapping!");
  console.log("Mapping List: ", mappingList);
  element = swizzleSet(mappingList, element);
});
console.log(element);
console.log(element.reduce(unionUnchecked))