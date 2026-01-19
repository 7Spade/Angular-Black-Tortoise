const isString = (value: unknown): value is string =>
  typeof value === 'string';

const isNumber = (value: unknown): value is number =>
  typeof value === 'number' && !isNaN(value);

export const asString = (value: unknown): string => (isString(value) ? value : '');

export const asNumber = (value: unknown): number => (isNumber(value) ? value : 0);

export const asStringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter(isString) : [];
