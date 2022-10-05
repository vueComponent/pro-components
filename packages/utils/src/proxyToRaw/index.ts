import { toRaw, isProxy } from 'vue';
import type { Recordable } from '../typings';

export const proxyToRaw = (proxy: Recordable) => {
  // TOOD: 处理日期格式化
  const target: Recordable = {};
  for (const key in proxy) {
    let value = proxy[key];
    if (isProxy(value)) {
      value = toRaw(value);
    }
    target[key] = value;
  }
  return target;
};
