import { defineComponent, type App, Plugin, DefineComponent, ref } from 'vue';
import type { InputProps } from 'ant-design-vue/es/input/inputProps';
import ProField from '../Field';
import type { ProFormFieldItemProps } from '../../typings';

// 防止在fieldProps中写入value
export type ProFieldPropsType = ProFormFieldItemProps<Omit<InputProps, 'value'>> & {
  value?: InputProps['value'];
};

const ProFormText = defineComponent<ProFieldPropsType>({
  name: 'ProFormText',
  inheritAttrs: false,
  props: ['fieldProps', 'formItemProps', 'value'] as any,
  emits: ['update:value'],
  setup(props, { attrs, emit }) {
    const inputValue = ref(props.value);

    return () => {
      return (
        <ProField
          valueType={'text'}
          fieldProps={{
            ...props.fieldProps,
            value: inputValue.value,
            'onUpdate:value': (value) => {
              inputValue.value = value;
              emit('update:value', value);
            },
          }}
          filedConfig={{ valueType: 'text' }}
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
