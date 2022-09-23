import { ref } from 'vue';
import type { DefaultOptionType } from 'ant-design-vue/es/select';
import type { FieldSelectProps } from '../index';

export const useFetchData = (props: FieldSelectProps) => {
  const loading = ref(false);
  const options = ref<DefaultOptionType[]>(props.fieldProps?.options || []);
  if (typeof props.request === 'function') {
    loading.value = true;
    props
      .request(props.params, props)
      .then((data) => {
        options.value = data;
      })
      .finally(() => {
        loading.value = false;
      });
  }
  return {
    loading,
    options,
  };
};
