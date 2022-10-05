import { defineComponent, type App, DefineComponent, Plugin } from 'vue';
import { fieldDatePickerProps, FieldDatePickerProps } from './types';
import { DatePicker } from 'ant-design-vue';
import { getSlot } from '@ant-design-vue/pro-utils';

export const slots = [
  'suffixIcon',
  'prevIcon',
  'nextIcon',
  'superPrevIcon',
  'superNextIcon',
  'dateRender',
  'renderExtraFooter',
  'monthCellRender',
];

const FieldDatePicker = defineComponent({
  name: 'FieldDatePicker',
  inheritAttrs: false,
  props: fieldDatePickerProps,
  slots,
  setup(props, { slots }) {
    const suffixIcon = getSlot(slots, props.fieldProps as Record<string, any>, 'suffixIcon');
    const prevIcon = getSlot(slots, props.fieldProps as Record<string, any>, 'prevIcon');
    const nextIcon = getSlot(slots, props.fieldProps as Record<string, any>, 'nextIcon');
    const superPrevIcon = getSlot(slots, props.fieldProps as Record<string, any>, 'superPrevIcon');
    const superNextIcon = getSlot(slots, props.fieldProps as Record<string, any>, 'superNextIcon');
    const dateRender = getSlot(slots, props.fieldProps as Record<string, any>, 'dateRender');
    const renderExtraFooter = getSlot(slots, props.fieldProps as Record<string, any>, 'renderExtraFooter');
    const monthCellRender = getSlot(slots, props.fieldProps as Record<string, any>, 'monthCellRender');
    return () => {
      const { fieldProps } = props;
      const { placeholder } = fieldProps || {};

      return (
        <DatePicker
          v-slots={{
            suffixIcon,
            prevIcon,
            nextIcon,
            superPrevIcon,
            superNextIcon,
            dateRender,
            renderExtraFooter,
            monthCellRender,
          }}
          {...fieldProps}
          placeholder={placeholder || '请选择'}
          allowClear
        />
      );
    };
  },
});

FieldDatePicker.install = (app: App) => {
  app.component(FieldDatePicker.name, FieldDatePicker);
  return app;
};

export default FieldDatePicker as DefineComponent<FieldDatePickerProps> & Plugin;
