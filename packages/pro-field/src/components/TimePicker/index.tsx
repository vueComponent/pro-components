import { defineComponent, type App, DefineComponent, Plugin } from 'vue';
import dayjs from 'dayjs';
import { fieldTimePickerProps, FieldTimePickerProps } from './types';
import { TimePicker } from 'ant-design-vue';
import { getSlot, VueText } from '@ant-design-vue/pro-utils';
import type { VueNode } from 'ant-design-vue/lib/_util/type';

export const slots = ['renderExtraFooter', 'suffixIcon', 'clearIcon'];

const FieldTimePicker = defineComponent({
  name: 'FieldDatePicker',
  inheritAttrs: false,
  props: fieldTimePickerProps,
  slots,
  setup(props, { slots }) {
    const suffixIcon = getSlot<() => VueNode>(slots, props.fieldProps as Record<string, any>, 'suffixIcon');
    const clearIcon = getSlot<() => VueNode>(slots, props.fieldProps as Record<string, any>, 'clearIcon');
    const renderExtraFooter = getSlot<() => VueNode>(
      slots,
      props.fieldProps as Record<string, any>,
      'renderExtraFooter'
    );

    const render = getSlot(slots, props.fieldProps as Record<string, any>, 'render') as Function;
    const renderFormItem = getSlot(slots, props.fieldProps as Record<string, any>, 'renderFormItem') as Function;

    return () => {
      const { mode, text, fieldProps } = props;
      const { placeholder } = fieldProps || {};

      const finalFormat = fieldProps?.format || 'HH:mm:ss';

      if (mode === 'read') {
        const dom = <span>{text ? dayjs(text as VueText, finalFormat).format(finalFormat) : '-'}</span>;
        if (render) {
          return render(text, { mode, ...fieldProps }, <span>{dom}</span>);
        }
        return dom;
      }
      if (mode === 'edit' || mode === 'update') {
        const dom = (
          <TimePicker
            v-slots={{
              suffixIcon,
              renderExtraFooter,
              clearIcon,
            }}
            {...fieldProps}
            format={finalFormat}
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

FieldTimePicker.install = (app: App) => {
  app.component(FieldTimePicker.name, FieldTimePicker);
  return app;
};

export default FieldTimePicker as DefineComponent<FieldTimePickerProps> & Plugin;
