import { defineComponent, type PropType, ExtractPropTypes, App, DefineComponent, Plugin } from 'vue';
import type { CommonProps, DatePickerProps } from 'ant-design-vue/es/date-picker/generatePicker/props';
import { getSlot } from '@ant-design-vue/pro-utils';
import type { Dayjs } from 'dayjs';
import { pick } from 'lodash-es';
import { fieldDatePickerSlots } from '@ant-design-vue/pro-field';
import ProFormField, { proFormFieldProps } from '../Field';
import { proFormItemProps } from '../FormItem';
import type { VueNode } from 'ant-design-vue/lib/_util/type';

const props = {
  ...proFormFieldProps,
  fieldProps: {
    type: Object as PropType<Omit<CommonProps<Dayjs> & DatePickerProps<Dayjs>, 'value'>>,
  },
};

export type ProFormDatePickerYearProps = Partial<ExtractPropTypes<typeof props>>;

export const ProFormDatePickerYear = defineComponent({
  name: 'ProFormDatePickerYear',
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
    const renderExtraFooter = getSlot<() => VueNode>(slots, props, 'renderExtraFooter');
    const dateRender = getSlot<() => VueNode>(slots, props, 'dateRender');

    return () => {
      const { fieldProps, colProps } = props;
      return (
        <ProFormField
          valueType={'dateYear'}
          fieldProps={{
            ...fieldProps,
            suffixIcon,
            prevIcon,
            nextIcon,
            superPrevIcon,
            superNextIcon,
            renderExtraFooter,
            dateRender,
          }}
          filedConfig={{ valueType: 'dateYear' }}
          colProps={colProps}
          formItemProps={formItemProps}
          {...formItemProps}
        />
      );
    };
  },
});

ProFormDatePickerYear.install = (app: App) => {
  app.component(ProFormDatePickerYear.name, ProFormDatePickerYear);
  return app;
};

export default ProFormDatePickerYear as DefineComponent<ProFormDatePickerYearProps> & Plugin;
