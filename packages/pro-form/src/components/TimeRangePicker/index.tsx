import { defineComponent, type PropType, ExtractPropTypes, App, DefineComponent, Plugin } from 'vue';
import { getSlot } from '@ant-design-vue/pro-utils';
import type { Dayjs } from 'dayjs';
import type { TimeRangePickerProps } from 'ant-design-vue/es/time-picker/time-picker';
import { pick } from 'lodash-es';
import { fieldTimePickerProps } from '@ant-design-vue/pro-field';
import ProFormField, { proFormFieldProps } from '../Field';
import { proFormItemProps } from '../FormItem';
import type { VueNode } from 'ant-design-vue/lib/_util/type';

const props = {
  ...proFormFieldProps,
  fieldProps: {
    type: Object as PropType<Omit<TimeRangePickerProps<Dayjs>, 'value'>>,
  },
};
export type ProFormTimeRangePickerProps = Partial<ExtractPropTypes<typeof props>>;

export const ProFormTimeRangePicker = defineComponent({
  name: 'ProFormTimeRangePicker',
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
          valueType={'timeRange'}
          fieldProps={{
            ...fieldProps,
            suffixIcon,
            clearIcon,
            renderExtraFooter,
          }}
          filedConfig={{ valueType: 'timeRange' }}
          colProps={colProps}
          formItemProps={formItemProps}
          {...formItemProps}
        />
      );
    };
  },
});

ProFormTimeRangePicker.install = (app: App) => {
  app.component(ProFormTimeRangePicker.name, ProFormTimeRangePicker);
  return app;
};

export default ProFormTimeRangePicker as DefineComponent<ProFormTimeRangePickerProps> & Plugin;
