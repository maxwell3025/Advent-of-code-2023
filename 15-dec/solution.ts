import * as fs from "node:fs/promises";
const fileData = (await fs.readFile("./input")).toString();
const instructions = fileData.trim().split(",");

function hash(str: string): number {
  let val = 0;
  for (let i = 0; i < str.length; i++) {
    val += str.charCodeAt(i);
    val *= 17;
    val %= 256;
  }
  return val;
}

type Lens = {
  label: string;
  focal: number;
};

const boxes = new Array(256).fill([]).map(() => [] as Lens[]);

instructions.forEach((instruction) => {
  if (instruction.includes("=")) {
    const [label, focalString] = instruction.split("=");
    const focal = parseInt(focalString);
    const hashValue = hash(label);
    const box = boxes[hashValue];
    const targetLens = box.find((lens) => (lens.label === label));
    if (targetLens) {
      targetLens.focal = focal;
    } else {
      box.push({
        label,
        focal,
      });
    }
  } else {
    const [label] = instruction.split("-");
    const hashValue = hash(label);
    const box = boxes[hashValue];
    const targetIndex = box.findIndex((lens) => (lens.label == label));
    if (targetIndex !== -1) {
      box.splice(targetIndex, 1);
    }
  }
});

const total = boxes
  .map((box, boxNumber) =>
    box
      .map((lens, slot) => {
        return lens.focal * (slot + 1) * (boxNumber + 1);
      })
      .reduce((a, b) => a + b, 0)
  )
  .reduce((a, b) => a + b, 0);

console.log(total)
console.log(
  boxes
    .map((box) => box.map(({ label, focal }) => `${label} ${focal}`).join(","))
    .join("\n")
);
