import * as fs from "node:fs/promises";
const fileData = (await fs.readFile("./input")).toString();
const data = fileData
  .trim()
  .split("\n")
  .map((line) => line.split(""));

let total = 0;
for (let col = 0; col < data[0].length; col++) {
  let nextRoll = 0;
  while (data[nextRoll][col] == "#") {
    nextRoll++;
  }
  for (let row = 0; row < data.length; row++) {
    if (data[row][col] == "#") {
      nextRoll = row + 1;
    }
    if (data[row][col] == "O") {
      data[row][col] = ".";
      data[nextRoll][col] = "O";
      total += data.length - nextRoll;
      nextRoll++;
    }
  }
}
console.log(data.map((row) => row.join("")).join("\n"));
console.log(total);
