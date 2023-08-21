import { filterEmpty, isBaseType, merge, toArray } from '@v-c/utils'
import type { VNode, VNodeChild } from 'vue'

export const useMergeProps = (...args: any[]) => {
  const obj: Record<string, any> = {}
  args.forEach((item) => {
    if (item) {
      merge(obj, item)
    }
  })
  return obj
}

export const getBaseText = (node: VNodeChild) => {
  if (isBaseType(node)) return node
  node = toArray(node)
  const nodes = filterEmpty(node)
  if (nodes.length) {
    const firstNode = nodes[0]
    if (isBaseType(firstNode)) {
      return firstNode
    }
    if (isBaseType((firstNode as VNode).children)) {
      return (firstNode as VNode).children
    }
    return null
  }
  return null
}
