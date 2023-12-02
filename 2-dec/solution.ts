import * as fs from "node:fs/promises";
const fileData = (await fs.readFile("./input")).toString();
const dataList = fileData.trim().split('\n');
const goal: Record<string, number> = {
	"red": 12,
	"green": 13,
	"blue": 14,
}
let sum = 0;
dataList.forEach((line, id) => {
	console.log(id + 1);
	line = line.replace(/^Game \d+: /, "");
	const events = line
		.split("; ")
		.map(event => 
			event.split(', ')
				.map(token =>
					token.split(' ')
				)
				.map(([a, b]) => [b, a])
		)
		.map(Object.fromEntries);
	if(events.every(rec => 
		((rec.red??0) <= goal.red) &&
		((rec.green??0) <= goal.green) &&
		((rec.blue??0) <= goal.blue)
	)){
		sum += id + 1;
	}
	console.log(events);
});
console.log(sum)

