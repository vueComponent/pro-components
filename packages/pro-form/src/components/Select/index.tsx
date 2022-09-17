import { defineComponent } from 'vue';
import type { SelectProps } from 'ant-design-vue/es/select';
import ProFormField from '../Field';
import type { ProFormFieldItemProps } from '../../typings';

export type ProFormSelectProps = ProFormFieldItemProps<SelectProps>;

export const ProFormSelect = defineComponent<ProFormSelectProps>({
  name: 'ProFormSelect',
  inheritAttrs: false,
  props: ['fieldProps', 'colProps', 'name'] as any,
  setup(props, attrs) {
    const formItemProps = {
      ...attrs,
      name: props.name,
    };
    return () => {
      return (
        <ProFormField
          valueType={'select'}
          fieldProps={props.fieldProps}
          filedConfig={{ valueType: 'select' }}
          colProps={props.colProps}
          formItemProps={formItemProps}
          {...formItemProps}
        />
      );
    };
  },
});
