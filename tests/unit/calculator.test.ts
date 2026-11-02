import { describe, it, expect } from 'vitest';
import { add, subtract, divide, multiply } from '../../src/calculator';

describe('calculator', () => {
  describe('add', () => {
    it('returns sum of two positive numbers', () => {
      expect(add(2, 3)).toBe(5);
    });

    it('handles negative numbers', () => {
      expect(add(-1, 1)).toBe(0);
    });

    it('handles zero', () => {
      expect(add(0, 5)).toBe(5);
    });
  });

  describe('subtract', () => {
    it('returns difference of two numbers', () => {
      expect(subtract(5, 3)).toBe(2);
    });

    it('returns negative when second is larger', () => {
      expect(subtract(3, 5)).toBe(-2);
    });
  });

  describe('divide', () => {
    it('returns quotient of two numbers', () => {
      expect(divide(10, 2)).toBe(5);
    });

    it('throws Error when dividing by zero', () => {
      expect(() => divide(1, 0)).toThrow('Division by zero');
    });

    it('handles decimal results', () => {
      expect(divide(1, 3)).toBeCloseTo(0.333, 3);
    });
  });

  describe('multiply', () => {
    it('returns product of two numbers', () => {
      expect(multiply(4, 3)).toBe(12);
    });

    it('returns zero when multiplying by zero', () => {
      expect(multiply(5, 0)).toBe(0);
    });
  });
});
