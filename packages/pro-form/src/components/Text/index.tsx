import { defineComponent, type App, DefineComponent, Plugin } from 'vue';
import type { InputProps } from 'ant-design-vue/es/input/inputProps';
import ProFormField from '../Field';
import type { ProFormFieldItemProps } from '../../typings';

export type ProFieldPropsType = ProFormFieldItemProps<Omit<InputProps, 'value'>>;

const ProFormText = defineComponent<ProFieldPropsType>({
  name: 'ProFormText',
  inheritAttrs: false,
  props: ['fieldProps', 'colProps', 'name'] as any,
  setup(props, { attrs }) {
    const formItemProps = {
      ...attrs,
      name: props.name,
    };
    return () => {
      return (
        <ProFormField
          valueType={'text'}
          fieldProps={props.fieldProps}
          filedConfig={{ valueType: 'text' }}
          colProps={props.colProps}
          formItemProps={formItemProps}
          {...formItemProps}
        />
      );
    };
  },
});

ProFormText.install = (app: App) => {
  app.component(ProFormText.name, ProFormText);
  return app;
};

export default ProFormText as DefineComponent<ProFieldPropsType> & Plugin;
