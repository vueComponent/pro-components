import { defineComponent, ref } from 'vue';
import { Select } from 'ant-design-vue';
import { searchSelectProps } from './types';
import { getSlot } from '@ant-design-vue/pro-utils';

export const slots = ['default'];

const SearchSelect = defineComponent({
  inheritAttrs: false,
  props: searchSelectProps,
  slots,
  setup(props, { slots }) {
    const searchValue = ref(props.searchValue);

    const children = getSlot(slots, props, 'default');

    return () => {
      const {
        fetchDataOnSearch,
        labelInValue,
        autoClearSearchValue = true,
        showSearch,
        placeholder,
        onSearch,
        onClear,
        fetchData,
        onChange,
        ...restProps
      } = props;
      return (
        <Select
          v-slots={{
            default: children,
          }}
          autoClearSearchValue={autoClearSearchValue}
          {...restProps}
          allowClear
          placeholder={placeholder || '请选择'}
          searchValue={searchValue.value}
          onClear={() => {
            onClear?.();
            fetchData?.('');
            if (showSearch) {
              searchValue.value = '';
            }
          }}
          onSearch={
            showSearch
              ? (value) => {
                  if (fetchDataOnSearch) {
                    fetchData?.(value);
                  }
                  onSearch?.(value);
                  searchValue.value = value;
                }
              : undefined
          }
          onChange={(value, optionList) => {
            if (showSearch && autoClearSearchValue) {
              if (!searchValue.value) fetchData?.('');
              onSearch?.('');
              searchValue.value = '';
            }
            if (!labelInValue) {
              onChange?.(value, optionList);
              return;
            }
            onChange?.(value, optionList);
          }}
        />
      );
    };
  },
});

export default SearchSelect;
