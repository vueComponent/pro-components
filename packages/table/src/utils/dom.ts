import { filterEmpty, toArray } from '@v-c/utils'

export const checkVNodes = (doms: any, defaultValue: any) => {
  if (doms === undefined || doms === null) {
    return defaultValue
  }
  const domsData = filterEmpty(toArray(doms))
  if (domsData.length > 0) {
    return domsData
  }
  return defaultValue
}
