import { ref, computed, unref, type SetupContext } from 'vue';
import type { FormInstance } from 'ant-design-vue';
import type { BaseFormPropsType } from '../types';
import { useGridHelpers } from '../../helpers';

export type FormState = ReturnType<typeof useFormState>;

export type useFormStateParams = {
  props: BaseFormPropsType;
  attrs: SetupContext['attrs'];
};

export const useFormState = ({ props, attrs }: useFormStateParams) => {
  const formPropsRef = ref<BaseFormPropsType>(props);
  const model = ref(props.model || {});
  const formInstanceRef = ref<FormInstance>();

  const { RowWrapper } = unref(
    useGridHelpers({
      grid: unref(formPropsRef).grid,
      rowProps: unref(formPropsRef).rowProps,
    })
  );

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
    RowWrapper,
  };
};
