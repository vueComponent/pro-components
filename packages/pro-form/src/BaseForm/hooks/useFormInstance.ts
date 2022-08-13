import { provide, inject } from 'vue';
import type { BaseFormType } from './index';

const key = Symbol('base-form');

export const createFromInstance = (instance: BaseFormType) => {
  provide(key, instance);
};

export const useFormInstance = () => {
  return inject(key) as BaseFormType;
};
