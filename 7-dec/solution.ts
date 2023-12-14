import { count } from "node:console";
import * as fs from "node:fs/promises";
const fileData = (await fs.readFile("./input")).toString();
const dataList = fileData
  .trim()
  .split("\n")
  .map(line => line.split(" "))
  .map(([hand, bid]) => ({hand, bid: parseInt(bid)}))

const rankMap = {
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  "T": 10,
  "J": 11,
  "Q": 12,
  "K": 13,
  "A": 14,
}
/**
 * Compares 2 individual card strings
 */
function compareChars(lhs: string, rhs: string): number{
  return Math.sign(rankMap[lhs] - rankMap[rhs])
}

/**
 * Compares 2 hands by the backup rule
 */
function compareAlpha(lhs: string, rhs: string): number{
  for(let cardIndex = 0; cardIndex < 5; cardIndex++){
    const compareResult = compareChars(lhs.charAt(cardIndex), rhs.charAt(cardIndex));
    if(compareResult != 0) return compareResult;
  }
  return 0;
}

/**
 * Gets a list of unlabeled counts for numbers\
 * ex. "44556" -> [1, 2, 2]
 */
function getUnlabeledCount(hand: string): number[]{
  const counter: Record<string, number> = {}
  for(let cardIndex = 0; cardIndex < 5; cardIndex++){
    const card = hand.charAt(cardIndex);
    counter[card] ??= 0;
    counter[card]++;
  }
  return Object.values(counter);
}

function isFiveOfAKind(hand: string): boolean {
  return getUnlabeledCount(hand).includes(5);
}
function isFourOfAKind(hand: string): boolean {
  return getUnlabeledCount(hand).includes(4);
}
function isFullHouse(hand: string): boolean {
  return getUnlabeledCount(hand).includes(2) &&
    getUnlabeledCount(hand).includes(3);
}
function isThreeOfAKind(hand: string): boolean {
  return getUnlabeledCount(hand).includes(3);
}
function isTwoPair(hand: string): boolean {
  return getUnlabeledCount(hand).filter(x => x == 2).length == 2;
}
function isOnePair(hand: string): boolean {
  return getUnlabeledCount(hand).includes(2);
}
function isHighCard(hand: string): boolean {
  return getUnlabeledCount(hand).every(x => x == 1);
}

/**
 * Compares 2 hands
 */
function compareHands(lhs: string, rhs: string): number{
  if(isFiveOfAKind(lhs) && isFiveOfAKind(rhs)) return compareAlpha(lhs, rhs);
  if(isFiveOfAKind(lhs) && !isFiveOfAKind(rhs)) return 1;
  if(!isFiveOfAKind(lhs) && isFiveOfAKind(rhs)) return -1;

  if(isFourOfAKind(lhs) && isFourOfAKind(rhs)) return compareAlpha(lhs, rhs);
  if(isFourOfAKind(lhs) && !isFourOfAKind(rhs)) return 1;
  if(!isFourOfAKind(lhs) && isFourOfAKind(rhs)) return -1;

  if(isFullHouse(lhs) && isFullHouse(rhs)) return compareAlpha(lhs, rhs);
  if(isFullHouse(lhs) && !isFullHouse(rhs)) return 1;
  if(!isFullHouse(lhs) && isFullHouse(rhs)) return -1;

  if(isThreeOfAKind(lhs) && isThreeOfAKind(rhs)) return compareAlpha(lhs, rhs);
  if(isThreeOfAKind(lhs) && !isThreeOfAKind(rhs)) return 1;
  if(!isThreeOfAKind(lhs) && isThreeOfAKind(rhs)) return -1;

  if(isTwoPair(lhs) && isTwoPair(rhs)) return compareAlpha(lhs, rhs);
  if(isTwoPair(lhs) && !isTwoPair(rhs)) return 1;
  if(!isTwoPair(lhs) && isTwoPair(rhs)) return -1;

  if(isOnePair(lhs) && isOnePair(rhs)) return compareAlpha(lhs, rhs);
  if(isOnePair(lhs) && !isOnePair(rhs)) return 1;
  if(!isOnePair(lhs) && isOnePair(rhs)) return -1;

  if(isHighCard(lhs) && isHighCard(rhs)) return compareAlpha(lhs, rhs);
  if(isHighCard(lhs) && !isHighCard(rhs)) return 1;
  if(!isHighCard(lhs) && isHighCard(rhs)) return -1;

  return compareAlpha(lhs, rhs)
}

dataList.sort((a, b) => compareHands(a.hand, b.hand))
let score = 0;
dataList.forEach(({bid}, rank) => {
  score += bid * (rank + 1)
})
console.log(dataList)
console.log(score)