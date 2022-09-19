import { defineComponent } from 'vue';
import { Select } from 'ant-design-vue';
import { searchSelectProps } from './types';

const SearchSelect = defineComponent({
  props: searchSelectProps,
  slots: ['option'],
  setup(props, { slots }) {
    return () => {
      return (
        <Select
          {...props}
          v-slots={{
            option: props.option || slots.option,
          }}
          allowClear
        />
      );
    };
  },
});

export default SearchSelect;
