import { defineComponent } from 'vue';
import { ProField } from '@ant-design-vue/pro-field';
import ProFormItem from '../FormItem';

const BaseProFormField = defineComponent({
  setup() {
    return () => {
      const BaseProFormField = () => {
        return <ProField />;
      };

      return (
        <ProFormItem
          v-slots={{
            default: BaseProFormField,
          }}
        ></ProFormItem>
      );
    };
  },
});

export { BaseProFormField };
