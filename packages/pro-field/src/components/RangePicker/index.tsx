import { defineComponent, type App, DefineComponent, Plugin } from 'vue';
import dayjs from 'dayjs';
import { fieldRangePickerProps, FieldRangePickerProps, RangesType } from './types';
import { RangePicker } from 'ant-design-vue';
import { getSlot } from '@ant-design-vue/pro-utils';
import type { VueNode } from 'ant-design-vue/lib/_util/type';

const formatDate = (text: any, format: any) => {
  if (!text) {
    return '-';
  }
  if (typeof format === 'function') {
    return format(dayjs(text));
  } else {
    return dayjs(text).format(format || 'YYYY-MM-DD');
  }
};

export const slots = [
  'suffixIcon',
  'prevIcon',
  'nextIcon',
  'superPrevIcon',
  'superNextIcon',
  'renderExtraFooter',
  'dateRender',
];

const FieldRangePicker = defineComponent({
  name: 'FieldRangePicker',
  inheritAttrs: false,
  props: fieldRangePickerProps,
  slots,
  setup(props, { slots }) {
    const suffixIcon = getSlot<() => VueNode>(slots, props.fieldProps as Record<string, any>, 'suffixIcon');
    const prevIcon = getSlot<() => VueNode>(slots, props.fieldProps as Record<string, any>, 'prevIcon');
    const nextIcon = getSlot<() => VueNode>(slots, props.fieldProps as Record<string, any>, 'nextIcon');
    const superPrevIcon = getSlot<() => VueNode>(slots, props.fieldProps as Record<string, any>, 'superPrevIcon');
    const superNextIcon = getSlot<() => VueNode>(slots, props.fieldProps as Record<string, any>, 'superNextIcon');
    const renderExtraFooter = getSlot<() => VueNode>(
      slots,
      props.fieldProps as Record<string, any>,
      'renderExtraFooter'
    );
    const dateRender = getSlot<() => VueNode>(slots, props.fieldProps as Record<string, any>, 'dateRender');

    const render = getSlot(slots, props.fieldProps as Record<string, any>, 'render') as any;
    const renderFormItem = getSlot(slots, props.fieldProps as Record<string, any>, 'renderFormItem') as any;

    return () => {
      const { mode, text, fieldProps } = props;
      const { placeholder, ranges, format = 'YYYY-MM-DD' } = fieldProps || {};
      const [startText, endText] = Array.isArray(text) ? text : [];

      if (mode === 'read') {
        const parsedStartText: string = startText ? formatDate(startText, format) : '';
        const parsedEndText: string = endText ? formatDate(endText, format) : '';
        const dom = (
          <div>
            <div>{parsedStartText || '-'}</div>
            <div>{parsedEndText || '-'}</div>
          </div>
        );
        if (render) {
          return render(text, { mode, ...fieldProps }, <>{dom}</>);
        }
        return dom;
      }
      if (mode === 'edit' || mode === 'update') {
        const dom = (
          <RangePicker
            v-slots={{
              suffixIcon,
              prevIcon,
              nextIcon,
              superPrevIcon,
              superNextIcon,
              renderExtraFooter,
              dateRender,
            }}
            {...fieldProps}
            format={format}
            ranges={ranges as RangesType}
            placeholder={placeholder || ['请选择', '请选择']}
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

FieldRangePicker.install = (app: App) => {
  app.component(FieldRangePicker.name, FieldRangePicker);
  return app;
};

export default FieldRangePicker as DefineComponent<FieldRangePickerProps> & Plugin;
