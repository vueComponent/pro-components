import triggerEvent from 'ant-design-vue/es/_util/triggerEvent'
import { inBrowser } from 'ant-design-vue/es/_util/env'

const getComponentFromProp = (instance, prop) => {
  const slots = instance.slots && instance.slots()
  return slots[prop] || instance.props[prop]
}

const isFun = (func) => {
  return typeof func === 'function'
}

const themeConfig = {
  daybreak: 'daybreak',
  '#1890ff': 'daybreak',
  '#F5222D': 'dust',
  '#FA541C': 'volcano',
  '#FAAD14': 'sunset',
  '#13C2C2': 'cyan',
  '#52C41A': 'green',
  '#2F54EB': 'geekblue',
  '#722ED1': 'purple',
}

export function genThemeToString (val) {
  return val && themeConfig[val] ? themeConfig[val] : val
}



export {
  triggerEvent,
  inBrowser,
  getComponentFromProp,
  isFun
}
