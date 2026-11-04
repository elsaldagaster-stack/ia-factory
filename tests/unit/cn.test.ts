import { describe, it, expect } from 'vitest';
import { cn } from '../../lib/cn';

describe('cn', () => {
  it('joins multiple class strings', () => {
    expect(cn('btn', 'btn-primary')).toBe('btn btn-primary');
  });

  it('filters out null, undefined, and false', () => {
    expect(cn('btn', null, undefined, false, 'active')).toBe('btn active');
  });

  it('returns single class unchanged', () => {
    expect(cn('btn')).toBe('btn');
  });

  it('returns empty string when all args are falsy', () => {
    expect(cn(null, undefined, false)).toBe('');
  });

  it('preserves internal spaces in class strings', () => {
    expect(cn('btn btn-lg', 'text-white')).toBe('btn btn-lg text-white');
  });

  it('handles no arguments', () => {
    expect(cn()).toBe('');
  });

  it('handles mix of empty string and valid class', () => {
    expect(cn('', 'btn')).toBe('btn');
  });
});
