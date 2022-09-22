import { defineComponent } from 'vue';
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
      return (
        <Select
          {...props}
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
          allowClear
        />
      );
    };
  },
});

export default SearchSelect;
