import { defineComponent } from 'vue';
import { Select } from 'ant-design-vue';
import { searchSelectProps } from './types';

const SearchSelect = defineComponent({
  props: searchSelectProps,
  setup(props) {
    return () => {
      return (
        <Select
          v-slots={{
            option: props.option,
          }}
          {...props}
          allowClear
        />
      );
    };
  },
});

export default SearchSelect;
