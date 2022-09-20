import { defineComponent, type App, DefineComponent, Plugin, PropType, ExtractPropTypes } from 'vue';
import type { VueNode } from '@ant-design-vue/pro-utils';
import { pick } from 'lodash-es';
import type { SelectProps, DefaultOptionType } from 'ant-design-vue/es/select';
import ProFormField, { proFormFieldProps } from '../Field';
import { proFormItemProps } from '../FormItem';

const props = {
  ...proFormFieldProps,
  fieldProps: {
    type: Object as PropType<Omit<SelectProps, 'value' | 'options'>>,
  },
  options: {
    type: Array as PropType<SelectProps['options']>,
  },
  option: {
    type: Function as PropType<(props: DefaultOptionType) => VueNode>,
  },
};

export type ProFormSelectProps = Partial<ExtractPropTypes<typeof props>>;

export const ProFormSelect = defineComponent({
  name: 'ProFormSelect',
  inheritAttrs: false,
  props,
  slots: ['option'],
  setup(props, { slots }) {
    const formItemProps = {
      ...props.formItemProps,
      ...pick(props, Object.keys(proFormItemProps)),
    };
    return () => {
      return (
        <ProFormField
          valueType={'select'}
          fieldProps={{
            ...props.fieldProps,
            options: props.options,
            option: props.option || slots.option,
          }}
          filedConfig={{ valueType: 'select' }}
          colProps={props.colProps}
          formItemProps={formItemProps}
          {...formItemProps}
        />
      );
    };
  },
});

ProFormSelect.install = (app: App) => {
  app.component(ProFormSelect.name, ProFormSelect);
  return app;
};

export default ProFormSelect as DefineComponent<ProFormSelectProps> & Plugin;
