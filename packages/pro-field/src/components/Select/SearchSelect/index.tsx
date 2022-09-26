import { defineComponent, ref } from 'vue';
import { Select } from 'ant-design-vue';
import { searchSelectProps } from './types';
import { getSlot } from '@ant-design-vue/pro-utils';

export const slots = [
  'notFoundContent',
  'suffixIcon',
  'itemIcon',
  'removeIcon',
  'clearIcon',
  'dropdownRender',
  'option',
  'placeholder',
  'tagRender',
  'maxTagPlaceholder',
  'optionLabel',
  'default',
];

const SearchSelect = defineComponent({
  props: searchSelectProps,
  slots,
  setup(props, { slots }) {
    const searchValue = ref(props.searchValue);

    const notFoundContent = getSlot(slots, props, 'notFoundContent');
    const suffixIcon = getSlot(slots, props, 'suffixIcon');
    const itemIcon = getSlot(slots, props, 'itemIcon');
    const removeIcon = getSlot(slots, props, 'removeIcon');
    const clearIcon = getSlot(slots, props, 'clearIcon');
    const dropdownRender = getSlot(slots, props, 'dropdownRender');
    const option = getSlot(slots, props, 'option');
    const placeholder = getSlot(slots, props, 'placeholder');
    const tagRender = getSlot(slots, props, 'tagRender');
    const maxTagPlaceholder = getSlot(slots, props, 'maxTagPlaceholder');
    const optionLabel = getSlot(slots, props, 'optionLabel');
    const children = getSlot(slots, props, 'default');

    return () => {
      const {
        fetchDataOnSearch,
        labelInValue,
        autoClearSearchValue = true,
        showSearch,
        onSearch,
        onClear,
        fetchData,
        onChange,
        ...restProps
      } = props;
      return (
        <Select
          v-slots={{
            notFoundContent,
            suffixIcon,
            itemIcon,
            removeIcon,
            clearIcon,
            dropdownRender,
            option,
            placeholder,
            tagRender,
            maxTagPlaceholder,
            optionLabel,
            default: children,
          }}
          autoClearSearchValue={autoClearSearchValue}
          {...restProps}
          allowClear
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
