import { defineComponent, type PropType, ExtractPropTypes, App, DefineComponent, Plugin } from 'vue';
import type { RadioGroupProps } from 'ant-design-vue/es/radio/Group';
import { getSlot } from '@ant-design-vue/pro-utils';
import { pick } from 'lodash-es';
import ProFormField, { proFormFieldProps } from '../Field';
import { proFormItemProps } from '../FormItem';
import type { VueNode } from 'ant-design-vue/lib/_util/type';

const props = {
  ...proFormFieldProps,
  fieldProps: {
    type: Object as PropType<RadioGroupProps>,
  },
};
export type ProFormRadioProps = Partial<ExtractPropTypes<typeof props>>;

export const ProFormRadio = defineComponent({
  name: 'ProFormRadio',
  inheritAttrs: false,
  props,
  setup(props, { slots }) {
    const formItemProps = {
      ...props.formItemProps,
      ...pick(props, Object.keys(proFormItemProps)),
    };

    const children = getSlot(slots, props, 'default') as Function;

    return () => {
      const { fieldProps, colProps } = props;
      return (
        <ProFormField
          valueType={'radio' || 'radioButton'}
          fieldProps={{
            ...fieldProps,
            default: children
          }}
          filedConfig={{ valueType: 'radio' || 'radioButton'}}
          colProps={colProps}
          formItemProps={formItemProps}
          {...formItemProps}
        />
      );
    };
  },
});

ProFormRadio.install = (app: App) => {
  app.component(ProFormRadio.name, ProFormRadio);
  return app;
};

export default ProFormRadio as DefineComponent<ProFormRadioProps> & Plugin;
