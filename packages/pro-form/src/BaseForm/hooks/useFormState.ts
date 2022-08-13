import { ref, computed, type SetupContext } from 'vue';
import type { FormInstance } from 'ant-design-vue';
import type { BaseFormPropsType } from '../types';
import { cloneDeep } from 'lodash';

export type FormState = ReturnType<typeof useFormState>;

export type useFormStateParams = {
  props: BaseFormPropsType;
  attrs: SetupContext['attrs'];
};

export const useFormState = ({ props, attrs }: useFormStateParams) => {
  const formPropsRef = ref<BaseFormPropsType>(cloneDeep(props));
  const model = ref(props.model);
  const formInstanceRef = ref<FormInstance>();

  const getFormProps = computed(() => {
    return {
      ...attrs,
      ...formPropsRef.value,
    } as BaseFormPropsType;
  });
  return {
    model,
    formInstanceRef,
    getFormProps,
  };
};
