import { dir } from "node:console";
import * as fs from "node:fs/promises";
const fileData = (await fs.readFile("./input")).toString();
const mirrors = fileData
  .trim()
  .split("\n")
  .map((line) => line.split(""));

const width = mirrors[0].length;
const height = mirrors.length;
type Direction = "north" | "east" | "south" | "west";
type Coord = {
  x: number;
  y: number;
};

const lightField = mirrors.map((row) => row.map(() => [] as Direction[]));

/**
 * steps `pos` 1 in the direction `coord`
 */
function step(pos: Coord, direction: Direction): Coord {
  switch (direction) {
    case "north":
      return {
        x: pos.x,
        y: pos.y - 1,
      };
    case "east":
      return {
        x: pos.x + 1,
        y: pos.y,
      };
    case "south":
      return {
        x: pos.x,
        y: pos.y + 1,
      };
    case "west":
      return {
        x: pos.x - 1,
        y: pos.y,
      };
    default:
      throw new Error(`Failed to move in direction ${direction}`);
  }
}

function evalLightField(row: number, col: number, direction: Direction) {
  if (row < 0 || col < 0 || row >= height || col >= width) return;
  if (lightField[row][col].includes(direction)) return;
  lightField[row][col].push(direction);
  switch (direction) {
    case "north":
      switch (mirrors[row][col]) {
        case "|":
        case ".":
          evalLightField(row - 1, col, "north");
          return;
        case "-":
          evalLightField(row, col - 1, "west");
          evalLightField(row, col + 1, "east");
          return;
        case "\\":
          evalLightField(row, col - 1, "west");
          return;
        case "/":
          evalLightField(row, col + 1, "east");
          return;
      }
    case "east":
      switch (mirrors[row][col]) {
        case "-":
        case ".":
          evalLightField(row, col + 1, "east");
          return;
        case "\\":
          evalLightField(row + 1, col, "south");
          return;
        case "/":
          evalLightField(row - 1, col, "north");
          return;
        case "|":
          evalLightField(row + 1, col, "south");
          evalLightField(row - 1, col, "north");
          return;
      }
    case "south":
      switch (mirrors[row][col]) {
        case "|":
        case ".":
          evalLightField(row + 1, col, "south");
          return;
        case "\\":
          evalLightField(row, col + 1, "east");
          return;
        case "/":
          evalLightField(row, col - 1, "west");
          return;
        case "-":
          evalLightField(row, col + 1, "east");
          evalLightField(row, col - 1, "west");
          return;
      }
    case "west":
      switch (mirrors[row][col]) {
        case "-":
        case ".":
          evalLightField(row, col - 1, "west");
          return;
        case "\\":
          evalLightField(row - 1, col, "north");
          return;
        case "/":
          evalLightField(row + 1, col, "south");
          return;
        case "|":
          evalLightField(row - 1, col, "north");
          evalLightField(row + 1, col, "south");
          return;
      }
  }
}

function testEnergization(
  row: number,
  col: number,
  direction: Direction
): number {
  lightField.forEach((row) => row.forEach((cell) => cell.splice(0)));
  evalLightField(row, col, direction);
  return lightField.flat().filter((x) => x.length >= 1).length;
}

const configVals = [] as number[];

for(let i = 0; i < width; i++){
  configVals.push(testEnergization(0, i, "south"));
  configVals.push(testEnergization(height - 1, i, "north"));
}

for(let i = 0; i < height; i++){
  configVals.push(testEnergization(i, 0, "east"));
  configVals.push(testEnergization(i, width - 1, "west"));
}

console.log(Math.max(...configVals))