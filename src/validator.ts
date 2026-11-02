export interface Logger {
  warn: (message: string) => void;
}

export function validateEmail(email: string, logger?: Logger): boolean {
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!valid && logger) {
    logger.warn(`Invalid email: ${email}`);
  }
  return valid;
}

export function validateNonEmpty(value: string, fieldName: string): string {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    throw new Error(`${fieldName} cannot be empty`);
  }
  return trimmed;
}
