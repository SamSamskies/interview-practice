'use strict';

// input num of growth seasons
// always plant end of winter
// 1st season always spring
// doubles in height in the spring
// grows 1m in the summer
// doesn't grow in the in the other seasons

// Examples:
// f(0) => 1
// f(1) => 2
// f(2) => 3
// f(3) => 6
// f(4) => 7
// f(5) => 14
// f(6) => 15

/**
 * numOfSeasons {integer}
 * returns heightOfTree {integer}
 */
function calcHeightOfTree(numOfSeasons) {
  if (numOfSeasons === 0) return 1;

  const isSpring = numOfSeasons % 2 === 1;
  const previousHeight = calcHeightOfTree(numOfSeasons - 1);

  return isSpring ? previousHeight * 2 : previousHeight + 1;
}

// Interpreter using tail call recursion could change this to constant space if recusive call is last.

console.log('expected 2 actual ', calcHeightOfTree(1))
console.log('expected 3 actual ', calcHeightOfTree(2))
console.log('expected 1, actual ', calcHeightOfTree(0))
console.log('expected 7, actual ', calcHeightOfTree(4))
console.log('expected 14, actual ', calcHeightOfTree(5))

// f(0) => 1
// f(1) => f(0) * 2 => 2
// f(2) => f(1) + 1 => 3
// f(3) => f(2) * 2 => 6
// f(4) => 7
// f(5) => 14
// f(6) => 15
// f(n) => if n is 0 1, if n is odd f(n-1) * 2, if n is even f(n-1) + 1