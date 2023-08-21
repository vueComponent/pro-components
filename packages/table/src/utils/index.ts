import type { Bordered, BorderedType } from '../typing'

/**
 * 根据 key 和 dataIndex 生成唯一 id
 *
 * @param key 用户设置的 key
 * @param dataIndex 在对象中的数据
 * @param index 序列号，理论上唯一
 */
export const genColumnKey = (
  key?: string | number,
  index?: number | string
): string => {
  if (key) {
    return Array.isArray(key) ? key.join('-') : key.toString()
  }
  return `${index}`
}

export const isBordered = (borderType: BorderedType, border?: Bordered) => {
  if (border === undefined) {
    return false
  }
  if (typeof border === 'boolean') {
    return border
  }
  return border[borderType]
}
