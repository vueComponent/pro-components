import { defineComponent } from 'vue';
import ProField, { type ProFieldPropsType } from '@ant-design-vue/pro-field';
import type { InputProps } from 'ant-design-vue/es/input/inputProps';
import ProFormItem from '../FormItem';
import type { ProFormFieldItemProps } from '../../typings';

export type ProFormFieldProps = ProFormFieldItemProps<InputProps> & Pick<ProFieldPropsType, 'valueType'>;

const ProFormField = defineComponent<ProFormFieldProps>({
  name: 'BaseProFormField',
  inheritAttrs: false,
  props: ['valueType', 'fieldProps', 'filedConfig', 'formItemProps'] as any,
  setup(props, { attrs }) {
    return () => {
      const valueType = props.valueType || 'text';
      const BaseProFormField = () => {
        return <ProField valueType={valueType} fieldProps={props.fieldProps} {...attrs} />;
      };

      return (
        <ProFormItem
          v-slots={{
            default: BaseProFormField,
          }}
          {...attrs}
        ></ProFormItem>
      );
    };
  },
});

export default ProFormField;
