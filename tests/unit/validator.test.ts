import { describe, it, expect, vi } from 'vitest';
import { validateEmail, validateNonEmpty, Logger } from '../../src/validator';

describe('validateEmail', () => {
  it('returns true for valid email', () => {
    expect(validateEmail('user@example.com')).toBe(true);
  });

  it('returns false for email without @', () => {
    expect(validateEmail('notanemail')).toBe(false);
  });

  it('returns false for email without domain', () => {
    expect(validateEmail('user@')).toBe(false);
  });

  it('calls logger.warn when email is invalid', () => {
    const mockLogger: Logger = { warn: vi.fn() };

    validateEmail('bad-email', mockLogger);

    expect(mockLogger.warn).toHaveBeenCalledWith('Invalid email: bad-email');
  });

  it('does not call logger when email is valid', () => {
    const mockLogger: Logger = { warn: vi.fn() };

    validateEmail('user@example.com', mockLogger);

    expect(mockLogger.warn).not.toHaveBeenCalled();
  });

  it('works without logger argument', () => {
    expect(() => validateEmail('bad-email')).not.toThrow();
  });
});

describe('validateNonEmpty', () => {
  it('returns trimmed value for non-empty string', () => {
    expect(validateNonEmpty('  hello  ', 'name')).toBe('hello');
  });

  it('throws Error for empty string', () => {
    expect(() => validateNonEmpty('', 'name')).toThrow('name cannot be empty');
  });

  it('throws Error for whitespace-only string', () => {
    expect(() => validateNonEmpty('   ', 'email')).toThrow('email cannot be empty');
  });
});
