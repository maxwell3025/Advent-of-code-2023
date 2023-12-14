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
  "J": 1,
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
 * Gets a list of unlabeled counts for nun-joker numbers\
 * ex. "44556" -> [1, 2, 2]
 */
function getUnlabeledCount(hand: string): number[]{
  const counter: Record<string, number> = {}
  for(let cardIndex = 0; cardIndex < 5; cardIndex++){
    const card = hand.charAt(cardIndex);
    counter[card] ??= 0;
    counter[card]++;
  }
  delete counter["J"];
  return Object.values(counter);
}

function getJokerCount(hand: string): number{
  let count = 0;
  for(let cardIndex = 0; cardIndex < 5; cardIndex++){
    if(hand.charAt(cardIndex) === "J") count++;
  }
  return count;
}

function isFiveOfAKind(hand: string): boolean {
  return getUnlabeledCount(hand).length <= 1;
}
function isFourOfAKind(hand: string): boolean {
  return Math.max(...getUnlabeledCount(hand), 0) + getJokerCount(hand) >= 4;
}
function isFullHouse(hand: string): boolean {
  return getUnlabeledCount(hand).length <= 2 && Math.max(...getUnlabeledCount(hand)) <= 3;
}
function isThreeOfAKind(hand: string): boolean {
  return Math.max(...getUnlabeledCount(hand), 0) + getJokerCount(hand) >= 3;
}
function isTwoPair(hand: string): boolean {
  switch(getJokerCount(hand)){
    case 0: {
      return getUnlabeledCount(hand).filter(x => x == 2).length === 2;
    }
    case 1: {
      return getUnlabeledCount(hand).filter(x => x == 2).length >= 1;
    }
    case 2:
    case 3:
    case 4:
    case 5: {
      return true;
    }
  }
  throw new Error("Found either more than 5 or less than 0 jokers, which is not possible. Hand was " + hand)
}
function isOnePair(hand: string): boolean {
  return getJokerCount(hand) !== 0 || getUnlabeledCount(hand).find(x => x >= 2) !== undefined;
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