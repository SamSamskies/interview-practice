// Examples:
// "1 + 1" = 2
// " 2-1 + 2 " = 3
// '12 + (2 - 1)' => 13
// "(1+(4+5+2)-3)+(6+8)" = 23
// The expression string may contain open ( and closing parentheses ),
// the plus + or minus sign -, non-negative integers and empty spaces .

/**
 * @param  {string} str
 * @return {integer}
 *
 * '12 + (2 - 1)' => 13
 */
export function calc(str) {
  return /* operator used to coerce int */ +tokenize(str).reduce(reduceTokenToStack, [])[0];
}

/**
 * @param  {string} str
 * @return {array}
 *
 * '12 + (2 - 1)' => [12, +, (, 2, -, 1, )]
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
 * [12, +], ( => [12, + (]
 * [12, +, (], 2 => [12, +, (, 2]
 * [12, +, (, 2], ' ' => [12, +, (, 2]
 * [12, +, (, 2], - => [12, +, (, 2, -]
 * [12, +, (, 2, -], ' ' => [12, +, (, 2, -]
 * [12, +, (, 2, -], 1 => [12, +, (, 2, -, 1]
 * [12, +, (, 2, -, 1], ) => [12, +, (, 2, -, 1, )]
 */
export function reduceCharToTokens(tokens, char) {
  if (!isValidToken(char)) return tokens; // all non-tokens are skipped

  const previousTokenIsNumeric = isNumericToken(tokens[tokens.length - 1]);
  if (previousTokenIsNumeric && isNumericToken(char)) return tokens.concat([tokens.pop() + char]);

  return tokens.concat([char]);
}

/**
 * @param  {array} stack
 * @param  {string} token
 * @return {array}
 *
 * [], 1 => [1] (if first, push)
 * [12], + => [12, +] (if token is operator, push)
 * [12, +], ( => [12, +, (] (if token is left paren, push)
 * [12, +, (], 2 => [12, +, (, 2] (if token is digit, push)
 * [12, + , (, 2], - => [12, +, (, 2, -]
 * [12, +, (, 2, -], 1 => [12, +, (, 1]
 * [12, +, (, 1], ) => [13]
 * [(, 9], ) => [9]
 */
export function reduceTokenToStack(stack, token) {
  const tokenOnTopOfStack = stack[stack.length - 1];

  // If token is right paren, pop previous four (two numbers, operator, and left paren),
  // discard left paren, then perform arithmetic and push result onto stack
  if (token === ')') {
    const secondNum = stack.pop();

    // discard left paren
    stack.pop();

    return stack.length === 0 ? [secondNum] : reduceNumericTokenToStack(stack, secondNum);
  }

  // If token currently on top of the stack is an operator and token is numeric,
  // pop last two tokens, perform arthmetic and push result onto stack
  if (isOperatorToken(tokenOnTopOfStack) && isNumericToken(token))
    return reduceNumericTokenToStack(stack, token);

  return stack.concat([token]);
}

export function reduceNumericTokenToStack(stack, token) {
  const operator = stack.pop();
  const firstNum = stack.pop();
  const strigifiedAnswer = safeEval(firstNum, token, operator) + '';
  return stack.concat([strigifiedAnswer]);
}

export function isNumericToken(token) {
  return /^\d+$/.test(token);
}

export function isOperatorToken(token) {
  return /\+|-/.test(token);
}

export function isValidToken(token) {
  const validTokenRegEx = /\d|\+|-|\(|\)/;
  return validTokenRegEx.test(token);
}


/**
 * @param  {string} firstNum
 * @param  {string} secondNum
 * @param  {string} operator
 * @return {integer}
 *
 * '1', '2', '+' => 3
 * '9', '3', '-' => 6
 */
export function safeEval(firstNum, secondNum, operator) {
  switch(operator) {
    case '+': return +firstNum + +secondNum;
    case '-': return +firstNum - +secondNum;
  }
}