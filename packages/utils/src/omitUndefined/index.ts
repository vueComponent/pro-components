const omitUndefined = <T extends { [key: string]: any }>(obj: T): { [key: string]: any } => {
  const newObj: {
    [key: string]: any;
  } = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] !== undefined) {
      newObj[key] = obj[key];
    }
  });
  if (Object.keys(newObj).length < 1) {
    return undefined as any;
  }
  return newObj;
};
export default omitUndefined;
