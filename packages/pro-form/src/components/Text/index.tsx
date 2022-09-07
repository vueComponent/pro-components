import { defineComponent, type App, Plugin, DefineComponent } from 'vue';
import type { InputProps } from 'ant-design-vue/es/input/inputProps';
import ProField from '../Field';
import type { ProFormFieldItemProps } from '../../typings';
import { useFormInstance } from '../../BaseForm/hooks/useFormInstance';

// 防止在fieldProps中写入value
export type ProFieldPropsType = ProFormFieldItemProps<Omit<InputProps, 'value'>>;
type NameType = string | number;

const ProFormText = defineComponent<ProFieldPropsType>({
  name: 'ProFormText',
  inheritAttrs: false,
  props: ['name', 'fieldProps', 'formItemProps', 'colProps'] as any,
  setup(props, { attrs }) {
    const formContext = useFormInstance();
    return () => {
      return (
        <ProField
          valueType={'text'}
          fieldProps={{
            ...props.fieldProps,
            value: formContext.model.value[props.name as NameType],
            'onUpdate:value'(value) {
              formContext.model.value[props.name as NameType] = value;
            },
          }}
          filedConfig={{ valueType: 'text' }}
          name={props.name}
          colProps={props.colProps}
          {...attrs}
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
