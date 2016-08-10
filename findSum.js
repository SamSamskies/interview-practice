'use strict';

const testCases = {
  given: {
    array: [9, 3, -2, 5, 23, 1, 0],
    targetSum: 9
  },
  expected: [1, 3, 5]
};

function findSum(array, targetSum) {
  if (array.length < 3) return [];

  array.sort((a, b) => a - b);

  for (let i=0; i < array.length - 2; i++) {
    const num1 = array[i];
    const num2 = array[i+1];
    const num3 = array[i+2];
    const sum = num1 + num2 + num3;

    if (sum > targetSum) break;
    if (sum === targetSum) return [num1, num2, num3];
  }

  return [];
}

let { array, targetSum } = testCases.given;

console.log('actual: ', findSum(array, targetSum));
console.log('expected: ',testCases.expected);