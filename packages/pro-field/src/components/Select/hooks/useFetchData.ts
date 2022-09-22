import { ref } from 'vue';
import type { DefaultOptionType } from 'ant-design-vue/es/select';
import type { FieldSelectProps } from '../index';

export const useFetchData = (props: FieldSelectProps) => {
  const loading = ref(false);
  const options = ref<DefaultOptionType[]>([]);
  loading.value = true;
  props
    ?.request?.(props.params, props)
    .then((data) => {
      options.value = data;
    })
    .finally(() => {
      loading.value = false;
    });
  return {
    loading,
    options: options.value.length > 0 ? options : ref(props.fieldProps?.options),
  };
};
