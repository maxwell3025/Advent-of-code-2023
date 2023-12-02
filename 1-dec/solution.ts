import * as fs from "node:fs/promises";
const fileData = (await fs.readFile("./input")).toString();
const dataList = fileData.trim().split('\n');
let sum = 0;
dataList.forEach(str => {
	let first: string | undefined = undefined;
	let last: string | undefined = undefined;
	console.log(str);
	for(let i = 0; i < str.length; i++){
		let sub = str.substring(i)
		sub = sub.replace(/^one/, "1");
		sub = sub.replace(/^two/, "2");
		sub = sub.replace(/^three/, "3");
		sub = sub.replace(/^four/, "4");
		sub = sub.replace(/^five/, "5");
		sub = sub.replace(/^six/, "6");
		sub = sub.replace(/^seven/, "7");
		sub = sub.replace(/^eight/, "8");
		sub = sub.replace(/^nine/, "9");
		const char = sub.charAt(0);
		console.log(sub);
		if(char <= '9' && char >= '0'){
			first ??= char;
			last = char;
		}
	}
	console.log(1 * `${first}${last}`);
	sum += 1 * `${first}${last}`;
});
console.log(sum);
