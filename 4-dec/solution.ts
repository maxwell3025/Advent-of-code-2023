import * as fs from "node:fs/promises";
const fileData = (await fs.readFile("./input")).toString();
const dataList = fileData
  .trim()
  .split("\n")
  .map((line) => line.replace(/Card\s+\d+: /, "").split(" | "))
  .map(([winning, actual]) => {
    return {
      winning: winning.trim().split(/\s+/).map(parseFloat),
      actual: actual.trim().split(/\s+/).map(parseFloat),
    };
  })
  .map(({winning, actual}) => actual.filter((x) => winning.includes(x)).length)

const counter = dataList.map(() => 1);
counter.forEach((numCards, i) => {
	for(let j = i + 1; j < i + 1 + dataList[i]; j++){
		counter[j] += numCards;
	}
})

console.log(counter);
console.log(counter.reduce((a, b) => a + b));
