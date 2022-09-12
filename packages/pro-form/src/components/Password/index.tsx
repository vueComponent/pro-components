import { defineComponent, type App, DefineComponent, Plugin } from 'vue';
import type { InputProps } from 'ant-design-vue/es/input/inputProps';
import ProFormField from '../Field';
import type { ProFormFieldItemProps } from '../../typings';

export type ProFieldPasswordPropsType = ProFormFieldItemProps<Omit<InputProps, 'value'>>;

const ProFormPassword = defineComponent<ProFieldPasswordPropsType>({
  name: 'ProFormPassword',
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
          valueType={'password'}
          fieldProps={props.fieldProps}
          filedConfig={{ valueType: 'password' }}
          colProps={props.colProps}
          formItemProps={formItemProps}
          {...formItemProps}
        />
      );
    };
  },
});

ProFormPassword.install = (app: App) => {
  app.component(ProFormPassword.name, ProFormPassword);
  return app;
};

export default ProFormPassword as DefineComponent<ProFieldPasswordPropsType> & Plugin;
