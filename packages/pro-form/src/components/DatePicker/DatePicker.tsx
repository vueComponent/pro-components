import { defineComponent, type PropType, ExtractPropTypes, App, DefineComponent, Plugin } from 'vue';
import type { CommonProps, DatePickerProps } from 'ant-design-vue/es/date-picker/generatePicker/props';
import { getSlot } from '@ant-design-vue/pro-utils';
import { pick } from 'lodash-es';
import { fieldDatePickerSlots } from '@ant-design-vue/pro-field';
import ProFormField, { proFormFieldProps } from '../Field';
import { proFormItemProps } from '../FormItem';
import type { VueNode } from 'ant-design-vue/lib/_util/type';

const props = {
  ...proFormFieldProps,
  fieldProps: {
    type: Object as PropType<Omit<CommonProps<any> & DatePickerProps<any>, 'value'>>,
  },
};

export type ProFormDatePickerProps = Partial<ExtractPropTypes<typeof props>>;

export const ProFormDatePicker = defineComponent({
  name: 'ProFormDatePicker',
  inheritAttrs: false,
  props,
  slots: fieldDatePickerSlots,
  setup(props, { slots }) {
    const formItemProps = {
      ...props.formItemProps,
      ...pick(props, Object.keys(proFormItemProps)),
    };
    const suffixIcon = getSlot<() => VueNode>(slots, props, 'suffixIcon');
    const prevIcon = getSlot<() => VueNode>(slots, props, 'prevIcon');
    const nextIcon = getSlot<() => VueNode>(slots, props, 'nextIcon');
    const superPrevIcon = getSlot<() => VueNode>(slots, props, 'superPrevIcon');
    const superNextIcon = getSlot<() => VueNode>(slots, props, 'superNextIcon');

    return () => {
      const { fieldProps, colProps } = props;
      return (
        <ProFormField
          valueType={'date'}
          fieldProps={{
            suffixIcon,
            prevIcon,
            nextIcon,
            superPrevIcon,
            superNextIcon,
            ...fieldProps,
          }}
          filedConfig={{ valueType: 'date' }}
          colProps={colProps}
          formItemProps={formItemProps}
          {...formItemProps}
        />
      );
    };
  },
});

ProFormDatePicker.install = (app: App) => {
  app.component(ProFormDatePicker.name, ProFormDatePicker);
  return app;
};

export default ProFormDatePicker as DefineComponent<ProFormDatePickerProps> & Plugin;
