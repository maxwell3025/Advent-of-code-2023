import * as fs from "node:fs/promises";
const fileData = (await fs.readFile("./input")).toString();
const dataList = fileData
  .trim()
  .split("\n")

const time = parseInt(dataList[0].split(/\s+/).slice(1).join(""));
const distance = parseInt(dataList[1].split(/\s+/).slice(1).join(""));

function getNumTimes(time: number, distance: number){
  const idealTime = time / 2;
  const idealDistance = time * time * 0.25;
  const timeSpread = Math.sqrt(idealDistance - distance) ?? 0;
  let minTime = idealTime - timeSpread;
  let maxTime = idealTime + timeSpread;
  if(minTime > maxTime){
    return 0;
  }
  if(Number.isInteger(minTime)){
    minTime++;
  }
  if(Number.isInteger(maxTime)){
    maxTime--;
  }
  minTime = Math.ceil(minTime);
  maxTime = Math.floor(maxTime);
  return maxTime - minTime + 1;
}

console.log(getNumTimes(time, distance));