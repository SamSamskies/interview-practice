const testCases = [
  {
    name: 'non-paren tokens ignored',
    given: {
      memo: {
        imbalanceDetected: false,
        parenStack: ['('],
      },
      value: 'f'
    },
    expected: {
      imbalanceDetected: false,
      parenStack: ['(']
    }
  },
  {
    name: 'close paren match',
    given: {
      memo: {
        imbalanceDetected: false,
        parenStack: ['('],
      },
      value: ')'
    },
    expected: {
      imbalanceDetected: false,
      parenStack: []
    }
  },
  {
    name: 'open paren',
    given: {
      memo: {
        imbalanceDetected: false,
        parenStack: ['('],
      },
      value: '('
    },
    expected: {
      imbalanceDetected: false,
      parenStack: ['(', '(']
    }
  },
  {
    name: 'close paren'
    given: {
      memo: {
        imbalanceDetected: false,
        parenStack: ['('],
      },
      value: ')'
    },
    expected: {
      imbalanceDetected: false,
      parenStack: []
    }
  },
  {
    name: 'imbalance detected'
    given: {
      memo: {
        imbalanceDetected: false,
        parenStack: [],
      },
      value: ')'
    },
    expected: {
      imbalanceDetected: true,
      parenStack: []
    }
  },
];

const closingParenFor = {
  '(': ')'
}

export function isBalanced(tokens) {
  const { imbalanceDetected, parenStack } = tokens.reduce(reducer, {
    imbalanceDetected: false,
    parenStack: []
  });
  return !imbalanceDetected && parenStack.length === 0;
}

export function reducer({ imbalanceDetected, parenStack }, token) {
  if (imbalanceDetected || !isParenToken(token)) return { imbalanceDetected, parenStack };
  if (isOpenParenToken(token) return {
    imbalanceDetected,
    parenStack: parenStack.concat([token]);
  }
  if (closingParenFor[peek(parenStack)] !== token)) return {
    imbalanceDetected: true,
    parenStack: []
  }

  // must be matching paren on top of stack
  return {
    imbalanceDetected,
    parenStack: parenStack.slice(0, -1)
  }
}