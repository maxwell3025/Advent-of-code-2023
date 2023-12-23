import { Dir } from "node:fs";
import * as fs from "node:fs/promises";
const fileData = (await fs.readFile("./input")).toString();
const tokens = fileData
  .trim()
  .split("\n")
  .map((line) => line.split(""));

type Direction = "north" | "east" | "south" | "west";
type Coord = {
  x: number;
  y: number;
};

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
      throw new Error(`Failed to move in direction ${direction}`)
  }
}

/**
 * returns the new direction of an animal if it is in the pipe at coord `pos` and is moving in direction `direction`
 */
function redirect(pos: Coord, direction: Direction): Direction | undefined {
  const pipeType = tokens[pos.y][pos.x];
  switch (direction) {
    case "north":
      switch (pipeType) {
        case "|":
          return "north";
        case "7":
          return "west";
        case "F":
          return "east";
        default:
          return undefined;
      }
    case "east":
      switch (pipeType) {
        case "-":
          return "east";
        case "J":
          return "north";
        case "7":
          return "south";
        default:
          return undefined;
      }
    case "south":
      switch (pipeType) {
        case "|":
          return "south";
        case "L":
          return "east";
        case "J":
          return "west";
        default:
          return undefined;
      }
    case "west":
      switch (pipeType) {
        case "-":
          return "west";
        case "L":
          return "north";
        case "F":
          return "south";
        default:
          return undefined;
      }
  }
}

const trail = [] as Coord[];
const startY = tokens.findIndex((row) => row.includes("S"));
const startX = tokens[startY].indexOf("S");

for (const startingDirection of ["north", "south", "east", "west"] as Direction[]) {
  let position = { x: startX, y: startY };
  let direction: Direction | undefined = startingDirection;
  while(direction !== undefined){
    trail.push(position)
    position = step(position, direction);
    direction = redirect(position, direction)
    if(position.x === startX && position.y === startY) break;
  }
  if(position.x === startX && position.y === startY) break;
  trail.splice(0)
}

trail.push(trail[0])

let area = 0;
for(let i = 0; i < trail.length - 1; i++){
  const {x: x1, y: y1} = trail[i];
  const {x: x2, y: y2} = trail[i + 1];
  area -= 0.5 * (x1 * y2 - x2 * y1)
}

area -= (trail.length - 1) * 0.5;
area += 1;

console.log(area)
