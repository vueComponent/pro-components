import { getType } from "../getType";

export const objToMap = (value: any) => {
  if (getType(value) === "map") {
    return value;
  }
  return new Map(Object.entries(value || {}));
};
