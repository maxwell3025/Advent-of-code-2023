import * as fs from "node:fs/promises";
const fileData = (await fs.readFile("./input")).toString();
const cases = fileData
  .trim()
  .split("\n\n")
  .map((caseText) => caseText.trim().split("\n").map((line) => line.split("")));

let total = 0;
cases.forEach((page) => {
  // horizontal mirrors
  for (let i = 1; i < page.length; i++) {
    const topHalf = page.slice(0, i).reverse();
    const bottomHalf = page.slice(i);
    let discrepancy = 0;
    while (topHalf.length !== 0 && bottomHalf.length !== 0) {
      const a = topHalf.shift()!;
      const b = bottomHalf.shift()!;
      for (let column = 0; column < a.length; column++) {
        if (a[column] !== b[column]) discrepancy++;
      }
    }
    if (discrepancy == 1) {
      total += 100 * i;
    }
  }
  //vertical mirrors
  for (let i = 1; i < page[0].length; i++) {
    let discrepancy = 0;
    for (let row = 0; row < page.length; row++) {
      const rowData = page[row];
      for (let diff = 0; ; diff++) {
        const left = rowData[i - diff - 1];
        const right = rowData[i + diff];
        if (left === undefined || right === undefined) break;
        if (left !== right) {
          discrepancy++;
          break;
        }
      }
    }
    if(discrepancy == 1){
      total += i;
    }
  }
});

console.log(total)