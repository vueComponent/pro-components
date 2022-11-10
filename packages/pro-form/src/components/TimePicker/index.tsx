import { defineComponent, type PropType, ExtractPropTypes, App, DefineComponent, Plugin } from 'vue';
import { getSlot } from '@ant-design-vue/pro-utils';
import type { Dayjs } from 'dayjs';
import type { TimePickerProps } from 'ant-design-vue/es/time-picker/time-picker';
import { pick } from 'lodash-es';
import { fieldTimePickerProps } from '@ant-design-vue/pro-field';
import ProFormField, { proFormFieldProps } from '../Field';
import { proFormItemProps } from '../FormItem';
import type { VueNode } from 'ant-design-vue/lib/_util/type';

const props = {
  ...proFormFieldProps,
  fieldProps: {
    type: Object as PropType<Omit<TimePickerProps<Dayjs>, 'value'>>,
  },
};

export type ProFormTimePickerProps = Partial<ExtractPropTypes<typeof props>>;

export const ProFormTimePicker = defineComponent({
  name: 'ProFormTimePicker',
  inheritAttrs: false,
  props,
  slots: fieldTimePickerProps,
  setup(props, { slots }) {
    const formItemProps = {
      ...props.formItemProps,
      ...pick(props, Object.keys(proFormItemProps)),
    };

    const suffixIcon = getSlot<() => VueNode>(slots, props, 'suffixIcon');
    const renderExtraFooter = getSlot<() => VueNode>(slots, props, 'renderExtraFooter');
    const clearIcon = getSlot<() => VueNode>(slots, props, 'clearIcon');

    return () => {
      const { fieldProps, colProps } = props;
      return (
        <ProFormField
          valueType={'time'}
          fieldProps={{
            ...fieldProps,
            suffixIcon,
            clearIcon,
            renderExtraFooter,
          }}
          filedConfig={{ valueType: 'time' }}
          colProps={colProps}
          formItemProps={formItemProps}
          {...formItemProps}
        />
      );
    };
  },
});

ProFormTimePicker.install = (app: App) => {
  app.component(ProFormTimePicker.name, ProFormTimePicker);
  return app;
};

export default ProFormTimePicker as DefineComponent<ProFormTimePickerProps> & Plugin;
