import * as fs from "node:fs/promises";
const fileData = (await fs.readFile("./input")).toString();
const dataList = fileData.trim().split('\n');
let sum = 0;
dataList.forEach(line => {
	line = line.replace(/^Game \d+: /, "");
	const events = line
		.split("; ")
		.map(event => 
			event.split(', ')
				.map(token =>
					token.split(' ')
				)
				.map(([a, b]) => [b, 1*a])
		)
		.map(Object.fromEntries);
	const minSet = {
		red: 0,
		green: 0,
		blue: 0
	}
	events.forEach(({red, green, blue}) => {
		minSet.red = Math.max(minSet.red, red??0);
		minSet.green = Math.max(minSet.green, green??0);
		minSet.blue = Math.max(minSet.blue, blue??0);
	});
	console.log(line);
	console.log(events);
	console.log(minSet);
	console.log(minSet.red * minSet.green * minSet.blue);
	console.log(sum += minSet.red * minSet.green * minSet.blue);
});
console.log(sum)

