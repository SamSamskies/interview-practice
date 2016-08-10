/**
 * O(n) implementation of Fibonacci
 *
 * @param  {integer} n - The nth Fibonacci number
 * @return {integer}     The value of the nth Fibonacci number
 */
function fib(n) {

  if (n <= 1) return n;

  return new Array(n-1).fill(0).reduce(memo => {
    const sumOfPreviousTwoValues = memo[0] + memo[1];
    return [memo[1], sumOfPreviousTwoValues];
  }, [0, 1])[1];
}

console.log('fib(2)', fib(2));
console.log('fib(4)', fib(4));
console.log('fib(10)', fib(10));
console.log('fib(50)', fib(50));


