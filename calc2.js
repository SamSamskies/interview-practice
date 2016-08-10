// Examples:
// "3+2*2" = 7
// " 3/2 " = 1
// " 3+5 / 2 " = 5
// '12 + 2 * 3' => 18
// The expression string contains only non-negative integers, +, -, *, / operators and empty spaces.
// The integer division should truncate toward zero.

/**
 * @param  {string} str
 * @return {integer}
 *
 * '12 + 2 * 3' => 18
 */
export function calc(str) {
  return +tokenize(str).reduce(reduceTokenToStack, [])[0];
}

/**
 * @param  {string} str
 * @return {array}
 *
 * '12 + 2 * 3' => [12, +, (, 2, *, 3, )]
 */
export function tokenize(str) {
  return str.split('').reduce(reduceCharToTokens, []);
}

/**
 * @param  {array} tokens
 * @param  {string} char
 * @return {array}
 *
 * [], 1 => [1]
 * [1], 2 => [12]
 * [12], ' ' => [12]
 * [12], + => [12, +]
 * [12, +], ' ' => [12, +]
 * [12, +], 2 => [12, +, 2]
 * [12, +, 2], ' ' => [12, +, 2]
 * [12, +, 2], * => [12, +, (, 2, *]
 * [12, +, (, 2, *], ' ' => [12, +, (, 2, *]
 * [12, +, (, 2, *], 3 => [12, +, (, 2, *, 3, )]
 */
export function reduceCharToTokens(tokens, char) {
  const isTokenValid = /\d|\+|-|\*|\//.test(char);

  if (!isTokenValid) return tokens;

  if (isHigherOrderOperatorToken(char)) {
    tokens.splice(tokens.length - 1, 0, '(');
    return tokens.concat([char]);
  }

  const previousToken = tokens[tokens.length - 1];
  if (isHigherOrderOperatorToken(previousToken)) {
    return tokens.concat([char, ')']);
  }

  if (isNumericToken(previousToken) && isNumericToken(char))
    return tokens.concat([tokens.pop() + char]);

  return tokens.concat([char]);
}

/**
 * @param  {array} stack
 * @param  {string} token
 * @return {array}
 *
 * [], 1 => [1] (if first, push)
 * [12], + => [12, +] (if token is operator, push)
 * [12, +], 2 => [12, +, 2] (if token is digit, push)
 * [12, +, 2], * => [12, +, 2, *]
 * [12, + , 2, *], 3 => [18]
 */
export function reduceTokenToStack(stack, token) {
  const tokenOnTopOfStack = stack[stack.length - 1];

  // Discard parens and return stack containing the answer if token is right paren
  // and there are only two tokens in the stack
  if (stack.length === 2 && token === ')') return [stack.pop()];

  // If token is right paren, pop previous four (two numbers, operator, and left paren),
  // discard left paren, then perform arithmetic and push result onto stack
  if (token === ')') {
    const secondNum = stack.pop();

    // discard left paren
    stack.pop();

    const operator = stack.pop();
    const firstNum = stack.pop();
    const strigifiedAnswer = safeEval(firstNum, secondNum, operator) + '';
    return stack.concat([strigifiedAnswer]);
  }

  // If token is currently on top of the stack is an operator and token is numeric,
  // pop last two tokens, perform arthmetic and push result onto stack
  if (isOperatorToken(tokenOnTopOfStack) && isNumericToken(token)) {
    const operator = stack.pop();
    const firstNum = stack.pop();
    const strigifiedAnswer = safeEval(firstNum, token, operator) + '';
    return stack.concat([strigifiedAnswer]);
  }

  if (!tokenOnTopOfStack || isNumericToken(token) || isOperatorToken(token) || token === '(')
    return stack.concat([token]);

}

export function isNumericToken(token) {
  return /^\d+$/.test(token);
}

export function isOperatorToken(token) {
  return /\+|-|\*|\//.test(token);
}

export function isHigherOrderOperatorToken(token) {
  return /\*|\//.test(token);
}


/**
 * @param  {string} firstNum
 * @param  {string} secondNum
 * @param  {string} operator
 * @return {integer}
 *
 * '1', '2', '+' => 3
 * '9', '3', '-' => 6
 * '2', '3', '*' => 6
 * '9', '4', '/' => 2
 *
 */
export function safeEval(firstNum, secondNum, operator) {
  switch(operator) {
    case '+': return +firstNum + +secondNum;
    case '-': return firstNum - secondNum;
    case '*': return firstNum * secondNum;
    case '/': return Math.floor(firstNum / secondNum);
  }
}