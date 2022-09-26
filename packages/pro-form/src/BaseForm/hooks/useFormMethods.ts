import { toRaw, isProxy } from 'vue';
import { proxyToRaw } from '@ant-design-vue/pro-utils';
import type { Recordable } from '../../typings';

export const useFormMethods = () => {
  function handleFormValues(values: Recordable) {
    return proxyToRaw(values);
  }
  return {
    handleFormValues,
  };
};

export type FormMethods = ReturnType<typeof useFormMethods>;
