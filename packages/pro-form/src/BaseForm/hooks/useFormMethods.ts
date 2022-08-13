import type { Recordable } from '../../typings';

export const useFormMethods = () => {
  function handleFormValues(values: Recordable) {
    return values;
  }
  return {
    handleFormValues,
  };
};

export type FormMethods = ReturnType<typeof useFormMethods>;
