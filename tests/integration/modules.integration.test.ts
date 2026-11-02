import { describe, it, expect } from 'vitest';
import * as calculator from '../../src/calculator';
import * as validator from '../../src/validator';

describe('module contracts (integration)', () => {
  describe('calculator exports', () => {
    it('exports add as a function', () => {
      expect(typeof calculator.add).toBe('function');
    });

    it('exports divide as a function', () => {
      expect(typeof calculator.divide).toBe('function');
    });

    it('add and multiply are consistent: a*b == sum of b added a times', () => {
      const a = 4;
      const b = 3;
      let sumResult = 0;
      for (let i = 0; i < b; i++) {
        sumResult = calculator.add(sumResult, a);
      }
      expect(sumResult).toBe(calculator.multiply(a, b));
    });
  });

  describe('validator exports', () => {
    it('exports validateEmail as a function', () => {
      expect(typeof validator.validateEmail).toBe('function');
    });

    it('exports validateNonEmpty as a function', () => {
      expect(typeof validator.validateNonEmpty).toBe('function');
    });

    it('validateEmail and validateNonEmpty work together', () => {
      const rawInput = '  user@example.com  ';
      const cleaned = validator.validateNonEmpty(rawInput, 'email');
      const isValid = validator.validateEmail(cleaned);
      expect(isValid).toBe(true);
    });
  });
});
