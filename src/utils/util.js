import triggerEvent from 'ant-design-vue/es/_util/triggerEvent'
import { inBrowser } from 'ant-design-vue/es/_util/env'

const getComponentFromProp = (instance, prop) => {
  const slots = instance.slots && instance.slots()
  return slots[prop] || instance.props[prop]
}

/*const getComponentFromProp = (instance, prop) => {
  const slots = instance.$slots
  return slots[prop] || instance.$props[prop]
}*/


const isFun = (func) => {
  return typeof func === 'function'
}

/**
 * 触发 window.resize
 */
export {
  triggerEvent,
  inBrowser,
  getComponentFromProp,
  isFun
}
