import { defineComponent, type App, DefineComponent, Plugin, PropType, ExtractPropTypes } from 'vue';
import { pick } from 'lodash-es';
import type { InputProps } from 'ant-design-vue/es/input/inputProps';
import ProFormField, { proFormFieldProps } from '../Field';
import { proFormItemProps } from '../FormItem';

export const proFormTextProps = {
  ...proFormFieldProps,
  fieldProps: {
    type: Object as PropType<Omit<InputProps, 'value'>>,
  },
};
export type ProFieldPropsType = Partial<ExtractPropTypes<typeof proFormTextProps>>;

const ProFormText = defineComponent({
  name: 'ProFormText',
  inheritAttrs: false,
  props: proFormTextProps,
  setup(props) {
    const formItemProps = {
      ...props.formItemProps,
      ...pick(props, Object.keys(proFormItemProps)),
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
