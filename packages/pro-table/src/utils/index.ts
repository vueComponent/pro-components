import type { Key, DataIndex } from '../typings';

export const genColumnKey = (key?: Key | DataIndex, index?: number): string => {
  if (key) {
    return Array.isArray(key) ? key.join('-') : key.toString();
  }
  return `${index}`;
};
