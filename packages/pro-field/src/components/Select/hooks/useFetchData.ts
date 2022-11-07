import { ref, watchEffect } from 'vue';
import type { DefaultOptionType } from 'ant-design-vue/es/select';
import type { FieldSelectProps } from '../index';

export const useFetchData = (props: FieldSelectProps) => {
  const defaultKeyWords = ref('');
  const loading = ref(false);
  const options = ref<DefaultOptionType[]>(props.fieldProps?.options || []);
  if (typeof props.request === 'function') {
    const { request } = props;
    watchEffect(() => {
      loading.value = true;
      request({
        keyWords: defaultKeyWords.value,
      })
        .then((data) => {
          options.value = data;
        })
        .finally(() => {
          loading.value = false;
        });
    });
  }
  return {
    defaultKeyWords,
    loading,
    options,
  };
};
