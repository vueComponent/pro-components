import { defineComponent, type App, DefineComponent, Plugin } from 'vue';
import Dayjs from 'dayjs';
import { fieldDatePickerProps, FieldDatePickerProps } from './types';
import { DatePicker } from 'ant-design-vue';
import { getSlot } from '@ant-design-vue/pro-utils';
import type { VueNode } from 'ant-design-vue/lib/_util/type';

const formatDate = (text: any, format: any) => {
  if (!text) {
    return '-';
  }
  if (typeof format === 'function') {
    return format(Dayjs(text));
  } else {
    return Dayjs(text).format(format || 'YYYY-MM-DD');
  }
};

export const slots = ['suffixIcon', 'prevIcon', 'nextIcon', 'superPrevIcon', 'superNextIcon'];

const FieldDatePicker = defineComponent({
  name: 'FieldDatePicker',
  inheritAttrs: false,
  props: fieldDatePickerProps,
  slots,
  setup(props, { slots }) {
    const suffixIcon = getSlot<() => VueNode>(slots, props.fieldProps as Record<string, any>, 'suffixIcon');
    const prevIcon = getSlot<() => VueNode>(slots, props.fieldProps as Record<string, any>, 'prevIcon');
    const nextIcon = getSlot<() => VueNode>(slots, props.fieldProps as Record<string, any>, 'nextIcon');
    const superPrevIcon = getSlot<() => VueNode>(slots, props.fieldProps as Record<string, any>, 'superPrevIcon');
    const superNextIcon = getSlot<() => VueNode>(slots, props.fieldProps as Record<string, any>, 'superNextIcon');

    const render = getSlot(slots, props.fieldProps as Record<string, any>, 'render') as any;
    const renderFormItem = getSlot(slots, props.fieldProps as Record<string, any>, 'renderFormItem') as any;

    return () => {
      const { mode, text, dateFormat, fieldProps } = props;
      const { placeholder, format } = fieldProps || {};

      if (mode === 'read') {
        const dom = formatDate(text, format || dateFormat);
        if (render) {
          return render(text, { mode, ...fieldProps }, <>{dom}</>);
        }
        return <>{dom}</>;
      }
      if (mode === 'edit' || mode === 'update') {
        const dom = (
          <DatePicker
            v-slots={{
              suffixIcon,
              prevIcon,
              nextIcon,
              superPrevIcon,
              superNextIcon,
            }}
            {...fieldProps}
            placeholder={placeholder || '请选择'}
            allowClear
          />
        );
        if (renderFormItem) {
          return renderFormItem(text, { mode, ...fieldProps }, dom);
        }
        return dom;
      }
      return null;
    };
  },
});

FieldDatePicker.install = (app: App) => {
  app.component(FieldDatePicker.name, FieldDatePicker);
  return app;
};

export default FieldDatePicker as DefineComponent<FieldDatePickerProps> & Plugin;