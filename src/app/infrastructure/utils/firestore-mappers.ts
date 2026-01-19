export const asString = (value: unknown): string =>
  typeof value === 'string' ? value : '';

export const asStringArray = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];
