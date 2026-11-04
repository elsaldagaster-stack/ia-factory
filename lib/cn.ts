export type ClassValue = string | undefined | null | false;

export function cn(...classes: ClassValue[]): string {
  return classes.filter((c): c is string => Boolean(c)).join(' ');
}
