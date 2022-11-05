import { defineComponent, type PropType, ExtractPropTypes, App, DefineComponent, Plugin } from 'vue';
import { rangePickerProps, type CommonProps } from 'ant-design-vue/es/date-picker/generatePicker/props';
import { getSlot } from '@ant-design-vue/pro-utils';
import { pick } from 'lodash-es';
import type { Dayjs } from 'dayjs';
import { rangePickerSlots } from '@ant-design-vue/pro-field';
import ProFormField, { proFormFieldProps } from '../Field';
import { proFormItemProps } from '../FormItem';
import type { VueNode } from 'ant-design-vue/lib/_util/type';

const rangeProps = rangePickerProps<Dayjs>();

export type RangePickerProps = Partial<ExtractPropTypes<typeof rangeProps>>;

const props = {
  ...proFormFieldProps,
  fieldProps: {
    type: Object as PropType<
      Omit<
        Omit<CommonProps<Dayjs>, 'placeholder'> &
          RangePickerProps & {
            placeholder: string[];
          },
        'value'
      >
    >,
  },
};

export type ProFormDateRangePickerProps = Partial<ExtractPropTypes<typeof props>>;

export const ProFormDateRangePicker = defineComponent({
  name: 'ProFormDateRangePicker',
  inheritAttrs: false,
  props,
  slots: rangePickerSlots,
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
    const renderExtraFooter = getSlot<() => VueNode>(slots, props, 'renderExtraFooter');
    const dateRender = getSlot<() => VueNode>(slots, props, 'dateRender');

    return () => {
      const { fieldProps, colProps } = props;
      return (
        <ProFormField
          valueType={'dateRange'}
          fieldProps={{
            suffixIcon,
            prevIcon,
            nextIcon,
            superPrevIcon,
            superNextIcon,
            renderExtraFooter,
            dateRender,
            ...fieldProps,
          }}
          filedConfig={{ valueType: 'dateRange' }}
          colProps={colProps}
          formItemProps={formItemProps}
          {...formItemProps}
        />
      );
    };
  },
});

ProFormDateRangePicker.install = (app: App) => {
  app.component(ProFormDateRangePicker.name, ProFormDateRangePicker);
  return app;
};

export default ProFormDateRangePicker as DefineComponent<ProFormDateRangePickerProps> & Plugin;
