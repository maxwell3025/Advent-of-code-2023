import * as fs from "node:fs/promises";
const fileData = (await fs.readFile("./input")).toString();
const data = fileData
  .trim()
  .split(",")
  .map(hash)
  .reduce((a, b) => a + b);

function hash(str: string): number{
  let val = 0;
  for(let i = 0; i < str.length; i++){
    val += str.charCodeAt(i);
    val *= 17;
    val %= 256;
  }
  return val;
}
console.log(data)