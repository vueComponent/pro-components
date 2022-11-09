import { toRaw, isProxy } from 'vue';
import { cloneDeep } from 'lodash-es';
import type { Recordable } from '../typings';

export const proxyToRaw = (proxy: Recordable) => {
  const target: Recordable = {};
  for (const key in proxy) {
    let value = proxy[key];
    if (isProxy(value)) {
      value = cloneDeep(toRaw(value));
    }
    target[key] = value;
  }
  return target;
};
