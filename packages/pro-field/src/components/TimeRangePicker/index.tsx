import { defineComponent, type App, DefineComponent, Plugin } from 'vue';
import dayjs from 'dayjs';
import { fieldTimeRangePickerProps, FieldTimeRangePickerProps } from './types';
import { TimeRangePicker } from 'ant-design-vue';
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

export const slots = ['renderExtraFooter', 'suffixIcon', 'clearIcon'];

const FieldTimeRangePicker = defineComponent({
  name: 'FieldTimeRangePicker',
  inheritAttrs: false,
  props: fieldTimeRangePickerProps,
  slots,
  setup(props, { slots }) {
    const suffixIcon = getSlot<() => VueNode>(slots, props.fieldProps as Record<string, any>, 'suffixIcon');
    const clearIcon = getSlot<() => VueNode>(slots, props.fieldProps as Record<string, any>, 'clearIcon');
    const renderExtraFooter = getSlot<() => VueNode>(
      slots,
      props.fieldProps as Record<string, any>,
      'renderExtraFooter'
    );

    const render = getSlot(slots, props.fieldProps as Record<string, any>, 'render') as any;
    const renderFormItem = getSlot(slots, props.fieldProps as Record<string, any>, 'renderFormItem') as any;

    return () => {
      const { mode, text, fieldProps } = props;
      const { placeholder } = fieldProps || {};

      const finalFormat = fieldProps?.format || 'HH:mm:ss';
      const [startText, endText] = Array.isArray(text) ? text : [];

      const parsedStartText: string = startText ? formatDate(startText, finalFormat) : '';
      const parsedEndText: string = endText ? formatDate(endText, finalFormat) : '';

      if (mode === 'read') {
        const dom = (
          <div>
            <div>{parsedStartText || '-'}</div>
            <div>{parsedEndText || '-'}</div>
          </div>
        );
        if (render) {
          return render(text, { mode, ...fieldProps }, <span>{dom}</span>);
        }
        return dom;
      }
      if (mode === 'edit' || mode === 'update') {
        const dom = (
          <TimeRangePicker
            v-slots={{
              suffixIcon,
              renderExtraFooter,
              clearIcon,
            }}
            {...fieldProps}
            format={finalFormat}
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

FieldTimeRangePicker.install = (app: App) => {
  app.component(FieldTimeRangePicker.name, FieldTimeRangePicker);
  return app;
};

export default FieldTimeRangePicker as DefineComponent<FieldTimeRangePickerProps> & Plugin;
