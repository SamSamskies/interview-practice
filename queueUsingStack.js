'use strict';

// Implement the following operations of a queue using stacks.

// push(x) -- Push element x to the back of queue.
// pop() -- Removes the element from in front of queue.
// peek() -- Get the front element.
// isEmpty() -- Return whether the queue is empty.
// Notes:
// You must use only standard operations of a stack -- which means only push to top, peek/pop from top, size, and is empty operations are valid.
// Depending on your language, stack may not be supported natively. You may simulate a stack by using a list or deque (double-ended queue), as long as you use only standard operations of a stack.
// You may assume that all operations are valid (for example, no pop or peek operations will be called on an empty


// ** Solution: Keep all operations the same as stack, except enq, then peek and deq work like a stack

const Stack = require('stackjs');

class Queue {

  constructor() {
    this.stack = new Stack();
  }

  /**
   * @param {number} x
   * @returns {void}
   *
   * 1. Pop off all elements in the stack
   * 2. Push new item into temp stack
   * 3. Put all elements back on the stack
   */
  enq(item) {
    const tempStack = new Stack();

    while(!this.stack.isEmpty()) {
      tempStack.push(this.stack.pop());
    }

    this.stack.push(item);

    while(!tempStack.isEmpty()) {
      this.stack.push(tempStack.pop());
    }
  }

  deq() {
    this.stack.pop();
  }

  peek() {
    return this.stack.peek();
  }

  isEmpty() {
    return this.stack.isEmpty();
  }
};


const queue = new Queue();

console.log('expect isEmpty true: ', queue.isEmpty());
queue.enq(1);
console.log('expect peek 1: ', queue.peek());
queue.enq(2);
console.log('expect peek 1: ', queue.peek());
console.log('expect isEmpty false: ', queue.isEmpty());
queue.deq();
console.log('expect peek 2: ', queue.peek());
console.log('expect isEmpty false: ', queue.isEmpty());
queue.deq();
console.log('expect isEmpty true: ', queue.isEmpty());


