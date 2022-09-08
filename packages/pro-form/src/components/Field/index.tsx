import { unref, defineComponent, FunctionalComponent } from 'vue';
import ProField, { type ProFieldPropsType } from '@ant-design-vue/pro-field';
import type { InputProps } from 'ant-design-vue/es/input/inputProps';
import ProFormItem from '../FormItem';
import type { ProFormFieldItemProps } from '../../typings';
import { useGridHelpers } from '../../helpers';

export type ProFormFieldProps = ProFormFieldItemProps<InputProps> & Pick<ProFieldPropsType, 'valueType'>;

const ProFormField = defineComponent<ProFormFieldProps>({
  name: 'BaseProFormField',
  inheritAttrs: false,
  props: ['valueType', 'fieldProps', 'filedConfig', 'formItemProps', 'colProps'] as any,
  setup(props, { attrs }) {
    return () => {
      const valueType = props.valueType || 'text';
      const FormItem: FunctionalComponent = () => {
        return (
          <ProFormItem
            v-slots={{
              default: () => <ProField {...props} valueType={valueType} {...attrs} />,
            }}
            {...attrs}
          />
        );
      };
      const { ColWrapper } = unref(useGridHelpers({ colProps: props.colProps }));
      return <ColWrapper>{FormItem}</ColWrapper>;
    };
  },
});

export default ProFormField;
