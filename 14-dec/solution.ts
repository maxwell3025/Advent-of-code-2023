import * as fs from "node:fs/promises";
const fileData = (await fs.readFile("./input")).toString();
const data = fileData
  .trim()
  .split("\n")
  .map((line) => line.split(""));

function copyField(field: string[][]): string[][] {
  return field.map((row) => row.map((x) => x));
}

function stringifyField(field: string[][]): string {
  return field.map((row) => row.join("")).join("\n");
}

function rotateCW(field: string[][]): string[][] {
  const width = field[0].length;
  const height = field.length;
  const output = new Array(width)
    .fill(new Array(height).fill("X"))
    .map((row) => row.map((x) => x));
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      output[col][width - row - 1] = field[row][col]
    }
  }
  return output;
}

function rotateCCW(field: string[][]): string[][] {
  return rotateCW(rotateCW(rotateCW(field)));
}

function rollNorth(field: string[][]): string[][] {
  const out = copyField(field);
  for (let col = 0; col < out[0].length; col++) {
    let targetRow = 0;
    while (out[targetRow][col] == "#") {
      targetRow++;
    }
    for (let row = 0; row < out.length; row++) {
      if (out[row][col] == "#") {
        targetRow = row + 1;
      }
      if (out[row][col] == "O") {
        out[row][col] = ".";
        out[targetRow][col] = "O";
        targetRow++;
      }
    }
  }
  return out;
}

function rollEast(field: string[][]): string[][] {
  return rotateCW(rollNorth(rotateCCW(field)))
}

function rollWest(field: string[][]): string[][] {
  return rotateCCW(rollNorth(rotateCW(field)))
}

function rollSouth(field: string[][]): string[][] {
  return rotateCW(rotateCW(rollNorth(rotateCW(rotateCW(field)))))
}

function cycle(field: string[][]): string[][] {
  const a = rollNorth(field);
  const b = rollWest(a);
  const c = rollSouth(b);
  const d = rollEast(c);
  return d;
}

const history = [] as string[];
// The nth element in history represents the field after n ticks
let currentField = copyField(data)
while(history.lastIndexOf(stringifyField(currentField)) === -1){
  history.push(stringifyField(currentField))
  currentField = cycle(currentField);
}
//Currently, history has the maximum number of milestones that don't repeat
const lastAppearance = history.lastIndexOf(stringifyField(currentField))
const cycleLength = history.length - lastAppearance
const targetIndex = (1000_000_000 - history.length) % cycleLength + history.length - cycleLength;
const lastState = history[targetIndex]

let total = 0;
lastState.split("\n").map(row => row.split("")).forEach((row, rowNumber) => {
  const weight = lastState.split("\n").length - rowNumber;
  total += row.filter(x => x === "O").length * weight;
})

console.log(cycleLength)
console.log(total)

