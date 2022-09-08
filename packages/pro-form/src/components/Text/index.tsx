import { defineComponent, type App, DefineComponent, Plugin } from 'vue';
import type { InputProps } from 'ant-design-vue/es/input/inputProps';
import ProFormField from '../Field';
import type { ProFormFieldItemProps } from '../../typings';
import { useFormInstance } from '../../BaseForm/hooks/useFormInstance';

export type ProFieldPropsType = ProFormFieldItemProps<Omit<InputProps, 'value'>>;
type NameType = string | number;

const ProFormText = defineComponent<ProFieldPropsType>({
  name: 'ProFormText',
  inheritAttrs: false,
  props: ['fieldProps', 'colProps', 'name'] as any,
  setup(props, { attrs }) {
    const formContext = useFormInstance();
    const formItemProps = {
      ...attrs,
      name: props.name,
    };
    return () => {
      return (
        <ProFormField
          valueType={'text'}
          fieldProps={{
            ...props.fieldProps,
            'onUpdate:value'(value) {
              // 更新form的model数据
              (formContext.model.value || {})[formItemProps.name as NameType] = value;
            },
          }}
          filedConfig={{ valueType: 'text' }}
          colProps={props.colProps}
          formItemProps={{
            ...formItemProps,
            model: formContext.model.value,
          }}
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
