import { describe, it, expect } from 'vitest';
import { formatDate, formatDateTime, truncate } from '../../lib/format';

describe('formatDate', () => {
  it('formats date as dd/mm/yyyy', () => {
    const date = new Date(2026, 10, 3); // month is 0-indexed: 10 = November
    expect(formatDate(date)).toBe('03/11/2026');
  });

  it('pads single-digit day and month', () => {
    const date = new Date(2026, 0, 5); // January 5
    expect(formatDate(date)).toBe('05/01/2026');
  });
});

describe('formatDateTime', () => {
  it('formats date with time as dd/mm/yyyy HH:mm', () => {
    const date = new Date(2026, 10, 3, 14, 30); // Nov 3, 14:30
    expect(formatDateTime(date)).toBe('03/11/2026 14:30');
  });

  it('pads single-digit hours and minutes', () => {
    const date = new Date(2026, 0, 5, 9, 5); // Jan 5, 09:05
    expect(formatDateTime(date)).toBe('05/01/2026 09:05');
  });
});

describe('truncate', () => {
  it('returns string unchanged when shorter than maxLength', () => {
    expect(truncate('hello', 10)).toBe('hello');
  });

  it('returns string unchanged when equal to maxLength', () => {
    expect(truncate('hello', 5)).toBe('hello');
  });

  it('truncates and appends ... when longer than maxLength', () => {
    expect(truncate('hello world', 8)).toBe('hello...');
  });

  it('handles maxLength of 3 (minimum meaningful)', () => {
    expect(truncate('hello', 3)).toBe('...');
  });
});
