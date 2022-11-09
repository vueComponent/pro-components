import { defineComponent, type App, DefineComponent, Plugin, PropType, ExtractPropTypes } from 'vue';
import { pick } from 'lodash-es';
import type { InputProps } from 'ant-design-vue/es/input/inputProps';
import ProFormField, { proFormFieldProps } from '../Field';
import { proFormItemProps } from '../FormItem';

export const proFormPasswordProps = {
  ...proFormFieldProps,
  fieldProps: {
    type: Object as PropType<Omit<InputProps, 'value'>>,
  },
};

export type ProFieldPasswordPropsType = Partial<ExtractPropTypes<typeof proFormPasswordProps>>;

const ProFormPassword = defineComponent({
  name: 'ProFormPassword',
  inheritAttrs: false,
  props: proFormPasswordProps,
  setup(props) {
    const formItemProps = {
      ...props.formItemProps,
      ...pick(props, Object.keys(proFormItemProps)),
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
