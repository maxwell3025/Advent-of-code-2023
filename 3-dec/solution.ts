import * as fs from "node:fs/promises";
const fileData = (await fs.readFile("./input")).toString();
const dataList = fileData.trim().split('\n');
const width = dataList[0].length;
const height = dataList.length;
function getCharAt(x: number, y: number){
	return dataList[y].charAt(x)
}
function getCharAtChecked(x: number, y: number){
	if(x < 0 || x >= width || y < 0 || y >= height){
		return "."
	}
	return dataList[y].charAt(x)
}
function isNumber(x: number, y: number){
	return /[0-9]/.test(getCharAt(x, y))
	&& (x === 0 || !/[0-9]/.test(getCharAt(x - 1, y)))
}
function numberLength(x: number, y: number){
	return dataList[y].slice(x).concat(".").search(/[^0-9]/);
}
function readTag(x: number, y: number){
	return parseInt(dataList[y].slice(x, x + numberLength(x, y)))
}
function isTag(x: number, y: number){
	if(!isNumber(x, y)) return false;
	console.log("found number", readTag(x, y))
	for(let xx = x-1; xx < x + 1 + numberLength(x, y); xx++){
		for(let yy = y-1; yy <= y+1; yy++){
			if(!/[0-9.]/.test(getCharAtChecked(xx, yy))){
				return true;
			}
			console.log(getCharAtChecked(xx, yy))
		}
	}
	console.log("bad")
	return false;
}

let sum = 0;
for(let x = 0; x < width; x++){
	for(let y = 0; y < height; y++){
		if(isTag(x, y)) sum += readTag(x, y)
	}
}

console.log(sum)

