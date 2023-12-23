import * as fs from "node:fs/promises";
const fileData = (await fs.readFile("./input")).toString();
const tokens = fileData
  .trim()
  .split("\n")
  .map((line) => line.split(" ").map((x) => parseInt(x)));

function contNeg(list: number[]){
  if(list.every(x => x === 0)){
    return 0;
  }
  const diffs = [] as number[];
  for(let i = 0; i < list.length - 1; i++){
    diffs.push(list[i + 1] - list[i])
  }
  const newDiff = contNeg(diffs);
  return list[0] - newDiff;
}

const continuations = tokens.map(contNeg)
console.log(continuations.reduce((a, b) => a + b))