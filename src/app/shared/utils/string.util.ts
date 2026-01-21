/**
 * String Utility Functions
 * 
 * Purpose:
 * - Common string operations
 * - Pure functions (no side effects)
 * - Framework-agnostic
 * 
 * DDD Compliance:
 * - Shared layer utilities
 * - No dependencies on other layers
 * - Pure TypeScript
 */

/**
 * Check if a string is empty or whitespace only.
 */
export const isEmpty = (value: string | null | undefined): boolean => {
  return !value || value.trim().length === 0;
};

/**
 * Capitalize the first letter of a string.
 */
export const capitalize = (value: string): string => {
  if (!value) {
    return '';
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
};

/**
 * Convert string to kebab-case.
 */
export const toKebabCase = (value: string): string => {
  return value
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase();
};

/**
 * Convert string to camelCase.
 */
export const toCamelCase = (value: string): string => {
  return value
    .toLowerCase()
    .replace(/[-_\s](.)/g, (_, char) => char.toUpperCase());
};

/**
 * Truncate string to specified length with ellipsis.
 */
export const truncate = (
  value: string,
  length: number,
  suffix: string = '...'
): string => {
  if (value.length <= length) {
    return value;
  }
  return value.substring(0, length) + suffix;
};

/**
 * Generate a random alphanumeric string.
 */
export const randomString = (length: number): string => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
