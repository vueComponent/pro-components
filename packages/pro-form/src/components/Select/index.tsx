import { defineComponent } from 'vue';
import ProFormField from '../Field';

export const ProFormSelect = defineComponent({
  setup() {
    return () => {
      return <ProFormField valueType={'select'} />;
    };
  },
});
