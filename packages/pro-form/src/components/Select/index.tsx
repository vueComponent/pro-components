import { defineComponent, type App, DefineComponent, Plugin, PropType, ExtractPropTypes } from 'vue';
import { omit, pick } from 'lodash-es';
import { proFieldProps } from '@ant-design-vue/pro-field';
import type { SelectProps } from 'ant-design-vue/es/select';
import ProFormField from '../Field';
import { proFormGridConfig, extendsProps } from '../../typings';
import { proFormItemProps } from '../FormItem';

const props = {
  ...omit(proFieldProps, 'valueType'),
  ...pick(proFormGridConfig, 'colProps'),
  ...proFormItemProps,
  ...extendsProps,
  fieldProps: {
    type: Object as PropType<Omit<SelectProps, 'value' | 'options'>>,
  },
  options: {
    type: Array as PropType<SelectProps['options']>,
  },
};

export type ProFormSelectProps = Partial<ExtractPropTypes<typeof props>>;

export const ProFormSelect = defineComponent({
  name: 'ProFormSelect',
  inheritAttrs: false,
  props,
  slots: ['option'],
  setup(props) {
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
