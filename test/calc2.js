'use strict';

import { expect } from 'chai';
import {
  calc,
  tokenize,
  reduceCharToTokens,
  reduceTokenToStack,
  isNumericToken,
  isOperatorToken,
  isHigherOrderOperatorToken,
  safeEval
} from '../calc2';

describe('calc', function() {
  describe('given a valid serialized equation', function() {
    it('returns an answer that is an integer', function() {
      expect(calc('1 + 1')).to.eql(2);
      expect(calc(' 2-1 + 2')).to.eql(3);
      expect(calc('12 + (2 - 1)')).to.eql(13);
      expect(calc('(1+(4+5+2)-3)+(6+8)')).to.eql(23);
      expect(calc('3+2*2')).to.eql(7);
      expect(calc(' 3/2')).to.eql(1);
      expect(calc(' 3+5 / 2')).to.eql(5);
      expect(calc('12 + 2 * 3')).to.eql(18);
    });
  });
});

describe('tokenize', function() {
  describe('given a valid serialized equation', function() {
    it('returns an array of valid tokens', function() {
      expect(tokenize('12 + 2 * 3')).to.eql(['12', '+', '(', '2', '*', '3', ')']);
    });
  });
});

describe('reduceCharToTokens', function() {
  it('returns an array', function() {
    expect(reduceCharToTokens([])).to.be.an('array');
  });

  describe('given character that is not a space', function() {
    it('returns an array including character', function() {
      expect(reduceCharToTokens([], '1')).to.eql(['1']);
      expect(reduceCharToTokens(['1'], '2')).to.eql(['12']);
      expect(reduceCharToTokens(['12'], '+')).to.eql(['12', '+']);
      expect(reduceCharToTokens(['12', '+'], '2')).to.eql(['12', '+', '2']);
      expect(reduceCharToTokens(['12', '+', '2'], '*')).to.eql(['12', '+', '(', '2', '*']);
      expect(reduceCharToTokens(['12', '+', '(', '2', '*'], '3')).to.eql(['12', '+', '(', '2', '*', '3', ')']);

    });
  });

  describe('given character is a space', function() {
    it('returns an array with same values as array given', function() {
      expect(reduceCharToTokens(['12'], ' ')).to.eql(['12']);
      expect(reduceCharToTokens(['12', '+'], ' ')).to.eql(['12', '+']);
      expect(reduceCharToTokens(['12', '+', '2'], ' ')).to.eql(['12', '+', '2']);
      expect(reduceCharToTokens(['12', '+', '2', '*'], ' ')).to.eql(['12', '+', '2', '*']);
    });
  })
});

describe('reduceTokenToStack', function() {
  it('returns an array', function() {
    expect(reduceTokenToStack([])).to.be.an('array');
  });

  describe('given empty array and digit token', function() {
    it('returns an array with given digit token', function() {
      expect(reduceTokenToStack([], '1')).to.eql(['1']);
    });
  });

  describe('given an array of tokens', function() {
    describe('with an operator token', function() {
      it('returns an array with the values of the existing array of tokens with the operator token added at the end', function() {
        expect(reduceTokenToStack(['12'], '+')).to.eql(['12', '+']);
        expect(reduceTokenToStack(['12', '+', '(', '2'], '-')).to.eql(['12', '+', '(', '2', '-']);
      });
    });

    describe('with a left paren token', function() {
      it('returns an array with the values of the existing array of tokens with the left paren token added at the end', function() {
        expect(reduceTokenToStack(['12', '+'], '(')).to.eql(['12', '+', '(']);
      });
    });

    describe('with a digit token', function() {
      it('returns an array with the values of the existing array of tokens with the digit token added at the end', function() {
        expect(reduceTokenToStack(['12', '+', '('], '2')).to.eql(['12', '+', '(', '2']);
      });
    });

    describe('with operator token on top and a digit token', function() {
      it('pops off previous two tokens, performs arithmetic on those tokens with the new token, then returns an array with the values of the existing array with the result added at the end', function() {
        expect(reduceTokenToStack(['12', '+', '(', '2', '-'], '1')).to.eql(['12', '+', '(', '1']);
      });
    });

    describe('with a right paren token', function() {
      it('pops off previous four tokens, performs arithmetic on those tokens with the new token, then returns an array with the values of the existing array with the result added at the end', function() {
        expect(reduceTokenToStack(['12', '+', '(', '1'], ')')).to.eql(['13']);
      });
    });
  });

  describe('isNumrericToken', function() {
    it('returns true if token is numeric', function() {
      expect(isNumericToken('2')).to.be.true;
      expect(isNumericToken('12')).to.be.true;
    });

    it('returns false if token is not numeric', function() {
      expect(isNumericToken('+')).to.be.false;
      expect(isNumericToken('-')).to.be.false;
      expect(isNumericToken('(')).to.be.false;
      expect(isNumericToken(')')).to.be.false;
      expect(isNumericToken(' ')).to.be.false;
    });
  });

  describe('isOperatorToken', function() {
    it('returns true if token is an operator', function() {
      expect(isOperatorToken('+')).to.be.true;
      expect(isOperatorToken('-')).to.be.true;
      expect(isOperatorToken('*')).to.be.true;
      expect(isOperatorToken('/')).to.be.true;
    });

    it('returns false if token is not an operator', function() {
      expect(isOperatorToken('1')).to.be.false;
      expect(isOperatorToken('(')).to.be.false;
      expect(isOperatorToken(')')).to.be.false;
      expect(isOperatorToken(' ')).to.be.false;
    });
  });

  describe('isHigherOrderOperatorToken', function() {
    it('returns true if token is a higher order operator', function() {
      expect(isHigherOrderOperatorToken('*')).to.be.true;
      expect(isHigherOrderOperatorToken('/')).to.be.true;
    });

    it('returns false if token is not a higher order operator', function() {
      expect(isHigherOrderOperatorToken('+')).to.be.false;
      expect(isHigherOrderOperatorToken('-')).to.be.false;
    });
  });

  describe('safeEval', function() {
    describe('given plus operator', function() {
      it('returns the result of the addition of the two numbers passed in', function() {
        expect(safeEval('1', '2', '+')).to.eql(3);
      });
    });

    describe('given minus operator', function() {
      it('returns the result of the subtraction of the first number minus the second number', function() {
        expect(safeEval('9', '3', '-')).to.eql(6);
      });
    });

    describe('given multiplication operator', function() {
      it('returns the result of the subtraction of the first number minus the second number', function() {
        expect(safeEval('2', '3', '*')).to.eql(6);
      });
    });

    describe('given division operator', function() {
      it('returns the result of the subtraction of the first number minus the second number', function() {
        expect(safeEval('9', '4', '/')).to.eql(2);
      });
    });
  });

});