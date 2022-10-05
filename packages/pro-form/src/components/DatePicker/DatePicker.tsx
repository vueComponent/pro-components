import { defineComponent, type PropType, ExtractPropTypes, App, DefineComponent, Plugin } from 'vue';
import type { CommonProps, DatePickerProps } from 'ant-design-vue/es/date-picker/generatePicker/props';
import { getSlot } from '@ant-design-vue/pro-utils';
import { pick } from 'lodash-es';
import { fieldDatePickerSlots } from '@ant-design-vue/pro-field';
import ProFormField, { proFormFieldProps } from '../Field';
import { proFormItemProps } from '../FormItem';

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
    const suffixIcon = getSlot(slots, props, 'suffixIcon');
    const prevIcon = getSlot(slots, props, 'prevIcon');
    const nextIcon = getSlot(slots, props, 'nextIcon');
    const superPrevIcon = getSlot(slots, props, 'superPrevIcon');
    const superNextIcon = getSlot(slots, props, 'superNextIcon');
    const dateRender = getSlot(slots, props, 'dateRender');
    const renderExtraFooter = getSlot(slots, props, 'renderExtraFooter');
    const monthCellRender = getSlot(slots, props, 'monthCellRender');
    return () => {
      const { fieldProps, colProps } = props;
      return (
        <ProFormField
          valueType={'date'}
          fieldProps={{
            ...fieldProps,
            suffixIcon,
            prevIcon,
            nextIcon,
            superPrevIcon,
            superNextIcon,
            dateRender,
            renderExtraFooter,
            monthCellRender,
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
