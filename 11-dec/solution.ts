import { Dir } from "node:fs";
import * as fs from "node:fs/promises";
const fileData = (await fs.readFile("./input")).toString();
const tokens = fileData
  .trim()
  .split("\n")
  .map((line) => line.split(""));

type Coord = {
  x: number;
  y: number;
};

const galaxies = [] as Coord[];
tokens.forEach((row, y) =>
  row.forEach((galaxy, x) => {
    if (galaxy === "#") galaxies.push({ x, y });
  })
);

galaxies.sort((a, b) => a.x - b.x);
let offset = 0;
let xPrev = galaxies[0].x;
galaxies.forEach((galaxy) => {
  offset += Math.max(0, galaxy.x - xPrev - 1);
  xPrev = galaxy.x;
  galaxy.x += offset * 999_999;
});

galaxies.sort((a, b) => a.y - b.y);
offset = 0;
let yPrev = galaxies[0].y;
galaxies.forEach((galaxy) => {
  offset += Math.max(0, galaxy.y - yPrev - 1);
  yPrev = galaxy.y;
  galaxy.y += offset * 999_999;
});

let sum = 0;
for (let i = 0; i < galaxies.length; i++) {
  for (let j = 0; j < i; j++) {
    sum +=
      Math.abs(galaxies[i].x - galaxies[j].x) +
      Math.abs(galaxies[i].y - galaxies[j].y);
  }
}
console.log(sum);
