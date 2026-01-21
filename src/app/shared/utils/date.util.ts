/**
 * Date Utility Functions
 * 
 * Purpose:
 * - Common date operations
 * - Pure functions (no side effects)
 * - Framework-agnostic
 * 
 * DDD Compliance:
 * - Shared layer utilities
 * - No dependencies on other layers
 * - Pure TypeScript
 */

/**
 * Format a date as ISO 8601 string.
 */
export const toISOString = (date: Date): string => {
  return date.toISOString();
};

/**
 * Parse an ISO 8601 string to Date.
 */
export const fromISOString = (isoString: string): Date => {
  return new Date(isoString);
};

/**
 * Get current timestamp in milliseconds.
 */
export const now = (): number => {
  return Date.now();
};

/**
 * Check if a date is in the past.
 */
export const isPast = (date: Date): boolean => {
  return date.getTime() < now();
};

/**
 * Check if a date is in the future.
 */
export const isFuture = (date: Date): boolean => {
  return date.getTime() > now();
};

/**
 * Add days to a date.
 */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Format date as human-readable string.
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString();
};

/**
 * Format date and time as human-readable string.
 */
export const formatDateTime = (date: Date): string => {
  return date.toLocaleString();
};
